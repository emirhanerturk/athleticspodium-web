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
npm run social-images        # renders the Open Graph images in static/og/ (commit the PNGs)
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

Railway, in project `athletics-podium` next to the backend:

- **Service:** `athleticspodium-web`, environment `production`, region `europe-west4-drams3a`, one replica. This folder is linked with the Railway CLI, so `railway logs`, `railway variables` and `railway status` work from here.
- **Deploys:** Every push to `main` deploys automatically. Railpack runs `npm run build` and then `npm start` (`node build`, adapter-node). The health check is `/robots.txt`.
  - If pushes stop deploying, reconnect the source: `railway service source connect --repo emirhanerturk/athleticspodium-web --branch main --service athleticspodium-web`.
- **Variables:** `BACKEND_URL` reaches the backend over the private network (`http://${{athleticspodium-backend.RAILWAY_PRIVATE_DOMAIN}}:8080/1.0`). `PROTOCOL_HEADER=x-forwarded-proto` makes request URLs https behind Railway's proxy.
- **Production since 2026-10-09** (it replaced the Angular site on Firebase):
  - `PUBLIC_SITE_ENV=production` and `PUBLIC_SITE_URL=https://athleticspodium.com`.
  - Domains: `athleticspodium.com` and `www.athleticspodium.com`, as Cloudflare CNAMEs to Railway, verified by `_railway-verify` TXT records. Any other host, including `athleticspodium-web-production.up.railway.app`, redirects to the apex.
  - The plan allows two custom domains per service, so there is no staging domain any more.
  - Rollback: turn the Cloudflare proxy off, then point the apex back to A `199.36.158.100` and `www` to CNAME `athletics-podium.web.app`. The Firebase site stays deployable for that.
- **Cloudflare:** both records are proxied (orange cloud) since 2026-10-09, to stop bot traffic from Singapore cloud networks (Tencent, Alibaba).
  - A WAF custom rule gives a Non-Interactive Challenge to requests from Singapore and China.
  - AI Crawl Control → Security blocks AI training crawlers (ClaudeBot, GPTBot, CCBot, Bytespider…) with a 403 and prepends a Cloudflare-managed block to `robots.txt`.
  - Search engine crawlers (Googlebot, BingBot, Applebot) must stay unblocked there. In October 2026 their toggles were on: Google could not crawl any page and Search Console reported the sitemap as 403. Google's and Apple's AI-training opt-outs are the `Google-Extended` and `Applebot-Extended` rules of the managed `robots.txt`, not these toggles.
  - Blocked requests never reach Railway; find them under Security → Analytics → Events, filtered by user agent. Railway still logs the visitor's real IP.
- **CDN:** Railway's CDN is on (`railway cdn status`): HTML caching follows `Cache-Control`, stale-while-revalidate is honoured and every deploy purges everything.
  - Its revalidations reach the service from CDN77 addresses with an empty User-Agent (about a third of origin traffic), so never block empty User-Agents.
  - Cache hits never reach the service and do not show in `railway logs --http`.
- **Egress:** Railway bills the bytes leaving the container, before its edge compresses them, so `hooks.server.ts` gzips text responses itself (`lib/routing/compression.ts`). The `txBytes` of `railway logs --http --json` sum to the billed egress; `railway metrics --network --raw --json` gives it per hour.
- **Config:** `.railway/railway.ts` declares the service as the named partial `athleticspodium-web`. Preview a change with `railway config plan`, then apply the reviewed plan with `railway config apply`. Keep the partial: a full IaC file deletes the resources it omits, including the backend and Postgres.
