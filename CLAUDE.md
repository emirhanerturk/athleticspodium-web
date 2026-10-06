# CLAUDE.md

Guidance for Claude Code in this repository.

## Overview

`athleticspodium-web` is the new public site of athleticspodium.com. It replaces the legacy Angular app in `athleticspodium-frontend`, which gets no further changes. The site is server-rendered with SvelteKit and reads everything from `athleticspodium-backend`. The design source, decisions, phases and backend prerequisites are in `docs/superpowers/specs/2026-10-06-web-rewrite-design.md`; read it before larger changes.

## Commands

```bash
npm run dev                  # http://localhost:4400 (5173 is often taken by other projects)
npm run check                # svelte-kit sync + svelte-check
npm run lint                 # prettier --check + eslint
npm run test:unit -- --run   # Vitest once
npm run test:e2e             # Playwright: builds, starts tests/stub-backend.js on 4499 and a preview on 4173
```

Run a single unit test file with `npx vitest run src/lib/routing/redirects.test.ts`. Environment variables are declared in `src/env.ts`; copy `.env.example` to `.env` for local work.

## Stack notes (SvelteKit 3)

- Configuration lives in `vite.config.ts`; there is no `svelte.config.js`.
- Import from `src/lib` with `#lib/...` and a `.js` extension (`#lib/domain/date.js`); `$lib` does not exist.
- Environment values come from `$app/env/private` and `$app/env/public`, defined in `src/env.ts`.
- Any `server` folder and any `*.server.ts` file is server-only.
- `error(status, message)`; `handleError` in `hooks.server.ts` maps backend errors to 404 and 503.

## Architecture

| Layer                           | Folders                                                           | May import                       |
| ------------------------------- | ----------------------------------------------------------------- | -------------------------------- |
| Core: pure, no I/O, unit-tested | `lib/domain`, `lib/format`, `lib/routing`, `lib/seo`, `lib/utils` | other core modules               |
| Shell: I/O                      | `routes/`, `hooks.server.ts`, `lib/server/backend`                | core and the shell's own modules |
| View                            | `lib/components`                                                  | core and other components        |

ESLint (`no-restricted-imports`) enforces the table.

- `lib/server/backend/<resource>/` holds `index.ts` (the public, page-shaped functions), `dto.ts` (the backend's shape) and `parse.ts` (DTO to domain). Only `index.ts` may be imported from outside the folder. `createBackend(fetch, baseUrl)` in `lib/server/backend/index.ts` wires them; `hooks.server.ts` puts it on `locals.backend`.
- The browser never calls the backend. Client-side features use this app's own endpoints under `routes/internal/`.
- Every internal URL is built in `lib/routing/urls.ts`; legacy URL handling is in `lib/routing/redirects.ts`; `Cache-Control` per route is in `lib/routing/cache.ts`.
- Dates travel as `YYYY-MM-DD` strings (`IsoDate`); "today" is the UTC date. `lib/format` formats without `Intl` date APIs so Node and Workers render the same text.
- Components live only under `lib/components/<area>/`, one per file, PascalCase. Route folders hold no components.

## Conventions

- Code explains itself through names and small functions. Add a comment only for a reason the code cannot show.
- Principles: functional core and imperative shell, deep modules with small interfaces, parse at the boundary, YAGNI, factory functions over classes, explicit dependencies passed as parameters.
- Keep dependencies minimal. Write small helpers in `lib/utils` instead of adding packages; no date, memoisation, UI or icon libraries.
- Design tokens are in `src/styles/app.css` (`@theme`). Tailwind's default palette, fonts and breakpoints are removed, so only design-system values exist. Light theme only.
- Unit tests sit next to their file (`*.test.ts`). End-to-end specs are in `tests/e2e`; fixtures in `tests/fixtures/backend` mirror real backend responses.
- Docs are written in English.

## Deployment

Hosting is not decided yet: Cloudflare Workers or Railway (`adapter-node`). Until then the app uses `adapter-auto` and only web-standard APIs, so either adapter works. Anything other than `PUBLIC_SITE_ENV=production` is served with `X-Robots-Tag: noindex` and a closed `robots.txt`.
