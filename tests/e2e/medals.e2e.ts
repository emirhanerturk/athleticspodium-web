import { expect, test } from './fixtures.js';

test('asks for a nation or a championship before searching medals', async ({ page }) => {
	const response = await page.goto('/medals');

	expect(response?.status()).toBe(200);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ask the archive');
	await expect(
		page
			.getByRole('navigation', { name: 'Archive tools' })
			.getByRole('link', { name: /Medal search/ })
	).toHaveAttribute('aria-current', 'page');
	await expect(
		page.getByText('Pick a nation or a championship in the sentence above to see its medals.')
	).toBeVisible();
	await expect(
		page.getByRole('link', { name: 'Turkey at the European Championships →' })
	).toHaveAttribute('href', '/medals?champ=18&country=TUR');
});

test('groups the medals by edition, with relays once and withdrawn medals apart', async ({
	page
}) => {
	await page.goto('/medals?champ=18&country=TUR');

	await expect(page.getByRole('combobox', { name: 'Nation' })).toHaveValue('TUR');
	await expect(page.getByRole('combobox', { name: 'Championship' })).toHaveValue('18');
	await expect(page.getByRole('heading', { level: 2, name: /^\d{4}/ })).toHaveCount(11);
	await expect(page.getByRole('heading', { level: 2, name: '2018 Berlin' })).toBeVisible();
	await expect(page.getByText('Relay team')).toHaveCount(1);
	await expect(page.getByText('Disqualified · medal withdrawn')).toHaveCount(4);
	await expect(page.getByRole('link', { name: /All medals\s+38/ })).toHaveAttribute(
		'aria-current',
		'page'
	);
	await expect(page.getByRole('link', { name: /Gold\s+12/ })).toHaveAttribute(
		'href',
		'/medals?champ=18&country=TUR&medal=gold'
	);
	await expect(page.getByText('4 medals withdrawn')).toBeVisible();
	await expect(
		page.getByRole('link', { name: 'Medal countdown, edition by edition →' })
	).toHaveAttribute('href', '/medals/countdown?country=TUR&champ=18');
});

test('rewrites the search when a box in the sentence changes', async ({ page }) => {
	await page.goto('/medals?champ=18&country=TUR', { waitUntil: 'networkidle' });

	await page.getByRole('combobox', { name: 'Year' }).selectOption('2016');
	await expect(page).toHaveURL(/\/medals\?champ=18&country=TUR&year=2016$/);
	await expect(page.getByRole('combobox', { name: 'Year' })).toHaveValue('2016');
});

test('moves the legacy tool addresses in one 301', async ({ request }) => {
	for (const [legacy, moved] of [
		[
			'/medals/search;champs=18;country=TUR;gender=1;medal=1',
			'/medals?champ=18&country=TUR&gender=women&medal=gold'
		],
		['/medals/country-champs?country=TUR&champ=18', '/medals/countdown?country=TUR&champ=18'],
		['/compare?a=18&b=40', '/medals/compare?a=18&b=40']
	]) {
		const response = await request.get(legacy, { maxRedirects: 0 });
		const location = new URL(response.headers().location ?? '', 'https://athleticspodium.com');

		expect(response.status()).toBe(301);
		expect(location.pathname + location.search).toBe(moved);
	}
});

test('shows a country’s medals at a championship edition by edition', async ({ page }) => {
	await page.goto('/medals/countdown?country=TUR&champ=18');

	await expect(
		page
			.getByRole('navigation', { name: 'Archive tools' })
			.getByRole('link', { name: /Medal countdown/ })
	).toHaveAttribute('aria-current', 'page');
	await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText(
		'Turkey at the European Championships'
	);
	await expect(page.getByRole('heading', { name: 'On the podium' })).toBeVisible();
	await expect(page.getByText('11 of 27', { exact: true })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Every edition, 1934–2028' })).toBeVisible();

	const table = page.locator('table');
	await expect(table.locator('tbody tr')).toHaveCount(28);
	await page.getByRole('button', { name: 'Medal editions only' }).click();
	await expect(table.locator('tbody tr')).toHaveCount(11);
});

test('opens the medallists of an edition', async ({ page }) => {
	await page.goto('/medals/countdown?country=TUR&champ=18', { waitUntil: 'networkidle' });

	const toggle = page.getByRole('button', { name: 'Medallists, 2018' });
	await toggle.click();

	await expect(toggle).toHaveAttribute('aria-expanded', 'true');
	await expect(page.getByRole('link', { name: 'Ramil Guliyev' }).first()).toBeVisible();
});

test('places the nation in the all-time table and points to the next edition', async ({ page }) => {
	await page.goto('/medals/countdown?country=TUR&champ=18');

	await expect(page.getByRole('link', { name: /^22 Turkey/ })).toHaveAttribute(
		'aria-current',
		'page'
	);
	await expect(page.getByRole('link', { name: /Next edition/ })).toHaveAttribute(
		'href',
		'/champs/european-champs/2028-european-championships'
	);
});

test('counts medals without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('/medals/countdown');

	await page.getByRole('combobox', { name: 'Nation' }).selectOption('TUR');
	await page.getByRole('combobox', { name: 'Championship' }).selectOption('18');
	await page.getByRole('button', { name: 'Count', exact: true }).click();

	await expect(page).toHaveURL('/medals/countdown?country=TUR&champ=18');
	await context.close();
});

test('rewrites the search without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('/medals?champ=18&country=TUR&medal=gold&gender=women');

	await page.getByRole('combobox', { name: 'Year' }).selectOption('2016');
	await page.getByRole('button', { name: 'Show' }).click();
	await expect(page).toHaveURL(/year=2016/);
	const params = new URL(page.url()).searchParams;
	expect([params.get('champ'), params.get('gender'), params.get('medal')]).toEqual([
		'18',
		'women',
		'gold'
	]);
	await expect(page.getByRole('combobox', { name: 'Year' })).toHaveValue('2016');
	await context.close();
});
