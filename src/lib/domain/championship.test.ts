import { describe, expect, it } from 'vitest';
import {
	championshipFacts,
	isHeld,
	programmeGrowth,
	programmeOf,
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
