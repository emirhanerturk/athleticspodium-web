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

test('sends the hero search to the search page', async ({ page }) => {
	await page.goto('/athlete', { waitUntil: 'networkidle' });

	await page.getByRole('searchbox', { name: 'Search athletes' }).fill('bolt');
	await page.getByRole('button', { name: 'Search', exact: true }).click();

	await expect(page).toHaveURL(/\/search\?type=athletes&q=bolt$/);
});
