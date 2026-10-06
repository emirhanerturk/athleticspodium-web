import { expect, test } from './fixtures.js';

test('asks for a championship or country before searching medals', async ({ page }) => {
	const response = await page.goto('/medals/search');

	expect(response?.status()).toBe(200);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Medal search');
	await expect(page.getByText('Pick a championship or a country to see its medals.')).toBeVisible();
});

test('lists medals with sortable columns and a link to the editions view', async ({ page }) => {
	await page.goto('/medals/search?champs=18&country=TUR');

	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		'European Championships · Turkey'
	);
	await expect(page.locator('tbody tr')).toHaveCount(41);
	await expect(page.getByRole('link', { name: 'Athlete', exact: true })).toHaveAttribute(
		'href',
		'/medals/search?champs=18&country=TUR&order=athlete'
	);
	await expect(page.getByRole('link', { name: 'Medals by edition →' })).toHaveAttribute(
		'href',
		'/medals/country-champs?country=TUR&champ=18'
	);
});

test('redirects legacy matrix parameters to the query string', async ({ request }) => {
	const response = await request.get('/medals/search;champs=18;country=TUR', { maxRedirects: 0 });

	expect(response.status()).toBe(301);
	expect(response.headers().location).toMatch(/\/medals\/search\?champs=18&country=TUR$/);
});

test('shows a country’s medals at a championship edition by edition', async ({ page }) => {
	await page.goto('/medals/country-champs?country=TUR&champ=18');

	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		'Turkey at the European Championships'
	);
	await expect(page.locator('tbody tr')).toHaveCount(12);
	await expect(page.getByRole('link', { name: 'Details →' }).first()).toHaveAttribute(
		'href',
		/^\/medals\/search\?champs=18&country=TUR&year=\d{4}$/
	);
});
