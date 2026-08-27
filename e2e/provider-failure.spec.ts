import { expect, test } from "@playwright/test";

/**
 * `ux-curator`'s brief §1.3 and §5: "a provider failure renders one plain sentence... offer the way
 * forward." Unmocked on purpose — this is the one spec that hits the real `/api/chat` route. Per
 * the CEO's Phase 6 note there is no funded `OPENROUTER_API_KEY` yet, so every real call already
 * 401s against OpenRouter; that is the natural, reachable trigger for this state right now, not a
 * simulated one. It proves the guard fires; it cannot prove the `models[]` fallback actually routes
 * traffic to the peer, since both entries fail identically without a working key.
 */
test("a provider failure renders one plain sentence, with nothing provider-shaped in it", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Your question").fill("What does Cadre AI do?");
  await page.getByRole("button", { name: "Send", exact: true }).click();

  // Scoped to our own error paragraph rather than `page.getByRole("alert")`: Next.js's built-in
  // route announcer (`#__next-route-announcer__`) also carries `role="alert"` and is always
  // present, empty, in every page it renders — a bare role query is ambiguous between the two.
  const notice = page.locator('p.notice[role="alert"]');
  await expect(notice).toBeVisible({ timeout: 15_000 });
  // Web-first assertion, not a one-shot read: retries against the live DOM until the sentence has
  // actually landed, rather than racing a render that committed the element a tick before its text.
  await expect(notice).not.toBeEmpty();

  const text = (await notice.textContent())?.trim() ?? "";
  expect(text.length).toBeGreaterThan(0);

  // Human words only. Nothing naming the provider, the model, a status code, or raw JSON.
  const forbidden = [
    "OpenRouter",
    "openrouter",
    "anthropic",
    "Anthropic",
    "claude",
    "Claude",
    "gpt-5",
    "sonnet",
    "401",
    "500",
    "rate limit",
    "upstream",
    "{",
    "}",
  ];
  for (const term of forbidden) {
    expect(text).not.toContain(term);
  }

  // The composer recovers — a failed turn doesn't leave the box permanently unusable.
  await expect(page.getByRole("button", { name: "Send", exact: true })).toBeEnabled();
  await expect(page.getByLabel("Your question")).toBeEnabled();
});
