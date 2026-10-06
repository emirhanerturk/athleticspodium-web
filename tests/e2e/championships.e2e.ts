import type { Page } from '@playwright/test';
import { expect, test } from './fixtures.js';

const cards = (page: Page) => page.locator('main a[href^="/champs/"]');
const tab = (page: Page, label: string) =>
	page
		.getByRole('navigation', { name: 'Categories' })
		.getByRole('link', { name: new RegExp(`^${label} `) });

test('renders the global championships on the server', async ({ page }) => {
	const response = await page.goto('/champs');

	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle(
		'Athletics championships – the complete archive | Athletics Podium'
	);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Championships');
	await expect(
		page.getByText('From the 1873 Irish Championships to the 2031 World Championships.')
	).toBeVisible();
	await expect(tab(page, 'Global')).toHaveAttribute('aria-current', 'page');
	await expect(cards(page)).toHaveCount(18);
	await expect(cards(page).first()).toHaveAttribute('href', '/champs/olympic-games');
});

test('opens a category from the address', async ({ page }) => {
	await page.goto('/champs?category=europe');

	await expect(tab(page, 'Europe')).toHaveAttribute('aria-current', 'page');
	await expect(cards(page)).toHaveCount(16);
	await expect(page.getByRole('link', { name: /European Championships/ }).first()).toHaveAttribute(
		'href',
		'/champs/european-champs'
	);
});

test('filters, counts and sorts in the browser', async ({ page }) => {
	await page.goto('/champs', { waitUntil: 'networkidle' });

	await tab(page, 'Europe').click();
	await expect(page).toHaveURL('/champs?category=europe');

	await page.getByRole('searchbox', { name: 'Filter championships' }).fill('u20');
	await expect(cards(page)).toHaveCount(1);
	await expect(tab(page, 'Asia')).toHaveText(/^\s*Asia\s+1\s*$/);

	await page.getByRole('searchbox', { name: 'Filter championships' }).fill('');
	await page.getByRole('combobox', { name: 'Sort' }).selectOption('name');
	await expect(cards(page).first()).toHaveAttribute('href', '/champs/european-champs');
});
