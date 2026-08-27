import type { LeadDetails } from "@/chat/lead";

/**
 * The server-side half of lead capture — `plan.md` §3: "The same payload is logged server-side, one
 * line per capture, so a lead is demonstrable in the review rather than asserted."
 *
 * That is all this does. Delivery is the `mailto:` the browser builds and the user clicks; there is
 * no database, no CRM write, and no email sent from here. `plan.md` §3 also names the risk this
 * accepts: the four fields are personal data, they reach one Vercel log line, and they inherit
 * Vercel's retention.
 *
 * No rate limit, unlike `/api/chat`: this endpoint spends no model credit, so the worst a caller
 * gets from hammering it is log noise, and the field caps below bound each line. That is the whole
 * residual, stated rather than papered over.
 */

/** Four short fields and nothing else. Comfortably past a real lead, nowhere near a paste bomb. */
const MAX_REQUEST_CHARS = 4_000;
const MAX_FIELD_CHARS = 500;

const LEAD_FIELDS = ["name", "company", "industry", "need"] as const;

/**
 * Validated at the boundary, because this is a public endpoint and the body is whatever it was
 * handed. All four are required: the point of the capture is that a strategist arrives with
 * context, and three fields out of four is not that.
 */
function parseLead(value: unknown): LeadDetails | null {
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;

  const lead: Partial<LeadDetails> = {};
  for (const field of LEAD_FIELDS) {
    const raw = record[field];
    if (typeof raw !== "string") return null;
    const trimmed = raw.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_FIELD_CHARS) return null;
    lead[field] = trimmed;
  }

  return lead as LeadDetails;
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.text();
  if (body.length > MAX_REQUEST_CHARS) {
    return Response.json({ error: "That's too long." }, { status: 413 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const lead = parseLead(parsed);
  if (lead === null) {
    return Response.json(
      { error: "Please fill in your name, company, industry, and what you need." },
      { status: 400 },
    );
  }

  // One line per capture, which is the reviewable artifact `plan.md` §3 asks for.
  console.log(
    "[lead]",
    JSON.stringify({ capturedAt: new Date().toISOString(), ...lead }),
  );

  return new Response(null, { status: 204 });
}
