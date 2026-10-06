import type { Page } from '@playwright/test';
import { expect, test } from './fixtures.js';

const pageViewTitles = (page: Page) =>
	page.evaluate(() =>
		window.dataLayer
			.map((entry) => Array.from(entry as ArrayLike<unknown>))
			.filter(([command, name]) => command === 'event' && name === 'page_view')
			.map(([, , params]) => (params as { page_title: string }).page_title)
	);

test('sends a Google Analytics page view on load and on every navigation', async ({ page }) => {
	const gtagScript = page.waitForRequest(/googletagmanager\.com\/gtag\/js\?id=G-TEST/);

	await page.goto('/athlete/35017/yaroslava-mahuchikh', { waitUntil: 'networkidle' });
	await gtagScript;
	await page.getByRole('link', { name: 'Athletics Podium home' }).click();
	await expect(page).toHaveTitle('Athletics Podium');

	await expect
		.poll(() => pageViewTitles(page))
		.toEqual([
			'Yaroslava Mahuchikh (UKR) – medals and results | Athletics Podium',
			'Athletics Podium'
		]);
});
