import { defineConfig } from '@playwright/test';

const STUB_BACKEND_PORT = 4499;
const PREVIEW_PORT = 4173;

export default defineConfig({
	testDir: 'tests/e2e',
	testMatch: '**/*.e2e.ts',
	use: { baseURL: `http://localhost:${PREVIEW_PORT}` },
	webServer: [
		{
			command: 'node tests/stub-backend.js',
			port: STUB_BACKEND_PORT,
			env: { STUB_BACKEND_PORT: String(STUB_BACKEND_PORT) }
		},
		{
			command: `npm run build && npm run preview -- --port ${PREVIEW_PORT} --strictPort`,
			port: PREVIEW_PORT,
			env: {
				BACKEND_URL: `http://localhost:${STUB_BACKEND_PORT}/1.0`,
				PUBLIC_SITE_URL: 'https://athleticspodium.com',
				PUBLIC_SITE_ENV: 'production'
			}
		}
	]
});
