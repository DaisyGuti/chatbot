import { describe, expect, it } from "vitest";
import { allModules } from "@/knowledge/modules";
import { servicesModules } from "@/knowledge/modules/services";
import { industriesModules } from "@/knowledge/modules/industries";
import { departmentsModules } from "@/knowledge/modules/departments";
import { strategyModules } from "@/knowledge/modules/strategy";
import { contactModules } from "@/knowledge/modules/contact";
import { allUnknowns } from "@/knowledge/unknowns";

// The 5 knowledge tests plan.md §8 gates the commit on. No network, no model — everything here is
// checkable from the registries alone.

describe("every module resolves a cadreai.com source", () => {
  it.each(allModules)("$id", (module) => {
    expect(module.source).toMatch(/^https:\/\/www\.cadreai\.com/);
  });
});

describe("every module carries a non-empty sourceHash", () => {
  it.each(allModules)("$id", (module) => {
    expect(module.sourceHash).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("every curated module is registered in the barrel", () => {
  const sections = {
    servicesModules,
    industriesModules,
    departmentsModules,
    strategyModules,
    contactModules,
  };

  it("the barrel is exactly the union of every section — nothing missing, nothing extra", () => {
    const fromSections = Object.values(sections).flat();
    expect(allModules).toHaveLength(fromSections.length);
    for (const curated of fromSections) {
      expect(allModules).toContain(curated);
    }
  });

  it("every id is globally unique, not just unique within its own section", () => {
    const ids = allModules.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("every unknown carries a route", () => {
  it.each(allUnknowns)("$id", (unknown) => {
    expect(["strategist", "support"]).toContain(unknown.route);
    expect(unknown.question.length).toBeGreaterThan(0);
    expect(unknown.reason.length).toBeGreaterThan(0);
  });
});

describe("no question is claimed by both a module and an unknown", () => {
  it("no id is shared between the two registries", () => {
    const moduleIds = new Set(allModules.map((m) => m.id));
    for (const unknown of allUnknowns) {
      expect(moduleIds.has(unknown.id)).toBe(false);
    }
  });

  it("no unknown's id matches a registered module — a decline and an answer can't both exist for the same fact", () => {
    const unknownIds = new Set(allUnknowns.map((u) => u.id));
    for (const curated of allModules) {
      expect(unknownIds.has(curated.id)).toBe(false);
    }
  });
});
