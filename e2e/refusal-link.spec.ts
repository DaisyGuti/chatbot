import { expect, test } from "@playwright/test";

import { mockChatReply } from "./support";

/**
 * `ux-curator`'s brief §1.2: "A refusal renders its route as something clickable... a `mailto:`, a
 * `tel:`, or a link to the contact page." The escalation strings here are copied verbatim from
 * `CLAUDE.md`'s table and `src/knowledge/modules/contact.ts`'s `escalationFacts` — the same literals
 * `src/chat/prompt.ts` instructs the model to use — so this checks that when those exact strings
 * appear in a reply, this repo's rendering turns them into real, correctly-addressed links. The
 * transport is mocked (see `support.ts`); whether the model reliably produces this refusal is the
 * live-model eval's job, not this one's.
 */
test("a refusal's contact details render as real, correctly-addressed links", async ({
  page,
}) => {
  await mockChatReply(page, [
    "Cadre AI doesn't publish SOC 2 or ISO 27001 certifications, or DPA and data-retention terms, ",
    "anywhere on its site. An AI strategist can go over your specific requirements — ",
    "email hello@gocadre.ai, call (619) 324-3223, or use the contact form at https://www.cadreai.com/contact.",
  ]);

  await page.goto("/");
  await page.getByLabel("Your question").fill("Are you SOC 2 or ISO 27001 certified?");
  await page.getByRole("button", { name: "Send", exact: true }).click();

  // The support email — gocadre.ai, never the cadreai.com address that looks right and is dead.
  const emailLink = page.getByRole("link", { name: "hello@gocadre.ai" });
  await expect(emailLink).toBeVisible();
  await expect(emailLink).toHaveAttribute("href", "mailto:hello@gocadre.ai");

  // The phone number, as a tel: link a finger or a cursor can act on.
  const phoneLink = page.getByRole("link", { name: "(619) 324-3223" });
  await expect(phoneLink).toBeVisible();
  await expect(phoneLink).toHaveAttribute("href", "tel:+16193243223");

  // The contact page, resolving to the exact published URL.
  const contactLink = page.getByRole("link", {
    name: "https://www.cadreai.com/contact",
  });
  await expect(contactLink).toBeVisible();
  await expect(contactLink).toHaveAttribute(
    "href",
    "https://www.cadreai.com/contact",
  );
});
