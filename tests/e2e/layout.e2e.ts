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

test('keeps the main menu in place when the current item turns bold', async ({ page }) => {
	await page.goto('/champs', { waitUntil: 'networkidle' });
	const nav = page.getByRole('navigation', { name: 'Main' });
	const articlesLeft = () =>
		nav
			.getByRole('link', { name: 'Articles' })
			.evaluate((link) => link.getBoundingClientRect().left);
	const before = await articlesLeft();

	await nav.getByRole('link', { name: 'Calendar' }).click();

	await expect(nav.getByRole('link', { name: 'Calendar' })).toHaveAttribute('aria-current', 'page');
	expect(await articlesLeft()).toBe(before);
});

test('opens the tools menu on hover and marks the tools as current', async ({ page }) => {
	await page.goto('/medals', { waitUntil: 'networkidle' });
	const tools = page
		.getByRole('navigation', { name: 'Main' })
		.getByRole('button', { name: 'Tools' });
	const menu = page.getByRole('navigation', { name: 'Tools menu' });

	await expect(tools).toHaveClass(/font-bold/);
	await tools.hover();

	await expect(menu).toBeVisible();
	await expect(menu.getByRole('link', { name: /^Medal search/ })).toHaveAttribute(
		'aria-current',
		'page'
	);

	await page.mouse.move(5, 600);
	await expect(menu).toBeHidden();
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
	await expect(page).toHaveTitle('Page not found | Athletics Podium');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(/DNF\.\s+Page not found/);
	await expect(page.getByText('Did not reach the finish line')).toBeVisible();

	await page.getByRole('searchbox', { name: 'Search' }).fill('bolt');
	await page.getByRole('button', { name: 'Search', exact: true }).click();
	await expect(page).toHaveURL(/\/search\?q=bolt$/);
});

test('redirects legacy URL forms in one 301', async ({ request }) => {
	const lowerCase = await request.get('/country/tur', { maxRedirects: 0 });
	const matrix = await request.get('/medals/search;champs=;country=TUR', { maxRedirects: 0 });

	expect(lowerCase.status()).toBe(301);
	expect(lowerCase.headers().location).toMatch(/\/country\/TUR$/);
	expect(matrix.status()).toBe(301);
	expect(matrix.headers().location).toMatch(/\/medals\?country=TUR$/);
});

test('publishes robots.txt and the sitemap in production', async ({ request }) => {
	const robots = await (await request.get('/robots.txt')).text();
	const index = await (await request.get('/sitemap.xml')).text();
	const countries = await (await request.get('/sitemaps/countries-1.xml')).text();

	expect(robots).toContain('Sitemap: https://athleticspodium.com/sitemap.xml');
	expect(index).toContain('<loc>https://athleticspodium.com/sitemaps/athletes-1.xml</loc>');
	expect(countries).toContain('<loc>https://athleticspodium.com/country/TUR/athletes</loc>');
});
