import { describe, expect, it } from 'vitest';
import {
	compareByYear,
	isComplete,
	markDifference,
	markValue,
	parseCompareQuery
} from './compare.js';
import type { MedalRecord } from './medal-search.js';

const medal = (year: number, place: number, mark: string): MedalRecord => ({
	id: year * 10 + place,
	meeting: { id: year, name: `${year}`, slug: `${year}`, year, city: null },
	champ: { name: 'Champ', slug: 'champ' },
	event: '100m',
	gender: 'men',
	place,
	canceled: false,
	athlete: null,
	athleteName: null,
	country: null,
	mark,
	markNote: null,
	wind: null,
	records: [],
	notes: null,
	isTeam: false
});

describe('parseCompareQuery', () => {
	it('reads both championships, the gender and the event', () => {
		const query = parseCompareQuery(new URLSearchParams('a=18&b=40&gender=women&event=10'));
		expect(query).toEqual({ a: 18, b: 40, gender: 'women', event: 10 });
		expect(isComplete(query)).toBe(true);
		expect(isComplete(parseCompareQuery(new URLSearchParams('a=18')))).toBe(false);
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
});

describe('markValue and markDifference', () => {
	it('reads seconds, minutes and hours', () => {
		expect(markValue('9.79')).toBe(9.79);
		expect(markValue('3:26.00')).toBe(206);
		expect(markValue('2:02:50')).toBe(7370);
		expect(markValue('DNF')).toBeNull();
	});

	it('writes the difference with the precision of the marks', () => {
		expect(markDifference('9.79', '9.86')).toBe('−0.07');
		expect(markDifference('8.95', '8.90')).toBe('+0.05');
		expect(markDifference('3:26.00', '3:24.50')).toBe('+1.50');
		expect(markDifference('2:03:10', '2:01:09')).toBe('+2:01');
		expect(markDifference('10.0', '10.0')).toBe('±0.0');
		expect(markDifference('10.0', null)).toBeNull();
	});
});
