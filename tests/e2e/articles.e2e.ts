import { expect, test } from './fixtures.js';

test('lists the articles on numbered pages', async ({ page }) => {
	const response = await page.goto('/article');

	expect(response?.status()).toBe(200);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Articles');
	await expect(page.locator('main a[href^="/article/"]').first()).toBeVisible();
	await expect(page).toHaveURL('/article');
	expect((await page.goto('/article?page=1'))?.url()).toMatch(/\/article$/);
});

test('renders an article with its related topics and JSON-LD', async ({ page }) => {
	const response = await page.goto('/article/362/the-numbers-asian-games');

	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle('The numbers: Asian Games | Athletics Podium');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('The numbers: Asian Games');
	await expect(page.getByRole('link', { name: '2026 Asian Games' })).toHaveAttribute(
		'href',
		'/champs/asian-games/2026-asian-games'
	);
	await expect(page.getByRole('link', { name: 'Japan' })).toHaveAttribute('href', '/country/JPN');

	const types = await page
		.locator('script[type="application/ld+json"]')
		.evaluateAll((scripts) =>
			scripts
				.flatMap((script) => JSON.parse(script.textContent ?? '[]'))
				.map((item) => item['@type'])
		);
	expect(types).toContain('Article');
});

test('redirects a wrong article slug and answers 404 for a missing article', async ({ page }) => {
	await page.goto('/article/362/old-slug');
	await expect(page).toHaveURL('/article/362/the-numbers-asian-games');

	expect((await page.goto('/article/999999/missing'))?.status()).toBe(404);
});
