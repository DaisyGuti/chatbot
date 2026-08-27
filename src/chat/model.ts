import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";

/**
 * The OpenRouter client — see `plan.md` §5. `server-only` because this file reads
 * `OPENROUTER_API_KEY`; importing it from a client component is a build error rather than a leaked
 * key at runtime.
 */

/** Refusal discipline is the binding constraint on the primary pick — `plan.md` §5. */
export const PRIMARY_MODEL = "anthropic/claude-sonnet-5";

/**
 * The availability peer, not the budget tier. It sits on a different provider than the primary, so
 * an Anthropic-side outage does not take out the fallback with it.
 */
export const FALLBACK_MODEL = "openai/gpt-5-mini";

/** Bounds the output cost of a single call — the second of `plan.md` §3's four guards. */
export const MAX_OUTPUT_TOKENS = 1024;

/**
 * `gpt-5-mini` writes its reasoning into the same text stream as its answer unless told not to.
 * Found live: asked about pricing, it spent the entire output budget narrating which module to
 * cite and never reached an answer — a real client would see that, not a refusal, if a Sonnet
 * outage ever failed over to it. `exclude: true` drops the trace from the response; low effort
 * keeps it from eating the budget it needs for the actual reply. Harmless on Sonnet, which doesn't
 * emit reasoning tokens on this path to begin with.
 */
const REASONING = { exclude: true, effort: "low" } as const;

/**
 * Built per request rather than at module load so `next build` does not need the key, and so a key
 * rotated in the Vercel dashboard takes effect without a redeploy.
 */
export function chatModel(apiKey: string) {
  // Unset in every real environment (local placeholder and Vercel both leave it out) — exists only
  // so `mock/openrouter-server.mjs` can stand in for OpenRouter during local UI testing without a
  // funded key. Setting it is a deliberate, manual opt-in; nothing in this codebase sets it itself.
  const baseURL = process.env.OPENROUTER_BASE_URL;
  const openrouter = createOpenRouter(baseURL ? { apiKey, baseURL } : { apiKey });

  // Unset in every real environment — exists only so `plan.md` §5's three-model comparison table
  // can be filled in by running the real route (real system prompt, real routing) against a single
  // named model instead of the primary+fallback pair, without a second call this codebase makes.
  const evalModel = process.env.EVAL_MODEL;
  if (evalModel) {
    return openrouter(evalModel, { models: [evalModel], reasoning: REASONING });
  }

  return openrouter(PRIMARY_MODEL, {
    // Ordered, and the order is the whole point: OpenRouter walks this list itself when the entry
    // ahead errors — rate limit, context-length rejection, moderation flag, provider outage —
    // inside one request/response, and prices the answer at whichever model served it. That is why
    // this repo has no retry loop and no health check, and why `CLAUDE.md`'s one-model-call-per-turn
    // rule still holds through a failover.
    models: [PRIMARY_MODEL, FALLBACK_MODEL],
    reasoning: REASONING,
  });
}
