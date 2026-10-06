import { expect, test } from './fixtures.js';

const CHAMPIONSHIP = '/champs/european-champs';

test('renders the championship on the server', async ({ page }) => {
	const response = await page.goto(CHAMPIONSHIP);

	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle(
		'European Championships – editions, medal table and history | Athletics Podium'
	);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('European Championships');
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		'content',
		'http://localhost:4499/media/champs/european-champs.jpg'
	);

	const hero = page.locator('dl').first();
	await expect(hero.getByText('first edition, Turin')).toBeVisible();
	await expect(hero.getByText('next · Chorzow')).toBeVisible();
});

test('links every edition and highlights the latest one', async ({ page }) => {
	await page.goto(CHAMPIONSHIP);
	const editions = page.locator('section', {
		has: page.getByRole('heading', { name: 'Editions' })
	});

	await expect(editions.getByRole('link')).toHaveCount(29);
	await expect(editions.locator('[aria-current="true"]')).toHaveAttribute(
		'href',
		'/champs/european-champs/2026-european-championships'
	);
	await expect(editions.getByText('upcoming')).toBeVisible();
});

test('shows the medal table, the athletes with most golds and the programme', async ({ page }) => {
	await page.goto(CHAMPIONSHIP);

	await expect(page.getByRole('heading', { name: 'All-time medal table' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Show all 43 nations' })).toBeVisible();
	await expect(page.locator('a[href="/athlete/33258/dina-asher-smith"]')).toHaveText(
		'Dina Asher-Smith'
	);
	await expect(page.getByText('100m, 200m, relays · 2016–26').first()).toBeVisible();
	await expect(page.getByRole('heading', { name: '66 events contested since 1934' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Discus throw' }).first()).toHaveAttribute(
		'href',
		'/medals/search?champs=18&event=99&gender=0'
	);
});

test('expands the history', async ({ page }) => {
	await page.goto(CHAMPIONSHIP, { waitUntil: 'networkidle' });

	await page.getByRole('button', { name: 'Read the full history' }).click();

	await expect(page.getByRole('button', { name: 'Show less' })).toHaveAttribute(
		'aria-expanded',
		'true'
	);
});

test('answers 404 for an unknown championship', async ({ page }) => {
	const response = await page.goto('/champs/no-such-championship');

	expect(response?.status()).toBe(404);
});
