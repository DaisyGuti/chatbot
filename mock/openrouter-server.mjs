// A local stand-in for OpenRouter's streaming chat-completions endpoint — dev-only, never used in
// production. It exists so `/api/chat` can be exercised for real in a browser (real streaming,
// real UI states) without a funded OpenRouter key. Point the app at it with:
//
//   OPENROUTER_BASE_URL=http://localhost:8787/api/v1
//   OPENROUTER_API_KEY=mock
//
// It speaks just enough of OpenAI/OpenRouter's SSE chat-completion format for the AI SDK's
// provider to parse it — no auth check, no real model, no network call out. Picks one of a few
// canned replies by keyword so you can see both a normal answer and a refusal-with-route render.

import { createServer } from "node:http";

const PORT = process.env.MOCK_PORT ?? 8787;

const REPLIES = [
  {
    match: /price|cost|pricing/i,
    text: "Cadre AI doesn't publish pricing — it depends on scope. A strategist can put a number to it once they know a bit about your business. Want me to pass your details along? You can also reach the team directly at hello@gocadre.ai or (619) 324-3223.",
  },
  {
    match: /soc\s*2|iso\s*27001|certif|dpa|compliance/i,
    text: "Cadre AI publishes its approach to LLM selection and data security — selecting the right model per use case, keeping client data black-boxed, and moving teams onto secure, compliant tools — but doesn't publish specific certifications like SOC 2 or ISO 27001 on its site. A strategist can walk through your compliance requirements directly: hello@gocadre.ai or (619) 324-3223.",
  },
  {
    match: /portal/i,
    text: "Cadre gives clients a centralized portal to track tools, agents, training, and results. The site doesn't publish login steps or a portal URL, though — for account access, reach out to hello@gocadre.ai or (619) 324-3223 and the team can get you set up.",
  },
  {
    text: "Cadre AI is an AI strategy and implementation firm working across four services — AI Strategy, AI Leadership & Facilitation, AI Engineering, and AI Agents — for industries including private equity, financial services, real estate, and more. Want to know more about a specific service or industry, or talk to a strategist about your business?",
  },
];

function pickReply(userText) {
  return (
    REPLIES.find((r) => r.match?.test(userText ?? ""))?.text ?? REPLIES.at(-1).text
  );
}

function lastUserMessageText(body) {
  const messages = body?.messages ?? [];
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return "";
  if (typeof lastUser.content === "string") return lastUser.content;
  return (lastUser.content ?? [])
    .map((part) => (typeof part === "string" ? part : (part.text ?? "")))
    .join(" ");
}

// Splits into small word-groups so the client sees the reply build up over several chunks,
// like a real streamed completion, instead of arriving as one paste.
function chunkWords(text, wordsPerChunk = 3) {
  const words = text.split(" ");
  const chunks = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(" ") + (i + wordsPerChunk < words.length ? " " : ""));
  }
  return chunks;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const server = createServer(async (req, res) => {
  if (req.method !== "POST" || !req.url?.includes("/chat/completions")) {
    res.writeHead(404).end();
    return;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  let body = {};
  try {
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    // Malformed body — fall through with an empty one, mock doesn't need to validate input.
  }

  const replyText = pickReply(lastUserMessageText(body));
  const id = `mock-${Date.now()}`;
  const model = body?.model ?? "anthropic/claude-sonnet-5";

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const send = (delta, finishReason = null) => {
    const payload = {
      id,
      object: "chat.completion.chunk",
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [{ index: 0, delta, finish_reason: finishReason }],
    };
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  send({ role: "assistant", content: "" });
  await sleep(300); // a visible pending beat before the first token, like a real cold call

  for (const piece of chunkWords(replyText)) {
    send({ content: piece });
    await sleep(35);
  }

  send({}, "stop");
  res.write("data: [DONE]\n\n");
  res.end();
});

server.listen(PORT, () => {
  console.log(`[mock-openrouter] listening on http://localhost:${PORT}/api/v1`);
  console.log(
    `[mock-openrouter] point the app at it: OPENROUTER_BASE_URL=http://localhost:${PORT}/api/v1 and OPENROUTER_API_KEY=mock`,
  );
});
