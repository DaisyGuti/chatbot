import type { KnowledgeModule } from "@/knowledge/types";

/**
 * Industries section — the /industries overview plus its nine named industry pages. Each
 * industry page follows the same template (a value-proposition line, four recurring challenges,
 * and a grid of example AI agents), so each module here assembles those same three parts from one
 * page. `provenance` is `derived` throughout: every module combines several statements from a
 * single page rather than quoting one sentence verbatim.
 *
 * Agent grids on every industry page except private-equity carry a "1 10" pagination marker while
 * only five (or, on professional-services, five unique) agent cards are present in the crawled
 * extract — the widget is client-side paginated and the crawler only captured the first page.
 * Content below is worded as "example agents" rather than a complete roster for that reason; see
 * the curator report for the corresponding unknown.
 */

export const industriesOverview: KnowledgeModule = {
  id: "industries-overview",
  topic: "industries",
  content:
    "Cadre AI's industries page lists nine industries with dedicated pages: Professional " +
    "Services, Private Equity, Real Estate, Financial Services, Mortgage & Lending, Construction, " +
    "Retail & E-commerce, Manufacturing & Logistics, and Hospitality. Across all nine, Cadre frames " +
    "its work around three outcomes: driving revenue through AI-driven automation and predictive " +
    "insights, increasing profitability by optimizing operations and eliminating inefficiencies, " +
    "and elevating employees by removing repetitive tasks so teams can focus on higher-impact work. " +
    "The page also states that Cadre has worked with companies in industries outside these nine " +
    "categories, and invites prospects whose industry isn't listed to talk to an AI strategist " +
    "about what's possible for their business.",
  source: "https://www.cadreai.com/industries",
  provenance: "derived",
  sourceHash: "b2eb7a2b7ac58313f87c73996dd2f399a4a490e48e2ca007deb012d99e1cc88c",
};

export const industriesProfessionalServices: KnowledgeModule = {
  id: "industries-professional-services",
  topic: "industries",
  content:
    "Cadre's professional-services page names four recurring problems it addresses: revenue " +
    "capped by billable hours, manual proposal/contract/research work that consumes partner time, " +
    "institutional knowledge scattered across individual expertise rather than searchable systems, " +
    "and time-intensive manual client status updates. Example AI agents listed for this industry: " +
    "a Client Status Updater (Operations) that monitors project-management tools and communications " +
    "to auto-generate client progress reports; a Contract Review Accelerator (Operations) that " +
    "analyzes contracts for standard clauses, red flags, and off-market terms, benchmarking against " +
    "industry norms and past agreements; a Client Proposal Automator (Sales) that generates " +
    "customized proposals from past proposals, case studies, and firm expertise, with the page " +
    "stating it reduces proposal creation time by 70%; a Research Brief Compiler (Finance) that " +
    "synthesizes multi-source research into client-ready briefs; and a Utilization Optimizer " +
    "(Operations) that analyzes team calendars and project assignments to flag utilization gaps and " +
    "reallocation opportunities. The page frames these as examples among a larger set of use cases, " +
    "not a complete list.",
  source: "https://www.cadreai.com/industries/professional-services",
  provenance: "derived",
  sourceHash: "301b9f61420851114f3e44225e1154726574d6d803bc7c4f915c0225b242960e",
};

export const industriesPrivateEquity: KnowledgeModule = {
  id: "industries-private-equity",
  topic: "industries",
  content:
    "Cadre's private-equity page states the firm accelerates deal flow, compresses due diligence " +
    "timelines, and works to extract more value from portfolio companies, with AI work built " +
    "specifically for private equity operations. The page names four recurring challenges: deal " +
    "sourcing that only surfaces opportunities after they hit the market, manual due diligence (CIM " +
    "review, financial modeling, contract review) that consumes weeks of partner time, relationship " +
    "intelligence scattered across individual emails rather than centralized systems, and portfolio " +
    "monitoring that relies on backward-looking board decks rather than real-time data. An " +
    "introductory statement on the page describes Cadre's engagement with PE firms specifically: " +
    "Cadre has facilitated learning events on behalf of private equity firms for their portfolio " +
    "companies' leadership teams, and has performed AI readiness assessments across PE portfolios, " +
    "positioning itself as an ongoing AI partner to both the fund and its portfolio companies. The " +
    "page lists ten example AI agents for private equity: a CIM Analyst (Sales) that parses CIMs, " +
    "pulls financial metrics, flags red flags, and benchmarks against past deals; a Deal Sourcer " +
    "(Sales) that surfaces pre-market targets from hiring trends, filings, funding activity, and " +
    "competitive moves; a Market Research Analyst (Finance) that condenses industry reports, " +
    "filings, news, and academic sources into structured insights; an NDA Analyst (Legal) that " +
    "auto-redlines NDAs against firm standards and categorizes them by risk; a Due Diligence " +
    "Analyst (Finance) that automates contract and financial document review using OCR and NLP; a " +
    "Predictive Portco Performance agent (Finance) that tracks operational, financial, and external " +
    "indicators to flag risk 3 to 6 months in advance and suggest operational playbooks and " +
    "exit-timing guidance; a Data Room Analyst (Finance) that automates data-room extraction and " +
    "flags missing documents or anomalies; an LP/Industry Monitor (Finance) that continuously " +
    "monitors news on portfolio companies and industries and scores fit against investment thesis; " +
    "an Investment Committee Prep agent (Executive Leadership) that auto-creates IC memos and " +
    "decision decks; and a CRM Analyst (Sales) that maps relationship health and suggests follow-up " +
    "timing and warm introductions.",
  source: "https://www.cadreai.com/industries/private-equity",
  provenance: "derived",
  sourceHash: "047402a5da1c88fa9a6dc1324a07afbb070e7c3e48441989978d68b941e470c5",
};

export const industriesRealEstate: KnowledgeModule = {
  id: "industries-real-estate",
  topic: "industries",
  content:
    "Cadre's real-estate page states it helps close deals faster through AI that automates " +
    "property analysis, qualifies leads instantly, and keeps pipelines moving at market speed. The " +
    "page names four recurring challenges: manual property analysis and market research that " +
    "limits deal volume, reactive lead qualification that spends time on unqualified leads, " +
    "transaction coordination handled through email threads and manual follow-ups, and market " +
    "intelligence that arrives after pricing or inventory shifts have already happened. Example AI " +
    "agents listed: a Showing Scheduler (Operations) that coordinates showing schedules to minimize " +
    "drive time and maximize properties shown per day; a Comp Analysis Automator (Sales) that pulls " +
    "comparable sales data and generates comp reports automatically, adjusting for property " +
    "features, location, and market trends; a Market Alert Monitor (Finance) that monitors MLS " +
    "data, pricing trends, and inventory changes and sends alerts when they match client criteria; " +
    "a Lead Scoring Optimizer (Sales) that scores incoming leads on buyer signals, financial " +
    "capacity, and timeline urgency; and a Pricing Strategy Advisor (Finance) that analyzes comps, " +
    "market velocity, and property features to recommend listing prices and suggest adjustments " +
    "based on showing feedback. The page frames these as examples among a larger set of use cases, " +
    "not a complete list.",
  source: "https://www.cadreai.com/industries/real-estate",
  provenance: "derived",
  sourceHash: "8c180075fcc8ce40e6b6a8e8b16237309f7ef23f0fe930a591fc801293df2db7",
};

export const industriesFinancialServices: KnowledgeModule = {
  id: "industries-financial-services",
  topic: "industries",
  content:
    "Cadre's financial-services page states it accelerates client onboarding, automates " +
    "compliance, and delivers personalized advice at scale. The page names four recurring " +
    "challenges: client onboarding (KYC, account opening) that takes weeks of manual work, " +
    "compliance and regulatory reporting that consumes operational resources, advisory work that " +
    "is generic rather than personalized because it depends on manual analysis, and risk/fraud " +
    "detection that is backward-looking rather than real-time. Example AI agents listed: a " +
    "Portfolio Recommendation Advisor (Finance) that analyzes client portfolios, risk profiles, and " +
    "market conditions to generate personalized investment recommendations; a Client Communication " +
    "Scheduler (Customer Success) that schedules and triggers client communications based on " +
    "portfolio events, market conditions, and regulatory requirements; a KYC Automation Accelerator " +
    "(Operations) that automates identity verification and generates compliance documentation and " +
    "audit trails, with the page stating it compresses onboarding from weeks to hours; a Client " +
    "Retention Predictor (Finance) that monitors account activity and engagement to flag at-risk " +
    "relationships before they leave; and a Client Risk Assessor (Finance) that evaluates client " +
    "risk tolerance through questionnaires and portfolio analysis to inform product " +
    "recommendations. The page frames these as examples among a larger set of use cases, not a " +
    "complete list.",
  source: "https://www.cadreai.com/industries/financial-services",
  provenance: "derived",
  sourceHash: "b059fe31bbee01fbf3b9532396ee126e16592255db4157f7332957bcf6b60f29",
};

export const industriesMortgageLending: KnowledgeModule = {
  id: "industries-mortgage-lending",
  topic: "industries",
  content:
    "Cadre's mortgage-and-lending page states it helps close loans faster and protect margins " +
    "through AI that automates underwriting and accelerates approvals. The page names four " +
    "recurring challenges: manual underwriting and document review that slows approvals, " +
    "income/asset verification that requires extensive back-and-forth communication with " +
    "borrowers, manual rate/pricing comparisons that make it hard to compete when borrowers are " +
    "shopping multiple lenders, and pipeline management based on static reports rather than " +
    "real-time alerts on loans at risk of falling out. Example AI agents listed: a Rate Lock " +
    "Optimizer (Sales) that monitors market rates and competitor pricing and alerts when borrowers " +
    "should lock; an Automated Underwriter (Operations) that reviews applications, verifies income " +
    "and assets, and generates underwriting decisions automatically; a Loan Validator (Operations) " +
    "that reviews loan packages for completeness, accuracy, and compliance before submission; a " +
    "Document Verification Accelerator (Operations) that extracts and verifies data from pay stubs, " +
    "tax returns, and bank statements; and a Client Update Notifier (Customer Success) that " +
    "automatically sends borrowers status updates at loan milestones and requests missing " +
    "documents. The page frames these as examples among a larger set of use cases, not a complete " +
    "list.",
  source: "https://www.cadreai.com/industries/mortgage-lending",
  provenance: "derived",
  sourceHash: "f93ecbec0a2db7d5c884761ffcbd58d16bcfd672731b7aef2c008b2544ca9400",
};

export const industriesConstruction: KnowledgeModule = {
  id: "industries-construction",
  topic: "industries",
  content:
    "Cadre's construction page states it helps firms win more bids, eliminate delays, and protect " +
    "margins through AI that automates takeoffs and tracks project health. The page names four " +
    "recurring challenges: manual quantity takeoffs and estimating that take days and introduce " +
    "pricing errors, project issues that become visible only after they've delayed the schedule, " +
    "reactive/manual change-order tracking that erodes margin, and static labor/equipment " +
    "scheduling that can't adapt to real-time conditions. Example AI agents listed: a Project " +
    "Health Monitor (Operations) that monitors project progress, material deliveries, and " +
    "subcontractor schedules to flag risk before it impacts timeline; an Automated Takeoff " +
    "Generator (Sales) that extracts material quantities and measurements from construction plans " +
    "automatically, with the page stating it reduces estimating time from days to hours; a Change " +
    "Order Tracker (Operations) that documents scope changes as they occur and auto-generates " +
    "change-order pricing; a Bid Estimator (Sales) that combines takeoff data with historical cost " +
    "data and current pricing to generate estimates and apply markup rules; and a Resource " +
    "Scheduler (Operations) that dynamically schedules labor and equipment across active projects " +
    "based on real-time availability, weather delays, and scope changes. The page frames these as " +
    "examples among a larger set of use cases, not a complete list.",
  source: "https://www.cadreai.com/industries/construction",
  provenance: "derived",
  sourceHash: "829c00301e5a16c9a7d505b362707b4fc2d46feca5f87a26e299b6453fb7acc4",
};

export const industriesRetailEcommerce: KnowledgeModule = {
  id: "industries-retail-ecommerce",
  topic: "industries",
  content:
    "Cadre's retail-and-e-commerce page states it helps increase conversion, reduce returns, and " +
    "maximize lifetime value through AI that personalizes interactions and optimizes operations " +
    "from inventory to checkout. The page names four recurring challenges: generic product " +
    "recommendations that miss personalization opportunities, inventory forecasting that is " +
    "reactive and leads to stockouts or overstock, customer-service teams overwhelmed by repetitive " +
    "questions, and fraud/returns-abuse detection that happens after losses occur. Example AI " +
    "agents listed: a Support Response Automator (Customer Success) that handles repetitive " +
    "customer-service questions about orders, shipping, returns, and products and escalates complex " +
    "issues with context, with the page stating it reduces support volume by 60%; a Checkout Flow " +
    "Optimizer (Sales) that analyzes checkout behavior to identify friction points causing " +
    "abandonment and tests variations; a Customer Loyalty Accelerator (Sales) that analyzes " +
    "purchase patterns and engagement to trigger personalized post-purchase communications and " +
    "incentives; a Demand Forecasting Analyzer (Operations) that predicts product demand from sales " +
    "trends, seasonality, and market signals; and an Email Campaign Optimizer (Sales) that " +
    "generates personalized email content by customer segment and optimizes send timing and subject " +
    "lines. The page frames these as examples among a larger set of use cases, not a complete list.",
  source: "https://www.cadreai.com/industries/retail-e-commerce",
  provenance: "derived",
  sourceHash: "1ae79db76a14db9e0570609516bffab9fc01446589155cfd40d11a3941d55c5a",
};

export const industriesManufacturingLogistics: KnowledgeModule = {
  id: "industries-manufacturing-logistics",
  topic: "industries",
  content:
    "Cadre's manufacturing-and-logistics page states it helps eliminate downtime, optimize " +
    "inventory, and accelerate fulfillment through AI that predicts problems before they happen. " +
    "The page names four recurring challenges: reactive maintenance that causes unplanned downtime " +
    "and emergency-repair expenses, manual inventory planning that leads to stockouts or excess " +
    "inventory, static production schedules that can't adapt to real-time demand or material " +
    "changes, and supply-chain visibility that is fragmented across systems and partners. Example " +
    "AI agents listed: a Production Schedule Optimizer (Operations) that dynamically adjusts " +
    "production schedules based on material availability, equipment status, and order priorities; " +
    "a Predictive Maintenance Scheduler (Operations) that analyzes equipment sensor data and " +
    "maintenance history to predict failures and schedule preventive maintenance, with the page " +
    "stating it reduces unplanned downtime by 60%; a Supplier Performance Tracker (Operations) that " +
    "monitors supplier delivery performance and quality metrics and flags vendor issues before they " +
    "impact production; a Smart Inventory Optimizer (Operations) that predicts inventory needs from " +
    "production schedules and order patterns and auto-generates purchase orders; and a Waste " +
    "Reduction Tracker (Operations) that tracks material usage and scrap rates by production run " +
    "and suggests process adjustments. The page frames these as examples among a larger set of use " +
    "cases, not a complete list.",
  source: "https://www.cadreai.com/industries/manufacturing-logistics",
  provenance: "derived",
  sourceHash: "0e87e1c9dc6859e3a93fba4b02798a0a0409c3871bedba26236b063cd2d3e712",
};

export const industriesHospitality: KnowledgeModule = {
  id: "industries-hospitality",
  topic: "industries",
  content:
    "Cadre's hospitality page states it helps elevate guest experience and optimize operations " +
    "through AI that personalizes service and predicts demand. The page names four recurring " +
    "challenges: reactive staffing that leads to either overstaffing costs or understaffed service " +
    "gaps, manual/static revenue management that misses dynamic pricing opportunities, guest " +
    "communication that is generic rather than personalized at scale, and manual handoffs between " +
    "departments that create service delays. Example AI agents listed: a Guest Preference Manager " +
    "(Customer Success) that tracks guest preferences from past stays and applies them to future " +
    "reservations, coordinating special requests across departments; a Demand Forecasting Optimizer " +
    "(Operations) that predicts occupancy patterns from bookings, events, and seasonal trends and " +
    "recommends staffing levels; an Upsell Opportunity Detector (Sales) that analyzes guest profiles " +
    "and booking patterns to identify upsell opportunities such as room upgrades and amenities; a " +
    "Dynamic Pricing Optimizer (Finance) that adjusts room rates in real time based on demand, " +
    "competition, and market conditions; and a Review Response Generator (Customer Success) that " +
    "generates personalized responses to guest reviews across platforms while maintaining brand " +
    "voice. The page frames these as examples among a larger set of use cases, not a complete list.",
  source: "https://www.cadreai.com/industries/hospitality",
  provenance: "derived",
  sourceHash: "8078829d0ff115982cca09576faa04a9f160f34d555fd2bb25c8e4cd902edeec",
};

export const industriesModules: KnowledgeModule[] = [
  industriesOverview,
  industriesProfessionalServices,
  industriesPrivateEquity,
  industriesRealEstate,
  industriesFinancialServices,
  industriesMortgageLending,
  industriesConstruction,
  industriesRetailEcommerce,
  industriesManufacturingLogistics,
  industriesHospitality,
];
