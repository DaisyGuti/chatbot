/**
 * Contact page and cross-cutting site-level facts — see `plan.md` §4.
 *
 * Covers: the six FAQ Q&As on `/contact`, the escalation facts (support contact info, the separate
 * privacy contact, and the legal entity name), the "Track your AI results" portal blurb on the
 * homepage, headline "who we are" facts from `/about`, and a pointer (not a summary) to
 * `/case-studies`.
 *
 * Registered in `src/knowledge/modules/index.ts` by the integration step — not here.
 */

import type { KnowledgeModule } from "@/knowledge/types";

/**
 * The escalation literals, owned here and nowhere else — see `plan.md` §4. `hello@cadreai.com`
 * looks right and is a dead address, so these strings get exactly one definition: the modules
 * below interpolate them into their `content`, and `buildSystemPrompt` reads the same object when
 * it writes the routing instructions. Nothing in `src/chat/` retypes a Cadre fact.
 */
export const escalationFacts = {
  /** General support and sales. Domain is gocadre.ai — not cadreai.com. */
  supportEmail: "hello@gocadre.ai",
  /** Data-handling, access, correction and deletion requests only. */
  privacyEmail: "privacy@gocadre.ai",
  phone: "(619) 324-3223",
  contactPage: "https://www.cadreai.com/contact",
  office: "3580 Carmel Mountain Rd, #150, San Diego, CA 92130",
  legalEntity: "AI Gurus LLC dba Cadre AI",
} as const;

/** The six FAQ questions and answers published on the contact page. */
export const contactFaq: KnowledgeModule = {
  id: "contact-faq",
  topic: "contact-faq",
  content: `The contact page publishes six FAQ questions and answers about working with Cadre AI.

What does Cadre AI actually do? "We're a consultancy focused on using AI to drive real revenue growth and improve EBITDA. Many companies get less efficient as they scale. We help you scale with less overhead by identifying the right AI strategy, not just throwing tools at the problem."

What kind of tools does Cadre AI build? "Sometimes we build, sometimes we don't. If a tool you already use has AI features available, we help you activate and use them quickly. When off-the-shelf tools exist, we'll recommend the best fit. We only build custom solutions when there's no faster or smarter option."

Why not just do AI in-house? "According to MIT, over 90% of AI initiatives fail, often because internal teams don't have the time, experience, or structure to lead AI work full time. Companies that bring in a dedicated AI partner are three times more likely to succeed. Cadre gives you that partner."

Can you work with our current tools and systems? "Yes. We start with a deep review of your current tech stack and processes. Then we identify where AI can plug in, whether it's simple workflow automation or agents that connect multiple tools together for fully automated execution."

What types of companies are the best fit? "We work with companies of all sizes, but we're especially valuable to businesses with manual workflows that get less efficient as they grow. B2B and B2C services companies often fit this profile. We also support private equity backed companies looking to grow efficiently and expand EBITDA without ballooning headcount."

How will the AI Maturity Index help me? "It scores your company across our eight-pillar framework for AI transformation. You'll get a grade in each area with clear explanations, plus actionable insights on how to improve and move further along in your AI journey." (The eight pillars themselves are named on the /strategy page, not here.)`,
  source: "https://www.cadreai.com/contact",
  provenance: "published",
  sourceHash: "741981def4831eb5d7bf2aa6b6a338f3041113cb48a136d0a80c4cd5fb7e9a2a",
};

/** Support contact details, copied character-for-character for the byte-exact grounding test. */
export const escalationContact: KnowledgeModule = {
  id: "escalation-contact",
  topic: "escalation",
  content: `Cadre AI's support contact details, as published on the contact page: support email ${escalationFacts.supportEmail}; phone ${escalationFacts.phone}; office location ${escalationFacts.office}. The contact page itself is at ${escalationFacts.contactPage}, and includes a contact form (Full Name, Email, Subject, Message) in addition to these direct contact methods.`,
  source: "https://www.cadreai.com/contact",
  provenance: "published",
  sourceHash: "741981def4831eb5d7bf2aa6b6a338f3041113cb48a136d0a80c4cd5fb7e9a2a",
};

/** The legal entity behind the Cadre AI brand, stated on the Terms of Service page. */
export const escalationLegalEntity: KnowledgeModule = {
  id: "escalation-legal-entity",
  topic: "escalation",
  // Left as written prose rather than interpolated: the first sentence is a verbatim quote from
  // the Terms of Service, and a quote that changes when a constant elsewhere changes is not a quote.
  content: `Cadre AI's Terms of Service state: "We are Cadre AI (Also known as AI Gurus LLC) ('Company,' 'we,' 'us,' 'our'), a company registered in California, United States at 3580 Carmel Mountain Rd, #150, San Diego, CA 92130." The legal entity operating the Cadre AI brand is AI Gurus LLC, doing business as Cadre AI.`,
  source: "https://www.cadreai.com/terms-of-service",
  provenance: "published",
  sourceHash: "d8908981e16a64a42150da8eb44517d3489ef2b3705349888bc13a6fc65fb513",
};

/**
 * The separate address Cadre publishes for data-protection questions. `derived`: it assembles the
 * Privacy Policy's Contact Us block with the sentence naming what that block is for, rather than
 * quoting one published statement.
 */
export const escalationPrivacy: KnowledgeModule = {
  id: "escalation-privacy",
  topic: "escalation",
  content: `Cadre AI's Privacy Policy publishes a contact for data-protection questions that is separate from general support. Its Contact Us section names ${escalationFacts.legalEntity} as the legal entity, a registered address of 3580 Carmel Mountain Rd #150, San Diego, CA 92130, USA, the contact email ${escalationFacts.privacyEmail}, and the phone number +1 ${escalationFacts.phone}, and states that questions about the Privacy Policy or Cadre's data practices go to that email. A data-handling request — access, correction, deletion, or how personal information is used — therefore goes to ${escalationFacts.privacyEmail}.`,
  source: "https://www.cadreai.com/legal/privacy-policy",
  provenance: "derived",
  sourceHash: "ffc524b20b446ab3aafbbbc56ec8155fac791158fa9542c7d5ca80398921e612",
};

/** The one published fact about the client portal — no login steps, URL, or subdomain exist here. */
export const portalOverview: KnowledgeModule = {
  id: "portal-overview",
  topic: "portal",
  content: `Cadre's homepage publishes a "Track your AI results" section: "Cadre gives you a centralized portal to track tools, agents, training, and results. Stay aligned, stay accountable, and scale what works." The portal centralizes tracking of tools, agents, training, and results for clients.`,
  source: "https://www.cadreai.com",
  provenance: "published",
  sourceHash: "cf5239a101863ecba0a527dec16f7f2bfd8aa2a6aeedfe9ef5273dc1c77d44fc",
};

/** Leadership team named on the About page. */
export const companyLeadership: KnowledgeModule = {
  id: "company-leadership",
  topic: "company",
  content: `Cadre AI's About page lists its leadership team: Grayson Lafrenz (Founder / CEO), Keith Jensen (President), Riley Stricklin (Founder | Chief Strategy Officer), Nicole Kelley (CFO), Sarah McLoughlin (Chief Client Officer), Chad Lohrli (Founder | Chief AI Officer), Katie Boes (VP, Client Strategy and Partnerships), and Ben Shapiro (Co-Founder | Head of AI Strategy).`,
  source: "https://www.cadreai.com/about",
  provenance: "published",
  sourceHash: "ab371c2a76df89dd0698e8c83de610b99c550a9a4080fa2784a69848654f3321",
};

/** "The Cadre Way" — the four named company values on the About page. */
export const companyValues: KnowledgeModule = {
  id: "company-values",
  topic: "company",
  content: `The About page names "The Cadre Way" — described as the mindset and behaviors the company hires for, rewards, and lives by — as four values: Growth Mindset ("We are lifelong learners on a mission to get 1% better every single day"), Extreme Ownership ("We own the problem, the solution, and the outcome, regardless of scenario"), Team First ("We constantly find ways to make the entire team and company better"), and Scrappy ("We are adaptable, resourceful, and always solving problems").`,
  source: "https://www.cadreai.com/about",
  provenance: "published",
  sourceHash: "ab371c2a76df89dd0698e8c83de610b99c550a9a4080fa2784a69848654f3321",
};

/**
 * Headline track-record numbers on the About page. `derived` because it assembles three separate
 * statements (two Cadre-stated figures and one MIT-attributed figure) into one summary.
 */
export const companyTrackRecord: KnowledgeModule = {
  id: "company-track-record",
  topic: "company",
  content: `The About page states three headline claims about Cadre AI's track record: a 3x higher success rate working with a strategic AI partner, 100+ high-ROI use cases delivered across 50+ companies, and — citing MIT's "State of AI in Business 2025" — that AI projects developed with specialized vendors have a success rate 300% higher than in-house AI projects.`,
  source: "https://www.cadreai.com/about",
  provenance: "derived",
  sourceHash: "ab371c2a76df89dd0698e8c83de610b99c550a9a4080fa2784a69848654f3321",
};

/**
 * A pointer to the case studies page, not a summary of it. `plan.md` cuts summarizing individual
 * case studies' numbers, so this deliberately omits every client's hours-saved and dollar figures.
 */
export const caseStudiesPointer: KnowledgeModule = {
  id: "case-studies-pointer",
  topic: "case-studies",
  content: `Cadre AI publishes real client case studies at https://www.cadreai.com/case-studies, each labeled as a "Non-Disclosed Company" to protect client identity. The examples span multiple industries: professional services, manufacturing & logistics, hospitality, real estate, and financial services / mortgage & lending. Each case study describes the client's problem, the AI solution Cadre built, and a measurable business outcome. For any specific client's figures, point the user to that page rather than reciting numbers from memory.`,
  source: "https://www.cadreai.com/case-studies",
  provenance: "derived",
  sourceHash: "2dbb3e2a4fd9301abae89c1685614d9cacbe2545a85c0564714f0109244af7f2",
};

/**
 * How to reach Cadre — confirmed across the whole crawl, not just the contact page. `derived`:
 * assembled from the repeated "Talk to an AI Strategist" CTA plus a whole-store check for any
 * scheduling tool (Calendly, Cal.com, Acuity, "book a time," etc.), none found on any of 107 pages.
 */
export const noBookingCalendar: KnowledgeModule = {
  id: "contact-no-booking-calendar",
  topic: "contact-faq",
  content: `Cadre AI's site has one recurring call-to-action, "Talk to an AI Strategist," repeated across the large majority of its pages. It links to the ${escalationFacts.contactPage} form rather than a scheduling calendar. There is no booking or scheduling tool (no Calendly, no "pick a time" widget, no equivalent) published anywhere on the site — every path to talking with Cadre goes through that contact form, or the direct ${escalationFacts.supportEmail} / ${escalationFacts.phone}.`,
  source: escalationFacts.contactPage,
  provenance: "derived",
  sourceHash: "741981def4831eb5d7bf2aa6b6a338f3041113cb48a136d0a80c4cd5fb7e9a2a",
};

export const contactModules: KnowledgeModule[] = [
  contactFaq,
  escalationContact,
  escalationLegalEntity,
  escalationPrivacy,
  noBookingCalendar,
  portalOverview,
  companyLeadership,
  companyValues,
  companyTrackRecord,
  caseStudiesPointer,
];
