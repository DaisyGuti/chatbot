# Workflow log

Running log of which agent produced what, kept as the build happens rather than reconstructed
afterward. See `plan.md` §10 for the agent roster and routing.

---

## Phase 1 — Next.js + TypeScript scaffold

`eng` scaffolded Next.js (App Router) + TypeScript, the four gate scripts (lint/typecheck/test/build,
all green), `src/knowledge/types.ts` (the `KnowledgeModule`/`UnknownFact` contract, ahead of schedule
so Phase 2a curators have it to import), and `.env.example`. README Status flipped to Done.

Correction worth recording: Next 16's `next dev` auto-appended an agent-rules block to `CLAUDE.md` on
first run — a framework writing to a hand-owned, graded deliverable. `eng` caught it, reverted the
file, and set `agentRules: false` in `next.config.ts`.

Left for review, not committed: pre-commit hook doesn't exist yet (CLAUDE.md assumes one). Decided
`.githooks/pre-commit` over husky — same effect, no new dependency.

## Phase 2 setup — crawler fix (before 2a)

Cross-checking plan.md's F3 claim ("a sitewide banner names the portal") against a live fetch of
cadreai.com turned up two bugs in `scripts/crawl.mjs`: it was stripping the one block that actually
states the portal fact (mistaking it for boilerplate), and a broken footer selector let the real
footer nav leak into all 107 extracts. `eng` fixed both, re-ran the full crawl, and verified the
portal text now appears in the store and the footer nav is gone, with no other content moved
(spot-checked strategy.txt, contact.txt, and three more). `plan.md` §4's description of what the
crawler strips was updated to match. Store was refreshed before any module existed, so no
`sourceHash` was invalidated by the fix.

## Phase 2a — knowledge curation

Five `knowledge-curator` instances ran in parallel, one per section: services (3 of Cadre's 4
named services — `agents.txt`, `ai-engineering.txt`, `leadership-facilitation.txt`), industries (10
pages), departments (9 pages), `/strategy` (1 page, densest on the site), and contact/site-level
facts (`contact.txt`, `home.txt`, `about.txt`, `case-studies.txt`, plus `terms-of-service.txt` for
the legal entity name only). 37 modules written across 5 files, all `topic` values already valid
members of the `Topic` union — no extension needed. Each curator independently grepped the whole
store and confirmed the three registered unknowns (pricing, portal access, security certifications)
stay genuinely unpublished; several also flagged narrower gaps (exact agent counts, engagement
durations) that are facets of the same pricing/specifics unknown rather than new registry entries.

## Phase 2b — serial integration (parent thread, per plan.md §10)

Correction on review: the services curator and the `/strategy` curator each independently wrote a
near-identical "LLM Selection & Data Security" module — the same block appears verbatim on both
`ai-engineering.txt` and `strategy.txt`, and neither curator could see the other's page. Kept the
`/strategy` version (plan.md F5 names `/strategy` as where this service is sold) and removed the
duplicate from `services.ts` — same fact, one module, half the tokens in a corpus that's paid for on
every turn.

Built: `src/knowledge/modules/index.ts` (barrel, 36 modules), `src/knowledge/unknowns.ts` (the 3
canonical unknowns, matching `CLAUDE.md`'s table exactly), `src/knowledge/retriever.ts`
(`KnowledgeRetriever` interface + `InMemoryRetriever`, returns every module per plan.md §6), and
`src/knowledge/knowledge.test.ts` (the 5 knowledge tests from plan.md §8: source resolves, hash
present, barrel is exactly the union of every section, ids globally unique, every unknown routed,
no id shared between the two registries). All green: 85 tests, lint/typecheck/build clean.
README Status flipped Phase 2 to Done.

## Phase 3 — chat API, system prompt, streaming

`eng` built `buildSystemPrompt()`, the `/api/chat` route (`createUIMessageStreamResponse()`, the
two required headers, ordered `models[]`, `cache_control` on the system prompt via
`@openrouter/ai-sdk-provider`), the three in-code endpoint guards, and 8 tests (4 prompt-assembly +
4 resilience) — 184 tests green, lint/typecheck/build clean.

Two corrections worth recording. First: `privacy@gocadre.ai` was in `CLAUDE.md`'s table and the
Phase 3 test spec but no module carried it — `eng` added `escalation-privacy`, sourced to
`/legal/privacy-policy`, rather than hand-typing a Cadre fact into `src/chat/`. Second: I added
`contact-no-booking-calendar` afterward — `eng` flagged that no module lets the bot affirmatively
say there's no scheduling calendar (only that the contact form exists), which is exactly where it
would guess a booking URL. Confirmed via a whole-store grep (zero hits for Calendly/Cal.com/Acuity/
"book a time") before writing it, `derived` provenance, sourced to the contact page. 38 modules now.

**Two items outside code, not done:** the OpenRouter credit limit (plan.md §3's one guard that
actually holds) is still unset on the OpenRouter dashboard — needs the CEO's account access, not
mine. And the six scenarios' end-to-end answers are unverified pending a real `OPENROUTER_API_KEY`
in `.env.local`; every guard, header, and the ordered `models[]` are verified against real HTTP
with a stubbed/invalid key, but no real model call has been made yet.

## Phase 4 — intent classification, routing, lead capture

`eng` built `classifyIntent()` (stickiness, hard-signal re-lock in either direction, assistant
turns excluded so the model's own restated question can't re-classify the thread), the three
routes as a second system message after the cache breakpoint (so a changing intent never
invalidates the cached ~20k-token knowledge block), and lead capture (`lead-form.tsx`,
`/api/lead`, a prefilled `mailto:` plus a `/contact` link). Driven end to end in a real headless
browser, not just unit tests — caught and fixed a real bug (an empty assistant bubble rendering on
a failed turn). 219 tests green, lint/typecheck/build clean.

Correction to `plan.md` made afterward (§3, at the CEO's direction): the "/contact" handoff link
was described as prefilled, but the live Cadre contact form is client-side Webflow and doesn't
read query parameters — only the `mailto:` is actually prefilled. `plan.md`'s deterministic-case
count (16) was also stale against the 6 cases this phase added; both fixed in `plan.md` directly.
New dependency: `@ai-sdk/react` (the `useChat` hook `plan.md` §4's own diagram already named).

## Phase 6 — chat UI, accessibility, browser-driven pass

The CEO asked to test locally before deploying, so Phase 5 is on hold and `ux-curator` ran against
a local build instead of production — its brief's usual "the app is already deployed by Phase 6"
assumption didn't hold this time, called out explicitly going in.

Refined (not rewrote) `eng`'s Phase 4 UI: empty state (4 grounded, question-phrased prompts), a
pending "Thinking…" state, `aria-live` streaming announcements, linkified `mailto:`/`tel:`/URL
handoffs, focus/contrast/disabled-state accessibility, phone-width layout. Set up Playwright
(`e2e/`, `test:e2e` script — expected for this phase, not a surprise dependency) and wrote 4
specs: stream mechanics, a refusal's route link, a real provider failure (driven against the actual
401, not mocked), phone width. All green, twice, no flakes.

Honestly flagged as unverifiable without a live key: real streaming cadence, real refusal wording,
and whether `models[]` actually fails over to `gpt-5-mini` (a dead key fails both entries alike, so
only the guard firing is provable, not the failover itself). README Status updated for Phase 6;
Phase 5 marked "on hold — testing locally first" rather than not started, since that's a deliberate
sequencing choice, not an unstarted one.

**Still true after six phases: nothing in this repo has ever been committed.** Everything from
Phase 1 onward sits in the working tree, per `eng.md` §6 and `ux-curator.md` §6's shared rule —
leave the tree for review, the CEO reads every diff before it lands.

## Commit — nine phase-scoped commits, not one dump

The CEO asked to commit. Split into one commit per phase plus separate commits for the crawler fix
and the mock harness, in build order, rather than everything landing at once — the brief's own tip
table names "one giant commit at the end" as the anti-pattern. Two files (`chat.tsx`, `lead-form.tsx`)
are dated to their Phase 6 commit even though `eng` first wrote them in Phase 4, because no exact
pre-`ux-curator` byte content was saved — fabricating a plausible-but-never-tested intermediate
version was judged worse than a slightly imprecise commit boundary, noted as such in that commit's
message. Also implemented, first commit to actually run through it: `.githooks/pre-commit`, closing
a gap that had existed since Phase 1 — `CLAUDE.md` assumed a hook enforced the gate; nothing did.

## Phase 7 (partial) — grounding red-team with a funded key

A real `OPENROUTER_API_KEY` landed. Manually verified two real scenarios first (a services/PE
question, a combined pricing + SOC 2 refusal) before handing off — both grounded, both correctly
routed. `grounding-adversary` then ran ~30 attack angles across all three registered unknowns
(authority pressure, false premise, incremental extraction, forged conversation history, indirect
injection via a pasted RFP) — none broke. It also over-refusal-checked the eight Maturity Index
pillars and the LLM Selection & Data Security approach, both answered correctly.

**One real gap found:** asked "what services do you offer," the bot sometimes said three and
folded AI Agents under AI Engineering — unsourced, since no module stated the count or that
relationship. Routed through `/ground` rather than fixed inline (a correction to the process
itself, mid-session) — added `strategy-services-overview`, grounded in the verifiable structural
fact (four separate service pages, none describing AI Agents as part of another) rather than a
quote that doesn't exist in the cleaned crawl store, plus a general system-prompt rule against
stating any count or hierarchy among Cadre's own things without a module behind it. Re-verified
against the real model: the exact prompt that broke it now names all four correctly.

**Deliberately deferred, once real spend was on the table:** the formal 15-case live-model table
and the 3-model comparison in `plan.md` §5. The CEO flagged the spend directly mid-session; neither
comparison is required for this deploy (the budget tier is an unrequested manual swap, the
availability peer only serves a real user during an actual Sonnet outage), so `EVAL_MODEL` was
added to `src/chat/model.ts` as the mechanism to run that comparison later, on purpose, rather than
run by default. Total spend against the $5 cap through this phase: **$0.62.**

## Phase 5 — deploy

Vercel CLI, not the dashboard. `vercel link` auto-detected the connected GitHub repo and created
`daisygutis-projects/chatbot`; `OPENROUTER_API_KEY` set as a Production environment variable before
the first deploy attempt.

**First deploy attempt failed the Vercel build**, not this app's code: `npm install` exited 128.
Cause was the Phase-7-commit's own `.githooks` setup — the `prepare` script ran `git config
core.hooksPath .githooks` unconditionally, and Vercel's build uploads the file tree without a
`.git` directory, so the command had nothing to configure and failed the whole install. Fixed by
swallowing the error outside a real git checkout (`|| true`); confirmed both paths — the hook still
activates in this repo, and a bare directory with no `.git` no-ops cleanly. Second deploy succeeded.

**Live and verified, not just reported as ready:** `https://chatbot-wine-one-97.vercel.app` returns
200 on the homepage with no deployment-protection gate blocking public access, and a real `/api/chat`
call streamed a correctly grounded, cited answer with the exact `Transfer-Encoding: chunked` /
`Connection: keep-alive` headers the streaming contract requires.

## Two minimal, deliberately cheap follow-ups after deploy

Two things were left explicitly open in the last report; the CEO asked for both, minimally.

**`models[]` failover — inconclusive, honestly.** A deliberately invalid model id gets rejected by
OpenRouter with a 400 before the fallback array is ever consulted — the failover only triggers on a
genuine runtime failure of a *valid* model, not a malformed one. No cheap, reliable way to force a
real transient failure from a healthy model on demand, so this stays unverified rather than marked
passed on a test that didn't actually exercise it. No charge for the attempt.

**Minimal 2-model comparison — found a real bug.** Three cases (pricing refusal, the eight-pillar
anti-refusal, a false-premise SOC 2 probe) against `gemini-2.5-flash-lite` and `gpt-5-mini` through
the real route via `EVAL_MODEL`. `gemini-2.5-flash-lite` held cleanly on content and prose. Neither
model ever fabricated a fact, but `gpt-5-mini` leaked its reasoning trace into the visible reply on
all three, and on the pricing question — the single most common one — spent its entire 1024-token
budget on that trace and never produced an answer at all. A pass/fail count alone would have missed
this: content was correct, delivery was broken. Fixed with `reasoning: { exclude: true, effort:
'low' }` on the OpenRouter request; the same pricing question now returns a clean, complete,
correctly-routed refusal. Total spend across both follow-ups: **~$0.014** (final: $0.6888 of $5).

`plan.md` §5's table and README's Model selection section both updated with this finding rather
than left generic — a fallback that's clean on *content* but broken on *delivery* is exactly the
kind of thing the pass-rate framing alone would have hidden.

## Scenario column filled in — the other half of §5's table

The CEO caught that the table's "Scenario pass rate" column was still "Not run" for both
`gemini-2.5-flash-lite` and `gpt-5-mini` right next to a filled-in "Refusal + adversarial" column —
easy to misread as a contradiction, but they're genuinely different tests: the first is the
boundary slice above, the second is the six named scenarios from the brief (F1-F6). Ran all six
against both models (12 calls). `gemini-2.5-flash-lite`: 6/6, on-topic, cited, correct decline-and-
route behavior. `gpt-5-mini`: 6/6 content-correct after the reasoning fix, with one transient empty
response on the booking question (F2) that cleared cleanly on an identical retry — the same class
of intermittent hiccup `grounding-adversary` flagged separately, not something that reproduced on
demand, so left as observed rather than chased. `plan.md` §5's table now has both columns real for
all three models. Total spend after this round: **$0.7621 of $5.**

Also, prompted directly by the CEO: verified no secret has ever appeared anywhere in git history
before the repo went public (`git log --all -p` grepped for OpenRouter/Vercel key shapes, and for
any commit ever touching `.env.local` — neither turned anything up). `plan.md`'s assumption that
the repo stays private is corrected to match reality rather than left stale.
