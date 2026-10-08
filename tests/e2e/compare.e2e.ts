import { expect, test } from './fixtures.js';

const EUROPEANS_VS_OLYMPICS = '/medals/compare?a=18&b=40&gender=men&event=10';

test('offers ready-made comparisons before a selection', async ({ page }) => {
	const response = await page.goto('/medals/compare');

	expect(response?.status()).toBe(200);
	await expect(page.getByRole('button', { name: 'Event: an event' })).toBeDisabled();
	await expect(
		page.getByRole('link', { name: 'Olympic Games vs World Championships · Women’s 100m →' })
	).toHaveAttribute('href', '/medals/compare?a=40&b=52&gender=women&event=10');
	await expect(page.getByText('The link is shareable:')).toHaveCount(0);
});

test('lines up two championships year by year', async ({ page }) => {
	await page.goto(EUROPEANS_VS_OLYMPICS, { waitUntil: 'networkidle' });

	await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText(
		'European Championships vs Olympic Games · Men’s 100m'
	);
	await expect(page.getByRole('heading', { name: 'Fastest winning time' })).toBeVisible();
	await expect(page.getByRole('rowheader', { name: '2016' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Swap championships' })).toHaveAttribute(
		'href',
		'/medals/compare?a=40&b=18&gender=men&event=10'
	);
	await expect(
		page.getByText('athleticspodium.com/medals/compare?a=18&b=40&gender=men&event=10')
	).toBeVisible();
	await expect(page.getByRole('button', { name: 'Copy link' })).toBeVisible();
});

test('traces a double winner through both championships', async ({ page }) => {
	await page.goto(EUROPEANS_VS_OLYMPICS, { waitUntil: 'networkidle' });

	const winner = page.getByRole('button', { name: /Yasemin Can/ });
	await expect(winner).toContainText('6 golds');
	await expect(page.getByRole('rowheader', { name: '2022' })).not.toHaveClass(/bg-brand /);

	await winner.click();

	await expect(winner).toHaveAttribute('aria-pressed', 'true');
	await expect(page.getByRole('rowheader', { name: '2022' })).toHaveClass(/bg-brand /);
	await expect(page.getByRole('rowheader', { name: '2002' })).not.toHaveClass(/bg-brand /);
});

test('picks the event under a gender tab', async ({ page }) => {
	await page.goto(EUROPEANS_VS_OLYMPICS, { waitUntil: 'networkidle' });

	await page.getByRole('button', { name: 'Event: Men’s 100m' }).click();
	await expect(page.getByRole('button', { name: 'Men', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await page.getByRole('button', { name: 'Women', exact: true }).click();
	await expect(page.getByRole('combobox', { name: 'Search event' })).toBeFocused();
	await page.getByRole('option', { name: '100m hurdles' }).click();

	await expect(page).toHaveURL('/medals/compare?a=18&b=40&gender=women&event=7');
});

test('turns the race menu of the form into the gender and the event', async ({ page }) => {
	await page.goto('/medals/compare?a=18&b=40&race=women-10');

	await expect(page).toHaveURL('/medals/compare?a=18&b=40&gender=women&event=10');
});
