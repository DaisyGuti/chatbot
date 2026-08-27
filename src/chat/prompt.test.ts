import { describe, expect, it } from "vitest";

import { buildIntentInstruction, buildSystemPrompt } from "@/chat/prompt";
import { allModules } from "@/knowledge/modules";
import { allUnknowns } from "@/knowledge/unknowns";
import { escalationFacts } from "@/knowledge/modules/contact";
import { InMemoryRetriever } from "@/knowledge/retriever";
import type { Intent } from "@/chat/intent";
import type { KnowledgeModule } from "@/knowledge/types";

// The 4 prompt-assembly tests plan.md §8 gates the commit on. No network, no model — the prompt is
// a pure function of the two registries.

const prompt = buildSystemPrompt(new InMemoryRetriever());

describe("the knowledge block contains every registered module", () => {
  it.each(allModules)("$id", (module) => {
    expect(prompt).toContain(module.id);
    expect(prompt).toContain(module.content);
    expect(prompt).toContain(module.source);
  });

  it("the count the prompt states matches the registry, so a dropped module is visible", () => {
    expect(prompt).toContain(
      `These ${allModules.length} modules are everything you may state about Cadre AI.`,
    );
  });
});

describe("the unknowns block contains every registered unknown with its route", () => {
  it.each(allUnknowns)("$id", (unknown) => {
    expect(prompt).toContain(unknown.question);
    expect(prompt).toContain(unknown.reason);
    expect(prompt).toContain(`Route: ${unknown.route}.`);
  });

  it("each route spells out a handoff rather than just naming itself", () => {
    // A route with no instruction behind it is a label; the point of the registry is the handoff.
    expect(prompt).toContain(
      "Route: strategist. Decline the specific figure or claim",
    );
    expect(prompt).toContain("Route: support. Decline the specific steps");
  });
});

describe("the escalation literals appear byte-exact", () => {
  // hello@cadreai.com looks right and is a dead address. These four are asserted character for
  // character because a plausible-looking wrong one is worse than no answer at all.
  it.each([
    "hello@gocadre.ai",
    "privacy@gocadre.ai",
    "(619) 324-3223",
    "https://www.cadreai.com/contact",
  ])("%s", (literal) => {
    expect(prompt).toContain(literal);
  });

  it("every escalation literal is backed by a knowledge module, not written into the prompt", () => {
    // The grounding rule in one assertion: if the prompt states it, a module states it too.
    const contents = allModules.map((module) => module.content).join("\n");
    for (const literal of [
      "hello@gocadre.ai",
      "privacy@gocadre.ai",
      "(619) 324-3223",
      "https://www.cadreai.com/contact",
    ]) {
      expect(contents).toContain(literal);
    }
  });
});

describe("provenance changes how a module is presented", () => {
  const published = allModules.filter((m) => m.provenance === "published");
  const derived = allModules.filter((m) => m.provenance === "derived");

  /** The `Provenance:` line the prompt printed for one module, isolated from its neighbors. */
  function provenanceLine(module: KnowledgeModule): string {
    const marker = `### ${module.id}\n`;
    const start = prompt.indexOf(marker);
    expect(start).toBeGreaterThan(-1);
    return (
      prompt
        .slice(start + marker.length)
        .split("\n")
        .find((line) => line.startsWith("Provenance:")) ?? ""
    );
  }

  it("both provenance values are present in the registry", () => {
    // Otherwise the two assertions below would pass vacuously.
    expect(published.length).toBeGreaterThan(0);
    expect(derived.length).toBeGreaterThan(0);
  });

  it.each(published)("published module $id renders as quotable", (module) => {
    expect(provenanceLine(module)).toContain("you may quote it directly");
  });

  it.each(derived)(
    "derived module $id renders as attribution, not a quote",
    (module) => {
      const line = provenanceLine(module);
      expect(line).toContain("attribute it to the page");
      expect(line).toContain("do not present any of it as a quotation");
    },
  );
});

describe("each intent produces its own handoff", () => {
  // plan.md §3's table, asserted as instructions the model actually receives. An intent that
  // resolved to the same paragraph as the others would be a label, not a route.
  const prospective = buildIntentInstruction("prospective");
  const existing = buildIntentInstruction("existing");
  const unknown = buildIntentInstruction("unknown");

  it("prospective captures the lead, then hands off to the strategist route", () => {
    expect(prospective).toContain("name, company, industry, and what they need");
    expect(prospective).toContain(escalationFacts.contactPage);
    expect(prospective).toContain(escalationFacts.supportEmail);
    // The phone number is the client-support route's addition, not the strategist's.
    expect(prospective).not.toContain(escalationFacts.phone);
  });

  it("existing skips capture and hands off to client support with the question restated", () => {
    expect(existing).toContain("Do not capture a lead");
    expect(existing).toContain(escalationFacts.supportEmail);
    expect(existing).toContain(escalationFacts.phone);
    expect(existing).toContain("restate their question");
  });

  it("unknown asks once, then falls to the strategist route", () => {
    expect(unknown).toContain(
      "already working with Cadre, or looking into it",
    );
    expect(unknown).toContain("Ask it once.");
    expect(unknown).toContain(escalationFacts.contactPage);
    expect(unknown).toContain(escalationFacts.supportEmail);
  });

  it.each<Intent>(["prospective", "existing", "unknown"])(
    "%s states no address Cadre has not published",
    (intent) => {
      // hello@cadreai.com looks right and is dead. Anything with an @ in these blocks has to be
      // the one address escalationFacts owns.
      const addresses =
        buildIntentInstruction(intent).match(
          /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g,
        ) ?? [];
      for (const address of addresses) {
        expect(address).toBe(escalationFacts.supportEmail);
      }
    },
  );
});
