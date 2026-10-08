import { expect, test } from './fixtures.js';

test.use({ timezoneId: 'UTC' });

const MONTHS = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december'
];
const today = new Date();
const todayPath = `/on-this-day/${MONTHS[today.getUTCMonth()]}-${today.getUTCDate()}`;

test('lists the athletes born and died on a day, most decorated first', async ({ page }) => {
	const response = await page.goto('/on-this-day/october-7');

	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle('Athletes born on 7 October | Athletics Podium');
	await expect(page.getByRole('heading', { level: 1 })).toContainText('7 Oct');
	await expect(page.locator('#born li')).toHaveCount(8);
	await expect(page.locator('#born li').first()).toContainText('Valeria Bufanu');
	await expect(page.getByRole('heading', { name: 'Died on 7 October', exact: true })).toBeVisible();

	const days = page.getByRole('navigation', { name: 'Other days' });
	await expect(days.getByRole('link', { name: '← 6 Oct' })).toHaveAttribute(
		'href',
		'/on-this-day/october-6'
	);
	await expect(days.getByRole('link', { name: '8 Oct →' })).toHaveAttribute(
		'href',
		'/on-this-day/october-8'
	);
	await expect(page.getByRole('link', { name: /Next/ })).toHaveAttribute(
		'href',
		'/on-this-day/october-7?page=2'
	);
});

test('moves to another day from the month and day menus', async ({ page }) => {
	await page.goto('/on-this-day/october-7', { waitUntil: 'networkidle' });

	await page.getByRole('combobox', { name: 'Month' }).selectOption({ label: 'February' });
	await expect(page).toHaveURL(/\/on-this-day\/february-7$/);
	await expect(page.getByRole('heading', { level: 1 })).toContainText('7 Feb');
});

test('redirects to the canonical day and rejects days that do not exist', async ({ request }) => {
	const redirects: [string, number, string][] = [
		['/on-this-day/October-07', 301, '/on-this-day/october-7'],
		['/on-this-day/october-7?page=1', 301, '/on-this-day/october-7'],
		['/on-this-day?month=2&day=31', 302, '/on-this-day/february-29']
	];
	for (const [from, status, to] of redirects) {
		const response = await request.get(from, { maxRedirects: 0 });
		expect(response.status()).toBe(status);
		expect(new URL(response.headers().location ?? '', 'https://x').pathname).toBe(to);
	}

	expect((await request.get('/on-this-day/february-30')).status()).toBe(404);
	expect((await request.get('/on-this-day/october-7?page=9')).status()).toBe(404);
});

test('links today’s birthdays and anniversaries to the day page', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('link', { name: 'All 145 →' }).first()).toHaveAttribute(
		'href',
		`${todayPath}#born`
	);

	await page.goto('/athlete');
	await expect(page.getByRole('link', { name: /^All 145 born on/ })).toHaveAttribute(
		'href',
		todayPath
	);
});

test('lists every day of the year in the sitemap', async ({ request }) => {
	const index = await (await request.get('/sitemap.xml')).text();
	const days = await (await request.get('/sitemaps/days-1.xml')).text();

	expect(index).toContain('/sitemaps/days-1.xml');
	expect(days.match(/<url>/g)).toHaveLength(366);
	expect(days).toContain('https://athleticspodium.com/on-this-day/february-29');
});

test('follows the visitor’s own date, not the server’s', async ({ browser }) => {
	const timezoneId = new Date().getUTCHours() >= 10 ? 'Pacific/Kiritimati' : 'Pacific/Pago_Pago';
	const [year, month, day] = new Intl.DateTimeFormat('en-CA', { timeZone: timezoneId })
		.format(new Date())
		.split('-')
		.map(Number);
	const localPath = `/on-this-day/${MONTHS[month - 1]}-${day}`;
	expect(localPath).not.toBe(todayPath);
	expect(year).toBeGreaterThan(2000);

	const context = await browser.newContext({ timezoneId, viewport: { width: 1280, height: 800 } });
	const page = await context.newPage();

	await page.goto('/on-this-day');
	await expect(page).toHaveURL(new RegExp(`${localPath}$`));

	await page.goto('/', { waitUntil: 'networkidle' });
	await expect(page.getByRole('link', { name: 'All 145 →' }).first()).toHaveAttribute(
		'href',
		`${localPath}#born`
	);
	await expect(page.getByRole('link', { name: /BORN TODAY/ })).toHaveAttribute('href', localPath);
	await context.close();
});
