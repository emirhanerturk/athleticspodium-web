import { expect, test } from './fixtures.js';

test('renders the about, simple notes and missing information pages', async ({ page }) => {
	for (const [path, heading] of [
		['/about', 'About Athletics Podium'],
		['/simple-notes', 'Simple notes on the database'],
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
