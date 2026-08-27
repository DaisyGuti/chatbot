import { describe, expect, it } from "vitest";

import { classifyIntent } from "@/chat/intent";

// plan.md §8's 3 classification tests — prospective, existing, and an ambiguous thread that must
// land on `unknown` rather than guessing — plus the two behaviors a naive per-message classifier
// gets wrong, which is the whole reason §4 specifies stickiness and a hard-signal override.

function user(text: string) {
  return { role: "user" as const, parts: [{ type: "text" as const, text }] };
}

function assistant(text: string) {
  return {
    role: "assistant" as const,
    parts: [{ type: "text" as const, text }],
  };
}

describe("a prospective thread", () => {
  it("classifies a soft prospective signal", () => {
    expect(
      classifyIntent([user("Do you work with private equity firms?")]),
    ).toBe("prospective");
  });
});

describe("an existing-client thread", () => {
  it("classifies a soft existing signal", () => {
    expect(
      classifyIntent([
        user("We're already working with your team — how do I get to our portal?"),
      ]),
    ).toBe("existing");
  });
});

describe("an ambiguous thread", () => {
  it("lands on unknown rather than guessing", () => {
    expect(
      classifyIntent([
        user("What is the AI Maturity Index?"),
        assistant("It scores your company across eight pillars."),
        user("And are you SOC 2 certified?"),
      ]),
    ).toBe("unknown");
  });

  it("is unknown for an empty thread", () => {
    expect(classifyIntent([])).toBe("unknown");
  });

  it("ignores signals the assistant wrote, including its own restatement of the question", () => {
    // The existing-client route tells the model to restate the user's question back to them. If
    // classification read assistant turns, that echo would re-classify the conversation.
    expect(
      classifyIntent([
        user("What does Cadre AI do?"),
        assistant(
          "To restate what you asked — do you work with our industry, and can you help my firm? Here is what Cadre publishes.",
        ),
      ]),
    ).toBe("unknown");
  });
});

describe("stickiness across the thread", () => {
  it("keeps an existing client on the support route when a later turn sounds like a prospect", () => {
    expect(
      classifyIntent([
        user("We're already working with you on the finance rollout."),
        assistant("Good to hear."),
        user("What does it cost to add another department?"),
      ]),
    ).toBe("existing");
  });

  it("keeps a prospect on the strategist route when a later turn sounds like a client", () => {
    expect(
      classifyIntent([
        user("How do I get started?"),
        assistant("Cadre's entry point is the AI Maturity Index."),
        user("Would my account see the dashboard you set up for other firms?"),
      ]),
    ).toBe("prospective");
  });
});

describe("hard signals re-lock the state", () => {
  it("overturns a soft prospective read — plan.md §4's own example", () => {
    expect(
      classifyIntent([
        user("How do I get started?"),
        assistant("Cadre's entry point is the AI Maturity Index."),
        user("We signed last month, how do I log in?"),
      ]),
    ).toBe("existing");
  });

  it("overturns a soft existing read in the other direction", () => {
    expect(
      classifyIntent([
        user("Is your portal something my account would include?"),
        assistant("Cadre publishes a portal for clients."),
        user("To be clear, we're not a client — we're comparing consultancies."),
      ]),
    ).toBe("prospective");
  });
});

describe("phrase matching is bounded to whole words", () => {
  it.each([
    ["my accounting team", "How can AI help my accounting team?"],
    ["your portal", "Is your portal secure enough for a regulated firm?"],
  ])("does not read %s as an existing client", (_label, question) => {
    expect(classifyIntent([user(question)])).not.toBe("existing");
  });
});
