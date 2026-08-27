/**
 * `server-only` is a bundler guard: it resolves to an empty module under Next's `react-server`
 * condition and to a module that throws everywhere else, so importing it from a client component
 * is a build error. Vitest is not a bundler and resolves neither condition, so `src/chat/model.ts`
 * would throw on import and the resilience tests could never see the OpenRouter request body.
 * `vitest.config.mts` aliases the package to this file for the test run only — the real guard
 * still runs in `npm run build`, which is in the commit gate for exactly that reason.
 */

export {};
