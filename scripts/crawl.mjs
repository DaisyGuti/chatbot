// Builds the knowledge source store the curators write modules from.
//
//   node scripts/crawl.mjs
//
// Reads cadreai.com's sitemap, fetches every page, strips it to the prose a
// module can rest on, and writes one .txt per page plus a manifest of
// url -> sha256. The hash in that manifest is the value a KnowledgeModule
// carries as `sourceHash`, so curation and drift detection agree by
// construction rather than by hoping two fetches matched.
//
// cleanExtract is exported because the drift job has to strip identically.
// Two implementations of this function is the one coupling that would make
// every hash mismatch and turn the worklist into noise.

import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const SITEMAP = 'https://www.cadreai.com/sitemap.xml'
const OUT_DIR = 'knowledge-source'
const UA = 'cadre-chatbot-curation/1.0'

/** Remove <tag>...</tag> including nesting of the same tag. */
function dropElement(html, tagName, attrMatch) {
  const open = new RegExp(`<${tagName}\\b[^>]*>`, 'gi')
  let out = html
  for (;;) {
    open.lastIndex = 0
    let start = -1
    let m
    while ((m = open.exec(out))) {
      if (!attrMatch || attrMatch.test(m[0])) {
        start = m.index
        break
      }
    }
    if (start === -1) return out

    // Walk forward counting same-tag opens and closes to find the true close.
    const scan = new RegExp(`<(/?)${tagName}\\b[^>]*>`, 'gi')
    scan.lastIndex = start
    let depth = 0
    let end = out.length
    let s
    while ((s = scan.exec(out))) {
      depth += s[1] ? -1 : 1
      if (depth === 0) {
        end = s.index + s[0].length
        break
      }
    }
    out = out.slice(0, start) + out.slice(end)
  }
}

/**
 * The page reduced to the text a knowledge module quotes from: no scripts,
 * no nav, no footer, and none of the sitewide CTA band that repeats on all
 * 106 pages. Deterministic and per-page — it never looks at another page, so
 * adding a page to the site cannot move an existing page's hash.
 */
export function cleanExtract(html) {
  let t = html
  t = t.replace(/<!--[\s\S]*?-->/g, ' ')
  t = t.replace(/<(script|style|noscript|svg)\b[\s\S]*?<\/\1>/gi, ' ')
  t = dropElement(t, 'nav')
  t = dropElement(t, 'div', /class="[^"]*\bnavbar_component\b/i)
  t = dropElement(t, 'div', /class="[^"]*\bsection_footer\b/i)
  t = dropElement(t, 'div', /class="[^"]*\bcta_content\b/i)
  t = t.replace(/<[^>]+>/g, ' ')
  t = t
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  t = t.replace(/[-]/g, ' ') // Webflow icon-font glyphs
  return t.replace(/\s+/g, ' ').trim()
}

export const sha256 = (text) => createHash('sha256').update(text, 'utf8').digest('hex')

const slugFor = (url) => {
  const path = new URL(url).pathname.replace(/^\/|\/$/g, '')
  return path === '' ? 'home' : path.replace(/\//g, '__')
}

async function get(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA } })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}

async function main() {
  const urls = [...(await get(SITEMAP)).matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
  console.log(`sitemap: ${urls.length} urls`)
  await mkdir(OUT_DIR, { recursive: true })

  const entries = []
  const failed = []
  for (const url of urls) {
    const slug = slugFor(url)
    try {
      const text = cleanExtract(await get(url))
      await writeFile(join(OUT_DIR, `${slug}.txt`), `${text}\n`)
      entries.push({ url, slug, file: `${slug}.txt`, chars: text.length, sha256: sha256(text) })
    } catch (err) {
      failed.push({ url, error: String(err.message ?? err) })
      console.error(`  skip ${url} — ${err.message ?? err}`)
    }
  }

  entries.sort((a, b) => a.url.localeCompare(b.url))
  await writeFile(
    join(OUT_DIR, 'manifest.json'),
    `${JSON.stringify({ sitemap: SITEMAP, pages: entries }, null, 2)}\n`,
  )

  const chars = entries.reduce((n, e) => n + e.chars, 0)
  console.log(`wrote ${entries.length} extracts (~${Math.round(chars / 4000)}k tokens)`)
  if (failed.length) console.log(`${failed.length} failed: ${failed.map((f) => f.url).join(', ')}`)
}

if (import.meta.url === `file://${process.argv[1]}`) await main()
