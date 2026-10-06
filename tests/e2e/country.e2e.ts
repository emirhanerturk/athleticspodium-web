import { expect, test } from './fixtures.js';

test('renders a country with its medals, athletes and hosted meetings', async ({ page }) => {
	const response = await page.goto('/country/TUR');

	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle('Turkey (TUR) – athletics medals and athletes | Athletics Podium');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Turkey');
	await expect(page.getByRole('link', { name: 'Europe', exact: true })).toHaveAttribute(
		'href',
		'/country?area=europe'
	);
	await expect(page.getByRole('link', { name: /European Championships/ }).first()).toHaveAttribute(
		'href',
		'/medals/country-champs?country=TUR&champ=18'
	);
	await expect(page.locator('section', { hasText: 'Most decorated' }).locator('li')).toHaveCount(
		12
	);
	await expect(page.getByRole('heading', { name: 'Hosted in Turkey' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'All athletes from Turkey →' })).toHaveAttribute(
		'href',
		'/country/TUR/athletes'
	);
});

test('filters the medal table by level', async ({ page }) => {
	await page.goto('/country/TUR', { waitUntil: 'networkidle' });

	await page.getByRole('group', { name: 'Level' }).getByRole('button', { name: 'Road' }).click();

	const table = page.locator('a[href^="/medals/country-champs"]');
	await expect(table.filter({ hasText: 'Istanbul Marathon' })).toBeVisible();
	await expect(table.filter({ hasText: 'European Championships' })).toHaveCount(0);
});

test('lists the country athletes on numbered pages', async ({ page }) => {
	const response = await page.goto('/country/TUR/athletes');

	expect(response?.status()).toBe(200);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Turkey athletes');
	await expect(page.locator('tbody tr')).toHaveCount(12);
	await expect(page.getByRole('navigation', { name: 'Pagination' })).toContainText('Page 1 of 1');

	expect((await page.goto('/country/TUR/athletes?page=1'))?.url()).toMatch(
		/\/country\/TUR\/athletes$/
	);
});

test('finds countries by name or code and by area', async ({ page }) => {
	await page.goto('/country', { waitUntil: 'networkidle' });

	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Countries');
	await expect(page.getByRole('link', { name: /United States of America/ }).first()).toBeVisible();

	await page.getByRole('searchbox', { name: 'Find a country' }).fill('jam');
	await expect(page.getByText('1 shown')).toBeVisible();
	await expect(page.getByRole('link', { name: /^Jamaica JAM/ })).toBeVisible();

	await page.getByRole('searchbox', { name: 'Find a country' }).fill('');
	await page
		.getByRole('navigation', { name: 'Areas' })
		.getByRole('link', { name: /^Europe/ })
		.click();
	await expect(page).toHaveURL('/country?area=europe');
	await expect(page.getByText('66 shown')).toBeVisible();
});
