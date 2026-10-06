import { describe, expect, it } from 'vitest';
import { careerSummary, levelCounts, medalsByChampionship, olympicAppearances } from './career.js';
import type { Result } from './result.js';

const OLYMPICS = { id: 40, name: 'Olympic Games', slug: 'olympic-games', category: 0, rank: 1 };
const EUROPEANS = { id: 2, name: 'European Championships', slug: 'euro', category: 3, rank: 5 };
const NATIONALS = { id: 9, name: 'Ukrainian Championships', slug: 'ukr', category: 7, rank: 99 };

let nextId = 1;
function result(
	champ: Result['champ'],
	year: number,
	place: number | null,
	extra: Partial<Result> = {}
): Result {
	return {
		id: nextId++,
		place,
		canceled: false,
		mark: '2.00',
		markNote: null,
		wind: null,
		records: [],
		notes: null,
		isTeam: false,
		event: { id: 1, name: 'HJ' },
		champ,
		meeting: {
			id: champ.id * 10000 + year,
			name: `${year} ${champ.name}`,
			slug: `${year}-${champ.slug}`,
			year,
			startDate: null,
			city: null,
			countryCode: null
		},
		...extra
	};
}

const career = [
	result(OLYMPICS, 2024, 1),
	result(OLYMPICS, 2021, 3),
	result(EUROPEANS, 2022, 1),
	result(EUROPEANS, 2018, 5),
	result(EUROPEANS, 2017, 2, { canceled: true }),
	result(NATIONALS, 2021, 1),
	result(NATIONALS, 2020, 2)
];

describe('careerSummary', () => {
	it('counts international medals, national titles and finals apart', () => {
		expect(careerSummary(career)).toEqual({
			international: { gold: 2, silver: 0, bronze: 1, total: 3 },
			nationalTitles: 1,
			placings: 1,
			podiumYears: { first: 2021, last: 2024 }
		});
	});

	it('has no podium years without an international medal', () => {
		expect(careerSummary([result(NATIONALS, 2021, 1)]).podiumYears).toBeNull();
	});
});

describe('medalsByChampionship', () => {
	it('tallies international medals per championship in rank order', () => {
		expect(
			medalsByChampionship(career).map(({ champ, total, gold }) => [champ.name, gold, total])
		).toEqual([
			['Olympic Games', 1, 2],
			['European Championships', 1, 1]
		]);
	});
});

describe('olympicAppearances', () => {
	it('pairs every Games with the best result there, newest first', () => {
		const games = [
			{
				id: 402021,
				name: '2020 Olympic Games',
				slug: 'tokyo',
				year: 2021,
				city: 'Tokyo',
				champSlug: 'olympic-games'
			},
			{
				id: 402016,
				name: '2016 Olympic Games',
				slug: 'rio',
				year: 2016,
				city: 'Rio',
				champSlug: 'olympic-games'
			},
			{
				id: 402024,
				name: '2024 Olympic Games',
				slug: 'paris',
				year: 2024,
				city: 'Paris',
				champSlug: 'olympic-games'
			}
		];

		expect(
			olympicAppearances(games, career).map(({ games, best }) => [games.city, best?.place ?? null])
		).toEqual([
			['Paris', 1],
			['Tokyo', 3],
			['Rio', null]
		]);
	});
});

describe('levelCounts', () => {
	it('counts rows per level in display order and skips empty levels', () => {
		expect(levelCounts(career)).toEqual([
			{ level: 'global', count: 2 },
			{ level: 'continental', count: 3 },
			{ level: 'national', count: 2 }
		]);
	});
});
