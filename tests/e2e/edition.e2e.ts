import { expect, test } from './fixtures.js';

const EDITION = '/champs/european-champs/2026-european-championships';

test('renders the edition on the server', async ({ page }) => {
	const response = await page.goto(EDITION);

	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle(
		'2026 European Champs – medallists and results | Athletics Podium'
	);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('2026 European Champs');
	await expect(page.getByText('events', { exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: '2024 Rome' })).toHaveAttribute(
		'href',
		'/champs/european-champs/2024-european-champs'
	);
	await expect(page.getByRole('link', { name: '2028 Chorzow' })).toBeVisible();

	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.evaluateAll((scripts) => scripts.flatMap((script) => JSON.parse(script.textContent ?? '[]')));
	expect(jsonLd).toContainEqual(
		expect.objectContaining({ '@type': 'SportsEvent', startDate: '2026-08-10' })
	);
});

test('shows relay teams as one line with their members', async ({ page }) => {
	await page.goto(EDITION);
	const relay = page.locator('article', { has: page.getByRole('heading', { name: '4x100m' }) });

	await expect(relay.getByText('Great Britain & NI', { exact: true })).toBeVisible();
	await expect(relay.getByText(/Azu/)).toBeVisible();
	await expect(relay.locator('.grid')).toHaveCount(2);
});

test('switches to the women’s podiums', async ({ page }) => {
	await page.goto(EDITION, { waitUntil: 'networkidle' });

	await page.getByRole('button', { name: /Women/ }).click();

	await expect(page.getByRole('heading', { name: 'High jump' })).toBeVisible();
	await expect(page.getByRole('heading', { name: '100m' })).toBeHidden();
});

test('opens the athlete card at once and fills it when the summary arrives', async ({ page }) => {
	let releaseSummary = () => {};
	const summaryHeld = new Promise<void>((resolve) => (releaseSummary = resolve));
	await page.route('**/internal/athlete-card/**', async (route) => {
		await summaryHeld;
		await route.continue();
	});
	await page.goto(EDITION, { waitUntil: 'networkidle' });

	await page.getByRole('link', { name: 'Romell Glave' }).hover();
	const card = page.locator('[aria-busy]');

	await expect(card).toHaveAttribute('aria-busy', 'true');
	await expect(card.getByText('Gold here · 100m · 10.09')).toBeVisible();
	await expect(card.getByText('Romell Glave')).toBeVisible();

	releaseSummary();

	await expect(card).toHaveAttribute('aria-busy', 'false');
	await expect(card.getByText('11 Nov 1999')).toBeVisible();
	await expect(card.getByRole('link', { name: 'Profile →' })).toHaveAttribute(
		'href',
		'/athlete/75442/romell-glave'
	);
});

test('redirects a wrong championship slug to the canonical edition', async ({ request }) => {
	const response = await request.get('/champs/olympic-games/2026-european-championships', {
		maxRedirects: 0
	});

	expect(response.status()).toBe(301);
	expect(response.headers().location).toBe(EDITION);
});
