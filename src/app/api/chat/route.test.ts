import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/chat/route";
import {
  FALLBACK_MODEL,
  MAX_OUTPUT_TOKENS,
  PRIMARY_MODEL,
} from "@/chat/model";

// The 4 resilience tests plan.md §8 gates the commit on. They drive the real route handler and
// stub `fetch`, so "no model call was made" is observed rather than assumed, and the OpenRouter
// request body is the actual bytes the provider would have sent.

/** The provider error string that must never reach a user. */
const PROVIDER_ERROR = "OpenRouter 502: upstream anthropic/claude-sonnet-5 is unavailable";

let calls: Array<{ url: string; body: unknown }>;

function stubFetchThatFails() {
  const fetchStub = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({
      url: String(input),
      body: typeof init?.body === "string" ? JSON.parse(init.body) : init?.body,
    });
    throw new Error(PROVIDER_ERROR);
  });
  vi.stubGlobal("fetch", fetchStub);
  return fetchStub;
}

function chatRequest(body: unknown, ip: string): Request {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function userMessage(text: string, id = "m1") {
  return {
    id,
    role: "user" as const,
    parts: [{ type: "text" as const, text }],
  };
}

/** The two system blocks the provider actually receives, in order. */
type SentSystemBlock = {
  role: string;
  content: Array<{ type: string; text: string; cache_control?: unknown }>;
};

async function systemBlocksFor(
  messages: unknown[],
  ip: string,
): Promise<SentSystemBlock[]> {
  stubFetchThatFails();
  const response = await POST(chatRequest({ messages }, ip));
  await response.text();

  const body = calls[0]?.body as { messages: SentSystemBlock[] };
  return body.messages.filter((message) => message.role === "system");
}

beforeEach(() => {
  calls = [];
  vi.stubEnv("OPENROUTER_API_KEY", "test-key");
  // The route logs the original error server-side on purpose; keep the suite output readable.
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("a provider error maps to a plain sentence", () => {
  it("streams a plain sentence and never the provider's own string", async () => {
    stubFetchThatFails();

    const response = await POST(
      chatRequest({ messages: [userMessage("What does Cadre AI do?")] }, "1.1.1.1"),
    );
    const streamed = await response.text();

    expect(response.status).toBe(200);
    expect(streamed).toContain(
      "Something went wrong on our side and I couldn't finish that answer.",
    );
    expect(streamed).not.toContain(PROVIDER_ERROR);
    expect(streamed).not.toContain("OpenRouter");
    expect(streamed).not.toContain("anthropic");
  });

  it("still holds the streaming contract, so the failure renders as it arrives", async () => {
    stubFetchThatFails();

    const response = await POST(
      chatRequest({ messages: [userMessage("What does Cadre AI do?")] }, "1.1.1.2"),
    );

    expect(response.headers.get("Transfer-Encoding")).toBe("chunked");
    expect(response.headers.get("Connection")).toBe("keep-alive");
  });
});

describe("empty input is rejected before the model call", () => {
  it.each([
    ["no messages at all", { messages: [] }],
    ["a message with only whitespace", { messages: [userMessage("   \n  ")] }],
    [
      "a thread that does not end in a user turn",
      {
        messages: [
          userMessage("What does Cadre AI do?"),
          {
            id: "m2",
            role: "assistant" as const,
            parts: [{ type: "text" as const, text: "An AI consultancy." }],
          },
        ],
      },
    ],
  ])("%s", async (_label, body) => {
    stubFetchThatFails();

    const response = await POST(chatRequest(body, "2.2.2.2"));

    expect(response.status).toBe(400);
    expect(calls).toHaveLength(0);
  });
});

describe("oversized input is rejected before the model call", () => {
  it("refuses a body past the cap without spending a token", async () => {
    stubFetchThatFails();

    const response = await POST(
      chatRequest({ messages: [userMessage("a".repeat(20_000))] }, "3.3.3.3"),
    );

    expect(response.status).toBe(413);
    expect(calls).toHaveLength(0);
  });

  it("lets an ordinary question through, so the cap isn't just rejecting everything", async () => {
    stubFetchThatFails();

    const response = await POST(
      chatRequest(
        { messages: [userMessage("Do you work with private equity firms?")] },
        "3.3.3.4",
      ),
    );
    // The stream is lazy — reading it is what runs the model call.
    await response.text();

    expect(calls).toHaveLength(1);
  });
});

describe("the OpenRouter request carries the ordered models array", () => {
  it("sends Sonnet first and the availability peer second, in one call", async () => {
    stubFetchThatFails();

    const response = await POST(
      chatRequest({ messages: [userMessage("What is the AI Maturity Index?")] }, "4.4.4.4"),
    );
    await response.text();

    // One call: the failover is OpenRouter's, inside this request — not a retry from here.
    expect(calls).toHaveLength(1);
    const [call] = calls;
    expect(call.url).toContain("openrouter.ai");

    const body = call.body as {
      model: string;
      models: string[];
      max_tokens: number;
      messages: Array<{ role: string; content: unknown }>;
    };
    expect(body.models).toEqual([PRIMARY_MODEL, FALLBACK_MODEL]);
    expect(body.models[0]).toBe("anthropic/claude-sonnet-5");
    expect(body.models[1]).toBe("openai/gpt-5-mini");
    expect(body.model).toBe(PRIMARY_MODEL);

    // The other two in-code guards ride on the same body: the output cap, and a cache breakpoint
    // on the system block so a warm turn costs an eighth of a cold one (plan.md §5).
    expect(body.max_tokens).toBe(MAX_OUTPUT_TOKENS);
    expect(body.messages[0]).toMatchObject({
      role: "system",
      content: [{ type: "text", cache_control: { type: "ephemeral" } }],
    });
  });
});

describe("the classified route reaches the model", () => {
  it("sends the knowledge block cached, and the route block after the breakpoint", async () => {
    const system = await systemBlocksFor(
      [userMessage("Do you work with private equity firms?")],
      "5.5.5.1",
    );

    // Two blocks, in this order: the ~20k-token corpus that is byte-identical every turn carries
    // the cache breakpoint, and the few hundred tokens that change with the thread sit after it.
    // One block would re-write the cache every time the intent moved (plan.md §5).
    expect(system).toHaveLength(2);
    expect(system[0].content[0].cache_control).toEqual({ type: "ephemeral" });
    expect(system[0].content[0].text).toContain("## Knowledge modules");
    expect(system[1].content[0].cache_control).toBeUndefined();
    expect(system[1].content[0].text).toContain("## Who you are talking to");
  });

  it.each([
    [
      "prospective",
      [userMessage("Do you work with private equity firms?")],
      "The thread reads as a prospective client",
      "5.5.5.2",
    ],
    [
      "existing",
      [
        userMessage("We're already working with you.", "m1"),
        userMessage("How do I get into our portal?", "m2"),
      ],
      "The thread reads as an existing Cadre client",
      "5.5.5.3",
    ],
    [
      "unknown",
      [userMessage("What is the AI Maturity Index?")],
      "Nothing in the thread says whether this person is an existing Cadre client",
      "5.5.5.4",
    ],
  ])("a %s thread carries its own route block", async (_intent, messages, marker, ip) => {
    const system = await systemBlocksFor(messages, ip);
    expect(system[1].content[0].text).toContain(marker);
  });
});
