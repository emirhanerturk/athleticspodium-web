import { describe, expect, it } from 'vitest';
import {
	medalCountdownUrl,
	medalSearchUrl,
	missingInformationUrl,
	onThisDayUrl,
	searchUrl
} from './urls.js';

describe('medalSearchUrl', () => {
	it('filters the medal search by championship', () => {
		expect(medalSearchUrl({ champ: 18 })).toBe('/medals?champ=18');
	});

	it('writes the gender and the medal as words', () => {
		expect(medalSearchUrl({ champ: 18, event: 10, gender: 'women', medal: 1, page: 2 })).toBe(
			'/medals?champ=18&event=10&gender=women&medal=gold&page=2'
		);
	});
});

describe('medalCountdownUrl', () => {
	it('keeps whichever of the nation and the championship is chosen', () => {
		expect(medalCountdownUrl('tur', 18)).toBe('/medals/countdown?country=TUR&champ=18');
		expect(medalCountdownUrl(null, 18)).toBe('/medals/countdown?champ=18');
		expect(medalCountdownUrl(null, null)).toBe('/medals/countdown');
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

describe('onThisDayUrl', () => {
	it('names the month and adds each list’s page after the first', () => {
		expect(onThisDayUrl({ month: 2, day: 29 })).toBe('/on-this-day/february-29');
		expect(onThisDayUrl({ month: 10, day: 7 }, { born: 2, died: 1 })).toBe(
			'/on-this-day/october-7?born=2'
		);
		expect(onThisDayUrl({ month: 10, day: 7 }, { born: 3, died: 2 })).toBe(
			'/on-this-day/october-7?born=3&died=2'
		);
	});
});
