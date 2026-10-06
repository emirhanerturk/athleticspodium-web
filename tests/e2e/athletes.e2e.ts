import { expect, test } from './fixtures.js';

test('renders the athletes hub with featured athletes, birthdays and nations', async ({ page }) => {
	const response = await page.goto('/athlete');

	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle('Athletes – find any medallist | Athletics Podium');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Find an athlete');
	await expect(page.getByRole('heading', { name: 'Featured' })).toBeVisible();
	await expect(page.getByRole('link', { name: /Marlies Göhr/ })).toHaveAttribute(
		'href',
		/\/athlete\/\d+\/marlies-oelsner-gohr/
	);
	await expect(page.getByRole('heading', { name: 'Birthdays today' })).toBeVisible();
	await expect(page.getByRole('link', { name: /Carl Lewis/ })).toBeVisible();
});

test('switches the greatest athletes by nation', async ({ page }) => {
	await page.goto('/athlete', { waitUntil: 'networkidle' });

	await page
		.getByRole('group', { name: 'Nation' })
		.getByRole('button', { name: 'Jamaica' })
		.click();

	await expect(page.getByRole('link', { name: /Carl Lewis/ })).toHaveCount(0);
	await expect(
		page.getByRole('group', { name: 'Nation' }).getByRole('button', { name: 'Jamaica' })
	).toHaveAttribute('aria-pressed', 'true');
});

test('suggests athletes in the hero search and opens the full results', async ({ page }) => {
	await page.goto('/athlete', { waitUntil: 'networkidle' });

	const box = page.getByRole('combobox', { name: 'Search athletes' });
	await box.fill('jam');
	await expect(page.getByRole('option', { name: /Aminat Yusuf/ })).toBeVisible();

	await box.press('Shift+Enter');
	await expect(page).toHaveURL(/\/search\?q=jam$/);
});
