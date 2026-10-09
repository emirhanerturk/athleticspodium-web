import { expect, test } from './fixtures.js';

test('renders a country with its medals, athletes and hosted meetings', async ({ page }) => {
	const response = await page.goto('/country/TUR');

	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle('Turkey (TUR) – athletics medals and athletes | Athletics Podium');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Turkey');
	await expect(page.getByRole('img', { name: 'Flag of Turkey' })).toHaveAttribute(
		'src',
		'http://localhost:4499/media/flags/tur.svg'
	);
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		'content',
		'https://athleticspodium.com/og/countries.png'
	);
	await expect(page.getByRole('link', { name: 'Europe', exact: true })).toHaveAttribute(
		'href',
		'/country?area=europe'
	);
	await expect(page.getByRole('link', { name: /European Championships/ }).first()).toHaveAttribute(
		'href',
		'/medals/countdown?country=TUR&champ=18'
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

	const table = page.locator('a[href^="/medals/countdown"]');
	await expect(table.filter({ hasText: 'Istanbul Marathon' })).toBeVisible();
	await expect(table.filter({ hasText: 'European Championships' })).toHaveCount(0);
});

test('lists the country athletes with their medal events and years', async ({ page }) => {
	const response = await page.goto('/country/TUR/athletes');

	expect(response?.status()).toBe(200);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Turkey’s athletes');
	await expect(
		page.locator('dl').filter({ hasText: 'medallists' }).getByRole('definition')
	).toHaveText(['12', '9', '3']);
	await expect(page.locator('tbody tr')).toHaveCount(12);
	await expect(page.locator('tbody tr').first()).toContainText('Women · 2012–26');
	await expect(page.locator('tbody tr').nth(1)).toContainText('100m, 200m, relays');
	await expect(page.getByText('Showing 1–12 of 12')).toBeVisible();
	await expect(page.getByRole('navigation', { name: 'Pagination' })).toHaveCount(0);

	expect((await page.goto('/country/TUR/athletes?page=1&sort=golds'))?.url()).toMatch(
		/\/country\/TUR\/athletes$/
	);
	expect((await page.goto('/country/TUR/athletes?page=2'))?.status()).toBe(404);
});

test('filters the athletes by name, gender and medal years, and sorts them', async ({ page }) => {
	await page.goto('/country/TUR/athletes', { waitUntil: 'networkidle' });
	const rows = page.locator('tbody tr');

	await page.getByRole('searchbox', { name: 'Filter by name or event' }).fill('can');
	await expect(page).toHaveURL('/country/TUR/athletes?q=can');
	await expect(rows).toHaveCount(3);
	await expect(page.getByRole('searchbox', { name: 'Filter by name or event' })).toBeFocused();

	await page.getByRole('group', { name: 'Gender' }).getByRole('link', { name: 'Women' }).click();
	await expect(page).toHaveURL('/country/TUR/athletes?q=can&gender=women');
	await expect(rows).toHaveText([/Yasemin Can/]);

	await page.getByRole('searchbox', { name: 'Filter by name or event' }).fill('steeple');
	await expect(page.getByText('No medallist from Turkey matches these filters.')).toBeVisible();
	await page.getByRole('link', { name: 'Clear filters' }).click();
	await expect(page).toHaveURL('/country/TUR/athletes');
	await expect(page.getByRole('searchbox', { name: 'Filter by name or event' })).toHaveValue('');

	await page
		.getByRole('group', { name: 'Medal years' })
		.getByRole('link', { name: '1980–99' })
		.click();
	await expect(page).toHaveURL('/country/TUR/athletes?era=1980-1999');
	await expect(rows).toHaveText([/Elvan Abeylegesse/]);

	await page.getByRole('link', { name: 'Any era' }).click();
	await expect(page).toHaveURL('/country/TUR/athletes');
	await page.getByLabel('Sort').selectOption('youngest');
	await expect(page).toHaveURL('/country/TUR/athletes?sort=youngest');
	await expect(rows.first()).toContainText('Berke Akcam');
});

test('pages through a long list of athletes', async ({ page }) => {
	await page.goto('/country/ETH/athletes', { waitUntil: 'networkidle' });

	await expect(page.getByText('Showing 1–25 of 30')).toBeVisible();
	await page
		.getByRole('navigation', { name: 'Pagination' })
		.getByRole('link', { name: 'Page 2' })
		.click();

	await expect(page).toHaveURL('/country/ETH/athletes?page=2#athletes');
	await expect(page.getByText('Showing 26–30 of 30')).toBeVisible();
	await expect(page.locator('tbody tr').first()).toContainText('26');
	await expect(page).toHaveTitle(/page 2/);
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

test('keeps the scroll position and focus when switching areas', async ({ page }) => {
	await page.goto('/country', { waitUntil: 'networkidle' });
	const europe = page
		.getByRole('navigation', { name: 'Areas' })
		.getByRole('link', { name: /^Europe/ });

	await page.evaluate(() => window.scrollTo(0, 120));
	const scrolled = await page.evaluate(() => window.scrollY);
	expect(scrolled).toBeGreaterThan(0);
	await europe.click();

	await expect(page).toHaveURL('/country?area=europe');
	expect(await page.evaluate(() => window.scrollY)).toBe(scrolled);
	await expect(europe).toBeFocused();
});
