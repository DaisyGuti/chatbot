import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/lead/route";

// The endpoint exists for one line of output — plan.md §3: "the same payload is logged server-side,
// one line per capture, so a lead is demonstrable in the review rather than asserted." So the test
// reads the log line, not just the status code.

const lead = {
  name: "Dana Reyes",
  company: "Harbor & Finch Capital",
  industry: "Private equity",
  need: "Scoping an AI maturity review",
};

let logged: string[];

function leadRequest(body: unknown): Request {
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  logged = [];
  vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
    logged.push(args.join(" "));
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("a captured lead is logged server-side", () => {
  it("writes one line carrying all four fields", async () => {
    const response = await POST(leadRequest(lead));

    expect(response.status).toBe(204);
    expect(logged).toHaveLength(1);
    expect(logged[0]).toContain("[lead]");
    expect(logged[0]).toContain(lead.name);
    expect(logged[0]).toContain(lead.company);
    expect(logged[0]).toContain(lead.industry);
    expect(logged[0]).toContain(lead.need);
  });

  it("trims the fields it was handed", async () => {
    await POST(leadRequest({ ...lead, name: "  Dana Reyes  " }));

    expect(logged[0]).toContain('"name":"Dana Reyes"');
  });
});

describe("a lead that would reach a strategist with nothing useful is refused", () => {
  it.each([
    ["a missing field", { name: "Dana", company: "Harbor", industry: "PE" }],
    ["a blank field", { ...lead, need: "   " }],
    ["a field that is not a string", { ...lead, company: 42 }],
    ["a body that is not an object", "[]"],
    ["a body that is not JSON", "not json"],
  ])("%s", async (_label, body) => {
    const response = await POST(leadRequest(body));

    expect(response.status).toBe(400);
    expect(logged).toHaveLength(0);
  });

  it("refuses an oversized body", async () => {
    const response = await POST(
      leadRequest({ ...lead, need: "a".repeat(5_000) }),
    );

    expect(response.status).toBe(413);
    expect(logged).toHaveLength(0);
  });
});
