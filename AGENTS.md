# Repository Guidelines

## Project Structure & Module Organization
- Feature routes live in `app/`; use `(marketing)` for public funnels, `(auth)` for account flows, and `app/api/` for server actions.
- Shared UI primitives reside in `components/`, while hooks and utilities belong in `lib/`.
- Persist configuration objects in `constants/`, context providers in `context/`, and long-form docs in `content/`, `docs/`, or `specs/`.
- Static assets ship from `public/`. Automation scripts sit under `scripts/` (e.g., `scripts/supabase-otp-test.mjs`).
- Mirror runtime paths inside `tests/`, placing multi-step journeys in `tests/integration/`.

## Build, Test, and Development Commands
- `npm run dev`: start the Next.js dev server with hot reload.
- `npm run build`: compile the production bundle and run type checks; follow with `npm run start` to verify the output.
- `npm run lint` and `npm run format`: ensure ESLint and Prettier stay green before opening a PR.
- `npm run test`, `npm run test:watch`, `npm run test:coverage`: execute the Jest suite, watch mode, and coverage thresholds.
- `npm run type-check` and `npm run clear-cache`: validate TypeScript separately and reset `.next` artifacts when builds misbehave.

## Coding Style & Naming Conventions
- Ship TypeScript/TSX components that lean on functional React patterns and hooks.
- Honor two-space indentation, trailing commas, and Tailwind-first styling; reach for module CSS only when Tailwind cannot express the design.
- Export React components in PascalCase, keep filenames kebab-case, and reserve camelCase for helpers. Accept ESLint autofixes and re-run `npm run format` after larger edits.

## Testing Guidelines
- Jest with `jest-environment-jsdom` and React Testing Library cover UI behaviour. Co-locate mocks for SendGrid, Upstash, and Supabase in the test file or dedicated helpers.
- Name specs after their target path (e.g., `tests/integration/marketing/home.spec.tsx`) and prefer black-box assertions over implementation details.
- Require passing coverage via `npm run test:coverage` whenever behaviour changes.

## Commit & Pull Request Guidelines
- Write imperative, one-line subjects such as `add contact form validations`; keep each commit scoped and self-review before pushing.
- PRs need a concise summary, linked issues, and before/after screenshots for UI changes. Note any follow-up tasks explicitly.
- Confirm `npm run lint`, `npm run test`, and relevant coverage commands locally before requesting review.

## Security & Configuration Tips
- Copy `.env.example` to `.env` for local setup; never commit real credentials.
- Review `vercel.json` and `next.config.mjs` carefully prior to altering deployment behaviour, and document new configuration keys in `docs/`.
