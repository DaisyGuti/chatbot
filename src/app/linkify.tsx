import type { ReactNode } from "react";

/**
 * Turns a plain-text reply into text interspersed with real links. `src/chat/prompt.ts` already
 * puts the exact escalation strings in the model's own words — `hello@gocadre.ai`,
 * `(619) 324-3223`, `https://www.cadreai.com/contact` — so a refusal's route sits in the text as a
 * plain string today. This wraps whichever of those substrings are already there in a `mailto:`,
 * `tel:`, or `href` link; it never adds a word the model didn't already write, so it states no
 * Cadre fact of its own.
 *
 * `ux-curator`'s brief, §1.2: "A refusal renders its route as something clickable... a thing a
 * finger or a cursor can act on."
 */

const LINK_PATTERN =
  /(https?:\/\/[^\s<>"')\]]+)|([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})|(\(\d{3}\)[\s.-]?\d{3}[\s.-]?\d{4})/gi;

/**
 * A model-written sentence often ends a URL with the sentence's own punctuation ("...at
 * https://www.cadreai.com/contact."), which the regex above has no way to distinguish from a URL
 * that legitimately ends in a character like that. Trimming trailing punctuation off the link and
 * rendering it as plain text after the `</a>` keeps the sentence's grammar intact.
 */
function splitTrailingPunctuation(url: string): { url: string; trailing: string } {
  const match = /[).,;:!?]+$/.exec(url);
  if (!match) return { url, trailing: "" };
  return { url: url.slice(0, -match[0].length), trailing: match[0] };
}

export function linkifyText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    const full = match[0];
    const [, url, email, phone] = match;

    if (url) {
      const { url: trimmedUrl, trailing } = splitTrailingPunctuation(url);
      nodes.push(
        <a key={key++} href={trimmedUrl} target="_blank" rel="noreferrer">
          {trimmedUrl}
        </a>,
      );
      if (trailing) nodes.push(trailing);
    } else if (email) {
      nodes.push(
        <a key={key++} href={`mailto:${email}`}>
          {email}
        </a>,
      );
    } else if (phone) {
      const digits = phone.replace(/\D/g, "");
      nodes.push(
        <a key={key++} href={`tel:+1${digits}`}>
          {phone}
        </a>,
      );
    } else {
      nodes.push(full);
    }

    lastIndex = index + full.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
