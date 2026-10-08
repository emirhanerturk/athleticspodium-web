import { describe, expect, it } from 'vitest';
import {
	articleUrl,
	athleteUrl,
	contactUrl,
	countryAthletesUrl,
	medalCountdownUrl,
	medalSearchUrl,
	meetingUrl,
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

describe('countryAthletesUrl', () => {
	it('leaves the defaults out', () => {
		expect(countryAthletesUrl('tur')).toBe('/country/TUR/athletes');
		expect(countryAthletesUrl('TUR', { q: '  ', sort: 'golds', page: 1 })).toBe(
			'/country/TUR/athletes'
		);
	});

	it('keeps the search, the filters, the sort and the page', () => {
		expect(
			countryAthletesUrl('TUR', {
				q: ' yasemin   can ',
				gender: 'women',
				era: 'since-2000',
				sort: 'medals',
				page: 2
			})
		).toBe('/country/TUR/athletes?q=yasemin+can&gender=women&era=since-2000&sort=medals&page=2');
	});
});

describe('contactUrl', () => {
	it('opens the about contact form, on a topic when given', () => {
		expect(contactUrl()).toBe('/about#contact');
		expect(contactUrl('other')).toBe('/about?topic=other#contact');
	});
});

describe('slug addresses', () => {
	it('encodes slugs that hold a query mark, spaces or letters outside ASCII', () => {
		expect(athleteUrl({ id: 37346, slug: 'zheng-?' })).toBe('/athlete/37346/zheng-%3F');
		expect(articleUrl({ id: 333, slug: 'new-era-for-ethiopia?' })).toBe(
			'/article/333/new-era-for-ethiopia%3F'
		);
		expect(athleteUrl({ id: 76950, slug: 'Tacca Lisbeth Huarachi' })).toBe(
			'/athlete/76950/Tacca%20Lisbeth%20Huarachi'
		);
		expect(athleteUrl({ id: 41583, slug: 'maria-böcke' })).toBe('/athlete/41583/maria-b%C3%B6cke');
	});

	it('keeps commas and apostrophes as the legacy links did', () => {
		expect(meetingUrl('european-cup-10000m', '1997-european-cup-10,000m')).toBe(
			'/champs/european-cup-10000m/1997-european-cup-10,000m'
		);
		expect(athleteUrl({ id: 49030, slug: "h'mimed-rahouli" })).toBe(
			"/athlete/49030/h'mimed-rahouli"
		);
	});

	it('round-trips every slug, so the canonical check never redirects to itself', () => {
		for (const slug of ['zheng-?', 'a#b', '100%', 'Tacca Lisbeth Huarachi', 'mariş', '10,000m']) {
			const path = athleteUrl({ id: 1, slug });
			expect(decodeURIComponent(path.split('/').at(-1)!)).toBe(slug);
		}
	});
});
