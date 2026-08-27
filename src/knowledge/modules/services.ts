/**
 * Services section — three of Cadre AI's four named services: AI Leadership & Facilitation,
 * AI Engineering, and AI Agents. The fourth, AI Strategy (`/strategy`), is a sibling curator's
 * section and is deliberately not covered here.
 *
 * Curated from:
 *  - https://www.cadreai.com/agents                 (knowledge-source/agents.txt)
 *  - https://www.cadreai.com/ai-engineering          (knowledge-source/ai-engineering.txt)
 *  - https://www.cadreai.com/leadership-facilitation (knowledge-source/leadership-facilitation.txt)
 */

import type { KnowledgeModule } from "../types";

export const servicesModules: KnowledgeModule[] = [
  {
    id: "services-ai-leadership-facilitation",
    topic: "services",
    content:
      "Cadre AI's AI Leadership & Facilitation service addresses the problem that AI tool spending " +
      "can produce zero ROI if the people who need to use the tools are not ready. Cadre describes " +
      "the failure pattern it is built to fix: companies spend capital on underutilized AI tools, " +
      "leaders don't know where to start or who to trust, technical implementation without culture " +
      "change creates resistance, projects halt from lack of alignment rather than bad strategy, and " +
      "employees can experience the transition as an existential crisis for their future. Cadre's " +
      "approach merges three elements — technical implementation, behavioral science, and executive " +
      "coaching — to turn executives and teams from AI-hesitant to AI-ambitious. The core offering, " +
      "'AI Leadership Executive & Team Facilitation,' is described as highly experiential sessions, " +
      "explicitly not training or lectures, structured in three weighted parts: 30% teaching (best " +
      "practices drawn from real-world implementations, spotting AI-ready use cases, messaging AI " +
      "adoption to skeptical or scared teams, and understanding what Cadre calls the Eight Pillars " +
      "Framework), 30% interaction (live problem-solving through resistance scenarios such as " +
      "skeptical department heads or employees worried about their jobs, meant to turn participants " +
      "into 'Strategic Champions' who actively advocate for AI adoption rather than just agree with " +
      "it), and 40% application (working through 3-5 specific business problems identified from " +
      "diagnostics of the client's own departments, ending with a prioritized shortlist, clarity on " +
      "quick wins versus long-term plays, and a concrete next-step action plan). Cadre states every " +
      "example and exercise is pulled from the client's actual operations rather than generic case " +
      "studies or theoretical frameworks. The stated outcomes are: spotting AI-ready use cases in the " +
      "business, addressing fear and uncertainty productively, building alignment across leadership " +
      "and teams, and leaving with actionable plans rather than only inspiration. Sessions are " +
      "tailored to the specific workflows, fears, and opportunities of individual departments — the " +
      "page names Legal, Technology, Marketing, Customer Success, Finance, Operations, Executive " +
      "Leadership, and Sales. Cadre frames this facilitation work as the first step in a sequence: " +
      "once leadership is aligned and teams are AI-ambitious, Cadre says it then helps find the right " +
      "strategy and implement it through AI Engineering, summarizing the relationship as 'Culture " +
      "without strategy is chaos. Strategy without adoption gets you zero ROI.'",
    source: "https://www.cadreai.com/leadership-facilitation",
    provenance: "derived",
    sourceHash: "f9f749e075a4a34a882ac34baf168e147fe832e011144723aecd41e7ce9c896e",
  },
  {
    id: "services-ai-leadership-session-formats",
    topic: "services",
    content:
      "Cadre AI's AI Leadership & Facilitation service is offered in four session formats: a 2-Day " +
      "Leadership Intensive, a 1-Day Workshop, a Half-Day Executive Session, and a 1-Hour Virtual " +
      "Kickoff.",
    source: "https://www.cadreai.com/leadership-facilitation",
    provenance: "published",
    sourceHash: "f9f749e075a4a34a882ac34baf168e147fe832e011144723aecd41e7ce9c896e",
  },
  {
    id: "services-ai-engineering-approach",
    topic: "services",
    content:
      "Cadre AI's AI Engineering service focuses on connecting a client's existing systems, " +
      "automating workflows, and adding AI intelligence to repetitive processes. Cadre describes its " +
      "engagement process in three steps: first, understand the problem — what business impact is " +
      "being targeted, where teams are wasting time on manual work, and what data is trapped in " +
      "disconnected systems; second, pick the right approach — research existing tools that solve the " +
      "specific problem, automate workflows and connect current systems, or build custom AI agents " +
      "for complex multi-step processes; third, integrate and automate — connect APIs across the " +
      "client's tech stack, build workflows that scale with the business, and track emerging AI " +
      "capabilities expected to launch in the next 3-6 months. Cadre states its implementations have " +
      "taught it when to buy an existing tool, when to automate, and when to build custom software, " +
      "citing having seen companies waste months building custom solutions that a $50/month tool and " +
      "smart automation would have solved within a week, as well as companies trying to force-fit " +
      "tools that don't work. The service covers four kinds of work: automating repetitive tasks " +
      "(data entry, document routing, email triage, report generation, customer inquiry handling); " +
      "connecting disconnected systems so the tech stack syncs data in real time and triggers actions " +
      "across platforms instead of manual copy-paste between tools; adding AI intelligence so " +
      "workflows understand context, route based on content analysis, extract insights from " +
      "unstructured data, and improve from patterns over time; and deploying custom AI agents for " +
      "autonomous work such as complex sales research, multi-step customer service, or operations " +
      "that run end-to-end (this last category is Cadre's separate AI Agents offering). Cadre " +
      "positions its engineering work as forward-looking, stating it tracks which platforms are " +
      "gaining traction and where AI technology is headed 6-12 months out so a client's automations " +
      "keep scaling with emerging capabilities rather than being built only for what AI can do today. " +
      "Cadre frames engineering as one part of a three-part strategic approach alongside AI Strategy " +
      "and AI Leadership & Facilitation, stating that automations only deliver full ROI when " +
      "strategy, engineering, and team adoption work together.",
    source: "https://www.cadreai.com/ai-engineering",
    provenance: "derived",
    sourceHash: "76ecfba8a62c27e95bdf9b4c3bee422cd30f9206fc6d2f47adf2e9f76eabbdd6",
  },
  {
    id: "services-ai-agents-categories",
    topic: "services",
    content:
      "Cadre AI's AI Agents service covers three tiers of build, from simplest to most complex. " +
      "Prompts & Assistants are high-impact prompts and assistants that plug into daily work, " +
      "automate repeatable tasks, and create immediate time savings — the way to 'start simple and " +
      "move quickly.' Voice Agents bring AI into conversations, handling intake, qualification, " +
      "support, and internal routing, turning calls into clean data and next steps. Fully Fledged AI " +
      "Agents are built for more complex workflows: agents that can plan, take actions across tools, " +
      "and run end-to-end processes with guardrails and human oversight. Cadre states each agent it " +
      "builds is designed to drive revenue, improve profitability, or elevate employees.",
    source: "https://www.cadreai.com/agents",
    provenance: "published",
    sourceHash: "75fb46b53021f71bbd656174ae936f6dcc4bfe45abfb47a583b8e18c1bcc1001",
  },
  {
    id: "services-ai-agents-examples",
    topic: "services",
    content:
      "Cadre AI publishes an agent library on its site showing examples of agents it has built for " +
      "clients, filterable by department (Legal, Technology, Marketing, Customer Success, Finance, " +
      "Operations, Executive Leadership, Sales) and by industry (Retail & E-commerce, Hospitality, " +
      "Mortgage & Lending, Financial Services, Construction, Manufacturing & Logistics, Real Estate, " +
      "Professional Services, Private Equity). Examples described on the page include: a Change " +
      "Order Tracker (Operations, built for Construction) that documents scope changes as they occur, " +
      "automatically generates change order pricing, and is described as protecting margin on every " +
      "change; a Quote Approval Router (Sales) that routes quote approvals to the correct " +
      "stakeholders based on discount levels and deal parameters, follows approval hierarchies and " +
      "escalation rules, and is described as reducing quote turnaround time significantly; a Team " +
      "Check-in Facilitator (Operations) that prompts team members for check-in responses on a " +
      "schedule via Slack or email and compiles responses while flagging blockers; a Training Module " +
      "Builder (Operations) that converts existing documentation and presentations into structured " +
      "training modules with quizzes and completion tracking; an Escalation Decision Advisor " +
      "(Customer Success) that helps support agents decide when to escalate tickets based on customer " +
      "tier, issue severity, and SLA requirements; a Slack IT Supporter (Operations) that delivers IT " +
      "support through a conversational interface in Slack and routes complex issues appropriately; " +
      "a Sales Objection Coach (Sales) that gives reps frameworks for handling objections around " +
      "price, timing, and fit; an Investment Committee Prep agent (Executive Leadership, built for " +
      "Private Equity) that auto-creates IC memos and decision decks, synthesizes workstreams into " +
      "decision-ready materials, applies IC format and standard evaluation criteria, and highlights " +
      "open issues and comparable investments; an Automated Takeoff Generator (Sales, built for " +
      "Construction) that analyzes construction plans to extract material quantities and " +
      "measurements and generates detailed takeoff reports, described as reducing estimating time " +
      "from days to hours; an Invoice Query Resolver (Finance) that answers vendor and employee " +
      "questions about invoice status, payment terms, and approval workflows; a Delegation Advisor " +
      "(Operations) that suggests task assignments based on team workload and skills; and a Project " +
      "Docs agent (Operations) that generates project documentation such as specs and requirements on " +
      "demand. The page presents these as a sample of results delivered for existing clients, not an " +
      "exhaustive list of every agent Cadre can build.",
    source: "https://www.cadreai.com/agents",
    provenance: "derived",
    sourceHash: "75fb46b53021f71bbd656174ae936f6dcc4bfe45abfb47a583b8e18c1bcc1001",
  },
];
