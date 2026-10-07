import { expect, test } from './fixtures.js';

test('renders the about, database notes and missing information pages', async ({ page }) => {
	for (const [path, heading] of [
		['/about', 'About Athletics Podium'],
		['/how-to-read-the-database', 'How to read the database'],
		['/missing-information', 'Missing information']
	]) {
		const response = await page.goto(path);
		expect(response?.status()).toBe(200);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
	}

	await expect(page.getByRole('link', { name: 'relays' })).toHaveAttribute(
		'href',
		'/missing-information?tab=relays'
	);
});

test('moves the simple notes address to the database notes page', async ({ request }) => {
	const response = await request.get('/simple-notes', { maxRedirects: 0 });

	expect(response.status()).toBe(301);
	expect(response.headers().location).toBe('/how-to-read-the-database');
});

test('marks the section in view in the page contents', async ({ page }) => {
	await page.goto('/how-to-read-the-database', { waitUntil: 'networkidle' });
	const contents = page.getByRole('navigation', { name: 'On this page' });

	await expect(contents.getByRole('link', { name: /Olympic champions/ })).toHaveAttribute(
		'aria-current',
		'location'
	);
	await contents.getByRole('link', { name: /Stripped medals/ }).click();
	await expect(contents.getByRole('link', { name: /Stripped medals/ })).toHaveAttribute(
		'aria-current',
		'location'
	);
	await expect(page.getByRole('heading', { name: 'Stripped medals' })).toBeInViewport();
});

test('explains invalid contact fields and sends a valid message', async ({ page }) => {
	await page.goto('/about', { waitUntil: 'networkidle' });

	await page.getByRole('button', { name: 'Send message' }).click();
	await expect(page.getByText('Enter your name (up to 100 characters).')).toBeVisible();

	await page.getByRole('textbox', { name: 'Name' }).fill('Ana');
	await page.getByRole('textbox', { name: 'Email' }).fill('ana@example.org');
	await page.getByRole('textbox', { name: 'Message' }).fill('A missing medal.');
	await page.getByRole('button', { name: 'Send message' }).click();

	await expect(page.getByRole('status')).toContainText('Your message has been sent.');
});

test('accepts the contact form without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('/missing-information');

	await page.getByRole('textbox', { name: 'Name' }).fill('Ana');
	await page.getByRole('textbox', { name: 'Email' }).fill('ana@example.org');
	await page.getByRole('textbox', { name: 'Message' }).fill('Relay members for 1957.');
	await page.getByRole('button', { name: 'Send message' }).click();

	await expect(page.getByRole('status')).toContainText('Your message has been sent.');
	await context.close();
});
