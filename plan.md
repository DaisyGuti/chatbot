# plan.md — Cadre AI support chatbot

**Brief:** `docs/requirements.md`. Build a customer-support chatbot for Cadre AI that handles
common inbound inquiries so their team can focus on high-value conversations. The prompt is
intentionally underspecified; scoping is graded.

**Target:** working MVP, deployed to a public URL, inside 4–6 hours.

---

## 1. Requirements

Extracted from the brief. Quoted source line, then how it is addressed.

### Deliverables (hard)

| # | Requirement (quoted) | Where addressed |
|---|---|---|
| D1 | "A deployed, publicly accessible URL of your chatbot" | Phase 1 — Vercel, before features |
| D2 | "Your code pushed to a GitHub repository you will share with us" | `DaisyGuti/chatbot`, private, shared by invite |
| D3 | "A `CLAUDE.md` at the root of the project" | `CLAUDE.md` |
| D4 | "A `plan.md` at the root of the project" | this file |

### Functional (the six scenarios)

| # | Scenario | Answerable from published content? |
|---|---|---|
| F1 | "what Cadre AI does and whether we work with their industry" | Yes — 4 services, 9 industries, 8 departments |
| F2 | "how to book a call with an AI strategist" | Yes — "Talk to an AI Strategist" → /contact |
| F3 | "how to access the Cadre portal" | **No** — portal exists, no access steps published |
| F4 | "what the AI Maturity Index is and how to get scored" | Partly — "eight-pillar framework", pillars unnamed |
| F5 | "Cadre's approach to LLM selection and data security" | Partly — partner list public, zero security claims |
| F6 | "a question the bot can't answer — and needs to escalate or redirect" | This is the design, not the failure case |

### Evaluation weights (drives priority order)

Claude Code proficiency 30% · System design 25% · Speed & scope 20% · Code quality &
verification 15% · Communication 10%.

The top two dimensions are the repo's own artifacts and its architecture, so `CLAUDE.md`,
this file, and the knowledge/retrieval boundary get built first and get the most care.

---

## 2. The central design decision

Three of the six scenarios have published answers. Three run into a knowledge boundary.

**The bot's job is answer-or-route, and routing is half the product.** The brief says so:
"handles the most common interactions so the team can focus on high-value conversations."

Cadre sells to private equity and financial services firms. The worst outcome is not a
question the bot declines — it is the bot inventing a price, a SOC 2 claim, or a case-study
number for a real company. So **unknowns are modelled as first-class data**, each with an owner
and a route, rather than falling out of a catch-all else-branch.

A refusal still converts. "I don't have pricing" is a dead end. "Pricing depends on scope — a
strategist can quote it, want me to pass your details along?" is the product.

---

## 3. Scope

### In

- The six scenarios above
- Grounded answers with a source URL per claim
- Intent classification: prospective client vs. existing client
- Two escalation routes with different handoffs
- Lead capture (name, company, industry, need) shown as the handoff payload
- Streaming chat UI

### Out — deliberately, with reasons

| Cut | Reason |
|---|---|
| Auth / user accounts | Nothing in the six scenarios needs identity. Cost: hours. Value: zero for the demo. |
| Real portal integration | No public API, no credentials, and portal access steps aren't published anyway. Stub the handoff. |
| Calendar or CRM writes | Booking is a real integration with real credentials. The lead-capture payload demonstrates the contract without the integration. |
| Cross-session memory | Needs a datastore. Single-session context covers every scenario in the brief. |
| Vector database | See §6. |
| Case-study summarization | Their numbers would need sourcing and verification. Link out instead. |

"Cut scope aggressively. 3 working features > 8 broken ones" — the brief's own tips table.

---

## 4. Architecture

```
Browser (Next.js App Router, React)
  └─ useChat  ──POST──▶  /api/chat  (Vercel Function, edge-compatible)
                              │
                              ├─ classifyIntent()     prospective | existing | unknown
                              ├─ KnowledgeRetriever   interface, in-memory impl
                              ├─ buildSystemPrompt()  modules + unknowns registry + rules
                              └─ OpenRouter           one call, streamed back
```

**Separation of concerns:** `src/knowledge/` knows nothing about HTTP or the model.
`src/chat/` knows nothing about where knowledge came from. The API route wires them.

**Data model** — `src/knowledge/types.ts`:

```ts
type KnowledgeModule = {
  id: string
  topic: Topic                  // 'services' | 'industries' | 'maturity-index' | ...
  content: string
  source: string                // cadreai.com URL — required
  confidence: 'published' | 'derived'
}

type UnknownFact = {
  id: string
  question: string              // what a user might ask
  reason: string                // why we don't know it
  route: 'strategist' | 'support'
}
```

The unknowns registry is deliberately the same shape of first-class data as the knowledge
modules. That symmetry is the architecture point.

---

## 5. Model selection

Live OpenRouter pricing, measured 2026-08-25. Assumed turn: ~4k input, ~250 output.

| Model | $/M in | $/M out | $/turn | Turns per $5 |
|---|---|---|---|---|
| google/gemini-2.5-flash-lite | 0.10 | 0.40 | $0.00050 | 10,000 |
| openai/gpt-5-mini | 0.25 | 2.00 | $0.00150 | 3,333 |
| anthropic/claude-haiku-4.5 | 1.00 | 5.00 | $0.00525 | 952 |
| **anthropic/claude-sonnet-5** | 2.00 | 10.00 | $0.01050 | **476** |

**Chosen: `anthropic/claude-sonnet-5`.** The $5 budget is not the binding constraint — a
take-home uses maybe 150 turns, so even the most expensive option leaves 3x headroom. The
binding constraint is refusal discipline: the failure that costs the most is fabricating a
client's numbers. Selection optimises for staying inside provided context.

`google/gemini-2.5-flash-lite` is configured as the fallback tier. Routing through OpenRouter
makes the swap a config change, which mirrors Cadre's own positioning — they "recommend the
best fit when off-the-shelf tools exist."

---

## 6. Rejected alternatives

### Vector database (Pinecone, pgvector)

Measured cadreai.com across 8 pages: **~15,400 words ≈ 20,000 tokens**. Claude Sonnet 5's
context window is 1,000,000 tokens. The entire knowledge base fits roughly 50 times over.

A vector DB solves "corpus too big for context." That problem does not exist here. Adding one
would introduce a failure mode that currently cannot occur — the retriever fetching the wrong
chunks and the model answering from partial information.

**What was built instead:** a real `KnowledgeRetriever` interface with an in-memory
implementation, and `PgVectorRetriever` as a documented one-file swap. The interface is the
scaling answer; the implementation is the scope decision.

### Claude Agent SDK for the deployed app

The Agent SDK is Claude Code as a library — built-in Read, Write, Edit, Bash and Grep tools,
for coding and filesystem agents. Three reasons it is wrong for this app:

1. Anthropic's docs: "Anthropic does not allow third party developers to offer claude.ai login
   or rate limits for their products, including agents built on the Claude Agent SDK." It reads
   `ANTHROPIC_API_KEY` (or Bedrock/Vertex/Foundry) and has no OpenRouter path — so the $5
   assessment key could not fund it.
2. It bundles a Claude Code binary and spawns it as a subprocess with filesystem access. That
   needs a container host, not Vercel serverless — a slower path to the hard-deliverable
   public URL.
3. An agent with `Bash` and `Edit` tools behind a public chat box is an unnecessary security
   surface for a bot that answers six question types.

Claude Code is used heavily to **build** this — which is what the 30% dimension actually
measures: `CLAUDE.md`, `plan.md`, subagents, custom commands, context management.

### Deploying on Render / Fly

Their free tiers sleep after inactivity and cold-start in ~50s. That happens live during a
10-minute demo. Vercel serverless has no sleep.

---

## 7. Build order

Deploy before features — the brief's tips table pairs "Deploy early" against "Waiting until the
end — deployment issues are real."

| Phase | Output | Done when |
|---|---|---|
| 0 | `CLAUDE.md`, `plan.md`, repo scaffold | Committed ✅ |
| 1 | Next.js skeleton live on Vercel | Public URL responds |
| 2 | Knowledge modules + unknowns registry + retriever | Grounding tests pass |
| 3 | `/api/chat`, system prompt, streaming | Six scenarios answer end to end |
| 4 | Intent classification + two escalation routes + lead capture | Both routes produce correct handoffs |
| 5 | Chat UI polish, error states | Provider failure shows a plain sentence |
| 6 | Full scenario pass, cost check, README | All tests green, spend recorded |

Cut from the bottom if time runs short. Phases 1–3 are the minimum bar the brief names:
"a functional chatbot that a prospective or existing Cadre AI client could plausibly use."

---

## 8. Verification

~15 test cases, written before the model is chosen so selection is a measurement:

- 6 scenario tests — on-topic answer, correct route where applicable
- 4 refusal tests — pricing, portal access, security specifics, the eight pillars. Each asserts
  no invented specifics **and** that a route is offered
- 3 classification tests — prospective, existing client, ambiguous
- 2 resilience tests — provider error, empty input

This is the "catching AI bugs" the 15% dimension names. It is also the only way to know whether
a cheaper model would have been sufficient.

---

## 9. Assumptions

Stated rather than blocking. Flag if any is wrong.

1. `OPENROUTER_API_KEY` is a placeholder until deploy. Nothing breaks until the first live call.
2. Knowledge is hand-curated from cadreai.com with source URLs, rather than scraped at build
   time. A scraper is a ~40 minute upgrade if the corpus is worth re-syncing.
3. The repo stays private and is shared with Cadre by invitation; only the deployed app is public.
4. Review date not yet fixed — submission targets one full business day ahead of it, per the brief.
