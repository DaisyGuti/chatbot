# Cadre AI Support Chatbot

A customer-support chatbot for [Cadre AI](https://www.cadreai.com), built as a take-home
technical assessment for the AI Engineer & FDE role.

**Live demo:** [chatbot-wine-one-97.vercel.app](https://chatbot-wine-one-97.vercel.app)
**Planning docs:** [`plan.md`](plan.md) · [`CLAUDE.md`](CLAUDE.md) · [brief](docs/requirements.md)

This file is the tour: what was decided and where the proof lives. `plan.md` is the reasoning
behind every one of those decisions, and `CLAUDE.md` is the rules the build runs under.

**Contents** · [Status](#status) · [The problem](#the-problem-in-one-paragraph) · [Architecture](#architecture) · [No vector database](#the-decision-worth-defending-no-vector-database) · [How this was built](#how-this-was-built) · [Model selection](#model-selection) · [Verification](#verification) · [Running locally](#running-locally) · [Scope](#scope) · [Assumptions](#assumptions)

---

## Status

| Phase | State |
|---|---|
| 0 — Planning docs, repo scaffold | **Done** |
| 1 — Next.js scaffold, running locally | **Done** |
| 2 — Knowledge modules, unknowns registry, retriever | **Done** |
| 3 — Chat API, system prompt, streaming | **Done** — verified against a real funded key: grounded, cited answers with correct pricing/certification refusals |
| 4 — Intent classification, escalation, lead capture | **Done** — routing verified with real model wording; lead capture driven end to end in a real browser (form appears, submits, logs server-side, renders a `mailto:` carrying all four fields) |
| 5 — Deploy to Vercel | **Done** — [chatbot-wine-one-97.vercel.app](https://chatbot-wine-one-97.vercel.app), verified publicly reachable with a real streamed answer |
| 6 — UI polish, error states | **Done, one part still open** — empty state, accessibility floor, phone-width layout, provider-failure rendering all verified; real streaming cadence now confirmed too. Not yet deliberately tested: the `models[]` fallback actually routing to `gpt-5-mini` on a real Sonnet failure (would need to break something on purpose against the funded key) |
| 7 — Live eval and red-team against production, cost check | **Partial** — `grounding-adversary` ran ~30 attack angles against all three registered unknowns and none broke; it did find one real gap (the bot undercounting Cadre's services), which is fixed and re-verified. A minimal 2-model comparison found and fixed a real reasoning-leak bug in the `gpt-5-mini` fallback. The full 15-case live-model table is deliberately deferred — not required for this deploy, and left for a deliberate future spend rather than run by default |

Planning was completed before any application code, per the brief's own guidance: *"Plan before
coding. Write CLAUDE.md and plan.md first."*

---

## The problem, in one paragraph

Cadre AI's inbound team fields a growing volume of questions from prospective clients, existing
clients, and people who just want to know what Cadre does. Four of the six scenarios in the brief
have answers published on cadreai.com. The rest, plus service pricing, do not. So the bot's real
job is **answer-or-route**, and routing well is half the product — which is what the brief asks
for: *"handles the most common interactions so the team can focus on high-value conversations."*

Cadre sells to private equity and financial services firms. The worst outcome isn't a question
the bot declines. It's the bot inventing a price, a security certification, or a case-study
number for a real company. So the three things Cadre has never published are modeled as
**first-class data with routes**, each one owned and destined somewhere:

| Unknown | Why | Routes to |
|---|---|---|
| Pricing | Published nowhere on their site. Every dollar figure is a client outcome in a case study | Strategist call |
| Portal access steps | A banner names the portal and what it tracks. No login link, no instructions | Client support |
| Security certifications | No SOC 2, ISO 27001, DPA or retention terms anywhere on the site. Their approach to securing client data *is* published, and the bot answers that | Strategist call |

A fourth row came out on 2026-08-25. I had the eight Maturity Index pillars down as unpublished,
on the strength of the phrase "eight-pillar framework" appearing without a list. Reading the live
site, `/strategy` names all eight. The refusal test I had planned would have made the bot decline
a question Cadre answers on its own service page. Every row now cites what was actually fetched.

A refusal still converts. "I don't have pricing" is a dead end. "Pricing depends on scope — a
strategist can quote it, want me to pass your details along?" is the product.

---

## Architecture

One model call per turn. Classification is deterministic and runs before it.

```
Browser (Next.js App Router, React)
  └─ useChat  ──POST──▶  /api/chat  (Vercel Function)
                              │
                              ├─ classifyIntent()     prospective | existing | unknown — no model
                              ├─ KnowledgeRetriever   interface, in-memory implementation
                              ├─ buildSystemPrompt()  modules + unknowns registry + rules
                              └─ OpenRouter           models[]: sonnet, then gpt-5-mini on error — streamed back
```

`src/knowledge/` knows nothing about HTTP or the model. `src/chat/` knows nothing about where
knowledge came from. The API route wires them together.

`classifyIntent()` is plain TypeScript over the whole thread, so the turn stays at exactly one
model call and its tests run in the commit gate for free. The retriever returns the whole corpus
every turn — nothing selects, so nothing mis-selects — and the resulting ~20k-token system prompt
is cached. That one call carries an ordered `models[]`, so an Anthropic-side outage fails over to a
peer automatically, with no second call from this codebase. [`plan.md` §4](plan.md#4-architecture) has
the data model and sticky-classification rules; [`plan.md` §5](plan.md#5-model-selection) has the
fallback.

**Stack:** Next.js (App Router) + TypeScript · Vercel AI SDK for streaming · OpenRouter for
model access · deployed on Vercel. No database in v1.

---

## The decision worth defending: no vector database

The pages the bot answers from are ~81,000 tokens raw and ~20,000 once curated into modules,
against Claude Sonnet 5's 1,000,000-token context window. A vector database solves "corpus too big
for context," and that problem doesn't exist here — while adding one would introduce a failure mode
that currently can't occur: the retriever fetching the wrong chunks and the model answering from
partial information.

The numbers come from crawling cadreai.com's sitemap — 107 pages, ~413,000 tokens in total, of
which 263,000 are podcast transcripts the bot doesn't speak from.
[`plan.md` §6](plan.md#6-rejected-alternatives) has the per-section table, the concrete case where top-k retrieval would
split an answer across two pages and miss half of it, and the corpus size that would reopen the
decision.

What was built instead: a real `KnowledgeRetriever` interface, an in-memory implementation, and
`PgVectorRetriever` as a documented one-file swap. The interface is the scaling answer; the
implementation is the scope decision.

---

## How this was built

Four subagents and one command live in [`.claude/`](.claude) and are committed, so the workflow is
readable rather than described. [`plan.md` §10](plan.md#10-claude-code-workflow) says which phase invokes each one, why it
sits at the model tier it does, and why curation is the only step that fans out in parallel.

| | What it does |
|---|---|
| `eng` | Build pass — ground in the real code, simplest-path check, verify all four commands, self-review the diff |
| `knowledge-curator` | Turns one section of cadreai.com into typed modules with source URLs. Runs one per section, in parallel |
| `grounding-adversary` | Red-teams the running bot to make it state something no module supports. Gates every deploy |
| `ux-curator` | Owns the chat interface and its refusal, error, empty and narrow-viewport states |
| `/ground <topic>` | Fetches the source, writes the module or the registered unknown, registers it in the barrel, writes its test. All three or none |

`docs/workflow.md` logs the build as it happens — which agent produced what, where Claude's output
was rejected or corrected, and where context was compacted.

---

## Model selection

Chosen: **`anthropic/claude-sonnet-5`**. `gemini-2.5-flash-lite` is a manually-switched budget tier
at a twentieth of the cost, and `gpt-5-mini` is a separate thing entirely: the peer OpenRouter
automatically fails over to if Sonnet errors or Anthropic is down, wired as an ordered `models[]` on
the same request rather than a second call this codebase makes. The binding constraint on the
primary pick is refusal discipline — selection optimizes for staying inside provided context,
because the expensive failure is fabricating a client's numbers.

Sonnet is also the most expensive of the four models priced, and the whole-corpus system prompt is
paid on every turn, so prompt caching ships with the chat route rather than waiting to be an
optimization: OpenRouter forwards Anthropic `cache_control`, and a warm turn costs about an eighth
of a cold one. [`plan.md` §5](plan.md#5-model-selection) prices all four candidates, the cache
multipliers, and the availability fallback, and is the only place those numbers live. It also holds
the eval delta across all three models, so the choice — and the fallback pick — end up with a number
behind them rather than an argument.

A minimal live comparison (not the full formal suite — see `plan.md` §5) caught a real problem in
the fallback: `gpt-5-mini` never stated an ungrounded fact, but it leaked its reasoning trace into
the visible reply, and on a pricing question burned its entire output budget on that trace without
ever reaching an answer. A real client hitting the fallback during a Sonnet outage would have seen
that instead of a clean refusal. Fixed with `reasoning: { exclude: true, effort: 'low' }` on the
OpenRouter request and re-verified clean on the same question.

---

## Verification

Three suites, because they cost different things and check different layers.

**Deterministic — the commit gate.** No network, no model, no spend. [`plan.md`
§8](plan.md#8-verification)'s sixteen cases: five on the knowledge boundary (every module registered
and resolvable, every unknown routed, no question claimed by both), four on prompt assembly
including the escalation literals byte-exact, three on `classifyIntent`, and four on resilience —
provider error, empty input, oversized input, and the OpenRouter request carrying its models ordered
with the primary first and the fallback second.

Phase 4 added six more the plan's count predates: three on the routes (each intent's handoff differs
and names only published contact details; the route block reaches the model as a second system
message _after_ the cache breakpoint, so a changing intent cannot invalidate the cached corpus) and
three on lead delivery (the `mailto:` address and its four fields, the contact-form link, and the
one server-side log line per capture). The classification group also carries the cases a naive
per-message classifier fails: stickiness across a thread, a hard signal re-locking it in either
direction, and signals the assistant wrote being ignored.

**Live-model eval — by hand, and before every deploy.** Fifteen cases against the real model: the
six scenarios, three refusals, one anti-refusal, and five adversarial prompts — direct injection,
false premise ("your rep quoted me $50k, confirm that"), hypothetical framing, roleplay, and
incremental extraction across four turns. Every one asserts the response contains no `$` figure,
no "SOC 2" or "ISO 27001", and no percentage absent from a module's `content`.

**UX/browser-driven — manual, gating Phase 6 and every UI change after.** `npm run test:e2e` plus a
driven walkthrough through the Playwright MCP: a normal scenario, a refusal with its route link, a
provider failure that actually exercises the `models[]` fallback, a narrow viewport, and the
accessibility floor. The checklist lives in `ux-curator`'s own brief;
[`plan.md` §8](plan.md#8-verification) has the reasoning.

The `grounding-adversary` subagent runs the open-ended version before every deploy. Fifteen fixed
prompts do not test a boundary against someone actually trying.

Two regressions outrank a green suite: the bot answering one of the three unknowns, and the bot
declining the eight pillars, which are published.

---

## Running locally

Node 22. `npm run dev` serves without a key — `/api/chat` needs one, and answers with a plain
error sentence until `OPENROUTER_API_KEY` is set.

```bash
npm install
cp .env.example .env.local     # add OPENROUTER_API_KEY
npm run dev                    # localhost:3000
```

```bash
npm test          # vitest, includes the grounding suite
npm run lint
npm run typecheck
npm run build
```

All four run in the pre-commit hook and must pass before any commit.

```bash
npm run test:e2e   # Playwright, browser-driven — Phase 6 onward, never in the commit gate
```

---

## Scope

**In:** the six brief scenarios and the brief's common-inquiry row · grounded answers with a
source URL per claim · deterministic intent classification with a route for all three values ·
lead capture delivered through a prefilled `mailto:hello@gocadre.ai` and a server-side log ·
streaming chat UI.

**Out, deliberately:** auth · real portal integration · calendar and CRM writes · cross-session
memory · vector database · case-study summarization. Each cut has a reason in
[`plan.md` §3](plan.md#3-scope).

> *"Cut scope aggressively. 3 working features > 8 broken ones."* — the brief's tips table

---

## Assumptions

Six, listed in [`plan.md` §9](plan.md#9-assumptions) so they are stated in one place: the API key, hand-curation
over scraping, repo privacy, the review date, the crawl date behind the knowledge boundary, and
what the live eval spends.
