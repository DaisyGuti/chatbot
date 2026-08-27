"use client";

import { useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";

import { classifyIntent } from "@/chat/intent";
import { EmptyState } from "./empty-state";
import { LeadForm } from "./lead-form";
import { linkifyText } from "./linkify";

/**
 * The chat surface. Deliberately plain — `plan.md` §7 gives the interface to Phase 6, and this is
 * the minimum that makes Phase 4 real: a thread, a composer, and the lead form appearing on the
 * route that calls for it.
 *
 * `classifyIntent` runs here as well as in the route, on the same thread and with the same result,
 * because it is pure and deterministic. That is what lets the form know when to appear without a
 * second endpoint, a piece of server state, or anything crossing the wire to say so.
 */

const GENERIC_ERROR =
  "Something went wrong on our side. Please try sending that again.";

/**
 * `/api/chat`'s guards answer with a JSON body of our own writing — a 429, a 413, a 400. The SDK
 * hands that body over as the error message, so read our sentence back out of it and fall back to a
 * fixed one otherwise. Nothing a provider wrote is ever rendered: that is the point of the fallback.
 */
function userFacingError(error: Error): string {
  try {
    const parsed: unknown = JSON.parse(error.message);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "error" in parsed &&
      typeof parsed.error === "string"
    ) {
      return parsed.error;
    }
  } catch {
    // Not our JSON — the fixed sentence below is the safe answer.
  }
  return GENERIC_ERROR;
}

export function Chat() {
  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState("");
  const [leadFormOpen, setLeadFormOpen] = useState(false);

  const intent = classifyIntent(messages);
  // `plan.md` §3: capture is the prospective route's first step and is never run on an existing
  // client. `unknown` resolves to the strategist route too, but only after the bot has asked its one
  // qualifying question — so that path reaches the form through the button below rather than by
  // this component guessing on the user's behalf.
  const showLeadForm = leadFormOpen || intent === "prospective";
  const busy = status === "submitted" || status === "streaming";

  // The request is in flight but nothing has rendered yet — either `status` is "submitted" (no
  // chunk back at all) or it has just flipped to "streaming" on a structural chunk that arrives
  // before the first character of text does. Either way the box would otherwise sit empty and
  // silent for the length of a model call — `ux-curator`'s brief §1.1's "visible pending state".
  const lastMessage = messages.at(-1);
  const lastMessageHasText =
    lastMessage?.role === "assistant" &&
    lastMessage.parts.some(
      (part) => part.type === "text" && part.text.length > 0,
    );
  const showPending = busy && !lastMessageHasText;

  function submitText(text: string) {
    const trimmed = text.trim();
    if (trimmed.length === 0 || busy) return;
    setInput("");
    void sendMessage({ text: trimmed });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitText(input);
  }

  return (
    <div className="chat">
      {messages.length === 0 ? (
        <EmptyState onPick={submitText} disabled={busy} />
      ) : (
        // `aria-live="polite"` on this exact container is what makes the stream accessible: it is
        // the same node for the whole conversation (React keys it by `message.id`, never replaced),
        // so a screen reader announces each token as it lands here rather than staying silent until
        // a node gets swapped in whole. `ux-curator`'s brief §2.
        <ol className="thread" aria-live="polite" aria-relevant="additions text">
          {messages.map((message) => {
            // A turn that failed before its first token has no text parts. Skipping it is what
            // keeps a provider error from rendering as an empty bubble above the error notice.
            const text = message.parts.filter((part) => part.type === "text");
            if (text.length === 0) return null;

            return (
              <li key={message.id} className={`turn turn-${message.role}`}>
                {text.map((part, index) => (
                  <p key={index}>{linkifyText(part.text)}</p>
                ))}
              </li>
            );
          })}
          {showPending ? (
            <li className="turn turn-assistant turn-pending">
              <p>Thinking…</p>
            </li>
          ) : null}
        </ol>
      )}

      {error ? (
        <p className="notice" role="alert">
          {userFacingError(error)}
        </p>
      ) : null}

      <form className="composer" onSubmit={handleSubmit}>
        <label htmlFor="message">Your question</label>
        <input
          id="message"
          name="message"
          value={input}
          placeholder="Ask about Cadre AI…"
          disabled={busy}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit" disabled={busy}>
          {busy ? "Sending…" : "Send"}
        </button>
      </form>

      {showLeadForm ? (
        <LeadForm />
      ) : (
        <button type="button" onClick={() => setLeadFormOpen(true)}>
          Talk to an AI strategist
        </button>
      )}
    </div>
  );
}
