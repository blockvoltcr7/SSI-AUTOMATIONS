# Repository Guidelines

## Project Structure & Module Organization

Next.js routes live under `app/`; `(marketing)` handles public funnels, `(auth)` covers account flows, and `api/` exposes server actions. Shared UI components sit in `components/`, while cross-cutting hooks and utilities belong to `lib/`. Keep configuration objects in `constants/`, context providers in `context/`, and long-form references in `content/`, `docs/`, or `specs/`. Static assets belong in `public/`, Jest specs live in `tests/` with multi-step journeys under `tests/integration/`, and automation helpers reside in `scripts/` (e.g., `scripts/supabase-otp-test.mjs`).

## Build, Test, and Development Commands

Use `npm run dev` to launch the Next.js dev server with hot reload. `npm run build` compiles the production bundle and runs type checks; follow with `npm run start` if you need to verify the built output. Run `npm run lint` before each push, and pair it with `npm run format` when formatting drifts. `npm run test`, `npm run test:watch`, and `npm run test:coverage` drive the Jest suite; `npm run type-check` validates TypeScript separately, and `npm run clear-cache` resets `.next` artifacts.

## Coding Style & Naming Conventions

Write components in TypeScript/TSX with functional patterns and React hooks. Follow the project’s two-space indentation, trailing commas, and Tailwind-first styling—introduce module CSS only for cases Tailwind cannot cover. Export React components in PascalCase, keep files kebab-case, and reserve camelCase for helpers. Accept ESLint autofixes and ensure Prettier runs cleanly via `npm run format`.

## Testing Guidelines

Jest with `jest-environment-jsdom` and React Testing Library underpins UI tests. Mirror the component or route path in filenames (e.g., `tests/integration/marketing/home.spec.tsx`). Mock network services such as SendGrid, Upstash, and Supabase in tests. Run `npm run test:coverage` for behaviour changes and keep coverage thresholds green before merging.

## Commit & Pull Request Guidelines

Write imperative, one-line commit subjects like `add contact form validations` and keep each commit scoped. Pull requests need a summary, linked issues, and before/after screenshots for UI updates. Confirm `npm run lint`, `npm run test`, and relevant coverage checks locally, and note any follow-up tasks in the PR description.

## Security & Configuration Tips

Seed local secrets by copying `.env.example` to `.env`; never commit actual credentials. Review `vercel.json` and `next.config.mjs` before modifying deployment behaviour. Keep Vercel environment variables aligned with new configuration keys and document required setup steps in `docs/`.
