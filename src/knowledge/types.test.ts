import { describe, expect, it } from "vitest";
import type { KnowledgeModule, UnknownFact } from "@/knowledge/types";

// This file is a contract test: the load-bearing assertions are the `@ts-expect-error` directives,
// which `npm run typecheck` fails on if the error they expect stops happening. That is what catches
// `provenance` or `route` being widened to `string`, or `source`/`sourceHash` turning optional —
// each of which would let an ungrounded module compile. Vitest runs the well-formed fixtures.
//
// Fixtures only. No Cadre AI fact belongs in this file; real modules land in Phase 2.

const wellFormedModule: KnowledgeModule = {
  id: "fixture-module",
  topic: "services",
  content: "Fixture content, standing in for curated prose.",
  source: "https://www.cadreai.com/",
  provenance: "published",
  sourceHash: "0".repeat(64),
};

const wellFormedUnknown: UnknownFact = {
  id: "fixture-unknown",
  question: "A question the site does not answer.",
  reason: "Fixture, standing in for a confirmed gap.",
  route: "strategist",
};

describe("KnowledgeModule", () => {
  it("carries a source and a hash", () => {
    expect(wellFormedModule.source).toMatch(/^https:\/\/www\.cadreai\.com\//);
    expect(wellFormedModule.sourceHash).toHaveLength(64);
  });

  it("rejects a topic outside the union", () => {
    const outsideUnion: KnowledgeModule = {
      ...wellFormedModule,
      // @ts-expect-error "pricing" is not a Topic member; Phase 2b extends the union deliberately.
      topic: "pricing",
    };
    expect(outsideUnion.topic).toBe("pricing");
  });

  it("rejects a provenance outside published | derived", () => {
    const thirdProvenance: KnowledgeModule = {
      ...wellFormedModule,
      // @ts-expect-error buildSystemPrompt handles exactly two values; a third would render as neither.
      provenance: "inferred",
    };
    expect(thirdProvenance.provenance).toBe("inferred");
  });

  it("rejects a module with no sourceHash", () => {
    // @ts-expect-error sourceHash is required — a module with no hash is invisible to the drift job.
    const unhashed: KnowledgeModule = {
      id: "fixture-unhashed",
      topic: "services",
      content: "Fixture content.",
      source: "https://www.cadreai.com/",
      provenance: "published",
    };
    expect(unhashed.sourceHash).toBeUndefined();
  });
});

describe("UnknownFact", () => {
  it("carries a question, a reason and a route", () => {
    expect(wellFormedUnknown.question).not.toHaveLength(0);
    expect(wellFormedUnknown.reason).not.toHaveLength(0);
    expect(wellFormedUnknown.route).toBe("strategist");
  });

  it("rejects a route with no destination", () => {
    const nowhere: UnknownFact = {
      ...wellFormedUnknown,
      // @ts-expect-error an unknown with an unroutable route is the else-branch plan.md §2 rejects.
      route: "none",
    };
    expect(nowhere.route).toBe("none");
  });
});
