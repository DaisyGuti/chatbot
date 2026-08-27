import { expect, test } from "@playwright/test";

/**
 * `ux-curator`'s brief §1.5 and §5: "the composer stays reachable, the thread scrolls, nothing
 * overflows sideways, tap targets are big enough to hit."
 */
test.use({ viewport: { width: 375, height: 667 } });

test("holds at phone width: no sideways overflow, composer reachable, tap targets sized", async ({
  page,
}) => {
  await page.goto("/");

  // Nothing forces the page wider than the viewport.
  const overflowsHorizontally = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  expect(overflowsHorizontally).toBe(false);

  // The empty state's prompts are themselves a phone-width surface worth checking — full-width,
  // tappable buttons rather than an inline row that would force horizontal scrolling.
  const firstPrompt = page.getByRole("button", {
    name: "How do I book a call with an AI strategist?",
  });
  await expect(firstPrompt).toBeVisible();
  const promptBox = await firstPrompt.boundingBox();
  expect(promptBox?.height ?? 0).toBeGreaterThanOrEqual(30);

  await firstPrompt.click();

  // The composer is on screen and usable at this width without any horizontal scrolling.
  const question = page.getByLabel("Your question");
  await expect(question).toBeVisible();
  const sendButton = page.getByRole("button", { name: "Send", exact: true });
  await expect(sendButton).toBeVisible();

  const questionBox = await question.boundingBox();
  const sendBox = await sendButton.boundingBox();
  expect(questionBox?.height ?? 0).toBeGreaterThanOrEqual(30);
  expect(sendBox?.height ?? 0).toBeGreaterThanOrEqual(30);
  expect((questionBox?.x ?? 0) + (questionBox?.width ?? 0)).toBeLessThanOrEqual(375);
  expect((sendBox?.x ?? 0) + (sendBox?.width ?? 0)).toBeLessThanOrEqual(375);

  // Still no sideways overflow once a turn is in flight and the thread has content.
  const overflowsAfterSend = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  expect(overflowsAfterSend).toBe(false);
});
