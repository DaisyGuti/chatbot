# CLAUDE.md — Cadre AI support chatbot

A customer-support chatbot for Cadre AI, an AI strategy consultancy. Built as a take-home
assessment. The full brief is `docs/requirements.md` — read it before changing scope.

## Commands

```bash
npm run dev          # local dev server, localhost:3000
npm test             # vitest, includes the grounding suite
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run build        # production build — run before every deploy
```

All four of `test`, `lint`, `typecheck`, `build` must pass before a commit. No exceptions.

## The rule that matters most

**The bot never states a fact about Cadre AI that isn't in a knowledge module.**

Cadre is a real company selling to private equity and financial services firms. A fabricated
price, security certification, or case-study number is a liability for them and an instant fail
for this assessment. Every claim traces to a module with a `source` URL.

Four things are deliberately **not** in the knowledge base, because Cadre has never published
them. When asked, route — never improvise:

| Unknown | Why | Route to |
|---|---|---|
| Pricing | Published nowhere on cadreai.com | Strategist call |
| Portal access steps | Portal exists; no login instructions public | Client support |
| Security certifications, data handling | No claims on their site at all | Strategist call |
| The eight Maturity Index pillars | Site says "eight-pillar" and never names them | Strategist call |

When you add a knowledge module, add its refusal test in the same commit.

## Architecture rules

- **Knowledge lives in `src/knowledge/modules/*.ts`**, typed against `KnowledgeModule`. Each
  carries `id`, `topic`, `content`, `source` (a real cadreai.com URL), and `confidence`.
- **Retrieval goes through the `KnowledgeRetriever` interface** in `src/knowledge/retriever.ts`.
  `InMemoryRetriever` is the only implementation. Do not add a vector database — the corpus is
  ~20k tokens against a 1M-token context window, so embeddings would add a wrong-chunk failure
  mode and buy nothing. `PgVectorRetriever` is the documented swap if the corpus ever grows past
  ~200k tokens.
- **One model call per turn.** No agent loop, no tool-calling chain. The bot retrieves, answers
  or routes, and stops.
- **Escalation is a first-class path, not a fallback.** `classifyIntent` decides prospective vs.
  existing client before generation; the two get different handoffs.

## Conventions that differ from defaults

- Server-only modules import `server-only`. The OpenRouter client is never imported into a
  client component.
- Every `src/knowledge/modules/*.ts` export is registered in `modules/index.ts`. An unregistered
  module is invisible to retrieval and the test suite will not catch it — check the barrel.
- Error responses to the user never surface a provider error string. Map to a plain sentence and
  log the original server-side.

## Secrets

`OPENROUTER_API_KEY` is the only secret. It lives in `.env.local` (gitignored) and in Vercel's
env store for production. `.env.example` ships with the key name and an empty value.

Never put an Anthropic API key in this repo. The app calls OpenRouter only. If you find yourself
reaching for `ANTHROPIC_API_KEY`, something has gone wrong — see the rejected-alternatives
section of `plan.md`.

## Testing

The grounding suite in `src/knowledge/__tests__/grounding.test.ts` is the point of the test
suite, not a formality. It asserts:

1. Each of the six brief scenarios gets an on-topic answer.
2. Each of the four unknowns produces a refusal plus a route, and no invented specifics.
3. Every knowledge module has a resolvable `source` URL.

A change that makes the bot answer an unknown is a regression even if every other test passes.

## Scope

In scope: the six scenarios in `docs/requirements.md`, lead capture, escalation routing.

Out of scope, deliberately: auth, real portal integration, calendar/CRM writes, cross-session
memory, case-study summarization (link out instead). Reasons are in `plan.md`. Do not quietly
add any of these — if one seems necessary, say so and update `plan.md` first.

## Never

- Never invent a Cadre fact to make an answer feel complete.
- Never commit with a failing test, lint error, or type error.
- Never `git push --force`, never `--no-verify`.
- Never add a dependency without a one-sentence justification in the commit message.
