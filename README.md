# Athletics Podium

The public website of [athleticspodium.com](https://athleticspodium.com): every international athletics medal and medallist since 1873.

Built with SvelteKit 3, Svelte 5 and Tailwind CSS 4. Pages are rendered on the server from the [athleticspodium-backend](https://github.com/emirhanerturk/athleticspodium-backend) API.

## Development

```bash
cp .env.example .env
npm install
npm run dev        # http://localhost:4400
```

`.env.example` points `BACKEND_URL` at the production API, which only receives GET requests from this app. To use a local backend, set `BACKEND_URL=http://localhost:3001/1.0`.

## Scripts

| Script                              | What it does                                                             |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `npm run dev`                       | Dev server on port 4400                                                  |
| `npm run build` / `npm run preview` | Production build and a local preview of it                               |
| `npm run check`                     | Svelte and TypeScript checks                                             |
| `npm run lint` / `npm run format`   | Prettier and ESLint                                                      |
| `npm run test:unit`                 | Vitest, watching                                                         |
| `npm run test:e2e`                  | Playwright against a build that talks to the fixture backend in `tests/` |

## Documentation

The design and its decisions are in [`docs/superpowers/specs/2026-10-06-web-rewrite-design.md`](docs/superpowers/specs/2026-10-06-web-rewrite-design.md).
