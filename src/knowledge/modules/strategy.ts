/**
 * Knowledge modules curated from https://www.cadreai.com/strategy.
 *
 * Covers three distinct things published on that one page: the AI Strategy service itself, the
 * eight-pillar AI Maturity Index, and Cadre's named "LLM Selection & Data Security" approach.
 *
 * Not covered here (deliberately, to avoid duplicating a sibling curator's territory):
 * - The sitewide "Track your AI results" portal CTA band that also appears at the bottom of this
 *   page — it is boilerplate repeated on every page of the site, not `/strategy`-specific content.
 * - The "Industry Specific Expertise" list and the "AI Leadership & Facilitation" / "AI
 *   Engineering" blurbs near the bottom of the page — these summarize the industries page and the
 *   other two named services, which belong to their own dedicated pages and curators.
 * - How AI Maturity Index scoring works (the grade/explanation mechanic) — that is on `/contact`'s
 *   FAQ, not `/strategy`.
 */

import type { KnowledgeModule } from "../types";

const SOURCE_URL = "https://www.cadreai.com/strategy";
const SOURCE_HASH =
  "8d38dc0e5e7f4ea7710f75dbb8659e872e8bf599e872637e46aef8fc238d4542";

/** The AI Strategy service: the 45-day Transformation Intensive and its four-step approach. */
export const strategyAiStrategyService: KnowledgeModule = {
  id: "strategy-ai-strategy-service",
  topic: "services",
  content:
    "Cadre AI's AI Strategy service is built around a structured, 45-day engagement called the " +
    "AI Transformation Intensive, meant to take a client from no clear AI plan to a prioritized " +
    "roadmap the client's own team can execute. The engagement follows four steps. Step one, " +
    "Discover Use Cases: interview teams across departments to find real problems, calculate the " +
    "potential ROI of each opportunity, and prioritize by impact and feasibility. Step two, " +
    "Survey the Landscape: research existing tools that solve the client's specific problems, " +
    "track AI capabilities expected to launch in the next three to six months, and identify gaps " +
    "current solutions don't cover. Step three, Implement Solutions: deploy the chosen tools, " +
    "integrate them into daily workflows, train the client's team to use them effectively, and " +
    "monitor usage to iterate on real feedback. Step four, Scale with Confidence: expand what " +
    "worked to other departments, establish internal champions to lead further AI opportunities, " +
    "and build a three-year roadmap based on the wins already proven. Cadre AI describes its " +
    "approach as finding quick wins that create measurable EBITDA impact, building the roadmap, " +
    "and then implementing that roadmap itself, rather than delivering a slide deck and walking " +
    "away.",
  source: SOURCE_URL,
  provenance: "derived",
  sourceHash: SOURCE_HASH,
};

/** Cadre's OpenAI partner status and what it says that status is used for. */
export const strategyOpenAiServicePartner: KnowledgeModule = {
  id: "strategy-openai-service-partner",
  topic: "company",
  content:
    "Cadre AI is one of the first official OpenAI service partners. As part of that role, it " +
    "builds enterprise-grade AI command centers meant to convert fragmented, risky AI usage " +
    "across an organization into secure, centralized systems that protect company data while " +
    "increasing team efficiency.",
  source: SOURCE_URL,
  provenance: "published",
  sourceHash: SOURCE_HASH,
};

/** The AI Maturity Index: all eight pillars of Cadre's AI transformation framework. */
export const strategyMaturityIndexPillars: KnowledgeModule = {
  id: "strategy-maturity-index-pillars",
  topic: "maturity-index",
  content:
    "Cadre AI's AI Maturity Index scores a company's AI transformation readiness across eight " +
    "pillars. Pillar 1, Build your dedicated AI team: a sustainable AI transformation needs a " +
    "fully accountable leader backed by experts in product, strategy, research, and engineering, " +
    "working across departments under CEO leadership; without that structure, companies chase AI " +
    "tools opportunistically instead of strategically solving business problems, and see minimal " +
    "financial impact. Pillar 2, Deploy your AI Command Center: choosing one AI platform " +
    "company-wide (for example ChatGPT, Copilot, or Claude) prevents the chaos of employees using " +
    "personal accounts with company data; Cadre describes this as the investment that delivers " +
    "the highest ROI, though most companies either haven't rolled out licenses or use only a " +
    "fraction of the platform's features, such as projects or custom GPTs. Pillar 3, Create an " +
    "AI-First Culture Shift: this requires a clear AI policy, CEO communication that addresses " +
    "employee fears, and real change management as teams adapt their processes to AI systems; " +
    "success depends on deep employee involvement and buy-in, and without cultural adoption even " +
    "a technically sound AI strategy will fail. Pillar 4, Connect & Enable your Tech Stack: an " +
    "AI-enabled tech stack means the company's existing systems have API access so AI agents can " +
    "push and pull data across fragmented platforms like CRMs and ERPs, and it also means " +
    "auditing current tools for AI features already available rather than buying new ones. " +
    "Pillar 5, AI-Healthy Data Assessment: AI needs clean, structured data for the same reason " +
    "people do, since messy data is hard to search and reason about; this pillar maps where data " +
    "is created, transformed, and stored across the organization so AI systems can process it. " +
    "Pillar 6, Build your Framework for AI Agent Readiness: AI agents act as digital employees " +
    "carrying out tasks across a company's systems, so they need clear standard operating " +
    "procedures, infrastructure access, and company templates, plus ongoing monitoring, feedback, " +
    "and training — the same way a new hire is expected to be noticeably better six months in " +
    "than on day one. Pillar 7, Departmental AI Deep Dives: this pillar assesses each " +
    "department's people, processes, and technology to find opportunities for AI, agentic " +
    "workflows, or plain automation, with the goal of helping teams do more with less and " +
    "shifting employees away from tedious work toward higher-value tasks. Pillar 8, Find your " +
    "3-Year AI Vision: this defines the company's longer-term goal of becoming the most scalable, " +
    "AI-enabled organization in its category, giving stakeholders a shared benchmark to track " +
    "progress against, the same way an annual budget does.",
  source: SOURCE_URL,
  provenance: "derived",
  sourceHash: SOURCE_HASH,
};

/** Cadre's named approach to securing client data when working across LLMs. */
export const strategyLlmSelectionDataSecurity: KnowledgeModule = {
  id: "strategy-llm-selection-data-security",
  topic: "services",
  content:
    "Cadre AI's LLM Selection & Data Security approach has four parts: selecting the right large " +
    "language model tailored to each of a client's specific use cases; black-boxing client data " +
    "so it is never used to train other models; stopping employees from sharing company secrets " +
    "on personal LLM accounts; and moving the client's entire team onto secure, compliant AI " +
    "tools.",
  source: SOURCE_URL,
  provenance: "published",
  sourceHash: SOURCE_HASH,
};

export const strategyModules: KnowledgeModule[] = [
  strategyAiStrategyService,
  strategyOpenAiServicePartner,
  strategyMaturityIndexPillars,
  strategyLlmSelectionDataSecurity,
];
