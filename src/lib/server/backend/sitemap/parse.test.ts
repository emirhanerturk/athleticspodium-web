import { describe, expect, it } from 'vitest';
import { parseSitemapPage } from './parse.js';

describe('parseSitemapPage', () => {
	it('turns meetings into edition paths and counts the pages', () => {
		const page = parseSitemapPage('meetings', {
			count: 7182,
			page_size: 10000,
			rows: [
				{
					slug: '2026-sydney-marathon',
					last_modified: '2026-09-27T13:28:14.261Z',
					champ: { slug: 'sydney-marathon' }
				}
			]
		});

		expect(page).toEqual({
			entries: [
				{ path: '/champs/sydney-marathon/2026-sydney-marathon', lastModified: '2026-09-27' }
			],
			pageCount: 1
		});
	});

	it('lists both pages of a country', () => {
		const page = parseSitemapPage('countries', {
			count: 1,
			page_size: 10000,
			rows: [{ code: 'TUR', last_modified: '2021-05-16T12:31:48.251Z' }]
		});

		expect(page.entries.map((entry) => entry.path)).toEqual([
			'/country/TUR',
			'/country/TUR/athletes'
		]);
	});

	it('skips rows that cannot form a URL', () => {
		const page = parseSitemapPage('athletes', {
			count: 20001,
			page_size: 10000,
			rows: [{ id: 7, slug: null, last_modified: '2026-01-01T00:00:00Z' }]
		});

		expect(page).toEqual({ entries: [], pageCount: 3 });
	});
});
