/**
 * Departments section — cadreai.com/departments and its eight department subpages.
 *
 * Each page pairs a one-line value proposition with named pain points, three narrative
 * "possible with AI today" themes, and a library of specific AI agents (many tagged with the
 * industry they were built for — Private Equity, Financial Services, Real Estate, Construction,
 * Manufacturing & Logistics, Mortgage & Lending, Professional Services, Hospitality, Retail &
 * E-commerce). Agent lists on several pages (Operations, Sales, Marketing) run into the dozens;
 * modules below sample representative agents rather than transcribing every row, and say so
 * explicitly so the bot never implies a curated list is exhaustive.
 */

import type { KnowledgeModule } from "../types";

export const departmentsModules: KnowledgeModule[] = [
  {
    id: "departments-overview",
    topic: "departments",
    content:
      "Cadre's Departments page (cadreai.com/departments) organizes the company's AI use cases by " +
      "business function, covering eight departments: Legal, Technology, Marketing, Customer " +
      "Success, Finance, Operations, Executive Leadership, and Sales. Each has a one-line value " +
      "proposition on the page: Legal — 'Accelerate contract review and stay compliant with AI " +
      "that automates legal research, flags risks instantly, and scales expertise across the " +
      "business.' Technology — 'Ship faster and maintain quality with AI that automates code " +
      "review, accelerates incident response, and eliminates technical debt.' Marketing — 'Create " +
      "more, test faster, and prove ROI with AI that generates campaigns, optimizes performance, " +
      "and scales content without scaling headcount.' Customer Success — 'Prevent churn and drive " +
      "expansion with AI that predicts at-risk accounts, automates health monitoring, and scales " +
      "personalized engagement.' Finance — 'Close books faster and make better decisions with AI " +
      "that automates reconciliation, forecasts accurately, and delivers real-time financial " +
      "intelligence.' Operations — 'Run leaner and move faster with AI that automates workflows, " +
      "eliminates bottlenecks, and keeps your operations running without constant manual " +
      "intervention.' Executive Leadership — 'Make faster, better decisions with AI that " +
      "synthesizes intelligence from across the business and delivers insights without waiting " +
      "for reports.' Sales — 'Close more deals faster with AI that automates prospecting, " +
      "qualifies leads instantly, and keeps your pipeline moving without manual busywork.' The " +
      "page frames Cadre's value across every department in three outcomes: driving revenue " +
      "(scaling with AI-driven automation and predictive insights that unlock growth), increasing " +
      "profitability (optimizing operations and eliminating inefficiencies to boost margins and " +
      "enterprise value), and elevating employees (removing tedious tasks so teams can focus on " +
      "higher-impact work). For departments not among the eight listed, the page invites visitors " +
      "to talk to an AI strategist, stating 'every function has AI opportunities hiding in plain " +
      "sight.'",
    source: "https://www.cadreai.com/departments",
    provenance: "derived",
    sourceHash:
      "2fb9b49b3b55e72b4764cc38d772b6825b69dc16ed386a718b4319b81a22eb6d",
  },
  {
    id: "departments-customer-success",
    topic: "departments",
    content:
      "Cadre's Customer Success department page frames its value as: 'Prevent churn and drive " +
      "expansion with AI that predicts at-risk accounts, automates health monitoring, and scales " +
      "personalized engagement.' It names four recurring CS challenges: reactive churn prevention " +
      "(at-risk accounts are discovered only after they've disengaged or already said they're " +
      "leaving), manual health monitoring (checking account health consumes hours and still " +
      "misses early warning signs), communication that doesn't scale (personalized outreach caps " +
      "how large a book of business one person can manage), and inconsistent onboarding (new " +
      "customers slip through cracks in adoption, delaying time-to-value). The page groups its " +
      "proposed AI use into three themes: predictive account intelligence (monitoring usage " +
      "patterns to flag risk before customers disengage), scaled personalization (continuously " +
      "calculated health scores and behavior-triggered communications), and an 'expansion " +
      "multiplier' (using the same intelligence to spot upsell opportunities, not just prevent " +
      "churn). Cadre profiles specific Customer Success AI agents, including a Renewal Reminder " +
      "Orchestrator (tracks contract renewal dates and automates reminder workflows), a Customer " +
      "Health Analyst (assesses product usage, support tickets, NPS scores, and engagement to " +
      "predict churn risk), an Escalation Decision Advisor (helps support agents decide when to " +
      "escalate based on customer tier, issue severity, and SLA requirements), a QBR Prep " +
      "Automator (assembles Quarterly Business Review materials from customer data), a Support " +
      "Ticket Router (routes tickets by issue type, customer tier, language, and required " +
      "expertise), an Onboarding Guide Generator (builds personalized onboarding plans by " +
      "customer use case and industry), and a Customer Success Playbook Assistant (offers " +
      "situational guidance on escalations and adoption strategies from CS playbooks). Several " +
      "agents are shown as examples for specific industries: a Review Response Generator for " +
      "Hospitality, a Client Communication Scheduler for Financial Services, a Client Update " +
      "Notifier for Mortgage & Lending, a Guest Preference Manager for Hospitality, and a Support " +
      "Response Automator for Retail & E-commerce that the page states 'reduces support volume by " +
      "60%.'",
    source: "https://www.cadreai.com/departments/customer-success",
    provenance: "derived",
    sourceHash:
      "9ce178ebddd40839358f0231665dae382f81955404776f7ab726b7d833aecd69",
  },
  {
    id: "departments-executive-leadership",
    topic: "departments",
    content:
      "Cadre's Executive Leadership department page frames its value as: 'Make faster, better " +
      "decisions with AI that synthesizes intelligence from across the business and delivers " +
      "insights without waiting for reports.' It names four recurring challenges: siloed business " +
      "intelligence (critical information lives in departmental systems, forcing decisions on " +
      "incomplete pictures), backward-looking reports (static reports show last week, not what's " +
      "happening now), manual strategic analysis (building scenarios and modeling outcomes takes " +
      "days instead of instant AI-generated options), and meeting-heavy alignment (keeping " +
      "leadership synchronized requires status meetings that consume time better spent deciding). " +
      "The page groups its proposed AI use into three themes: unified executive intelligence (AI " +
      "that synthesizes data across the business and generates meeting briefings automatically), " +
      "real-time business visibility (KPIs monitored continuously with anomalies flagged " +
      "automatically), and a 'decision velocity advantage' (faster decisions that are also better " +
      "because they're synthesized from more of the business). Specific agents profiled include a " +
      "Meeting Prep Briefing Generator (builds executive briefings for upcoming meetings from " +
      "CRM, email, and Slack data), a Business Metrics Explainer (translates KPIs and analytics " +
      "into plain language for non-technical executives), an Executive Coach (provides on-demand " +
      "leadership coaching and decision frameworks), and — tagged for Private Equity — an " +
      "Investment Committee Prep agent that auto-creates IC memos and decision decks, applies " +
      "standard IC evaluation formats, and highlights open issues and comparable investments.",
    source: "https://www.cadreai.com/departments/executive-leadership",
    provenance: "derived",
    sourceHash:
      "de70a257415ef8478eb404f0d6d2a7f7df4be9027e2b245c993fafa6878eda2f",
  },
  {
    id: "departments-finance",
    topic: "departments",
    content:
      "Cadre's Finance department page frames its value as: 'Close books faster and make better " +
      "decisions with AI that automates reconciliation, forecasts accurately, and delivers " +
      "real-time financial intelligence.' It names four recurring challenges: a month-end close " +
      "marathon (manual reconciliation consumes days and delays reporting), static forecasting " +
      "(spreadsheet models go stale the moment they're shared), expense approval delays (manual " +
      "review and routing frustrates employees and consumes finance team time), and reactive " +
      "variance analysis (budget issues surface only after they've compounded). The page groups " +
      "its proposed AI use into three themes: automated close & reconciliation (compressing " +
      "month-end from days to hours), real-time financial intelligence (forecasts that reflect " +
      "current pipeline and variance alerts that surface issues early), and a 'strategic finance " +
      "advantage' (shifting time from data entry to strategic analysis). The page profiles a large " +
      "set of Finance agents, several tagged to specific industries: for Private Equity, a Market " +
      "Research Analyst (condenses filings, news, and reports into structured insights), an " +
      "LP/Industry Monitor (tracks portfolio-company and industry news and scores fit against " +
      "investment thesis), a Predictive Portco Performance agent (the page states it 'flags risk " +
      "3 to 6 months in advance' and suggests intervention playbooks), a Due Diligence Analyst " +
      "(uses OCR/NLP to flag red flags and off-market contract terms), and a Data Room Analyst " +
      "(extracts and red-flags data-room documents, described as operating 'around the clock " +
      "across multiple deals'); for Financial Services, a Client Retention Predictor, a Portfolio " +
      "Recommendation Advisor, and a Client Risk Assessor; for Real Estate, a Market Alert Monitor " +
      "and a Pricing Strategy Advisor; for Hospitality, a Dynamic Pricing Optimizer; and for " +
      "Professional Services, a Research Brief Compiler. General-purpose Finance agents include a " +
      "Revenue Recognition Automator, a Financial Forecasting Advisor, an Expense Report " +
      "Auto-approver, a Financial Analyst Assistant, and an Invoice Query Resolver.",
    source: "https://www.cadreai.com/departments/finance",
    provenance: "derived",
    sourceHash:
      "396fd2955efab39bb9248399cae360ac9871410faa93b61515285699d512332e",
  },
  {
    id: "departments-legal",
    topic: "departments",
    content:
      "Cadre's Legal department page frames its value as: 'Accelerate contract review and stay " +
      "compliant with AI that automates legal research, flags risks instantly, and scales " +
      "expertise across the business.' It names four recurring challenges: a contract review " +
      "backlog (deal velocity is limited by how fast legal can review contracts), time-intensive " +
      "legal research (finding precedents and clause language takes hours), manual compliance " +
      "monitoring (tracking regulatory changes and deadlines via spreadsheets), and bottlenecked " +
      "legal expertise (routine questions consume partner time because legal knowledge isn't " +
      "self-service). The page groups its proposed AI use into three themes: accelerated contract " +
      "intelligence (analyzing contracts for standard terms and flagging unusual clauses in " +
      "minutes instead of hours), instant legal knowledge access (surfacing precedents and " +
      "tracking compliance deadlines automatically), and a 'strategic counsel advantage' (spending " +
      "time on strategic counsel instead of routine markup). The page profiles three Legal agents: " +
      "an NDA Analyst (tagged for Private Equity) that auto-redlines NDAs to firm standards, flags " +
      "confidentiality scope and liability language, and categorizes NDAs by risk and complexity; " +
      "a Contract Clause Library that provides approved contract language, clauses, and templates " +
      "on demand by contract type, jurisdiction, and business context; and a Compliance Policy " +
      "Guide that answers employee questions on GDPR, CCPA, export controls, and governance.",
    source: "https://www.cadreai.com/departments/legal",
    provenance: "derived",
    sourceHash:
      "d1e9d90fb54fe07584c32061a61f7f34da02ad9709a3eb78fec32b37c91b4512",
  },
  {
    id: "departments-marketing",
    topic: "departments",
    content:
      "Cadre's Marketing department page frames its value as: 'Create more, test faster, and " +
      "prove ROI with AI that generates campaigns, optimizes performance, and scales content " +
      "without scaling headcount.' It names four recurring challenges: a content creation " +
      "bottleneck (producing quality content at required volume forces a tradeoff between speed " +
      "and quality), slow performance optimization (campaign analysis happens after the fact " +
      "instead of live), generic messaging at scale (personalization requires manual segmentation " +
      "most teams can't resource), and sequential creative testing (testing one variation at a " +
      "time slows learning). The page groups its proposed AI use into three themes: content " +
      "production at scale (generating blog posts, social content, email campaigns, and ad copy " +
      "while maintaining brand voice), real-time campaign intelligence (live performance " +
      "optimization and parallel A/B testing), and an 'attribution advantage' (proving ROI through " +
      "automated attribution). The page profiles roughly two dozen Marketing agents; examples " +
      "include a Marketing Assistant (automates marketing documentation, campaigns, and reports to " +
      "company templates), a Content Campaign Planner (plans and executes campaigns from a single " +
      "prompt), Blog Bestie (generates SEO-optimized blog content to improve local search " +
      "rankings), a Lead Scoring Updater (recalculates lead scores from behavioral signals and " +
      "routes high-score leads to sales), a Competitor Tracker (delivers regular competitor " +
      "monitoring updates), LinkedIn Legend (turns ideas into LinkedIn posts), an SEO Expert " +
      "(optimizes titles, descriptions, and tags), a Brand Guardian (provides instant brand " +
      "guidance so content stays on-brand without bottlenecking marketing), and a Website Chatbot " +
      "(answers customer questions on the company website around the clock, drawing from the " +
      "company knowledge base).",
    source: "https://www.cadreai.com/departments/marketing",
    provenance: "derived",
    sourceHash:
      "78cd954d6550ab8baf8888f538c52ae161518b127798ca2cc9d50327cfb5e4fe",
  },
  {
    id: "departments-operations",
    topic: "departments",
    content:
      "Cadre's Operations department page frames its value as: 'Run leaner and move faster with " +
      "AI that automates workflows, eliminates bottlenecks, and keeps your operations running " +
      "without constant manual intervention.' It names four recurring challenges: manual " +
      "coordination bottlenecks (email threads and meetings to coordinate simple tasks), scattered " +
      "process knowledge (SOPs live in individual heads and outdated docs), request routing chaos " +
      "(tasks fall through cracks because routing depends on someone remembering to forward the " +
      "right email), and status tracking overhead (manually chasing project status across " +
      "systems). The page groups its proposed AI use into three themes: automated workflow " +
      "orchestration (routing requests and assigning tasks without manual handoffs), institutional " +
      "process memory (SOPs generated from observed work and organized for instant retrieval), and " +
      "an 'efficiency multiplier' (doing more with fewer people by systematizing coordination). " +
      "Operations is Cadre's largest department page, profiling dozens of named agents spanning " +
      "general back-office workflows (a Company Policies Assistant, a Contract Renewal Tracker, an " +
      "Access Request Provisioner, an HR Policy Bot, a PTO Request Processor, an Auto-Scheduler, a " +
      "Standard Operating Procedure Generator) and industry-specific workflows: for Construction, " +
      "a Project Health Monitor, a Change Order Tracker, and a Resource Scheduler; for Real " +
      "Estate, a Showing Scheduler; for Manufacturing & Logistics, a Waste Reduction Tracker, a " +
      "Smart Inventory Optimizer, and a Production Schedule Optimizer; for Financial Services, a " +
      "KYC Automation Accelerator (the page states it 'compresses onboarding from weeks to " +
      "hours') and a Regulatory Change Tracker; for Mortgage & Lending, a Document Verification " +
      "Accelerator and an Automated Underwriter; for Professional Services, a Contract Review " +
      "Accelerator and a Utilization Optimizer; and for Hospitality, a Demand Forecasting " +
      "Optimizer. One agent, a Predictive Maintenance Scheduler for Manufacturing & Logistics, is " +
      "described as 'reducing unplanned downtime by 60%.' Several Operations agents cover " +
      "HR-adjacent tasks (offer letters, recruiting coordination, PTO, onboarding checklists) even " +
      "though HR is not one of Cadre's eight named departments.",
    source: "https://www.cadreai.com/departments/operations",
    provenance: "derived",
    sourceHash:
      "4dbdbe2d11483a4043504561d391fcb15722041333a92307e7baf2100304c2c3",
  },
  {
    id: "departments-sales",
    topic: "departments",
    content:
      "Cadre's Sales department page frames its value as: 'Close more deals faster with AI that " +
      "automates prospecting, qualifies leads instantly, and keeps your pipeline moving without " +
      "manual busywork.' It names four recurring challenges: manual prospecting that limits " +
      "volume (research and outreach consume selling time), reactive lead qualification (hours " +
      "wasted on unqualified leads instead of instant scoring), slow quote turnaround (proposal " +
      "creation takes days of back-and-forth), and pipeline maintenance overhead (manually " +
      "updating the CRM and chasing status). The page groups its proposed AI use into three " +
      "themes: automated prospecting at scale (automating research, enrichment, and personalized " +
      "outreach), instant deal acceleration (leads scored on entry, proposals generated from " +
      "templates, CRM updates automated), and a 'velocity advantage' (compressing sales cycles and " +
      "multiplying capacity per rep). The page profiles roughly forty Sales agents. General-purpose " +
      "examples include a Sales Assistant (on-demand support across the sales process), a Lead " +
      "Enrichment Automator, a Sales Coach (AI role-play for practicing sales skills with " +
      "feedback), a Demo Scheduler, a Cold Email Writer, and a CRM Data Entry Automator. " +
      "Industry-tagged examples include, for Private Equity, a Deal Sourcer (surfaces pre-market " +
      "acquisition targets from hiring trends, filings, and funding activity), a CIM Analyst " +
      "(parses CIMs and surfaces risks in minutes), and a CRM Analyst (maps relationship health and " +
      "optimizes deal outreach); for Professional Services, a Client Proposal Automator that the " +
      "page states 'reduces proposal creation time by 70% while improving quality'; for " +
      "Construction, an Automated Takeoff Generator and a Bid Estimator; for Real Estate, a Comp " +
      "Analysis Automator and a Lead Scoring Optimizer; and for Mortgage & Lending, a Rate Lock " +
      "Optimizer.",
    source: "https://www.cadreai.com/departments/sales",
    provenance: "derived",
    sourceHash:
      "c7330c8b03d5d03cb346a16efe17a9981bfa77c489dae0e6670bd9f6143526d9",
  },
  {
    id: "departments-technology",
    topic: "departments",
    content:
      "Cadre's Technology department page frames its value as: 'Ship faster and maintain quality " +
      "with AI that automates code review, accelerates incident response, and eliminates " +
      "technical debt.' It names four recurring challenges: code review bottlenecks (pull requests " +
      "sit waiting for review, slowing shipping velocity), chaotic incident response (manual " +
      "coordination during incidents relies on who remembers the runbook), subjective debt " +
      "prioritization (technical debt decisions are based on opinion rather than data), and " +
      "documentation debt (code ships without docs because engineers prioritize features). The " +
      "page groups its proposed AI use into three themes: automated code quality (reviewing pull " +
      "requests, flagging security issues before deploy), orchestrated incident management " +
      "(detecting and routing incidents automatically, generating postmortems from timeline data, " +
      "paging on-call engineers with full context), and a 'velocity multiplier' (shipping more " +
      "while maintaining quality and reducing mean time to resolution). The page profiles fourteen " +
      "Technology agents, including a Pull Request Reviewer (reviews PRs for code quality, " +
      "security issues, and test coverage), an Incident Response Coordinator (detects incidents " +
      "from monitoring alerts, creates tickets, posts to Slack, and pages on-call engineers), an " +
      "Incident Postmortem Assistant (generates structured postmortems from incident Slack threads " +
      "and monitoring alerts), a Security Vulnerability Triager (monitors security scanning tools " +
      "and creates prioritized, auto-assigned tickets), a Technical Debt Analyzer (evaluates code " +
      "complexity, bug density, and business impact to prioritize refactoring), a Code " +
      "Documentation Generator, and a Cursor / Claude Code Enablement Service — a training program " +
      "the page describes as helping developers use Claude and Cursor coding tools effectively.",
    source: "https://www.cadreai.com/departments/technology",
    provenance: "derived",
    sourceHash:
      "bb9b51f9ac9af2ebad23bbe8201252df3223d39443bf865453bcbf0e7105e858",
  },
];
