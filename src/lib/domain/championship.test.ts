import { describe, expect, it } from 'vitest';
import {
	archiveExtent,
	categoryGroupOf,
	championshipFacts,
	championshipStatus,
	filterByName,
	isHeld,
	programmeGrowth,
	programmeOf,
	sortChampionships,
	timelineRange,
	type ChampionshipSummary,
	type EditionRef
} from './championship.js';

const edition = (
	year: number,
	eventsCount: number,
	startDate: string | null = null
): EditionRef => ({
	name: `${year} European Championships`,
	slug: `${year}-european-championships`,
	year,
	city: `City ${year}`,
	countryCode: null,
	startDate,
	eventsCount
});

describe('isHeld', () => {
	it('uses the start date when there is one', () => {
		expect(isHeld(edition(2026, 0, '2026-08-10'), '2026-08-09')).toBe(false);
		expect(isHeld(edition(2026, 0, '2026-08-10'), '2026-08-10')).toBe(true);
	});

	it('falls back to the year', () => {
		expect(isHeld(edition(2026, 0), '2026-01-01')).toBe(true);
		expect(isHeld(edition(2027, 0), '2026-12-31')).toBe(false);
	});
});

describe('championshipFacts', () => {
	const editions = [
		edition(2028, 0, '2028-08-21'),
		edition(2026, 52, '2026-08-10'),
		edition(1938, 9),
		edition(1938, 23),
		edition(1934, 22)
	];

	it('finds the first, latest and next edition', () => {
		const facts = championshipFacts(editions, '2026-10-07');

		expect(facts.first?.year).toBe(1934);
		expect(facts.latest?.year).toBe(2026);
		expect(facts.next?.year).toBe(2028);
	});

	it('counts a year with split events as one edition', () => {
		expect(championshipFacts(editions, '2026-10-07').editionsHeld).toBe(3);
	});

	it('has no next edition when none is scheduled', () => {
		expect(championshipFacts(editions.slice(1), '2029-01-01').next).toBeNull();
	});
});

describe('programmeGrowth', () => {
	it('compares the first and latest editions with results', () => {
		const growth = programmeGrowth(
			[edition(2028, 0), edition(2026, 52), edition(1934, 22), edition(1930, 0)],
			'2026-10-07'
		);

		expect([growth?.from.year, growth?.to.year]).toEqual([1934, 2026]);
	});

	it('is empty with fewer than two editions with results', () => {
		expect(programmeGrowth([edition(2026, 52), edition(2024, 0)], '2026-10-07')).toBeNull();
	});
});

describe('programmeOf', () => {
	const catalogue = [
		{ id: 10, name: '100m', rank: 3 },
		{ id: 3, name: 'DT', rank: 90 },
		{ id: 69, name: '4x400m Mixed', rank: 120 }
	];

	it('lists events in catalogue order with long names', () => {
		const programme = programmeOf({ men: [3, 10], women: [], mixed: [69, 999] }, catalogue);

		expect(programme.men).toEqual([
			{ id: 10, longName: '100m' },
			{ id: 3, longName: 'Discus throw' }
		]);
		expect(programme.mixed).toEqual([{ id: 69, longName: 'Mixed 4x400m' }]);
	});
});

const champ = (rank: number, name: string, years: number[]): ChampionshipSummary => ({
	id: rank,
	name,
	slug: name.toLowerCase().replaceAll(' ', '-'),
	category: 0,
	rank,
	years
});

describe('categoryGroupOf', () => {
	it('finds a group by slug and falls back to global', () => {
		expect(categoryGroupOf('europe').category).toBe(3);
		expect(categoryGroupOf('mars').slug).toBe('global');
		expect(categoryGroupOf(null).slug).toBe('global');
	});
});

describe('championshipStatus', () => {
	it('names the next edition first', () => {
		expect(championshipStatus([2024, 2026, 2028], 2026)).toEqual({ kind: 'next', year: 2028 });
	});

	it('counts an edition later this year as held', () => {
		expect(championshipStatus([2022, 2026], 2026)).toEqual({ kind: 'held', year: 2026 });
	});

	it('calls last year recent and older editions last held', () => {
		expect(championshipStatus([2025], 2026)).toEqual({ kind: 'held', year: 2025 });
		expect(championshipStatus([1985, 1990], 2026)).toEqual({ kind: 'last', year: 1990 });
	});

	it('has no status without editions', () => {
		expect(championshipStatus([], 2026)).toEqual({ kind: 'none' });
	});
});

describe('filterByName', () => {
	const champs = [champ(1, 'European Championships', []), champ(2, 'Zürich Weltklasse', [])];

	it('matches parts of the name without case or accents', () => {
		expect(filterByName(champs, ' zurich ').map((item) => item.rank)).toEqual([2]);
	});

	it('keeps everything for an empty query', () => {
		expect(filterByName(champs, '  ')).toHaveLength(2);
	});
});

describe('sortChampionships', () => {
	const champs = [
		champ(1, 'Olympic Games', [1896, 2024]),
		champ(2, 'African Games', [1965, 1973, 2024]),
		champ(3, 'Lusophonia Games', []),
		champ(4, 'Asian Games', [1951, 1954, 2023])
	];
	const names = (sort: Parameters<typeof sortChampionships>[1]) =>
		sortChampionships(champs, sort).map((item) => item.name);

	it('sorts by importance, name, age and size', () => {
		expect(names('rank')).toEqual([
			'Olympic Games',
			'African Games',
			'Lusophonia Games',
			'Asian Games'
		]);
		expect(names('name')).toEqual([
			'African Games',
			'Asian Games',
			'Lusophonia Games',
			'Olympic Games'
		]);
		expect(names('oldest')).toEqual([
			'Olympic Games',
			'Asian Games',
			'African Games',
			'Lusophonia Games'
		]);
		expect(names('editions')).toEqual([
			'African Games',
			'Asian Games',
			'Olympic Games',
			'Lusophonia Games'
		]);
	});
});

describe('archiveExtent and timelineRange', () => {
	const champs = [
		champ(2, 'African Games', [1965, 2031]),
		champ(1, 'World Championships', [1983, 2031]),
		champ(3, 'Irish Championships', [1873, 2025]),
		champ(4, 'Lusophonia Games', [])
	];

	it('finds the oldest and newest editions, preferring the more important championship', () => {
		expect(archiveExtent(champs)).toEqual({
			first: { year: 1873, name: 'Irish Championships' },
			last: { year: 2031, name: 'World Championships' }
		});
	});

	it('rounds the timeline out to five years', () => {
		expect(timelineRange(archiveExtent(champs)!)).toEqual({ from: 1870, to: 2035 });
	});

	it('has no extent without editions', () => {
		expect(archiveExtent([champ(1, 'Lusophonia Games', [])])).toBeNull();
	});
});
