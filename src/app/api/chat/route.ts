import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  safeValidateUIMessages,
  streamText,
  toUIMessageStream,
  type SystemModelMessage,
  type UIMessage,
} from "ai";

import { buildIntentInstruction, buildSystemPrompt } from "@/chat/prompt";
import { chatModel, MAX_OUTPUT_TOKENS } from "@/chat/model";
import { classifyIntent } from "@/chat/intent";
import { InMemoryRetriever } from "@/knowledge/retriever";

/**
 * The chat endpoint — `plan.md` §3 for the guards, §4 for the shape of a turn. One model call, one
 * streamed response, and three of §3's four guards in front of it. The fourth, the hard credit
 * limit on the OpenRouter key, is a provider-dashboard setting and deliberately has no code here:
 * it is the only ceiling a caller cannot route around, so it must not depend on this file.
 */

const retriever = new InMemoryRetriever();

/**
 * Bounds the whole request body rather than the latest message, which is the one check that also
 * bounds thread length and message count — the client posts the full thread every turn. ~16k
 * characters is roughly 4k tokens of conversation: past the handful of turns the six scenarios
 * take, far short of a pasted book.
 */
const MAX_REQUEST_CHARS = 16_000;

/** Fixed window, module scope. Per-instance, resets on a cold start — `plan.md` §3 says so. */
const RATE_LIMIT_REQUESTS = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;
/**
 * A ceiling on the counter itself, so a spread-out crawl can't grow this map without bound. Past
 * it everyone gets a fresh allowance, which is the same thing a cold start already does.
 */
const RATE_LIMIT_MAX_TRACKED_IPS = 10_000;
const rateLimitWindows = new Map<
  string,
  { windowStartedAt: number; count: number }
>();

/**
 * The one sentence a user ever sees for a failure on our side. Provider errors name models,
 * providers and sometimes request internals, so the original is logged and never forwarded.
 */
const USER_FACING_ERROR =
  "Something went wrong on our side and I couldn't finish that answer. Please try sending it again.";

function toUserFacingError(error: unknown): string {
  console.error("[chat] turn failed:", error);
  return USER_FACING_ERROR;
}

function clientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const first = forwardedFor?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string, now: number): boolean {
  const window = rateLimitWindows.get(ip);
  if (
    window === undefined ||
    now - window.windowStartedAt >= RATE_LIMIT_WINDOW_MS
  ) {
    if (rateLimitWindows.size >= RATE_LIMIT_MAX_TRACKED_IPS) {
      rateLimitWindows.clear();
    }
    rateLimitWindows.set(ip, { windowStartedAt: now, count: 1 });
    return false;
  }
  window.count += 1;
  return window.count > RATE_LIMIT_REQUESTS;
}

/**
 * There is a question to answer only if the thread ends in a user message with real text. That one
 * rule covers an empty array, a whitespace-only submit, and a hand-made body whose last message is
 * an assistant turn — all of which would otherwise buy a model call for nothing.
 */
function hasNoQuestion(messages: UIMessage[]): boolean {
  const last = messages.at(-1);
  return (
    last === undefined ||
    last.role !== "user" ||
    !last.parts.some(
      (part) => part.type === "text" && part.text.trim().length > 0,
    )
  );
}

export async function POST(request: Request): Promise<Response> {
  if (isRateLimited(clientIp(request), Date.now())) {
    return Response.json(
      { error: "Too many messages. Give it a minute and try again." },
      { status: 429 },
    );
  }

  // Read the body as text first: the size guard has to run before anything parses or spends a
  // token, so an oversized body costs one string comparison and no model call.
  const body = await request.text();
  if (body.length > MAX_REQUEST_CHARS) {
    return Response.json(
      { error: "That's too long for me to read. Try a shorter message." },
      { status: 413 },
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  // Narrowed rather than cast: the body is whatever a public endpoint was handed, and
  // `safeValidateUIMessages` is the thing that decides whether it is a message array.
  const validation = await safeValidateUIMessages({
    messages:
      typeof parsed === "object" && parsed !== null && "messages" in parsed
        ? parsed.messages
        : undefined,
  });
  if (!validation.success) {
    console.error("[chat] rejected message array:", validation.error);
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const messages = validation.data;
  if (hasNoQuestion(messages)) {
    return Response.json(
      { error: "Send me a question and I'll answer it." },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("[chat] OPENROUTER_API_KEY is not set");
    return Response.json({ error: USER_FACING_ERROR }, { status: 500 });
  }

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const knowledgeInstruction: SystemModelMessage = {
        role: "system",
        content: buildSystemPrompt(retriever),
        // The cache breakpoint. The system prompt is the same ~20k tokens of rules and knowledge
        // every turn, and a warm turn costs about an eighth of a cold one — `plan.md` §5. The
        // provider turns this into `cache_control: { type: 'ephemeral' }` on the system block.
        providerOptions: {
          openrouter: { cacheControl: { type: "ephemeral" } },
        },
      };

      // Deterministic, over the whole thread, before generation — `plan.md` §4. Every value has a
      // route, including `unknown`, so no turn falls through to whatever the model felt like doing.
      const routeInstruction: SystemModelMessage = {
        role: "system",
        content: buildIntentInstruction(classifyIntent(messages)),
      };

      const result = streamText({
        model: chatModel(apiKey),
        // Two system messages, in this order, and the order is the cache: the knowledge block is
        // byte-identical every turn and carries the breakpoint, the route block changes with the
        // thread and sits after it. Folding them into one would re-write the cache whenever the
        // intent moved. `classifyIntent` runs before this and costs no model call, so the turn is
        // still exactly one — CLAUDE.md's rule holds.
        instructions: [knowledgeInstruction, routeInstruction],
        messages: await convertToModelMessages(messages),
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        // OpenRouter's ordered `models` walks to the peer itself when the primary errors, inside
        // this one request. A retry here would be a second call for a failover that has already
        // happened — see `plan.md` §5 and CLAUDE.md's one-model-call-per-turn rule.
        maxRetries: 0,
      });

      writer.merge(
        toUIMessageStream({
          stream: result.fullStream,
          onError: toUserFacingError,
        }),
      );
    },
    onError: toUserFacingError,
  });

  return createUIMessageStreamResponse({
    stream,
    // Without these the stream buffers behind the production proxy — empty box, then the whole
    // answer at once — while working fine locally. See CLAUDE.md § Streaming contract.
    headers: {
      "Transfer-Encoding": "chunked",
      Connection: "keep-alive",
    },
  });
}
