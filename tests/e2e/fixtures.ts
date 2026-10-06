import { test as base } from '@playwright/test';

export { expect } from '@playwright/test';

export const test = base.extend({
	page: async ({ page }, use) => {
		await page.route('https://www.googletagmanager.com/**', (route) =>
			route.fulfill({ status: 200, contentType: 'application/javascript', body: '' })
		);
		await use(page);
	}
});
