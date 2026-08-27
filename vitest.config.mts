import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // The same `@/*` -> `src/*` mapping tsconfig.json declares, so a test imports what the app imports.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // `server-only` throws outside a bundler. See src/test/server-only-stub.ts for why the test
      // run substitutes it and why that doesn't weaken the guard.
      "server-only": fileURLToPath(
        new URL("./src/test/server-only-stub.ts", import.meta.url),
      ),
    },
  },
  test: {
    // Deterministic suite only. The Playwright pass (`npm run test:e2e`, Phase 6) needs a running
    // app and never blocks a commit, so it stays out of this glob — see plan.md §8.
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
