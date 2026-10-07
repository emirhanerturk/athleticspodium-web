import { expect, test } from './fixtures.js';

test('renders the ticker, the navigation and the footer on the server', async ({ page }) => {
	const response = await page.goto('/');

	expect(response?.status()).toBe(200);
	expect(response?.headers()['x-robots-tag']).toBeUndefined();
	await expect(page).toHaveTitle('Athletics Podium');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://athleticspodium.com/'
	);
	await expect(page.getByRole('link', { name: /UP NEXT 2099 Youth Olympics/ })).toBeVisible();
	await expect(page.getByRole('navigation', { name: 'Main' })).toContainText('Championships');
	await expect(page.getByRole('contentinfo')).toContainText('395,929');
	await expect(page.getByRole('contentinfo')).toContainText('Last addition · 2026 Sydney Marathon');
});

test('serves the social images', async ({ request }) => {
	const response = await request.get('/og/default.png');

	expect(response.status()).toBe(200);
	expect(response.headers()['content-type']).toBe('image/png');
});

test('opens the quick search with the slash key and closes it with Escape', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });
	const search = page.getByRole('dialog', { name: 'Search' });

	await page.keyboard.press('/');
	await expect(search).toBeVisible();
	await expect(search.getByRole('combobox')).toBeFocused();

	await page.keyboard.press('Escape');
	await expect(search).toBeHidden();
});

test('answers unknown pages with a real 404', async ({ page }) => {
	const response = await page.goto('/no-such-page');

	expect(response?.status()).toBe(404);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
});

test('redirects legacy URL forms in one 301', async ({ request }) => {
	const lowerCase = await request.get('/country/tur', { maxRedirects: 0 });
	const matrix = await request.get('/medals/search;champs=;country=TUR', { maxRedirects: 0 });

	expect(lowerCase.status()).toBe(301);
	expect(lowerCase.headers().location).toMatch(/\/country\/TUR$/);
	expect(matrix.status()).toBe(301);
	expect(matrix.headers().location).toMatch(/\/medals\/search\?country=TUR$/);
});

test('publishes robots.txt and the sitemap in production', async ({ request }) => {
	const robots = await (await request.get('/robots.txt')).text();
	const index = await (await request.get('/sitemap.xml')).text();
	const countries = await (await request.get('/sitemaps/countries-1.xml')).text();

	expect(robots).toContain('Sitemap: https://athleticspodium.com/sitemap.xml');
	expect(index).toContain('<loc>https://athleticspodium.com/sitemaps/athletes-1.xml</loc>');
	expect(countries).toContain('<loc>https://athleticspodium.com/country/TUR/athletes</loc>');
});
