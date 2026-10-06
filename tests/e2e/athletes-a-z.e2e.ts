import { expect, test } from './fixtures.js';

test('lists athletes by surname letter with linked letters and pages', async ({ page }) => {
	const response = await page.goto('/athlete/letter/a');

	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle('Athletes A–Z: A | Athletics Podium');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Athletes: A');
	await expect(page.locator('tbody tr')).toHaveCount(20);
	await expect(page.getByRole('navigation', { name: 'Letters' }).getByRole('link')).toHaveCount(26);
	await expect(page.getByRole('link', { name: 'B', exact: true })).toHaveAttribute(
		'href',
		'/athlete/letter/b'
	);
	await expect(page.getByRole('link', { name: 'Next →' })).toHaveAttribute(
		'href',
		'/athlete/letter/a?page=2'
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://athleticspodium.com/athlete/letter/a'
	);
});

test('redirects capital letters and the first page to the canonical address', async ({ page }) => {
	await page.goto('/athlete/letter/A?page=1');
	await expect(page).toHaveURL('/athlete/letter/a');
	expect((await page.goto('/athlete/letter/a?page=999'))?.status()).toBe(404);
});
