"use client";

import { useState, type FormEvent } from "react";

import {
  leadContactFormUrl,
  leadMailtoUrl,
  type LeadDetails,
} from "@/chat/lead";
import { escalationFacts } from "@/knowledge/modules/contact";

/**
 * Lead capture for the strategist route — `plan.md` §3's four fields, and the two links that get
 * them to Cadre. Delivery is the user clicking the `mailto:`; this app sends no email and writes to
 * no CRM.
 *
 * Plain fields rather than a conversational capture on purpose: four labelled inputs are one screen
 * of typing, where asking for them one at a time is four turns and four chances to drift.
 */
export function LeadForm() {
  const [captured, setCaptured] = useState<LeadDetails | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const lead: LeadDetails = {
      name: String(fields.get("name") ?? "").trim(),
      company: String(fields.get("company") ?? "").trim(),
      industry: String(fields.get("industry") ?? "").trim(),
      need: String(fields.get("need") ?? "").trim(),
    };

    // The server-side log is `plan.md` §3's evidence half. Delivery is the link below and does not
    // depend on it, so a failed POST is reported to the console and never withholds the link the
    // user came for.
    const logged = await fetch("/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(lead),
    }).catch(() => null);
    if (!logged?.ok) {
      console.error("[lead] server-side log failed; the send link still works");
    }

    setCaptured(lead);
  }

  if (captured !== null) {
    return (
      // `aria-live="polite"` + `role="status"` so a screen-reader user who just submitted the form
      // is told this confirmation replaced it, rather than the swap happening silently.
      <section className="lead" aria-live="polite" role="status">
        <h2>Send it to a strategist</h2>
        <p>
          Nothing has been sent yet. The email opens in your own mail app, so it
          arrives from your address and the strategist can reply to you.
        </p>
        <p>
          <a href={leadMailtoUrl(captured)}>
            Email these details to {escalationFacts.supportEmail}
          </a>
        </p>
        <p>
          <a
            href={leadContactFormUrl(captured)}
            target="_blank"
            rel="noreferrer"
          >
            Or open Cadre&rsquo;s contact form
          </a>
        </p>
        <button type="button" onClick={() => setCaptured(null)}>
          Edit these details
        </button>
      </section>
    );
  }

  return (
    <form
      className="lead"
      onSubmit={(event) => {
        void submit(event);
      }}
    >
      <h2>Talk to an AI strategist</h2>
      <p>
        Four details, so the strategist arrives knowing your situation. You send
        it yourself on the next screen.
      </p>

      <label htmlFor="lead-name">Your name</label>
      <input id="lead-name" name="name" required maxLength={500} />

      <label htmlFor="lead-company">Company</label>
      <input id="lead-company" name="company" required maxLength={500} />

      <label htmlFor="lead-industry">Industry</label>
      <input id="lead-industry" name="industry" required maxLength={500} />

      <label htmlFor="lead-need">What you need</label>
      <textarea id="lead-need" name="need" required maxLength={500} rows={3} />

      <button type="submit">Build my message</button>
    </form>
  );
}
