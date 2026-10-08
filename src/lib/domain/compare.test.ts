import { describe, expect, it } from 'vitest';
import {
	champStats,
	compareByYear,
	doubleWinners,
	isComplete,
	markValue,
	parseCompareQuery,
	raceName,
	racesFor
} from './compare.js';
import type { FilterChamp, MedalRecord } from './medal-search.js';

let nextId = 1;

const medal = (
	year: number,
	place: number,
	mark: string,
	options: { athlete?: number; country?: string; canceled?: boolean; team?: boolean } = {}
): MedalRecord => ({
	id: nextId++,
	meeting: { id: year, name: `${year}`, slug: `${year}`, year, city: null },
	champ: { name: 'Champ', slug: 'champ' },
	event: '100m',
	gender: 'men',
	place,
	canceled: options.canceled ?? false,
	athlete: options.athlete
		? {
				id: options.athlete,
				slug: `athlete-${options.athlete}`,
				firstName: 'Athlete',
				lastName: String(options.athlete),
				countryCode: options.country ?? null,
				olympicChampion: false,
				birthYear: null
			}
		: null,
	athleteName: null,
	country: options.country ? { code: options.country, name: options.country } : null,
	mark,
	markNote: null,
	wind: null,
	records: [],
	notes: null,
	isTeam: options.team ?? false
});

const champ = (id: number, events: Partial<FilterChamp['events']>): FilterChamp => ({
	id,
	name: `Champ ${id}`,
	slug: `champ-${id}`,
	category: 1,
	countries: [],
	years: [],
	events: { men: [], women: [], mixed: [], ...events }
});

describe('parseCompareQuery', () => {
	it('reads both championships, the gender and the event', () => {
		const query = parseCompareQuery(new URLSearchParams('a=18&b=40&gender=women&event=10'));
		expect(query).toEqual({ a: 18, b: 40, gender: 'women', event: 10 });
		expect(isComplete(query)).toBe(true);
		expect(isComplete(parseCompareQuery(new URLSearchParams('a=18')))).toBe(false);
	});

	it('reads the gender and the event from the race menu of the form', () => {
		expect(parseCompareQuery(new URLSearchParams('a=18&b=40&race=women-10'))).toEqual({
			a: 18,
			b: 40,
			gender: 'women',
			event: 10
		});
	});
});

describe('raceName', () => {
	it('names the race by gender and event', () => {
		expect(raceName('women', '100m')).toBe('Women’s 100m');
		expect(raceName('men', 'HJ')).toBe('Men’s high jump');
		expect(raceName('mixed', '4x400m')).toBe('Mixed 4x400m');
	});
});

describe('racesFor', () => {
	it('lists the events both championships have held, by gender', () => {
		const catalogue = [
			{ id: 10, name: '100m', rank: 1 },
			{ id: 20, name: '1500m', rank: 2 }
		];
		const races = racesFor(
			[champ(1, { men: [10, 20], women: [10] }), champ(2, { men: [10], women: [10, 20] })],
			catalogue
		);

		expect(races.map((group) => [group.gender, group.events.map((event) => event.id)])).toEqual([
			['men', [10]],
			['women', [10]]
		]);
		expect(racesFor([], catalogue)).toEqual([]);
	});
});

describe('compareByYear', () => {
	it('lines up the podiums of both championships by year, newest first', () => {
		const years = compareByYear(
			[medal(2024, 2, '9.81'), medal(2024, 1, '9.79')],
			[medal(2022, 1, '9.86')]
		);

		expect(years.map((item) => [item.year, item.a.map((row) => row.place), item.b.length])).toEqual(
			[
				[2024, [1, 2], 0],
				[2022, [], 1]
			]
		);
	});

	it('shows a relay team once and a withdrawn medal after the one that replaced it', () => {
		const team = [1, 2, 3, 4].map((runner) =>
			medal(2024, 1, '37.50', { athlete: runner, country: 'JAM', team: true })
		);
		const [year] = compareByYear(
			[
				medal(2023, 1, '9.80', { athlete: 1, canceled: true }),
				medal(2023, 1, '9.85', { athlete: 2 })
			],
			team
		).toSorted((x, y) => x.year - y.year);

		expect(year.a.map((row) => row.canceled)).toEqual([false, true]);
		expect(compareByYear([], team)[0].b).toHaveLength(1);
	});
});

describe('champStats', () => {
	const years = compareByYear(
		[
			medal(2024, 1, '9.79', { athlete: 1, country: 'JAM' }),
			medal(2020, 1, '9.80', { athlete: 1, country: 'JAM' }),
			medal(2016, 1, '9.70', { athlete: 2, country: 'USA', canceled: true }),
			medal(2016, 1, '9.85', { athlete: 3, country: 'CAN' }),
			medal(2012, 2, '9.75', { athlete: 4, country: 'USA' })
		],
		[medal(2023, 1, '8.95', { athlete: 5, country: 'USA' })]
	);

	it('counts the editions, the best winning mark, the most titles and the winning nations', () => {
		const stats = champStats(years, 'a', 'time');

		expect(stats.editions).toBe(4);
		expect(stats.since).toBe(2012);
		expect(stats.best?.mark).toBe('9.79');
		expect(stats.titles).toEqual({
			count: 2,
			winners: [{ key: 'athlete:1', name: 'Athlete 1', countryCode: 'JAM' }]
		});
		expect(stats.nations).toBe(2);
	});

	it('takes the highest mark for distances', () => {
		expect(champStats(years, 'a', 'distance').best?.mark).toBe('9.85');
	});
});

describe('doubleWinners', () => {
	it('lists those who won gold at both championships, most golds first', () => {
		const years = compareByYear(
			[medal(2024, 1, '9.79', { athlete: 1 }), medal(2016, 1, '9.81', { athlete: 1 })],
			[medal(2023, 1, '9.83', { athlete: 1 }), medal(2019, 1, '9.76', { athlete: 2 })]
		);

		expect(doubleWinners(years)).toEqual([
			{ key: 'athlete:1', name: 'Athlete 1', countryCode: null, golds: 3 }
		]);
	});
});

describe('markValue', () => {
	it('reads seconds, minutes and hours', () => {
		expect(markValue('9.79')).toBe(9.79);
		expect(markValue('3:26.00')).toBe(206);
		expect(markValue('2:02:50')).toBe(7370);
		expect(markValue('DNF')).toBeNull();
	});
});
