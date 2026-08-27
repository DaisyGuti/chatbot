# CLAUDE.md — Cadre AI support chatbot

Customer-support chatbot for Cadre AI (a real company selling to private equity and financial-
services firms). Take-home assessment. **All reasoning lives in `plan.md`; this file is rules
only — keep it short so it survives every compaction.**

## The rule that matters most

**The bot never states a fact about Cadre AI that isn't in a knowledge module.** A fabricated
price, certification, or case-study number is a liability for a real company and an instant fail.
Every claim traces to a module with a `source` URL.

Three topics are unpublished — route, never improvise (verified on the live site 2026-08-25):

| Unknown | Route to |
|---|---|
| Pricing | Strategist |
| Portal access steps | Client support |
| Security certifications (SOC 2, ISO, DPA terms) | Strategist |

Two things look like unknowns and are not. The eight Maturity Index pillars are published
(`/strategy` names all eight), and so is Cadre's approach to data security (`/strategy` sells it as
a named service, **LLM Selection & Data Security**). Answering both is correct; refusing either is
a regression. Only Cadre's own certifications are missing.

Before adding a row to this table, fetch the source and confirm the fact is genuinely unpublished.

## Escalation facts — verbatim, never paraphrase

| Field | Value |
|---|---|
| Support email | `hello@gocadre.ai` — domain is **gocadre.ai**, not cadreai.com |
| Privacy email | `privacy@gocadre.ai` — for data-handling and deletion requests only |
| Phone | (619) 324-3223 |
| Contact page | https://www.cadreai.com/contact |
| Office | 3580 Carmel Mountain Rd, #150, San Diego, CA 92130 |
| Legal entity | AI Gurus LLC dba Cadre AI |
| Booking | No calendar on the site; "Talk to an AI Strategist" lands on the contact form |

`hello@cadreai.com` looks right and is wrong. These literals live in a knowledge module and the
grounding suite asserts them byte-for-byte.

## Architecture rules

- **Knowledge** lives in `src/knowledge/modules/*.ts`, typed `KnowledgeModule`: `id`, `topic`,
  `content`, `source` (real cadreai.com URL), `provenance`, `sourceHash`. `provenance` is
  `published` (page states it outright → quote it) or `derived` (assembled from several statements
  on the same page → attribute to the page, don't quote); `buildSystemPrompt` consumes it.
  `sourceHash` is the sha256 of the source page's cleaned extract, set at curation time for drift
  detection — curators copy it from `knowledge-source/manifest.json` (see `plan.md` §4).
- **Unknowns** live in `src/knowledge/unknowns.ts`, typed `UnknownFact` (`id`, `question`,
  `reason`, `route`) — the same first-class shape as modules, not an else-branch.
- **Retrieval** goes through the `KnowledgeRetriever` interface; `InMemoryRetriever` returns every
  module every turn. No vector DB — see `plan.md` §6.
- **One model call per turn.** No agent loop, no tool chain. `classifyIntent` is deterministic
  (no model) and runs before generation. That call carries OpenRouter's ordered `models` array
  (`claude-sonnet-5` then `gpt-5-mini`) so a primary-model error fails over automatically — never
  hand-roll a retry or a health check for this; see `plan.md` §5.
- **Register every module in `modules/index.ts`.** An unregistered module is invisible to
  retrieval and no test catches it — check the barrel.

## Streaming contract

The chat route returns `createUIMessageStreamResponse()` with `Transfer-Encoding: chunked` and
`Connection: keep-alive`. Never hand-roll a `Response`. Without these headers the stream buffers
in production (empty box, then the whole answer at once) while working locally.

## Conventions

- Server-only modules import `server-only`; the OpenRouter client never reaches a client component.
- User-facing errors never surface a provider error string — map to a plain sentence, log the
  original server-side.
- When you change the knowledge boundary, add its test in the same commit: a new module gets an
  answer test, a new unknown gets a refusal test.

## Secrets

`OPENROUTER_API_KEY` only, in `.env.local` (gitignored) and Vercel. Never put an Anthropic key in
this repo — the app calls OpenRouter only. Provision that key with a hard credit limit on the
OpenRouter side: `/api/chat` is a public endpoint and the in-code guards are per-instance, so the
key limit is the only ceiling a caller cannot route around.

## Scope

Fixed in `plan.md` §3. Do not add auth, portal integration, calendar/CRM writes, cross-session
memory, or case-study summarization without saying so and updating `plan.md` first.

## Gates

`test`, `lint`, `typecheck`, `build` all pass before every commit (pre-commit hook — hence no
`--no-verify`). `build` is in the gate from Phase 1 so production-only failures — `server-only`
leaking into the client bundle, package resolution — surface long before deploy day. `test` here is
the deterministic suite (vitest) only; `npm run test:e2e` is a separate browser-driven pass that
needs a running app and never blocks a commit — see `plan.md` §8.

## Never

- Never invent a Cadre fact to fill a gap.
- Never commit with a failing test, lint error, type error, or broken build.
- Never `git push --force`, never `--no-verify`.
- Never add a dependency without a one-sentence justification in the commit message.