/**
 * The unknowns registry — see `plan.md` §2. Same first-class shape as a `KnowledgeModule`: a
 * decline is a registered fact with a route, not an else-branch the model reaches for on its own.
 *
 * Exactly three, matching `CLAUDE.md`'s table. All three curator passes independently confirmed
 * each is genuinely absent from the crawled site (grepped the whole store, not just their own
 * section) before this registry was written — see `docs/workflow.md`.
 */

import type { UnknownFact } from "./types";

export const allUnknowns: UnknownFact[] = [
  {
    id: "pricing",
    question: "What does Cadre AI's service cost?",
    reason:
      "Published nowhere on cadreai.com — no rates, packages, or session fees for any of the four " +
      "services. Case studies state client outcomes, never what Cadre charged for them.",
    route: "strategist",
  },
  {
    id: "portal-access",
    question: "How do I log into or access the Cadre client portal?",
    reason:
      "The homepage states a portal exists and what it tracks (tools, agents, training, results), " +
      "but no login URL, subdomain, or account-setup step is published anywhere on the site.",
    route: "support",
  },
  {
    id: "security-certifications",
    question:
      "Is Cadre AI SOC 2 or ISO 27001 certified? What are your DPA or data-retention terms?",
    reason:
      "Cadre's approach to LLM selection and data security is published on /strategy, but no " +
      "certification, DPA, or retention terms appear anywhere on the site — this is the one thing " +
      "about that approach that stays unknown.",
    route: "strategist",
  },
];
