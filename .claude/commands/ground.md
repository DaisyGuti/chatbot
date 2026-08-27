---
description: Add a knowledge module or a registered unknown for one topic — fetches the source, writes the typed entry, registers it, and writes its test.
argument-hint: <topic or cadreai.com URL>
---

Add grounded knowledge for the topic below, end to end. This is the repetitive three-step
operation in this repo; do all three or none. A module that is written but not registered is
invisible to retrieval and nothing catches it, and a module without a test is a fact with nothing
holding it in place.

<topic>
$ARGUMENTS
</topic>

Steps:

1. **Fetch the source.** Find the cadreai.com page that covers this topic and read it. Prefer
   `knowledge-source/<slug>.txt` if the crawl store already has it — that is the exact cleaned text
   modules are written from. If it doesn't, run `node scripts/crawl.mjs` for that URL so the store
   and `manifest.json` stay complete. If no published page states the fact, this is an unknown —
   go to step 2b.

2a. **Known** — write a `KnowledgeModule` in `src/knowledge/modules/`, matching the shape in
   `src/knowledge/types.ts`:

   - `source` — the exact URL you fetched.
   - `provenance` — `published` if the page states it outright, `derived` if you assembled it from
     several statements on that same page.
   - `sourceHash` — copy it from `knowledge-source/manifest.json` for that URL. Do not compute it
     yourself and do not leave it empty; the commit gate asserts every module carries one.
   - `topic` — if the `Topic` union lacks the value you need, extend it. (Curators running in
     parallel at Phase 2a report instead; `/ground` is serial, so it may edit the union directly.)

2b. **Unknown** — add an `UnknownFact` to `src/knowledge/unknowns.ts` with the question a user
   would actually ask, the reason it isn't knowable from published content, and a route of
   `strategist` or `support`. Confirm the fact is genuinely unpublished by fetching the page first;
   `plan.md` §1 has two topics that looked unpublished and were not.

3. **Register and test.** Add the module to `src/knowledge/modules/index.ts`, then add two cases,
   one per suite (`plan.md` §8):

   - **Deterministic**, in `src/knowledge/__tests__/` — the module resolves its `source`, carries a
     `sourceHash`, and reaches the assembled prompt; or the unknown carries a route. This runs in
     the commit gate.
   - **Live eval** — an on-topic assertion for a module, or a refusal-plus-route assertion for an
     unknown. This costs money and runs by hand.

Run `npm test` for the deterministic case and report the result. Say whether the eval case needs
running too, and leave that call to the author. Do not commit.

If the topic is ambiguous, or the page contradicts an existing module, stop and say so rather than
writing a hedged entry.
