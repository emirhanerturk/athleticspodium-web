import { describe, expect, it } from 'vitest';
import {
	champsFor,
	countriesFor,
	eventsFor,
	groupByEdition,
	isSearchable,
	parseLegacyMedalQuery,
	parseMedalQuery,
	yearsFor,
	type FilterChamp,
	type MedalRecord
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
	it('reads the readable parameters', () => {
		expect(
			parseMedalQuery(
				new URLSearchParams(
					'champ=18&country=tur&event=10&year=2026&gender=women&medal=silver&page=3'
				)
			)
		).toEqual({
			champ: 18,
			country: 'TUR',
			event: 10,
			year: 2026,
			gender: 'women',
			medal: 2,
			page: 3
		});
	});

	it('drops invalid values', () => {
		expect(
			parseMedalQuery(new URLSearchParams('champ=&country=TURKEY&medal=5&gender=1&page=0'))
		).toEqual({
			champ: null,
			country: null,
			event: null,
			year: null,
			gender: null,
			medal: null,
			page: 1
		});
	});

	it('reads the legacy parameters for the redirect', () => {
		expect(
			parseLegacyMedalQuery(
				new URLSearchParams('champs=18&country=TUR&gender=1&medal=1&order=athlete')
			)
		).toMatchObject({ champ: 18, country: 'TUR', gender: 'women', medal: 1, page: 1 });
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

describe('groupByEdition', () => {
	let nextId = 1;
	const record = (
		meetingId: number,
		event: string,
		place: number,
		extra: Partial<MedalRecord> = {}
	): MedalRecord => ({
		id: nextId++,
		meeting: {
			id: meetingId,
			name: `${meetingId}`,
			slug: `${meetingId}`,
			year: 2018,
			city: 'Berlin'
		},
		champ: { name: 'European Championships', slug: 'european-champs' },
		event,
		gender: 'men',
		place,
		canceled: false,
		athlete: null,
		athleteName: null,
		country: { code: 'TUR', name: 'Turkey' },
		mark: null,
		markNote: null,
		wind: null,
		records: [],
		notes: null,
		isTeam: false,
		...extra
	});

	it('keeps editions in order, joins relay legs and leaves withdrawn medals out of the tally', () => {
		const relay = { isTeam: true, mark: '37.98' };
		const editions = groupByEdition([
			record(2018, '200m', 1),
			record(2018, '4x100m', 2, relay),
			record(2012, '1500m', 1, { canceled: true }),
			record(2018, '4x100m', 2, relay),
			record(2012, '1500m', 2)
		]);

		expect(editions.map(({ meeting, entries }) => [meeting.id, entries.length])).toEqual([
			[2018, 2],
			[2012, 2]
		]);
		expect(editions[0].entries[1].team).toHaveLength(2);
		expect(editions[0].tally).toEqual({ gold: 1, silver: 1, bronze: 0, withdrawn: 0 });
		expect(editions[1].tally).toEqual({ gold: 0, silver: 1, bronze: 0, withdrawn: 1 });
	});
});
