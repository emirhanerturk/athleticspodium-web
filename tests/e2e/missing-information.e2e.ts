import { expect, test } from './fixtures.js';

test('lists the gaps by championship, with the gaps readers filled', async ({ page }) => {
	await page.goto('/missing-information');
	const lists = page.getByRole('navigation', { name: 'Lists' });

	await expect(lists.getByRole('link', { name: /Medallists/ })).toHaveAttribute(
		'aria-current',
		'page'
	);
	await expect(lists.getByRole('link', { name: /Medallists/ })).toContainText('53');
	await expect(page.getByRole('heading', { name: 'Pan Arab Games' })).toBeVisible();
	await expect(page.getByTitle('Silver missing').first()).toBeVisible();
	await expect(page.getByRole('complementary')).toContainText('Michel Maze');
});

test('filters the list as the visitor types', async ({ page }) => {
	await page.goto('/missing-information', { waitUntil: 'networkidle' });
	const filter = page.getByRole('searchbox', { name: 'Filter the list' });

	await filter.fill('1961');
	await expect(page).toHaveURL(/q=1961/);
	await expect(page.getByRole('heading', { level: 2, name: 'Pan Arab Games' })).toBeVisible();
	await expect(page.getByText('2 gaps')).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Gymnasiade' })).toHaveCount(0);

	await filter.fill('zzz');
	await expect(page.getByText('No gap matches “zzz”')).toBeVisible();
});

test('starts the message with the gap the visitor knows', async ({ page }) => {
	await page.goto('/missing-information', { waitUntil: 'networkidle' });

	await page.getByRole('link', { name: /I know this: 1961 Men's 50kmW/ }).click();
	await expect(page).toHaveURL(/#send$/);
	await expect(page.getByRole('textbox', { name: 'Message' })).toHaveValue(
		"Pan Arab Games · 1961 Men's 50kmW - S / B\n\n"
	);
});

test('filters the list without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('/missing-information?tab=relays');

	await page.getByRole('searchbox', { name: 'Filter the list' }).fill('gymnasiade');
	await page.getByRole('searchbox', { name: 'Filter the list' }).press('Enter');
	await expect(page).toHaveURL(/tab=relays&q=gymnasiade/);
	await expect(page.getByRole('heading', { level: 2, name: 'Gymnasiade' })).toBeVisible();
	await expect(page.getByRole('heading', { level: 2, name: 'Pan Arab Games' })).toHaveCount(0);
	await context.close();
});
