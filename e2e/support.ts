import type { Page } from "@playwright/test";

/**
 * Shared plumbing for the mocked specs. `plan.md` §7's Done-when needs the `models[]` fallback
 * exercised, not just declared — but without a funded `OPENROUTER_API_KEY` (see the CEO's Phase 6
 * note), the real endpoint always fails identically, so it cannot prove a failover actually
 * happened, only that the guard fires. These two specs mock the transport instead, at the exact
 * wire format `createUIMessageStreamResponse` produces, to test *this repo's own rendering code*
 * deterministically: does a streamed reply render progressively, and does a refusal's contact
 * details become real links. Whether the model actually produces a correct refusal is a live-model
 * question — `plan.md` §8's separate, money-spending eval — not this smoke suite's job.
 */

type UIMessageChunk = Record<string, unknown>;

function chunkToSseEvent(chunk: UIMessageChunk): string {
  return `data: ${JSON.stringify(chunk)}\n\n`;
}

/** One assistant turn, delivered as the same chunk sequence `toUIMessageStream` emits. */
export function assistantTurnBody(deltas: string[]): string {
  const chunks: UIMessageChunk[] = [
    { type: "start", messageId: "mocked-assistant-1" },
    { type: "start-step" },
    { type: "text-start", id: "0" },
    ...deltas.map((delta) => ({ type: "text-delta", id: "0", delta })),
    { type: "text-end", id: "0" },
    { type: "finish-step" },
    { type: "finish" },
  ];
  return chunks.map(chunkToSseEvent).join("") + "data: [DONE]\n\n";
}

const SSE_HEADERS = {
  "content-type": "text/event-stream",
  "cache-control": "no-cache",
  "x-vercel-ai-ui-message-stream": "v1",
};

/**
 * Routes `/api/chat` to a scripted reply. `delayMs` holds the response back before fulfilling it,
 * which is what makes the pending state observable in a test — real network latency would do the
 * same thing, this just makes it deterministic.
 */
export async function mockChatReply(
  page: Page,
  deltas: string[],
  delayMs = 0,
): Promise<void> {
  await page.route("**/api/chat", async (route) => {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    await route.fulfill({
      status: 200,
      headers: SSE_HEADERS,
      body: assistantTurnBody(deltas),
    });
  });
}
