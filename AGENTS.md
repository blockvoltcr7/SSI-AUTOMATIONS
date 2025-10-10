# Repository Guidelines

## Project Structure & Module Organization

Core Next.js routes live in `app/`, with `(marketing)` covering public funnels, `(auth)` handling account flows, and `api/` exposing server actions. Shared UI sits in `components/`, grouped by feature; utilities and hooks are under `lib/`. Configuration values and providers belong in `constants/` and `context/`. Long-form assets, MDX content, and internal docs reside in `content/`, `docs/`, and `specs/`. Static assets stay in `public/`. Tests should land in `tests/`—prefer `tests/integration/` when validating multi-step journeys.

## Build, Test, and Development Commands

`npm run dev` boots the Next.js dev server with hot reload. `npm run build` emits the production bundle and enforces type checks. `npm run start` serves the compiled app locally. Run `npm run lint` before every push to apply Next/ESLint rules. Use `npm run test`, `npm run test:watch`, and `npm run test:coverage` for the Jest suite; keep coverage reports green prior to merging.

## Coding Style & Naming Conventions

Write components in TypeScript (`.tsx`) with functional patterns and React hooks. Tailwind utilities drive styling—co-locate bespoke styles in module CSS only when needed. Maintain two-space indentation and trailing commas, mirroring existing code such as `components/testimonials.tsx`. Export React components using PascalCase, keep file names kebab-case, and reserve camelCase for helpers. Run `npm run lint` (and accept suggested fixes) to stay aligned with the configured ESLint ruleset.

## Testing Guidelines

Jest with `jest-environment-jsdom` and React Testing Library powers the test harness (`jest.config.js`, `jest.setup.js`). Place integration specs under `tests/integration/`, mirroring the route or component under test (e.g., `tests/integration/marketing/home.spec.tsx`). Mock network-bound services like SendGrid or Upstash. Execute `npm run test:coverage` for behaviour-altering changes and capture edge cases alongside core paths.

## Commit & Pull Request Guidelines

Keep commits focused and write imperative, one-line subjects (e.g., `add missing blog`). For pull requests, include a concise summary, link related issues, and attach before/after screenshots for UI changes. Confirm `npm run lint` and `npm run test` pass locally before requesting review, and call out follow-up tasks or known gaps in the PR body.

## Environment & Configuration

Copy `.env.example` to `.env` and add local secrets (email credentials, Upstash tokens, etc.); never commit real keys. Review `vercel.json` and `next.config.mjs` prior to altering deploy behaviour. Keep Vercel environment variables in sync with new configuration keys and document any required setup in `docs/`.
