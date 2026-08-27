import { expect, test } from "@playwright/test";

import { mockChatReply } from "./support";

/**
 * `ux-curator`'s brief §1.1 and §5: "the stream starts fast and visibly builds... before the first
 * token there is a visible pending state." The transport is mocked (see `support.ts`) so the delay
 * before the first token is deterministic rather than dependent on a live model.
 */
test("shows a pending state before the first token, then renders the streamed reply", async ({
  page,
}) => {
  await mockChatReply(
    page,
    [
      "Cadre AI is an AI strategy and implementation consultancy. ",
      "It works with businesses across professional services, private equity, and financial services.",
    ],
    600,
  );

  await page.goto("/");

  const question = page.getByLabel("Your question");
  await question.fill("What does Cadre AI do?");
  await page.getByRole("button", { name: "Send", exact: true }).click();

  // Before the mocked delay resolves: the box is not silent — a pending turn is visible, and the
  // control that would let a second request go out mid-turn announces itself as unavailable.
  await expect(page.getByText("Thinking…")).toBeVisible();
  const sendingButton = page.getByRole("button", { name: "Sending…" });
  await expect(sendingButton).toBeVisible();
  await expect(sendingButton).toBeDisabled();
  await expect(question).toBeDisabled();

  // The container the reply streams into is announced to assistive tech as it fills in — the
  // accessibility-floor requirement (brief §2), not just a visual one.
  await expect(page.locator("ol.thread")).toHaveAttribute("aria-live", "polite");

  // Once the mocked delay clears, the full reply has landed and the pending turn is gone.
  await expect(
    page.getByText(
      "Cadre AI is an AI strategy and implementation consultancy. It works with businesses across professional services, private equity, and financial services.",
    ),
  ).toBeVisible({ timeout: 5000 });
  await expect(page.getByText("Thinking…")).toHaveCount(0);

  // The composer is usable again for the next turn.
  await expect(page.getByRole("button", { name: "Send", exact: true })).toBeEnabled();
});
