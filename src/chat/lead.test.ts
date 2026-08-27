import { describe, expect, it } from "vitest";

import { leadContactFormUrl, leadMailtoUrl } from "@/chat/lead";
import { escalationFacts } from "@/knowledge/modules/contact";

// Lead delivery is a `mailto:` string and nothing else — plan.md §3. If the address is wrong or the
// body is mangled, the lead is lost silently, so both are asserted rather than eyeballed.

const lead = {
  name: "Dana Reyes",
  company: "Harbor & Finch Capital",
  industry: "Private equity",
  need: "Scoping an AI maturity review for two portfolio companies",
};

describe("the mailto: a captured lead builds", () => {
  const url = leadMailtoUrl(lead);
  const parsed = new URL(url);
  const query = new URLSearchParams(parsed.search);

  it("is addressed to the published support inbox, character for character", () => {
    expect(url.startsWith(`mailto:${escalationFacts.supportEmail}?`)).toBe(true);
    expect(escalationFacts.supportEmail).toBe("hello@gocadre.ai");
  });

  it("carries all four captured fields in the body", () => {
    const body = query.get("body") ?? "";
    expect(body).toContain(`Name: ${lead.name}`);
    expect(body).toContain(`Company: ${lead.company}`);
    expect(body).toContain(`Industry: ${lead.industry}`);
    expect(body).toContain(`What they need: ${lead.need}`);
  });

  it("names the company in the subject line", () => {
    expect(query.get("subject")).toBe(
      `AI strategist request — ${lead.company}`,
    );
  });

  it("encodes spaces as %20, which mail clients render as spaces", () => {
    // URLSearchParams would write "+", and a subject line reading "AI+strategist+request" is the
    // kind of thing that only shows up in someone's inbox.
    expect(url).not.toContain("+");
    expect(url).toContain("%20");
  });
});

describe("the contact-form link", () => {
  const url = new URL(leadContactFormUrl(lead));

  it("points at the published contact page", () => {
    expect(`${url.origin}${url.pathname}`).toBe(escalationFacts.contactPage);
  });

  it("carries the details under the live form's own field names", () => {
    // Read off https://www.cadreai.com/contact on 2026-08-27: a Webflow form whose inputs are
    // named Name, Email, Subject and Message.
    expect(url.searchParams.get("Name")).toBe(lead.name);
    expect(url.searchParams.get("Subject")).toContain(lead.company);
    expect(url.searchParams.get("Message")).toContain(lead.need);
  });
});
