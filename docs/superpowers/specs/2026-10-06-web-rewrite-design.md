# athleticspodium-web: rewrite design

- **Date:** 2026-10-06
- **Status:** Approved 2026-10-06
- **Projects:** `athleticspodium-web` (new), `athleticspodium-backend` (prerequisites)
- **Replaces:** `athleticspodium-frontend` (Angular 18 SPA)
- **Design source:** Claude Design canvas "Athletics Podium Redesign", page "v2 · Feedback round": https://claude.ai/artifact/4oD3wVaMPNSRRPrWwyPd24

## 1. Goal

Replace the Angular SPA at athleticspodium.com with a server-rendered SvelteKit site. The new site implements the v2 design, keeps every indexed URL working and improves SEO.

Success criteria:

- Every URL in the indexed set (section 2) returns 200, or a single 301 to its canonical URL.
- The server HTML of every page is complete: content, title, description, canonical, Open Graph and JSON-LD.
- Unknown URLs return HTTP 404.
- The indexed page count in Search Console does not drop during the 4 weeks after cutover.
- On mobile, athlete and edition pages reach "good" Core Web Vitals: LCP under 2.5 s, CLS under 0.1.

## 2. Baseline

The current site:

- It is an Angular 18 SPA on Firebase Hosting and has no SSR.
- In `index.html` the `<title>` and description are empty and the canonical tag is commented out.
- There is no sitemap.
- Unknown URLs redirect on the client to `/404`, and Firebase answers every path with 200. Search engines see these as soft 404s.
- The Angular service worker (`ngsw-worker.js`) is registered.
- The A–Z athlete index keeps the letter and page in component state, so crawlers cannot reach it.
- Medal search and country-championship pages put filters in Angular matrix parameters (`/medals/search;country=TUR;page=2`).

Search Console "Indexed pages" export (2026-10-06). The UI caps exports at 1000 rows, so this is a sample:

| Pattern                   | Count             |
| ------------------------- | ----------------- |
| `/athlete/:id/:slug`      | 812 (3 on `www.`) |
| `/champs/:champ/:meeting` | 140               |
| `/champs/:champ`          | 18                |
| `/article/:id/:slug`      | 15                |
| `/country/:CODE/athletes` | 8                 |
| `/country/:CODE`          | 6                 |
| `/`                       | 1                 |

What the sample shows:

- Both hosts are indexed, so the same content appears twice.
- Country codes are indexed in upper case.
- The complete URL set comes from the database (section 11).

## 3. Decisions

1. New repository `athleticspodium-web`. `athleticspodium-frontend` stays live until cutover and is archived a few weeks after.
2. SvelteKit 3, Svelte 5 (runes), TypeScript 6 in strict mode. Code imports `src/lib` as `#lib/...` (Node subpath imports), and configuration lives in `vite.config.ts`.
3. Light theme only.
4. Tailwind CSS v4, with the design tokens in `@theme`.
5. Fonts are self-hosted through `@fontsource`.
6. Hosting is Railway (`adapter-node`), decided on 2026-10-06 (section 6.5). The service `athleticspodium-web` runs in the backend's project and region and reaches the API over the private network.
7. All page data loads in server `load` functions. The browser never calls the backend. Client-side features (hover card, quick search, contact form) call this app's own endpoints and form actions.
8. Existing URLs do not change. Legacy forms redirect with 301 (section 5.2).
9. Pages the design does not cover are still built in the v2 visual language, so no indexed page is lost.
10. No PWA. A safety worker unregisters the old Angular service worker.
11. The athlete hover card uses the single compact variant. It loads lazily on hover or focus. On touch devices the name is a plain link.
12. `/search` is `noindex`. The quick search shows featured athletes instead of "trending". Recent searches stay in `localStorage`. Search starts at 2 characters.
13. Medal counts follow one definition (section 8).
14. `/country/:code/athletes` follows `V2-CountryAthletes`; its filters run on the server, so every state has a URL.
15. The A–Z athlete directory stays, now with crawlable URLs.
16. Placings 4–8 have their own "Other achievements" section on the athlete profile, between Medals and National results, as on the legacy site. Until 2026-10-08 they sat behind a "Show places 4–8" toggle in the Medals table.
17. Content the design omits stays:
    - meeting `content` and meeting notes
    - medal `notes`, `info` and wind
    - related athletes
18. "Today" is computed in UTC.
19. Dependencies stay minimal. There is no date library, no memoisation library, no UI kit and no icon package.
20. Docs are in English. Code is self-documenting and has almost no comments.
21. Analytics stays on Google Analytics 4 with the legacy property (`G-7EDH9146FP`, set as `PUBLIC_GA_MEASUREMENT_ID`). It loads only in production and sends a `page_view` on the first load and on every client-side navigation. Like the legacy site, there is no consent banner.

## 4. Scope

**In scope:**

- Every page in section 5.
- The design system.
- SEO.
- The backend prerequisites in section 10.
- Cutover from Firebase.

**Out of scope:**

- The CMS, which stays Angular 14.
- Image optimisation: resizing, formats, CDN transforms.
- Dark mode.
- PWA.
- A calendar `.ics` feed.
- The "Athletics families" section.
- Trending-athlete tracking.
- New editorial data fields.

## 5. Pages and URLs

### 5.1 Routes

| Page                     | URL                                                      | Design source                             | Indexable |
| ------------------------ | -------------------------------------------------------- | ----------------------------------------- | --------- |
| Home                     | `/`                                                      | `V2-Home` → `Home-B` (`v2=true`)          | yes       |
| Championships            | `/champs`                                                | `V2-Champs` → `Champs-A`                  | yes       |
| Championship             | `/champs/[champ]`                                        | `V2-Champ` → `ChampDetail`                | yes       |
| Edition                  | `/champs/[champ]/[meeting]`                              | `V2-Edition` → `Meeting-A` (`cards=true`) | yes       |
| Athletes                 | `/athlete`                                               | `V2-Athletes` → `Athletes-B`              | yes       |
| Athletes A–Z             | `/athlete/letter/[letter]?page=n`                        | v2 components                             | yes       |
| On this day              | `/on-this-day/[day]?born=n&died=n`                       | v2 components (home "On this day" style)  | yes       |
| Athlete                  | `/athlete/[id=integer]/[slug]`                           | `V2-Athlete` → `Athlete-A` (`v2=true`)    | yes       |
| Countries                | `/country`                                               | `V2-Countries`                            | yes       |
| Country                  | `/country/[code]`                                        | `V2-Country`                              | yes       |
| Country athletes         | `/country/[code]/athletes?q=&gender=&era=&sort=&page=`   | `V2-CountryAthletes`                      | yes       |
| Calendar                 | `/calendar`, `/calendar/[year=integer]`                  | `V2-Calendar`                             | yes       |
| Search                   | `/search?q=&type=&gender=&born_from=&born_to=&olympian=` | `V2-Search`                               | no        |
| Articles                 | `/article`, `/article/[id=integer]/[slug]`               | v2 components                             | yes       |
| Medal search             | `/medals?…`                                              | `V2-Tools`                                | yes       |
| Medal countdown          | `/medals/countdown?…`                                    | `V2-Tools` hero, `V2-Countdown`           | yes       |
| Compare                  | `/medals/compare?…`                                      | `V2-Tools` hero, `V2-Compare`             | yes       |
| About                    | `/about`                                                 | `V2-About`                                | yes       |
| Missing information      | `/missing-information?tab=&q=`                           | `V2-Missing`                              | yes       |
| How to read the database | `/how-to-read-the-database`                              | `V2-Notes`                                | yes       |

Shared parts:

- header: `Header`, ticker variant
- footer: `Footer`, ink variant
- athlete hover card: `AthleteCard`
- quick search overlay: `V2-SearchOverlay`
- building blocks: `V2-Blocks`, with places, DQ and record badges

`Foundations` (`Main`) supplies the logo files and the colour palette. The v2 page supplies the fonts.

Endpoints served by this app:

| Path                                       | Purpose                        |
| ------------------------------------------ | ------------------------------ |
| `/sitemap.xml`, `/sitemaps/[type]-[n].xml` | sitemap index and files        |
| `/robots.txt`                              | crawler rules                  |
| `/ngsw-worker.js`                          | safety worker for old visitors |
| `/internal/athlete-card/[id]`              | hover card JSON                |
| `/internal/search?q=`                      | quick search JSON              |

### 5.2 Redirects and status codes

All redirects are single-hop 301s, handled in `hooks.server.ts`:

| Request                                                                                                                                      | Response                                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `www.athleticspodium.com/*`                                                                                                                  | apex host, same path                                                                                                                                                                                      |
| any other host in production (`next.athleticspodium.com`, `*.up.railway.app`), except `/robots.txt` (Railway's health check) and local hosts | the host of `PUBLIC_SITE_URL`, same path                                                                                                                                                                  |
| trailing slash (`/champs/`)                                                                                                                  | path without the slash                                                                                                                                                                                    |
| lower-case country code (`/country/tur`)                                                                                                     | upper-case code                                                                                                                                                                                           |
| athlete or article with a wrong slug                                                                                                         | canonical slug                                                                                                                                                                                            |
| matrix parameters (`/athlete/letter/a;page=2`)                                                                                               | the same filters as a query string                                                                                                                                                                        |
| `/medals/search`, `/medals/country-champs`, `/compare` (moved on 2026-10-08)                                                                 | `/medals`, `/medals/countdown`, `/medals/compare`; medal search parameters translated (`champs` → `champ`, `gender` 0–2 → `men`/`women`/`mixed`, `medal` 1–3 → `gold`/`silver`/`bronze`, `order` dropped) |
| `/simple-notes`                                                                                                                              | `/how-to-read-the-database`                                                                                                                                                                               |
| `/404`, `/ngsw.json`, any unknown path                                                                                                       | HTTP 404 with the v2 error page                                                                                                                                                                           |

The Angular service worker deletes its caches and unregisters itself when `/ngsw.json` returns 404. The safety worker at `/ngsw-worker.js` covers browsers that load the worker script first.

## 6. Architecture

### 6.1 Principles

These replace SOLID as the working rules:

- **Functional core, imperative shell.** Pure modules hold the logic: `domain`, `format`, `seo`, `urls` and the backend parsers. Routes, hooks and backend API modules do the I/O and stay thin.
- **Deep modules.** A module exposes a few functions with simple signatures and hides its details. For example, `backend.athletes.getProfile(id)` hides several requests and the mapping.
- **Parse, don't validate.** Backend responses become domain types once, at the boundary. Nothing outside `lib/server/backend` sees a DTO.
- **YAGNI.** An abstraction appears with its second real use, not before.
- **Functions over classes.** Use factory functions. There is no inheritance and no DI container. Dependencies arrive as parameters.
- **Self-documenting code.** Names carry the meaning. A comment is written only for a reason the code cannot show.
- **Few dependencies.** Anything a few lines of code can do is written here, in `lib/utils`.

### 6.2 Folder structure

```
athleticspodium-web/
├── docs/                        specs, plans, decisions
├── scripts/                     maintenance scripts (check-urls)
├── src/
│   ├── routes/                  one folder per URL; only load functions and page composition
│   │   ├── internal/            JSON endpoints for client-side features
│   │   ├── sitemap.xml/  sitemaps/  robots.txt/
│   │   └── (page folders as in 5.1)
│   ├── lib/
│   │   ├── server/backend/      the only code that talks to athleticspodium-backend
│   │   │   ├── client.ts        fetch with base URL, timeout and error mapping
│   │   │   ├── index.ts         createBackend(fetch, baseUrl, mediaUrl)
│   │   │   ├── nation-tally.ts  medal-table rows shared by champs and meetings
│   │   │   └── <resource>/      athletes, champs, meetings, events, media, countries, medals, articles, search, stats, pages, sitemap
│   │   │       ├── index.ts     the public surface: page-shaped functions such as getProfile(id)
│   │   │       ├── dto.ts       response shapes as the backend sends them (private to the folder)
│   │   │       └── parse.ts     DTO to domain, pure (private to the folder)
│   │   ├── domain/              types and pure rules (athlete, medal, champ, meeting, country, record)
│   │   ├── components/
│   │   │   ├── ui/              design-system primitives (MedalDisc, RecordBadge, Flag, Tabs, Button, icons/)
│   │   │   ├── layout/          Header, Ticker, Footer, Breadcrumb, SearchOverlay
│   │   │   ├── seo/             SeoHead, JsonLd
│   │   │   └── athlete/ championship/ meeting/ country/ calendar/ search/ article/ medal/
│   │   ├── seo/                 pure builders: titles, canonical URLs, JSON-LD, sitemap XML
│   │   ├── format/              Intl-based formatters for dates, numbers and marks
│   │   ├── routing/             urls.ts (every internal URL), redirects.ts (legacy forms), cache.ts (Cache-Control)
│   │   └── utils/               small generic helpers, one function per file
│   ├── styles/app.css           Tailwind import and @theme tokens
│   ├── env.ts                   environment variables (defineEnvVars)
│   ├── hooks.server.ts          redirects, cache headers, locals.backend, error mapping
│   └── app.html
├── static/                      flags, ngsw-worker.js (logos and favicon are hashed imports from lib/assets)
└── tests/
    ├── e2e/                     Playwright specs
    └── fixtures/backend/        JSON responses for the stub backend
```

The folders follow the principles in 6.1:

| Layer                            | Folders                                                           | May import                        |
| -------------------------------- | ----------------------------------------------------------------- | --------------------------------- |
| Core (pure, no I/O, unit-tested) | `lib/domain`, `lib/format`, `lib/routing`, `lib/seo`, `lib/utils` | only other core modules           |
| Shell (I/O)                      | `routes/`, `hooks.server.ts`, `lib/server/backend`                | core, and the shell's own modules |
| View                             | `lib/components`                                                  | core and other components         |

Rules:

- ESLint `no-restricted-imports` enforces the table above.
- Outside a backend resource folder, only its `index.ts` may be imported. Its `dto.ts` and `parse.ts` stay private.
- A backend resource exposes page-shaped functions. For example, `athletes.getProfile(id)` runs the profile's requests in parallel and returns one parsed object, so a route makes one call per need.
- Unit tests sit next to the file they test (`*.test.ts`).
- Components live only under `lib/components/<area>/`, one component per file, named in PascalCase. Route folders hold no components.
- `lib/server/**` is server-only. SvelteKit refuses to bundle it for the browser.

### 6.3 Request flow

1. `hooks.server.ts` applies the redirects in 5.2. It then sets `event.locals.backend = createBackend(event.fetch, BACKEND_URL, PUBLIC_MEDIA_URL)`.
2. A route's `+page.server.ts` calls `locals.backend.<resource>.<function>()`. Independent requests run in parallel.
3. The resource module sends its requests through `client.ts`. Its `parse.ts` turns the responses into domain types.
4. `+page.svelte` composes components from the domain data and sets `SeoHead` and `JsonLd`.
5. `hooks.server.ts` adds `Cache-Control` according to the route type (6.4).

Error handling:

- `client.ts` throws `BackendNotFoundError` when a record is missing and `BackendUnavailableError` for a timeout (8 s), a server error or a network failure.
- Until B20 ships, a missing record still comes back as HTTP 200 with `data: null`. So the client reads the body as well:
  - `success: false` with code `4040` means not found; any other code is an error.
  - `success: true` with `data: null` on a detail endpoint also means not found.
- Load functions turn these into `error(404)` or `error(503)`.
- `+error.svelte` renders the v2 error page:
  - 404 follows `V2-404`: "DNF.", a search box to `/search`, shortcut links, and a results sheet whose last row is the missing page.
  - 503 ("The archive didn’t answer.") and other errors follow the error card of `V2-States`: a DQ disc, "Try again" (a full reload) and "Report problem" (the About contact form, on the Other topic).
- `handleError` logs unexpected errors with the request path.

- **Today is the visitor's date.** The server renders "today" in UTC, because it cannot know the visitor's time zone, and pages stay shareable in caches.
  - After hydration the root layout stores the browser's local date (`visitor-today.svelte.ts`).
  - The ticker, the home dateline and "On this day" block, the athletes hub's birthdays and the day page's "today" mark follow it.
  - When the local date differs from the server's, these blocks load that day from `/internal/on-this-day/[day]` once and swap it in.
  - Other dates (countdowns on the calendar, ages in hover cards) still use the server's date.

### 6.4 Caching

| Response                      | Cache-Control                                                   |
| ----------------------------- | --------------------------------------------------------------- |
| content pages                 | `public, max-age=0, s-maxage=300, stale-while-revalidate=86400` |
| `/internal/athlete-card/*`    | `public, max-age=3600, s-maxage=86400`                          |
| `/internal/search`, `/search` | `public, max-age=0, s-maxage=300`                               |
| sitemap files                 | `public, s-maxage=86400`                                        |
| hashed static assets          | `public, max-age=31536000, immutable`                           |

- **Layout data** (ticker and footer stats) is needed on every server render. It is memoised in process for 10 minutes by `lib/utils/memoize-with-ttl.ts`.
- **Content pages** stay at the edge for 5 minutes, so results entered in the CMS reach the site within minutes (changed from 1 hour on 2026-10-09).
- **Pages that show "today"** (home, ticker) keep `s-maxage` at 1 hour or less. That way, stale data never lasts more than an hour past midnight UTC.
- **Shared cache:** Railway's CDN is switched on at cutover with HTML caching that follows `Cache-Control`, stale-while-revalidate and a purge on every deploy (`railway cdn`). Until then the headers apply to browsers only.

### 6.5 Hosting

Railway was chosen because every uncached page has to read from the API in EU West, so rendering next to it wins:

- **Measured from Istanbul:**
  - Each API request costs 30–70 ms on the server.
  - On staging, the athlete page, with four backend calls in parallel, renders in about 50–130 ms.
- **Where else it could run:**
  - Cloudflare Workers would render at the visitor's edge and pay a public-internet round trip to Europe for every call.
  - With Smart Placement, Workers would land next to the API anyway, but without the private network.
- **Edge caching** comes from Railway's own CDN, so it needs no second platform.

Setup:

| Item            | Value                                                                                                                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Service         | `athleticspodium-web` in project `athletics-podium`, environment `production`                                                                                                            |
| Region          | `europe-west4-drams3a`, one replica. Set with `railway scale`; the first deploy ignored `multiRegionConfig` in `railway.json`                                                            |
| Build and start | Railpack, `npm run build`, `npm start` (`node build`); health check `/robots.txt`                                                                                                        |
| Domains         | `athleticspodium-web-production.up.railway.app`, `next.athleticspodium.com` (DNS only)                                                                                                   |
| Variables       | `BACKEND_URL=http://${{athleticspodium-backend.RAILWAY_PRIVATE_DOMAIN}}:8080/1.0`, `PROTOCOL_HEADER=x-forwarded-proto`, `PUBLIC_SITE_URL`, `PUBLIC_SITE_ENV`, `PUBLIC_GA_MEASUREMENT_ID` |

Rules that still hold:

- Use web-standard APIs where they exist, so the code stays portable.
- Declare configuration in `src/env.ts` and read it from `$app/env/private` and `$app/env/public`.
- The service is declared in `.railway/railway.ts` (moved from `railway.json` on 2026-10-07). An IaC file describes a whole project and deletes what it omits, so it is a named partial that owns only `athleticspodium-web`; the backend and Postgres stay outside it.

## 7. Design system

### 7.1 Tokens

| Token                        | Value                             | Use                              |
| ---------------------------- | --------------------------------- | -------------------------------- |
| `bg`                         | `#F5F4F0`                         | page background                  |
| `surface`                    | `#FFFFFF`                         | cards, panels                    |
| `surface-2`                  | `#EEECE6`                         | inputs, chips, neutral discs     |
| `surface-3`                  | `#E4E1D9`                         | pressed states                   |
| `ink`                        | `#121316`                         | primary text, ticker bar, footer |
| `ink-2`                      | `#474A52`                         | secondary text                   |
| `ink-3`                      | `#666A73`                         | captions                         |
| `line`                       | `#E3E0D8`                         | borders                          |
| `line-2`                     | `#D2CEC4`                         | strong borders                   |
| `brand`                      | `#F9BA0F`                         | Podium Gold, primary actions     |
| `brand-ink`                  | `#7A4F00`                         | links, accents on light surfaces |
| `brand-soft`                 | `#FDF1CC`                         | highlights                       |
| `info` / `info-soft`         | `#2F5BD3` / `#E9EEFB`             | informational chips              |
| `up`                         | `#15724A`                         | "live", countdowns               |
| `gold` / `silver` / `bronze` | `#F9BA0F` / `#BFC6CF` / `#C9844F` | medal discs                      |
| `dq`                         | `#D7262E`                         | disqualified results             |

- **Fonts:**
  - Saira Condensed 500–800 for display
  - IBM Plex Sans 400–700 for text
  - Barlow Semi Condensed 400–700 with tabular numerals for data
- **Layout:**
  - Container: max width 1344 px.
  - Side padding: 32 px, or 16 px at 640 px and below.
  - Breakpoints: 640, 900 and 1100 px.
  - The header collapses to search and menu buttons at 900 px.

### 7.2 Building blocks

- **Medal disc.** Places 1–3 use the medal colours. Places 4–8 use a neutral disc (`surface-2` with `ink-2`).
- **DQ.** A cancelled result shows a red DQ disc, and its mark is struck through in `dq`. The original mark stays readable. The disc itself is not struck through, since a line across a disc that small hides the letters.
- **Record badge.** `WR` uses `ink` with `brand` text. Area and championship records (`AR`, `ER`, `CR`, …) use `brand-soft` with `brand-ink`. `NR` and any unknown text use an outlined badge. Records are free text in the database, so the mapping matches known prefixes and shows unknown values unchanged.
- **Athlete hover card.** The compact variant, 256 px wide:
  - photo or initials
  - name
  - country code and events
  - OG badge
  - birth date and age
  - an optional result line from the host page
  - international gold/silver/bronze
  - "Profile →" link

  It opens on hover or keyboard focus after 100 ms and closes on leave, blur or Escape. It opens below the name, lined up with its left edge, or with its right edge when the card would otherwise run past the viewport.

- **Icons.** Inline stroke SVG components in `components/ui/icons/`.
- **Accessibility.**
  - Interactive elements are real `<a>` and `<button>` elements.
  - Focus is visible.
  - Text contrast is at least 4.5:1.
  - Icon-only buttons have an `aria-label`.

## 8. Data rules

These live in `lib/domain` and match the backend:

- **Medal or placing.** `medal` values 1–3 and null are medal rows. Values 4–8 are placings. Placings are shown but never counted.
- **International medal count.**
  - Medal rows that are not cancelled, in championships whose `category` is not 7 (national).
  - Relay medals count once for each team member.
  - This one definition is used for athletes everywhere: profile, hover card, search, featured athletes, country lists.
- **National titles.** Gold medals in championships of category 7. They are shown separately and never added to the international count.
- **Championship categories:**

  | Value | Category    |
  | ----- | ----------- |
  | 0     | Global      |
  | 1–5   | Continental |
  | 6     | Regional    |
  | 7     | National    |
  | 8     | Road        |

- **OG badge** (Olympic champion) comes from `athlete.olympic_mark`. **"Olympian"** (took part in the Olympics) comes from `olympian_athlete`, via B16.
- **Today** is the UTC date. Ages and countdowns are computed from it.
- **Events.** Long names and disciplines come from `lib/domain/event.ts`, a map of all 168 events in the database. A unit test fails when that list changes without the map.

## 9. Pages

For each page: what it shows, where the data comes from, and the backend prerequisites (B-numbers, section 10).

### Header (ticker)

- **Up next:** The first meeting from `upcoming-meetings` that is running or still to come, with a countdown (B6).
- **Born today:** the most decorated living athlete born today (from `/athletes/on-this-day`), then "+N more". It links to today's day page.
- **Search field:** Opens the quick search. `/` and `⌘K` also open it.
- **Links:**
  - The yellow "Medal search" button goes to `/medals` (it read "Medal Tracker" until 2026-10-08; one name per page).
  - Nav: Championships, Athletes, Countries, Calendar, Tools, Articles.
    - Each item reserves the width of its bold label, so the current item turning bold moves nothing.
    - The current item's brand underline grows from the centre (200 ms); hovering draws a thin grey one. Tools is current on every `/medals` page.
    - The Tools menu (`TOOLS` in `lib/domain/tools.ts`, shared with the Tools hero) is a popover listing each tool with its one-line description.
      - It opens on mouse hover and closes 150 ms after the pointer leaves the button and the panel.
      - Touch and keyboard open it by click or Enter.
      - It fades in and slides down, and stays inside the viewport.
  - Social links: Bluesky, Facebook, Instagram, and About.

### Footer (ink)

- **Totals from `/stats`** (B14): medals, placings, athletes, championships and the last addition. Medals and placings are shown separately.
- **Link columns** follow the design. The Tools column lists only existing tools.

### Quick search overlay

- **Launcher**, before the user types:
  - recent searches from `localStorage`
  - jump links: Medal search, the current year's calendar, the next upcoming meeting
  - featured athletes
- **Results**, from 2 characters with a 150 ms debounce: `/internal/search` proxies the backend search (B12). Results are grouped by type, with the match highlighted and the first row preselected.
- **Keys:** ↑ ↓ move, ↵ opens, ⇧↵ opens `/search`, Esc closes.

### Home (`/`)

| Block                                                    | Data                                                 | Prerequisite           |
| -------------------------------------------------------- | ---------------------------------------------------- | ---------------------- |
| Dateline totals, season meeting count                    | `/stats`                                             | B14                    |
| Lead story                                               | `/featured-articles`                                 | —                      |
| Latest 5                                                 | `/articles`                                          | —                      |
| Context tag on stories                                   | related meeting or championship name                 | B10; no tag without it |
| Results desk (4)                                         | `last-meetings` summary                              | B15                    |
| Next six months timeline                                 | `upcoming-meetings?days=183`                         | B6                     |
| Guides                                                   | `lib/domain/guides.ts`                               | —                      |
| On this day counts, Born today (7), Remembered today (6) | `/athletes/on-this-day`                              | backend PR #15         |
| Portraits                                                | `/featured-athletes`, with an excerpt of `biography` | B8                     |

- **Results desk rule.** Road races (category 8) show the winners. Other meetings show the top three nations. Meetings are the most recently ended ones that have results.
- **Lead and latest:** the first featured article leads (the newest article when none is featured); the latest five follow without it.
- **On this day:** the first 7 born and 6 remembered from `/athletes/on-this-day`, which ranks by international medals. The date and the "All N →" links go to the day page.
- **Guides:**
  - The cards replace the legacy Paris 2024 and World Marathon Majors banners. Each links to its article and uses the article's cover image.
  - Copy and figures are kept by hand in `lib/domain/guides.ts`. Update them when the article changes, for example the World Marathon Majors race count after each race.
- **Headings:** a visually hidden `h1` names the site; the lead title is an `h2`.
- **JSON-LD:** `WebSite` with a `SearchAction` to `/search?q=` and `Organization` with the logo and the social profiles.
- **Dropped:** the article kicker ("Analysis").

### Championships (`/champs`)

- **Data:** `/champs?fields=years` with `name`, `slug`, `category` and `years`. The list does not return `rank`, but it is sorted by it, so the position is the rank.
- **Category tabs:** links to `/champs?category=<slug>` (`global`, `africa`, `asia`, `europe`, `americas`, `oceania`, `multi-region`, `national`, `road`). The server renders the chosen tab, and in the browser a tab switch runs no new load because only the page reads the parameter. The canonical URL stays `/champs`.
- **Client-side features:** the name filter (case and accents ignored; the tab badges count the matches) and the sorts (importance, A–Z, oldest first, most editions).
- **Status pill:**
  - "Next" when a year after the current one exists.
  - "Held" for this year or last year; an edition later in the current year counts as held.
  - "Last held" for older years, "No editions yet" without years.
- **Timeline:** one dot per edition year on a shared scale from the oldest to the newest edition, rounded out to five years.
- **Link:** "Send missing information" goes to `/missing-information`.

### Championship (`/champs/[champ]`)

| Block                       | Data                                    | Prerequisite                                   |
| --------------------------- | --------------------------------------- | ---------------------------------------------- |
| Hero, facts, editions strip | `/champs/:slug` with meetings           | B4 for host country, dates, events per edition |
| All-time medal table        | `/champs/:slug/counts`                  | B7                                             |
| Most golds                  | `/champs/:id/top-athletes`              | B13                                            |
| Programme                   | `events_men/women/mixed` with `/events` | `lib/domain/event.ts` for long names           |
| History                     | `content`                               | —                                              |
| Stories                     | `/articles?champ=`                      | —                                              |

- **Hero photo:** `media/champs/<slug>.jpg`. The `image` column is never filled, and 23 of 212 championships have no file, so the server checks the file with a `HEAD` request and renders the hero without a photo when it is missing. The photo is also the Open Graph image.
- **Facts:** an edition counts as held from its start date, or from its year when it has no dates. Two meetings in one year (Europeans 1938, men and women) count as one edition. The fourth figure is the next edition, or the latest one when none is scheduled.
- **Editions strip:** newest first; the latest held edition is highlighted and upcoming ones are dashed.
- **Event catalogue:** `/events` (names and ranks) is cached in memory for an hour. It orders the programme and each athlete's events.
- **Links:** programme events and "Every medal in the tracker" go to `/medals` with `champ`, `event` and `gender`; "Compare" goes to `/medals/compare`.
- **Dropped:** the frequency label ("every two years"), the "historic" nation badge, the area crumb in the breadcrumb and the "All N articles" link.

### Edition (`/champs/[champ]/[meeting]`)

| Block                                          | Data                                         | Prerequisite |
| ---------------------------------------------- | -------------------------------------------- | ------------ |
| Header, host, dates                            | `/meetings/:slug`                            | —            |
| Edition switcher                               | champ meetings from `/champs/:slug`          | —            |
| Stats (events, medals, nations, world records) | derived from medals; relay rows deduplicated | —            |
| Men / Women / Mixed tabs, event cards, rows    | `/meetings/:slug/medals`                     | B7           |
| Discipline chips, long event names             | `lib/domain/event.ts`                        | —            |
| Medal table                                    | `/meetings/:slug/counts`                     | B7           |
| Records set                                    | medal rows with `records`, NR left out       | —            |
| About this edition                             | meeting `content` and meeting notes          | —            |
| Stories                                        | `/articles?meeting=`                         | —            |
| Hover cards                                    | `/internal/athlete-card/[id]`                | B11          |

- **Rows:**
  - Each row shows its own wind next to the mark.
  - `medal.notes` and `info` appear as footnote markers.
  - Cancelled results use the DQ style.
  - A relay team is one row: the country, then every runner below it, wrapping onto more lines as needed. Runners with a profile link to it with the hover card; the others are plain text.
- **"Show places 4–8"** toggles placings.
- **Hero image:** Meetings have no image yet, so the hero runs full width without one.

### Athletes (`/athlete`)

- **Total athletes:** the `athletes` figure of `/stats` (B14), already loaded by the layout.
- **Hero search:** a `GET /search?type=athletes&q=` form, so it works without JavaScript; the quick search suggestions are added with the search work (B12).
- **Featured cards:** from `/featured-athletes` (B8).
- **Born today:** the first six from `/athletes/on-this-day`, with "All N born on …" linking to the day page. `†` and life years mark deceased athletes (B9).
- **Greatest by nation:**
  - Top 5 per nation, from `/countries/:code/athletes?limit=5&international=1` (B3).
  - The nation chips come from a fixed list in `lib/domain/featured-nations.ts`.
- **"Browse A–Z"** links to `/athlete/letter/a`.
- **Dropped:** "Athletics families".

### Athletes A–Z (`/athlete/letter/[letter]?page=n`)

- **Data:** `/athletes/first-letter/:letter/:page` (surname initial, 100 per page, with the total count).
- **Display:** A v2 table (surname first, country, birth or life years, OG badge) with letter tabs. The tabs and the pagination are plain `<a href>` links, so crawlers can follow them.
- **Canonical:** It includes `page` when page > 1. Capital letters and `?page=1` redirect (301) to the canonical address; a page past the last one answers 404.

### Athlete (`/athlete/[id]/[slug]`)

| Block                                                                    | Data                                            | Prerequisite |
| ------------------------------------------------------------------------ | ----------------------------------------------- | ------------ |
| Identity, photos with caption and credit, aka, birth details, biography  | `/athletes/:id`                                 | —            |
| Podium counts, "on the podium" span, by-championship totals, level chips | derived from `/athletes/:id/medals` (section 8) | —            |
| Olympian line, Olympic cards                                             | `/athletes/:id/olympians` with medal rows       | B1 for city  |
| Results table with Venue column                                          | `/athletes/:id/medals`                          | B1           |
| National championships tally and national results list                   | the same, category 7                            | B1           |
| Family                                                                   | `/athletes/:id/relateds`                        | —            |
| Stories                                                                  | `/articles?athlete=`                            | —            |

- **Results table:**
  - It keeps the event column, wind, notes and DQ.
  - The Medals table lists places 1–3 (and rows without a place) with the level chips. Places 4–8 follow in "Other achievements", with the same columns and no chips. Both tables show the Event column when the international results span more than one event.
  - "All N results" in the hero goes to the start of these sections (`#results`).
- **Mark notes:** `medal.info` is shown after the mark; `(i)` renders as the indoor "i".
- **Photos:**
  - The hero shows the first photo, with any other photos as thumbnails below it (62 athletes have two or three).
  - A click on a photo opens it uncropped in a full-screen `<dialog>`, with caption, credit, arrows, keyboard and swipe; the originals are at most about 800 px wide.
  - Without JavaScript, each photo links to its file.
- **Layout:**
  - The "By championship" band shows the international tally beside a "National championships" tally.
  - The Medals table follows. The national results list comes last, so national titles never push the international medals down.
  - The national list shows the event when the athlete has more than one.
- **Dropped:** the age-group chip and the "Heights on the podium" chart (decided 2026-10-07).

### On this day (`/on-this-day/[day]?born=n&died=n`)

- **Address:** the day is a month name and a number (`/on-this-day/october-7`); all 366 days exist, 29 February included.
  - `/on-this-day` opens the visitor's own date in the browser (a `noindex` page with a link to the server's date as a fallback). With `?month=&day=` from the day picker it answers 302 to that day (a day past the month's end becomes its last day).
  - Other spellings (`October-07`) and `?born=1` or `?died=1` answer 301; a day that does not exist, or a page past a list's last, answers 404. The canonical URL is the day without parameters.
- **Data:** `GET /athletes/on-this-day?kind=born|died&date=MM-DD&limit=100&offset=` (backend PR #15). It ranks by international medals with the summaries' rule (no national championships, placings or withdrawn medals) and returns the total.
- **Display:** one band holds the breadcrumb and the hero: the date, the counts, the previous and next day, "Today" and a day/month picker. Below, "Born on …" and "Died on …" stand side by side (stacked on phones), 25 compact rows each, and each list pages on its own (`born`, `died`). A row has the rank, flag, name with the hover card, OG, life years with the age (this year, or at death) and the medal tally.
- **Links in:** the home page's date and "All N →" links, the ticker's "Born today", and the athletes hub's "All N born on …".
- **Sitemap:** the site adds `/sitemaps/days-1.xml` with the 366 day pages to the index itself.

### Countries (`/country`)

- **Data:**
  - `/countries?fields=code,name,categories,is_country&order=name`.
  - Olympic medal totals from the Olympic Games counts (`/champs/:slug/counts`, B7).
- **Client-side features:** letter groups, search (name without accents, or the exact IOC code, across all areas) and the sort (A–Z or most Olympic medals).
- **Area tabs:** links to `/country?area=<slug>` (`europe`, `africa`, `asia`, `americas`, `oceania`; none for all), handled like the championship tabs. A country page's area crumb links to its tab.
- **"Teams & neutral entries"** lists countries with `is_country = false`, each linking to its page.
- **Dropped:** the "Former nations" group.

### Country (`/country/[code]`)

| Block                                             | Data                                                         | Prerequisite |
| ------------------------------------------------- | ------------------------------------------------------------ | ------------ |
| Header, area, about                               | `/countries/:code` (`content` shown as is)                   | —            |
| Totals, by-level bars, grouped championship table | `/countries/:code/medals`                                    | B2           |
| Most decorated (12), All / Men / Women            | `/countries/:code/athletes?limit=12&international=1&gender=` | B3, B21      |
| Hosted meetings                                   | `/meetings?country=:code`                                    | B5           |
| Stories                                           | `/articles?country=`                                         | —            |

- **Link:** "All athletes" goes to `/country/[code]/athletes`.
- **Most decorated:** the line under each name gives the gender and the first two medal events (B21).
- **Medal table rows** link to `/medals/countdown?country=<code>&champ=<id>`. The level bars and tabs filter the table; national titles are the golds in national championships.
- **Hosted meetings:** the 8 latest international meetings (`international=1`), with a countdown for coming ones and "Results" when `has_results` is true.
- **About:** `content` is collapsible under the hero.
- **Dropped:** the structured facts strip.

### Country athletes (`/country/[code]/athletes`)

- **Data:** the country's whole list from `/countries/:code/athletes?international=1` (B3, B21), with each athlete's medal events in catalogue order. The server keeps the profile and the list for 10 minutes, for up to 30 countries, and filters, sorts and pages them there. A page sends 25 rows.
- **Hero:** the flag, "<code> · every international medallist", "<Country>’s athletes", and the counts of medallists, men and women.
- **Toolbar:** sticky from 640 px.
  - **Filter by name or event:** every word must start a word of the name, an event's short or long name, or its discipline. Folding ignores case and accents and also turns ı, ø, ł and đ into i, o, l and d. The URL follows after a 250 ms pause and replaces the history entry.
  - **All / Men / Women.**
  - **Medal years:** Any era, Before 1960, 1960–79, 1980–99, 2000+. An athlete appears in every era that their first-to-last medal span touches.
  - **Sort:** Most golds (default: gold, silver, bronze), Most medals, Youngest first (unknown birth dates last), A–Z by surname.
- **Rows:** the rank in the current order, the photo or initials, the name with the hover card, the gender and the medal years, the birth date, the medal events, gold/silver/bronze, and the total with a bar scaled to the square root of the country's highest total. Phones keep the rank, the athlete, the medals and the total.
- **URLs:** `q`, `gender` (`men`, `women`), `era` (`before-1960`, `1960-1979`, `1980-1999`, `since-2000`), `sort` (`medals`, `youngest`, `name`) and `page`. Defaults are left out. A request whose known parameters are not in that form (empty, invalid, the default, or another order) redirects (301) to it; other parameters are left alone. A page past the last answers 404. Filtered or re-sorted states are `noindex`.
- **Without JavaScript:** the search and the sort submit a GET form, which the redirect then cleans up; the gender and era options are links.
- **Pagination:** numbered links (first, last and the pages around the current one) that land on the list (`#athletes`), with "Showing 1–25 of N".
- **Footnote:** only international medals count; national titles are left out.

### Calendar (`/calendar`, `/calendar/[year]`)

| Block                                   | Data                                         | Prerequisite |
| --------------------------------------- | -------------------------------------------- | ------------ |
| Year grid, month strip, rows, TBA group | `/meetings?year=` (lean, with `has_results`) | B5, B9       |
| Up next card                            | `upcoming-meetings`                          | B6           |

- **Client-side features:** the level chips, the national toggle (off by default) and the TODAY marker (UTC). The month strip, the counts and the list follow the filters.
- **"Results →"** appears when `has_results` is true; ended meetings without results say "No results yet".
- **URLs:** `/calendar` redirects (302) to the current season. Seasons from 1860 to five years ahead exist; other years answer 404. Previous and next seasons are plain links.
- **Up next:** the next three meetings within a year (B6), with a countdown.
- **Dropped:** the `.ics` and Google Calendar buttons.

### Search (`/search`)

- **Data:** `GET /search/v2` (B12, B16). The legacy `/search` stays for the old frontend. Every request also asks for the overview (6 per type) so the scope tabs always show counts.
- **URL parameters:** `q`, `type` (`athletes`, `champs`, `countries`, `articles`), `gender` (`men`, `women`), `born_from`, `born_to`, `olympian`, `page` (20 per page, single types only). Every filter, tab and page is a plain link, so the page works without JavaScript.
- **Display:**
  - Scope tabs with counts.
  - Athlete rows with photo, Olympian label and international gold/silver/bronze.
  - Championship, country and story results.
- **Top result:** Shown only for an exact match: an IOC code, a full championship name or a full athlete name.
- **Indexing:** `noindex, follow`.
- **Quick search:** `/internal/search?q=` returns up to 5 athletes and 3 championships and countries plus the total. `QuickSearchBox` serves the header overlay and the athletes hero: suggestions after 2 characters (150 ms debounce), the match highlighted without regard to case or accents, ↑↓ to move, ↵ to open, ⇧↵ for all results. Recent searches stay in `localStorage`.

### Articles, medal search, medals by country and championship, compare, static pages

These are built with the v2 components on the existing endpoints:

- `/articles`, `/articles/:id`
- `/medals`
- `/medals/country-champs`
- compare: `/champs`, `/events`, and `/medals` filtered by championship, event and gender
- `/pages/:slug?section=`

Notes:

- **Articles:** `/article?page=n` lists 12 per page (the legacy page kept the page in memory). `/article/[id]/[slug]` shows the standfirst (`spot`), the photo with caption and credit, the content, the related championships, editions, athletes and countries, and three more stories, with `Article` JSON-LD. A wrong slug redirects (301); a missing id is a 404 (the backend now answers `data: null` instead of a 500).
- **Tools hero:** Medal search, Medal countdown and Compare share the `V2-Tools` hero: "Ask the archive" (the page `h1`), the medal total from `/stats` and the three tools as tabs. Each page's subject is an `h2` in the white band below.
- **No share link:** the design shows each tool's address under its sentence and a "Copy link" button. The site leaves both out, because the address in the browser already is the link to share.
- **Picker** (`lib/components/ui/Picker.svelte`, lists in `lib/domain/pick-list.ts`) is the box in the Tools sentences:
  - **Before hydration and without JavaScript:** the box is a styled label over a native `<select>`, so the GET form still works.
  - **After hydration:** it becomes a button that opens a popover.
    - Desktop: the panel sits under the box (or above it when there is no room), 360 px wide, and follows scrolling.
    - Under `sm`: a full-width sheet pinned to the top of the screen, with a dimmed backdrop, a title and a close button; the visual viewport sets its height, so the keyboard does not hide the search.
  - **Search:** the field appears when a list has more than 12 options. Each word of the query must start a word of the option or of its keywords, ignoring case and accents. "ger" finds Germany but not Algeria; country codes (TUR) and event short names (HJ, 10000 for 10,000m) work too. The first word is highlighted.
  - **Lists:**
    - nations A–Z with flag and code;
    - championships grouped by area (`CATEGORY_GROUPS`) with their span of years;
    - events grouped by discipline;
    - years newest first.
    - "Any …" options come first when the medal search allows them.
  - **Keyboard and screen readers:** the search field is a combobox over a listbox with groups (`aria-activedescendant`). ↑↓, PageUp/PageDown and Enter choose; Escape closes and focus returns to the box; typing on a focused box opens it with that letter.
  - **Compare's event box:** Men / Women / Mixed tabs over the events of that gender; the native fallback keeps the optgroups by gender.

- **Medal search** (`/medals`):
  - Parameters: `champ`, `country`, `event`, `year`, `gender` (`men`, `women`, `mixed`), `medal` (`gold`, `silver`, `bronze`) and `page` (100 per page). A championship or a country is required. The legacy names and numeric values redirect (section 5).
  - The question is a sentence ("Show medals won by … at the … in … · …"). Each box is a `Picker` (see "Picker" below). A change navigates at once and drops an event or year the new championship does not have.
  - Medal tabs (with counts) and gender tabs are links. With a medal filter, a second request without it gives the tab counts.
  - Results are grouped by edition (`groupByEdition`): relay legs join into one row, and each edition shows its own gold, silver, bronze and DQ count for the rows on the page.
  - Side column: the totals from `counts` (withdrawn medals apart, relays once; backend PR #14), a link to the medal countdown when both a nation and a championship are chosen, and "Try another question" (`MEDAL_QUESTIONS`).
  - The filter lists (championships, countries, events) are cached for an hour.
- **Medal countdown** (`/medals/countdown?country=&champ=`, design `V2-Countdown` below the shared Tools hero):
  - The question is a sentence: "Count [nation]’s medals at every [championship]". The boxes are pickers, as in the medal search. Road races and national championships are left out. "Also try" offers fixed examples (`COUNTDOWN_PRESETS`).
  - Data:
    - per-edition tallies from `/medals/country-champs`, which leaves out withdrawn medals;
    - every edition from `/champs/:slug`, so editions without a medal and the next edition appear;
    - the medal table from `/champs/:slug/counts`;
    - the withdrawn medals from `/medals?is_canceled=1`;
    - the first page of `/medals` for the year of the first medal and of the first gold.
  - A team medal is one entry. The `is_team` flag is unreliable both ways: some individual medals carry it, and some relay medals without runners lack it. So an entry is called "Team" when it has more than one row, or when it has no name and is a team or relay event.
  - The summary is the all-time haul (withdrawn medals noted, relays once) and five cards: on the podium (editions with a medal of those held, and the current unbroken run), first medal, first gold, best edition and the place in the all-time table.
  - "Every edition" is a strip with one column per edition and the next edition dashed. Up to 12 medals in the best edition it shows one dot per medal; above that, proportional gold, silver and bronze bars. A column links to its row in the table and opens it.
  - "Edition by edition" lists every edition held, newest first: its number, the medals, G, S, B and total. It can be limited to editions with medals, and ends in a total row. An arrow opens a drawer filled from `/internal/medals/[champ]/[country]/[year]` (cached like the hover card). The drawer lays itself out by its own width (container queries); if it cannot load, it links to the medal search for that year.
  - Side column:
    - the all-time medal table around the nation (nine rows, ranked by golds with ties sharing a place, each row a countdown of its own);
    - the withdrawn medals, each athlete a profile link with the hover card; a team entry lists its runners below its line;
    - the next edition.
- **Compare** (`/medals/compare?a=&b=&gender=&event=`, design `V2-Compare` below the shared Tools hero):
  - The legacy page kept its state in memory; the new one reads it from the URL, so comparisons can be linked (the championship page links to `?a=<id>`).
  - The question is a sentence: "Compare [A] ⇄ [B] in [Women’s 100m]". A is brand yellow, B is ink. The swap button is a link. The race menu groups the events by gender and lists only those both championships have held. Without JavaScript the boxes submit a GET form; the race menu sends `race=women-10`, which redirects (302) to `gender` and `event`. With JavaScript a change navigates at once and drops a race the new pair has not held.
  - The server loads every medal of the event for both championships (up to 10 pages of 100). Relay teams count once.
  - Four cards set A against B:
    - Editions with medals, and the first year.
    - The best winning mark: fastest time for races, best mark for jumps and throws, highest score for combined events. A wind over +2.0 is noted.
    - Most titles: ties of more than three show only how many share it.
    - Winning nations.
  - "Won both" lists the athletes (or, in relays, the nations) with gold at both, most golds first. A chip traces them: their medals and their years are highlighted in brand colours. Names in the timeline stay profile links with the hover card.
  - The timeline: A on the left (mirrored), the year in the middle, B on the right, newest first, with a sticky header. Every medal is shown, gold larger, records as badges, withdrawn medals struck through in red. An empty side says "no edition" or, when the championship was held that year, "not held". Notes on hand timing and withdrawn medals appear only when they apply.
  - Without a full selection the page offers ready-made comparisons (`COMPARE_PRESETS`).
- Filters live in query strings.
- The contact form uses a SvelteKit form action that posts to `/contacts`. It works without JavaScript, validates name, email, topic and message (up to 1,000 characters) on the server, drops messages that fill a hidden honeypot field, and forwards the visitor's IP (`x-forwarded-for`) and user agent so the backend records them as before.
  - Topics are radio chips, and each one sets the message label and hint. They map to the backend `subject`: Missing info 3, Correction 4, Photo 5, Collaborate 6, Other 0 (general message). Subjects 4–6 are new; the CMS messages list names them (CMS PR #5). The legacy subjects 1 (technical error) and 2 (suggestion) are no longer offered.
  - `?topic=<key>#contact` opens the About form on a topic (`contactUrl`).
  - The Missing information page uses the same form with the subject fixed to 3 and no chips.
- **About** (design `V2-About`):
  - Static copy from the design, which condenses the old CMS sections `main` and `box`. The site no longer reads `/pages/about`.
  - Hero with the press-tribune photo, then a dark band of numbers: medals and nations from `/stats`, stories from the article count (cached for an hour), people credited from the static lists, and the opening date.
  - Story ("Why it exists", "What’s included"), six aims and the open-data note, with a sticky "On this page" list from 900 px. The list is the shared `OnThisPage` component, which the database notes page uses too.
  - Editor card (portrait, career lines; no personal-site link), the team (9) and the contributors (28, with flags), kept in `lib/domain/about.ts`.
  - "Help us fill the gaps": the four Missing information lists, the database notes link, social links and the contact form.
- **Missing information** (design `V2-Missing`):
  - The four CMS sections (`/pages/missing-information?section=`) stay the source and load together. `pages.missingInformation()` parses their HTML.
  - Parsing rules:
    - A bold-only line is a championship heading; headings starting with "Missing" are titles and are left out.
    - A line that starts with a year is a gap. A trailing `- G / S / B` or `(G)`, `(S)`, `(B)` becomes dashed medal discs.
    - A line ending in `Found (Thanks to …)` is a filled gap and is left out.
    - Other lines (legends, contact lines) are left out.
  - Tabs (with gap counts), the filter (`q`) and the prefilled message (`gap`) are read from the URL by the page, so switching them loads nothing. The filter is a GET form, so it works without JavaScript.
  - "I know this" opens the contact form at `#send` with the gap as the start of the message; the subject is fixed to "Missing information".
  - Later option from the design: generate the lists from the medals table (podium slots without an athlete, medals without a mark, relay teams without legs), so each row can link to its edition.
- **How to read the database** (`/how-to-read-the-database`, design `V2-Notes`):
  - Static copy, restructured from the CMS page `simple-notes`, which the site no longer reads.
  - It describes what the new site shows: the OG badge, notes in small type after the mark, and the Record and Notes columns.
  - The contents list is sticky from 900 px and marks the section in view.
- Form posts are never cached (`Cache-Control: no-store` for any method other than GET and HEAD).

## 10. Backend prerequisites

Each item is a normal backend PR. It ships before the page that needs it (release order: backend, then web). `athleticspodium-frontend` is legacy from 2026-10-06 and gets no further fixes; backend changes only need to keep it working.

| ID  | Change                                                                                                                                                                                                                                                                                                   | Needed by                           |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| B1  | `/athletes/:id/medals`: add `city` and `country_code` to the meeting include.                                                                                                                                                                                                                            | Athlete                             |
| B2  | `/countries/:code/medals`: add `category` to the champ include and grouping.                                                                                                                                                                                                                             | Country                             |
| B3  | `/countries/:code/athletes`: return `image`, `date_of_birth` and `events`; add `gender`, `international` and `offset` parameters.                                                                                                                                                                        | Country, Country athletes, Athletes |
| B4  | `/champs/:slug`: include meetings with `country_code`, `start_date`, `end_date` and an events count per edition.                                                                                                                                                                                         | Championship                        |
| B5  | `/meetings`: add a `country` filter, an `international` filter and a `has_results` flag; leave `content` out of the list.                                                                                                                                                                                | Country, Calendar                   |
| B6  | `/meetings/upcoming-meetings`: add `limit` and `days`; include running meetings (`end_date` ≥ today) when either is given; add `category` to the champ include.                                                                                                                                          | Header, Home, Calendar              |
| B7  | Accept slugs on `/meetings/:id/medals`, `/meetings/:id/counts` and `/champs/:id/counts`.                                                                                                                                                                                                                 | Edition, Championship, Countries    |
| B8  | `/featured-athletes`: add international medal counts.                                                                                                                                                                                                                                                    | Home, Athletes                      |
| B9  | Athlete, meeting and article lists accept column names in `fields`, which narrows each row to the default scope plus those columns. Association names in `fields` keep working as includes. Requests without column names still return full rows for the legacy clients; the web always passes `fields`. | all list pages                      |
| B10 | Article lists and featured articles return the related meeting or championship name, as `context` when `context=1` is passed.                                                                                                                                                                            | Home                                |
| B11 | Athlete summary: `GET /athletes/:id/summary` and `GET /athletes/summaries?ids=` return identity, first image, events, `olympic_mark`, birth and death dates, and international gold/silver/bronze.                                                                                                       | hover card, Search                  |
| B12 | Search rework (details below), as `GET /search/v2`.                                                                                                                                                                                                                                                      | Search, quick search                |
| B13 | `GET /champs/:id/top-athletes?limit=`: gold/silver/bronze, first and last year, and events per athlete within the championship.                                                                                                                                                                          | Championship                        |
| B14 | `GET /stats`: medal, placing, athlete, championship and season meeting counts, plus the last addition.                                                                                                                                                                                                   | Footer, Home                        |
| B15 | `/meetings/last-meetings?summary=1&limit=`: the top three nations or the winners per meeting.                                                                                                                                                                                                            | Home                                |
| B16 | `is_olympian` on search and athlete list results, from `olympian_athlete`.                                                                                                                                                                                                                               | Search                              |
| B17 | Sitemap feed: `GET /sitemap/:type?page=` for athletes, champs, meetings, countries and articles. Pages of 10,000 rows with the URL parts and `updated_date`.                                                                                                                                             | sitemap                             |
| B18 | Replaced on 2026-10-07 by `lib/domain/event.ts` in the web app. Only the new site uses long names and disciplines, and the backend has no migration tooling. Move the map into `event` columns if the CMS ever needs to edit it.                                                                         | —                                   |
| B19 | Error responses carry the matching HTTP status: 400, 401, 403, 404, 500. The `{success, error}` body and its codes stay. The CMS `api.service` reads the error body of non-2xx responses, so the 4010 logout keeps working.                                                                              | all pages, monitoring               |
| B20 | After cutover, detail lookups answer 404 instead of `success: true, data: null`. The legacy frontend only detects missing records through the null data, so this waits until it is retired.                                                                                                              | all detail pages                    |
| B21 | `/countries/:code/athletes`: add each athlete's medal `events` and their `first_year` and `last_year`, like B13. Backend PR #16.                                                                                                                                                                         | Country athletes, Country           |

B12 search rework:

- Rank results: exact name, then prefix, then contains, then international medals.
- Return the image and international gold/silver/bronze.
- Return `{rows, count}` per type, with `limit` and `offset`.
- Add the filters `type`, `gender`, `born_from`, `born_to` and `olympian`.
- Match `aka`.
- Match country names as typed. Today `home.controller.ts` replaces spaces with dashes, so "united states" finds nothing.
- Search article `content` and `related_athletes`.
- Lower the minimum query length to 2.

The CMS gets no changes in this project. Editing the new event columns in the CMS is follow-up work.

## 11. SEO

- **Titles** follow `<subject> – <page purpose> | Athletics Podium`. Examples:
  - `Armand Duplantis (SWE) – medals and results | Athletics Podium`
  - `2026 European Championships – medallists and results | Athletics Podium`

  Descriptions come from the page data. The templates live in `lib/seo/titles.ts`.

- **Canonical URLs** use the apex host, no trailing slash, the canonical slug and the `page` parameter when page > 1.
- **JSON-LD:**

  | Page       | Types                                                           |
  | ---------- | --------------------------------------------------------------- |
  | every page | `BreadcrumbList`                                                |
  | athlete    | `Person` (name, birth and death dates, nationality, image, URL) |
  | edition    | `SportsEvent` (dates, location, status); none without a date    |
  | article    | `Article`                                                       |
  | home       | `WebSite` and `Organization`                                    |

- **Open Graph** uses the page's own picture when there is one: the athlete photo, the championship hero or the article image. Every other page uses the social image of its section:
  - The images are 1200×630 PNGs in `static/og/`: `default`, `championships`, `athletes`, `countries`, `calendar`, `tools` and `articles`. They carry no figures that go out of date.
  - `npm run social-images` renders them with Playwright from `scripts/social-images.js`, using the site's fonts, colour tokens, logo and flags. Rerun it and commit the PNGs when the design or the copy changes.
  - Pages name their section with `fallbackImage` on `SeoHead`; `lib/seo/social-images.ts` holds the alt texts.
- **Sitemap:**
  - `/sitemap.xml` is an index of per-type files. Each file holds at most 50,000 URLs.
  - The files are built from the B17 feed, with `lastmod` from `updated_date`.
  - They are submitted in Search Console at cutover.
- **`robots.txt`** allows everything except `/search` and `/internal/`, and points to the sitemap.
- **Staging** sends `X-Robots-Tag: noindex, nofollow` on every response unless `PUBLIC_SITE_ENV=production`.
- **No `hreflang`**: the site has one language.

## 12. Testing

- **Unit (Vitest):** Every pure module has tests next to it: domain rules, formatters, backend parsers, URL builders, SEO builders and redirect resolution.
- **End-to-end (Playwright):**
  - Setup: The tests run against the built app. `BACKEND_URL` points to a stub server that serves JSON fixtures captured from the local backend.
  - Coverage, for every route type:
    - status codes and redirects
    - title, canonical and JSON-LD
    - key content in the server HTML
    - hover card and quick search behaviour
- **URL check:** `node scripts/check-urls.ts --base <origin> [--per-source N] [--concurrency N] <source>...` takes sitemap URLs (an index is followed) and text files of URLs or paths, rebases them on `--base`, and reports each status, redirect chain and time. `--per-source` samples each sitemap file; text files are checked in full. `scripts/legacy-urls.txt` holds one example of every legacy address shape. Every address must end in 200; the exit code is 1 otherwise.
- **CI (GitHub Actions on pull requests):**
  - lint and format
  - `svelte-check`
  - unit tests
  - end-to-end tests

## 13. Delivery phases

0. **Backend groundwork:**
   - B7, B9, B14 and B17, together with a fix that stops database error details from reaching clients. Done on 2026-10-06 in branch `feat/web-groundwork`.
   - B19, then the CMS fix and the backend change, in that order.
   - B20 follows in phase 5.
1. **Skeleton:**
   - SvelteKit, Tailwind tokens, fonts.
   - Layout: header, ticker, footer, quick search shell.
   - `lib/server/backend`.
   - Hooks: redirects, caching, locals.
   - The error page, sitemap, robots and the safety worker.
   - CI, plus the repo's `CLAUDE.md` and README.
   - Staging on Railway at `next.athleticspodium.com` (done on 2026-10-06).
2. **Pages, in order of SEO value.** Each page ships after the backend items it needs:
   1. Athlete (B1, B11), done on 2026-10-06
   2. Edition (B11), done on 2026-10-07
   3. Championship (B4, B13), done on 2026-10-07
   4. Championships, done on 2026-10-07
   5. Country (B2, B3, B5), done on 2026-10-07
   6. Country athletes, done on 2026-10-07
   7. Countries, done on 2026-10-07
   8. Athletes A–Z, done on 2026-10-07
   9. Athletes (B8), done on 2026-10-07
   10. Home (B6, B10, B15), done on 2026-10-07
   11. Calendar, done on 2026-10-07
   12. Search and quick search (B12, B16), done on 2026-10-07
   13. Articles, done on 2026-10-07
   14. Medal search, done on 2026-10-07
   15. Medals by country and championship, done on 2026-10-07
   16. Compare, done on 2026-10-07
   17. Static pages, done on 2026-10-07
3. **Pre-cutover QA** (first round on 2026-10-08, against staging):
   - **URL check:** a sample of 8 per sitemap file and the legacy shapes (136 addresses), plus all 48 sitemap addresses with characters outside `[A-Za-z0-9._-]`. Found 10 redirect loops: athlete and article slugs ending in `?`. The web now percent-encodes slug segments (commas stay). Backend PR #17 makes `Slugify` strict and adds `scripts/normalize-slugs.js`; it rewrote 33 broken athlete and article slugs in production on 2026-10-08 (run inside the backend service with `railway ssh`). The old forms answer with one 301 to the new slug. The full run waits for the cutover, against production. The Search Console export is no longer on disk; export it again then.
   - **Lighthouse** (11 page types):
     - Mobile performance 73–95; desktop 97–100.
     - SEO 69 only because staging is `noindex`.
     - Accessibility 93–100. Fixed: `ink-3` on `surface-2` was 4.45:1 (now 4.59:1 with `#666A73`); count badges went from 70 % to 85 % opacity; the labelled medal dots got `role="img"`.
     - Left as is: relay runner links are small inline targets.
   - **Rich Results:** the JSON-LD of each page type was checked against Google's fields. `SportsEvent` gained `eventStatus` and `eventAttendanceMode` and is left out when a meeting has no start date; article titles are trimmed. Single-item breadcrumbs on top-level pages are valid and stay. Google's Rich Results Test runs at cutover, because staging's `robots.txt` blocks it.
   - **Content:** 14 pages were compared with the old site: five athletes (including withdrawn medals and a 4th place), three editions, two championships, two countries, the 2026 calendar and an article. All figures match. Rule differences:
     - "national titles" on a country counts golds in any national championship (for example Kenyans at the British AAA);
     - the country athletes list counts international medals only.
4. **Cutover** (done on 2026-10-09, live at 13:19 Istanbul time):
   - Set `PUBLIC_SITE_ENV=production` and `PUBLIC_SITE_URL=https://athleticspodium.com` on the service.
   - Turn on Railway's CDN (HTML caching that follows `Cache-Control`, stale-while-revalidate, purge on deploy).
   - Add `athleticspodium.com` and `www.athleticspodium.com` as Railway custom domains, then point the DNS records to Railway, DNS only.
     - Add Railway's `_railway-verify` TXT records **before** the CNAMEs. On the day the CNAMEs went first, and the site answered with Railway's default certificate and a 404 for about 8 minutes, until the TXT records verified the domains.
     - `next.athleticspodium.com` was removed to stay within the plan's two custom domains per service.
   - Submit the sitemap.
   - Watch Search Console coverage and 404s for 4 weeks.
   - Keep the Firebase site deployable for rollback.
5. **Cleanup:**
   - Ship B20.
   - Archive `athleticspodium-frontend`.
   - Update the workspace `CLAUDE.md`, `dev.sh` and the VS Code workspace.

## 14. Risks

| Risk                                         | Mitigation                                                                                         |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| An IaC apply touches the backend or Postgres | `.railway/railway.ts` is a partial that owns only this service; review `railway config plan` first |
| Backend scope grows with page work           | Every page lists its B-items; a page without its B-item ships with the documented fallback         |
| Returning visitors keep the old Angular app  | `/ngsw.json` returns 404 and a safety worker is served                                             |
| Rankings dip after cutover                   | Same URLs, complete server HTML, sitemap, redirects; monitor for 4 weeks with rollback ready       |
| Free-text records render inconsistently      | Known prefixes are mapped; unknown text renders unchanged in an outlined badge                     |

## 15. Deferred

- Image optimisation.
- `.ics` calendar feed.
- Athletics families.
- Trending athletes.
- New editorial data:
  - meeting images
  - structured country facts
  - former-nation flag
  - championship frequency
  - indoor flag
  - age-group level
  - article type
  - photo focal point
- CMS fields for `event.long_name` and `event.discipline`.
