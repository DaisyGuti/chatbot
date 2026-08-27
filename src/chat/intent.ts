/**
 * Deterministic intent classification — see `plan.md` §4. No model call: it keeps `CLAUDE.md`'s
 * one-model-call-per-turn rule literally true, and it puts the classification tests in the commit
 * gate for free.
 *
 * Two properties matter more than the phrase list itself:
 *
 * - **It reads the whole thread, and only the user's half of it.** A client who says "we're already
 *   working with you" in turn one still routes to support when they ask about the portal in turn
 *   five. Assistant turns are skipped because the existing-client route instructs the model to
 *   restate the user's question — scanning its output would let the bot's own echo re-classify the
 *   conversation.
 * - **Soft signals set the state once; hard signals re-lock it.** `plan.md` §4: "how do I get
 *   started" is a guess about who is typing, "we signed last month" is a statement of fact, so only
 *   the second one may overturn an earlier read.
 */

import type { UIMessage } from "ai";

/** Who the thread says is typing. Every value has a route — see `buildIntentInstruction`. */
export type Intent = "prospective" | "existing" | "unknown";

/** The half of a `UIMessage` this reads. Widened so a test needn't invent message ids. */
type ThreadMessage = Pick<UIMessage, "role" | "parts">;

/**
 * Explicit statements of the relationship. These always win and re-lock in either direction, so a
 * prospect who signs mid-thread stops being routed to sales. `plan.md` §4 names the first three on
 * the existing side; the rest are the same statement in the forms people actually type, and the
 * prospective list is its mirror — without one, "re-lock in either direction" has only one gear.
 */
const HARD_EXISTING = [
  "we signed",
  "we've signed",
  "we have signed",
  "our contract",
  "we're a client",
  "we are a client",
  "we're already a client",
  "we are already a client",
];

const HARD_PROSPECTIVE = [
  "we're not a client",
  "we are not a client",
  "not a client yet",
  "we haven't signed",
  "we have not signed",
  "we're not working with",
  "we are not working with",
];

/** `plan.md` §4's soft lists, verbatim. These set the initial state and never overturn one. */
const SOFT_EXISTING = [
  "my account",
  "our portal",
  "the dashboard you set up",
  "we're already working with",
];

const SOFT_PROSPECTIVE = [
  "do you work with",
  "how do I get started",
  "what does it cost",
  "can you help my firm",
];

/**
 * Curly apostrophes are what a phone keyboard actually produces, so "we’re a client" has to match
 * the same phrase as "we're a client" or the hard signal misses most of the traffic it exists for.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ");
}

/**
 * Word-bounded, or "my account" matches "my accounting team" and "our portal" matches "is your
 * portal secure?" — both plausible questions from a prospect, both misrouted to client support.
 */
function signalPattern(phrases: string[]): RegExp {
  const alternatives = phrases
    .map((phrase) => normalize(phrase).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  return new RegExp(`\\b(?:${alternatives})\\b`, "g");
}

const PATTERNS = {
  hardExisting: signalPattern(HARD_EXISTING),
  hardProspective: signalPattern(HARD_PROSPECTIVE),
  softExisting: signalPattern(SOFT_EXISTING),
  softProspective: signalPattern(SOFT_PROSPECTIVE),
};

/**
 * Where a side's *last* match sits in the message, or -1. Last rather than first because the
 * operative clause of a sentence tends to be the later one — "we were looking into it, but we
 * signed last month" is a client, and comparing last positions is what reads it that way.
 */
function lastSignalIndex(text: string, pattern: RegExp): number {
  let latest = -1;
  for (const match of text.matchAll(pattern)) {
    latest = match.index;
  }
  return latest;
}

function userText(message: ThreadMessage): string {
  return normalize(
    message.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join(" "),
  );
}

/** The whole thread, in order. Every value is routed — `buildIntentInstruction` says where. */
export function classifyIntent(messages: readonly ThreadMessage[]): Intent {
  let intent: Intent = "unknown";

  for (const message of messages) {
    if (message.role !== "user") continue;
    const text = userText(message);

    const hardExisting = lastSignalIndex(text, PATTERNS.hardExisting);
    const hardProspective = lastSignalIndex(text, PATTERNS.hardProspective);
    if (hardExisting >= 0 || hardProspective >= 0) {
      intent = hardExisting > hardProspective ? "existing" : "prospective";
      continue;
    }

    // Soft signals only set the initial state — this is the stickiness `plan.md` §4 asks for.
    if (intent !== "unknown") continue;

    const softExisting = lastSignalIndex(text, PATTERNS.softExisting);
    const softProspective = lastSignalIndex(text, PATTERNS.softProspective);
    if (softExisting >= 0 || softProspective >= 0) {
      intent = softExisting > softProspective ? "existing" : "prospective";
    }
  }

  return intent;
}
