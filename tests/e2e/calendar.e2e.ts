import { expect, test } from './fixtures.js';

test('sends /calendar to the current season', async ({ page }) => {
	await page.goto('/calendar');

	await expect(page).toHaveURL(/\/calendar\/\d{4}$/);
});

test('renders a season with its months, levels and neighbours', async ({ page }) => {
	const response = await page.goto('/calendar/2026');

	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle('Athletics calendar 2026 – every championship | Athletics Podium');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('2026');
	await expect(page.getByRole('link', { name: 'Previous season: 2025' })).toHaveAttribute(
		'href',
		'/calendar/2025'
	);
	await expect(page.getByRole('link', { name: /Istanbul Marathon/ }).first()).toHaveAttribute(
		'href',
		/^\/champs\/istanbul-marathon\//
	);

	expect((await page.goto('/calendar/1700'))?.status()).toBe(404);
});

test('filters the season by level', async ({ page }) => {
	await page.goto('/calendar/2026', { waitUntil: 'networkidle' });

	await page
		.getByRole('group', { name: 'Level' })
		.getByRole('button', { name: /Road races/ })
		.click();

	await expect(page.getByRole('link', { name: /Istanbul Marathon/ }).first()).toBeVisible();
	await expect(page.getByRole('link', { name: /European Games/ })).toHaveCount(0);
});
