import { describe, expect, it } from 'vitest';
import {
	champsFor,
	countriesFor,
	eventsFor,
	isSearchable,
	parseMedalQuery,
	yearsFor,
	type FilterChamp
} from './medal-search.js';

const europeans: FilterChamp = {
	id: 18,
	name: 'European Championships',
	slug: 'european-champs',
	category: 3,
	countries: [],
	years: [2022, 2026, 2024],
	events: { men: [10, 30], women: [10, 78], mixed: [123] }
};
const olympics: FilterChamp = { ...europeans, id: 40, name: 'Olympic Games', category: 0 };
const commonwealth: FilterChamp = {
	...europeans,
	id: 5,
	name: 'Commonwealth Games',
	category: 6,
	countries: ['GBR', 'KEN']
};
const countries = [
	{ code: 'TUR', name: 'Turkey', areas: [3] },
	{ code: 'KEN', name: 'Kenya', areas: [1] }
];

describe('parseMedalQuery', () => {
	it('reads the legacy parameters', () => {
		expect(
			parseMedalQuery(
				new URLSearchParams(
					'champs=18&country=tur&event=10&year=2026&gender=1&medal=2&page=3&order=event'
				)
			)
		).toEqual({
			champ: 18,
			country: 'TUR',
			event: 10,
			year: 2026,
			gender: 'women',
			medal: 2,
			page: 3,
			order: 'event'
		});
	});

	it('drops invalid values', () => {
		expect(
			parseMedalQuery(new URLSearchParams('champs=&country=TURKEY&medal=5&gender=7&order=x&page=0'))
		).toEqual({
			champ: null,
			country: null,
			event: null,
			year: null,
			gender: null,
			medal: null,
			page: 1,
			order: 'year'
		});
	});

	it('needs a championship or a country', () => {
		expect(isSearchable({ champ: null, country: null })).toBe(false);
		expect(isSearchable({ champ: null, country: 'TUR' })).toBe(true);
	});
});

describe('option narrowing', () => {
	it('limits countries to the championship', () => {
		expect(countriesFor(europeans, countries).map((country) => country.code)).toEqual(['TUR']);
		expect(countriesFor(commonwealth, countries).map((country) => country.code)).toEqual(['KEN']);
		expect(countriesFor(olympics, countries)).toHaveLength(2);
	});

	it('limits championships to the country', () => {
		expect(
			champsFor(countries[1], [europeans, olympics, commonwealth]).map((champ) => champ.id)
		).toEqual([40, 5]);
	});

	it('limits years and events to the championship', () => {
		expect(yearsFor(europeans, 2026)).toEqual([2026, 2024, 2022]);
		expect(yearsFor(undefined, 1862)).toEqual([1862, 1861, 1860]);
		const catalogue = [10, 30, 78, 123].map((id, rank) => ({ id, name: String(id), rank }));
		expect(eventsFor(europeans, 'women', catalogue).map((event) => event.id)).toEqual([10, 78]);
		expect(eventsFor(europeans, null, catalogue)).toHaveLength(4);
	});
});
