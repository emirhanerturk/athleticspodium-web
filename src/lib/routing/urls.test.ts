import { describe, expect, it } from 'vitest';
import { medalSearchUrl, missingInformationUrl, searchUrl } from './urls.js';

describe('medalSearchUrl', () => {
	it('filters the medal search by championship', () => {
		expect(medalSearchUrl({ champ: 18 })).toBe('/medals/search?champs=18');
	});

	it('adds the event and gender', () => {
		expect(medalSearchUrl({ champ: 18, event: 10, gender: 'women' })).toBe(
			'/medals/search?champs=18&event=10&gender=1'
		);
	});
});

describe('searchUrl', () => {
	it('keeps only the parameters that differ from the defaults', () => {
		expect(searchUrl({ query: 'bolt' })).toBe('/search?q=bolt');
		expect(
			searchUrl({
				query: 'an',
				scope: 'athletes',
				page: 2,
				filters: { gender: 'women', bornFrom: 1990, bornTo: null, olympian: true }
			})
		).toBe('/search?q=an&type=athletes&gender=women&born_from=1990&olympian=1&page=2');
	});
});

describe('missingInformationUrl', () => {
	it('leaves out the first tab and empty filters', () => {
		expect(missingInformationUrl()).toBe('/missing-information');
		expect(missingInformationUrl({ tab: 'medallists', query: ' ' })).toBe('/missing-information');
		expect(missingInformationUrl({ tab: 'relays', query: 'NGR', gap: '1989 4x100 men' })).toBe(
			'/missing-information?tab=relays&q=NGR&gap=1989+4x100+men'
		);
	});
});
