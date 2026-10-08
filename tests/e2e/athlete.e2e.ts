import { expect, test } from './fixtures.js';

const PROFILE = '/athlete/35017/yaroslava-mahuchikh';

test('renders the athlete profile on the server', async ({ page }) => {
	const response = await page.goto(PROFILE);

	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle(
		'Yaroslava Mahuchikh (UKR) – medals and results | Athletics Podium'
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		`https://athleticspodium.com${PROFILE}`
	);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Yaroslava Mahuchikh');
	await expect(page.getByRole('img', { name: '3 gold, 0 silver, 1 bronze' })).toBeVisible();
	await expect(page.getByText('+ 1 national title')).toBeVisible();
	await expect(page.getByRole('link', { name: /Paris 2024/ })).toBeVisible();

	const person = await page
		.locator('script[type="application/ld+json"]')
		.evaluateAll((scripts) => scripts.flatMap((script) => JSON.parse(script.textContent ?? '[]')));
	expect(person).toContainEqual(
		expect.objectContaining({ '@type': 'Person', name: 'Yaroslava Mahuchikh' })
	);
});

test('filters the results by championship level', async ({ page }) => {
	await page.goto(PROFILE, { waitUntil: 'networkidle' });
	const rows = page.locator('#medals tbody tr');

	await expect(rows).toHaveCount(4);
	await page.getByRole('button', { name: /Continental/ }).click();
	await expect(rows).toHaveCount(1);
	await expect(rows.first()).toContainText('European U23 Athletics Championships');
});

test('lists national results below the international medals', async ({ page }) => {
	await page.goto(PROFILE);
	const headings = await page.getByRole('heading', { level: 2 }).allTextContents();

	expect(headings.map((heading) => heading.replace(/\s+/g, ' ').trim())).toEqual([
		'Biography',
		'By championship',
		'National championships',
		'Medals 4',
		'National results 1'
	]);
	await expect(page.locator('#national li')).toHaveText([
		/2021\s+Ukrainian Athletics Championships/
	]);
});

test('lists places 4–8 apart from the medals', async ({ page }) => {
	await page.goto('/athlete/830/akani-simbine');
	const headings = await page.getByRole('heading', { level: 2 }).allTextContents();

	expect(headings.map((heading) => heading.replace(/\s+/g, ' ').trim())).toEqual(
		expect.arrayContaining(['Medals 17', 'Other achievements 1', 'National results 7'])
	);
	await expect(page.locator('#medals tbody tr')).toHaveCount(17);
	await expect(page.locator('#other-achievements tbody tr')).toHaveText([
		/2024\s*Olympic Games\s*100m\s*Paris\s*4\s*9\.82/
	]);
	await expect(page.getByText('Show places 4–8')).toHaveCount(0);
});

test('opens the photos in a viewer', async ({ page }) => {
	await page.goto(PROFILE, { waitUntil: 'networkidle' });
	const viewer = page.getByRole('dialog', { name: 'Photos of Yaroslava Mahuchikh' });

	await page.getByRole('link', { name: 'View photo 2 of 2' }).click();
	await expect(viewer).toBeVisible();
	await expect(viewer.getByText('Competing at 2021 European U23 Championships')).toBeInViewport({
		ratio: 0.9
	});

	await page.keyboard.press('ArrowLeft');
	await expect(viewer.getByText('1 / 2')).toBeInViewport({ ratio: 0.9 });

	await page.keyboard.press('Escape');
	await expect(viewer).toBeHidden();
});

test('links the photo to its file without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto(PROFILE);

	await expect(
		page.getByRole('link', { name: 'View photo of Yaroslava Mahuchikh' })
	).toHaveAttribute('href', /\/athletes\/35017\/fcaa7ef2-7ab4-4c6e-ad70-f51f65a7c897\.jpeg$/);
	await context.close();
});

test('redirects a wrong slug to the canonical profile', async ({ request }) => {
	const response = await request.get('/athlete/35017/someone-else', { maxRedirects: 0 });

	expect(response.status()).toBe(301);
	expect(response.headers().location).toBe(PROFILE);
});

test('answers 404 for an athlete that does not exist', async ({ page }) => {
	const response = await page.goto('/athlete/1/nobody');

	expect(response?.status()).toBe(404);
});
