/**
 * Lead delivery — see `plan.md` §3, "Lead delivery vs CRM writes". Cutting CRM writes does not cut
 * delivery: the captured fields build a prefilled `mailto:` the user sends in one click, so the
 * *user* is the transport and this codebase sends no email and holds no credential. A payload
 * rendered on screen and nowhere else never reaches Cadre's inbound team, and the difference is
 * this string.
 *
 * Pure and client-safe on purpose — the form component builds both links in the browser. It states
 * no Cadre fact of its own: the address and the contact URL come from `escalationFacts`, which is
 * their one owner.
 */

import { escalationFacts } from "@/knowledge/modules/contact";

/** The four fields `plan.md` §3 says a strategist wants before the call. */
export type LeadDetails = {
  name: string;
  company: string;
  industry: string;
  need: string;
};

function subjectFor(lead: LeadDetails): string {
  return `AI strategist request — ${lead.company}`;
}

function bodyFor(lead: LeadDetails): string {
  return [
    `Name: ${lead.name}`,
    `Company: ${lead.company}`,
    `Industry: ${lead.industry}`,
    `What they need: ${lead.need}`,
    "",
    "Sent from the chat assistant on the Cadre AI site.",
  ].join("\n");
}

/**
 * The delivery path. Opens the user's own mail client with the strategist request already written,
 * addressed to the published support inbox — `hello@gocadre.ai`, not the cadreai.com address that
 * looks right and does not exist.
 */
export function leadMailtoUrl(lead: LeadDetails): string {
  const query = new URLSearchParams({
    subject: subjectFor(lead),
    body: bodyFor(lead),
  });
  // `URLSearchParams` encodes spaces as "+", which mail clients render literally in a subject line.
  return `mailto:${escalationFacts.supportEmail}?${query.toString().replace(/\+/g, "%20")}`;
}

/**
 * The alternative for someone who would rather use Cadre's own form. The parameter names are the
 * live form's actual field names, read off https://www.cadreai.com/contact on 2026-08-27: a Webflow
 * form with inputs `Name`, `Email`, `Subject` and `Message`.
 *
 * Webflow renders those inputs client-side and does not populate them from the query string, so
 * this link carries the details rather than filling the form in. That is why the `mailto:` above is
 * the delivery path and this is offered as the alternative — and why nothing in the UI calls this
 * link prefilled.
 */
export function leadContactFormUrl(lead: LeadDetails): string {
  const url = new URL(escalationFacts.contactPage);
  url.searchParams.set("Name", lead.name);
  url.searchParams.set("Subject", subjectFor(lead));
  url.searchParams.set("Message", bodyFor(lead));
  return url.toString();
}
