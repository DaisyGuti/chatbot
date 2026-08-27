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
 * Built per request rather than at module load so `next build` does not need the key, and so a key
 * rotated in the Vercel dashboard takes effect without a redeploy.
 */
export function chatModel(apiKey: string) {
  const openrouter = createOpenRouter({ apiKey });

  return openrouter(PRIMARY_MODEL, {
    // Ordered, and the order is the whole point: OpenRouter walks this list itself when the entry
    // ahead errors — rate limit, context-length rejection, moderation flag, provider outage —
    // inside one request/response, and prices the answer at whichever model served it. That is why
    // this repo has no retry loop and no health check, and why `CLAUDE.md`'s one-model-call-per-turn
    // rule still holds through a failover.
    models: [PRIMARY_MODEL, FALLBACK_MODEL],
  });
}
