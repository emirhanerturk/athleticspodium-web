import { expect, test } from '@playwright/test';

const PROFILE = '/athlete/35017/yaroslava-mahuchikh';

test('renders the athlete profile on the server', async ({ page }) => {
	const response = await page.goto(PROFILE);

	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle(
		'Yaroslava Mahuchikh (UKR) – medals and results | Athletics Podium'
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		`https://athleticspodium.com${PROFILE}`
	);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Yaroslava Mahuchikh');
	await expect(page.getByRole('img', { name: '3 gold, 0 silver, 1 bronze' })).toBeVisible();
	await expect(page.getByText('+ 1 national title')).toBeVisible();
	await expect(page.getByRole('link', { name: /Paris 2024/ })).toBeVisible();

	const person = await page
		.locator('script[type="application/ld+json"]')
		.evaluateAll((scripts) => scripts.flatMap((script) => JSON.parse(script.textContent ?? '[]')));
	expect(person).toContainEqual(
		expect.objectContaining({ '@type': 'Person', name: 'Yaroslava Mahuchikh' })
	);
});

test('filters the results by championship level', async ({ page }) => {
	await page.goto(PROFILE, { waitUntil: 'networkidle' });
	const rows = page.locator('#results tbody tr');

	await expect(rows).toHaveCount(4);
	await page.getByRole('button', { name: /Continental/ }).click();
	await expect(rows).toHaveCount(1);
	await expect(rows.first()).toContainText('European U23 Athletics Championships');
});

test('redirects a wrong slug to the canonical profile', async ({ request }) => {
	const response = await request.get('/athlete/35017/someone-else', { maxRedirects: 0 });

	expect(response.status()).toBe(301);
	expect(response.headers().location).toBe(PROFILE);
});

test('answers 404 for an athlete that does not exist', async ({ page }) => {
	const response = await page.goto('/athlete/1/nobody');

	expect(response?.status()).toBe(404);
});
