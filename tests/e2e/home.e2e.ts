import { expect, test } from './fixtures.js';

test('renders the front page on the server', async ({ page }) => {
	const response = await page.goto('/');

	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle('Athletics Podium');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Athletics Podium/);
	await expect(page.getByRole('heading', { name: 'The numbers: Asian Games' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Fresh in the archive' })).toBeVisible();
	await expect(page.getByRole('link', { name: /2026 Berlin Marathon/ }).first()).toHaveAttribute(
		'href',
		'/champs/berlin-marathon/2026-berlin-marathon'
	);
	await expect(page.getByRole('heading', { name: 'Portraits' })).toBeVisible();

	const types = await page
		.locator('script[type="application/ld+json"]')
		.evaluateAll((scripts) =>
			scripts
				.flatMap((script) => JSON.parse(script.textContent ?? '[]'))
				.map((item) => item['@type'])
		);
	expect(types).toEqual(expect.arrayContaining(['WebSite', 'Organization']));
});
