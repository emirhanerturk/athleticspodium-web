import { describe, expect, it } from 'vitest';
import {
	addTallies,
	areaTabOf,
	groupByInitial,
	inArea,
	matchesCountry,
	internationalMedals,
	medalsByLevel,
	nationalTitles,
	type ChampionshipMedals
} from './country.js';

const row = (
	rank: number,
	category: number,
	gold: number,
	silver: number,
	bronze: number
): ChampionshipMedals => ({
	champ: { id: rank, name: `Champ ${rank}`, slug: `champ-${rank}`, category, rank },
	tally: { gold, silver, bronze, total: gold + silver + bronze }
});

const medals = [
	row(30, 3, 12, 10, 12),
	row(1, 0, 0, 1, 2),
	row(200, 7, 3284, 0, 0),
	row(90, 8, 12, 14, 19),
	row(60, 6, 199, 242, 293)
];

describe('medalsByLevel', () => {
	it('groups championships by level in rank order', () => {
		const groups = medalsByLevel(medals);

		expect(groups.global.map((item) => item.champ.rank)).toEqual([1]);
		expect(groups.continental.map((item) => item.champ.rank)).toEqual([30]);
		expect(groups.regional.map((item) => item.champ.rank)).toEqual([60]);
		expect(groups.road.map((item) => item.champ.rank)).toEqual([90]);
		expect(groups.national.map((item) => item.champ.rank)).toEqual([200]);
	});
});

describe('internationalMedals and nationalTitles', () => {
	it('keep national championships apart', () => {
		expect(internationalMedals(medals)).toEqual({
			gold: 223,
			silver: 267,
			bronze: 326,
			total: 816
		});
		expect(nationalTitles(medals)).toBe(3284);
	});
});

describe('addTallies', () => {
	it('starts from zero', () => {
		expect(addTallies([])).toEqual({ gold: 0, silver: 0, bronze: 0, total: 0 });
	});
});

describe('country directory helpers', () => {
	const turkey = { code: 'TUR', name: 'Turkey', areas: [3], isCountry: true };
	const cyprus = { code: 'CYP', name: 'Cyprus', areas: [3, 2], isCountry: true };
	const curacao = { code: 'CUW', name: 'Curaçao', areas: [4], isCountry: true };

	it('finds the area tab by slug and falls back to all', () => {
		expect(areaTabOf('asia').category).toBe(2);
		expect(areaTabOf(null).label).toBe('All');
		expect(areaTabOf('mars').label).toBe('All');
	});

	it('places a country in each of its areas', () => {
		expect(inArea(cyprus, areaTabOf('asia'))).toBe(true);
		expect(inArea(turkey, areaTabOf('asia'))).toBe(false);
		expect(inArea(turkey, areaTabOf(null))).toBe(true);
	});

	it('matches names without accents and codes exactly', () => {
		expect(matchesCountry(curacao, 'curac')).toBe(true);
		expect(matchesCountry(turkey, 'tur')).toBe(true);
		expect(matchesCountry(turkey, 'tu')).toBe(true);
		expect(matchesCountry(cyprus, 'TUR')).toBe(false);
	});

	it('groups by the first letter without accents', () => {
		expect(
			groupByInitial([turkey, curacao, cyprus]).map((group) => [group.initial, group.items.length])
		).toEqual([
			['C', 2],
			['T', 1]
		]);
	});
});
