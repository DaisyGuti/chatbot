import { defineConfig, devices } from "@playwright/test";

/**
 * The browser-driven pass — `plan.md` §8, "UX/browser-driven". Needs a running app and a real
 * browser, so it never enters the commit gate (`CLAUDE.md`'s gate is test/lint/typecheck/build
 * only). `npm run test:e2e` starts the dev server itself so the suite is a single command.
 *
 * Smoke, not a regression suite: `ux-curator`'s brief asks for three or four load-bearing specs,
 * kept small enough to stay green and fast.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run build && npm start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
