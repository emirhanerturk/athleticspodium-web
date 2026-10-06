import { expect, test } from './fixtures.js';

test('shows the search launcher without a query', async ({ page }) => {
	const response = await page.goto('/search');

	expect(response?.status()).toBe(200);
	await expect(page.getByRole('link', { name: /Medal search/ }).first()).toBeVisible();
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
});

test('renders grouped results with a top result and scope tabs', async ({ page }) => {
	await page.goto('/search?q=jam');

	await expect(page).toHaveTitle('Search: jam | Athletics Podium');
	await expect(page.getByText('Top result · Country · JAM')).toBeVisible();
	await expect(page.getByRole('heading', { name: /^Athletes/ })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Show all 655 athletes' })).toHaveAttribute(
		'href',
		'/search?q=jam&type=athletes'
	);
	const tabs = page.getByRole('navigation', { name: 'Result types' });
	await expect(tabs.getByRole('link', { name: /^All/ })).toHaveAttribute('aria-current', 'page');
	await expect(tabs.getByRole('link', { name: /^Stories/ })).toHaveAttribute(
		'href',
		'/search?q=jam&type=articles'
	);
});

test('pages through one result type and refines athletes', async ({ page }) => {
	await page.goto('/search?q=jam&type=athletes');

	await expect(page.getByRole('navigation', { name: 'Pagination' })).toContainText('Page 1 of 33');
	await expect(
		page.getByRole('navigation', { name: 'Refine athletes' }).getByRole('link', { name: 'Women' })
	).toHaveAttribute('href', '/search?q=jam&type=athletes&gender=women');
});

test('answers quick search requests', async ({ request }) => {
	const response = await request.get('/internal/search?q=jam');
	const body = await response.json();

	expect(body.countries[0]).toMatchObject({ code: 'JAM', name: 'Jamaica' });
	expect(body.athletes).toHaveLength(6);
	expect((await (await request.get('/internal/search?q=j')).json()).athletes).toEqual([]);
});
