import { expect, test } from './fixtures.js';

test('shows the compare form without a selection', async ({ page }) => {
	const response = await page.goto('/compare');

	expect(response?.status()).toBe(200);
	await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText(
		'Two championships, one event'
	);
	await expect(page.getByRole('combobox', { name: 'Event' })).toBeDisabled();
});

test('lines up two championships year by year', async ({ page }) => {
	await page.goto('/compare?a=18&b=40&gender=men&event=10', { waitUntil: 'networkidle' });

	await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText(
		'European Championships vs Olympic Games: 100m, men'
	);
	await expect(page.locator('tbody tr').first()).toBeVisible();
	await expect(page.getByRole('columnheader', { name: 'A − B' })).toBeVisible();
});
