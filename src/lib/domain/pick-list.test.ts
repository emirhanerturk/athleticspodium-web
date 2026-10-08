import { describe, expect, it } from 'vitest';
import {
	champPicks,
	countPicks,
	eventPicks,
	matchPicks,
	nationPicks,
	yearPicks
} from './pick-list.js';

const nations = nationPicks([
	{ code: 'ALG', name: 'Algeria' },
	{ code: 'GER', name: 'Germany' },
	{ code: 'GDR', name: 'Germany DR (1949-89)' },
	{ code: 'CIV', name: 'Côte d’Ivoire' },
	{ code: 'NIG', name: 'Niger' },
	{ code: 'TUR', name: 'Turkey' }
]);
const labels = (groups: ReturnType<typeof matchPicks>) =>
	groups.flatMap((group) => group.options.map((option) => option.label));

describe('matchPicks', () => {
	it('matches the start of words, not the middle', () => {
		expect(labels(matchPicks(nations, 'ger'))).toEqual(['Germany', 'Germany DR (1949-89)']);
	});

	it('ignores case and accents and needs every word of the query', () => {
		expect(labels(matchPicks(nations, 'COTE'))).toEqual(['Côte d’Ivoire']);
		expect(labels(matchPicks(nations, 'germany dr'))).toEqual(['Germany DR (1949-89)']);
	});

	it('finds an option by its keywords, such as the country code', () => {
		expect(labels(matchPicks(nations, 'tur'))).toEqual(['Turkey']);
		expect(labels(matchPicks(nations, 'gdr'))).toEqual(['Germany DR (1949-89)']);
	});

	it('keeps every option for an empty query and drops empty groups', () => {
		expect(matchPicks(nations, '  ')).toBe(nations);
		expect(matchPicks(nations, 'xyz')).toEqual([]);
	});
});

describe('champPicks', () => {
	it('groups championships by area, with the span of their years', () => {
		const groups = champPicks([
			{ id: 18, name: 'European Championships', category: 3, years: [1934, 2026, 1938] },
			{ id: 40, name: 'Olympic Games', category: 0, years: [1896, 2024] },
			{ id: 99, name: 'Strange Games', category: 42, years: [2001] }
		]);

		expect(
			groups.map((group) => [group.label, group.options.map((option) => option.hint)])
		).toEqual([
			['Global', ['1896–2024']],
			['Europe', ['1934–2026']],
			['Other', ['2001']]
		]);
	});
});

describe('eventPicks', () => {
	const groups = eventPicks([
		{ id: 10, name: '100m', rank: 1 },
		{ id: 3, name: '10,000m', rank: 2 },
		{ id: 111, name: 'HJ', rank: 3 },
		{ id: 999, name: 'Tug of war', rank: 4 }
	]);

	it('groups events by discipline with their long names', () => {
		expect(
			groups.map((group) => [group.label, group.options.map((option) => option.label)])
		).toEqual([
			['Sprints', ['100m']],
			['Middle & long', ['10,000m']],
			['Jumps', ['High jump']],
			['Other', ['Tug of war']]
		]);
	});

	it('finds events by short name and by marks written without separators', () => {
		expect(labels(matchPicks(groups, 'hj'))).toEqual(['High jump']);
		expect(labels(matchPicks(groups, '10000'))).toEqual(['10,000m']);
		expect(labels(matchPicks(groups, 'high'))).toEqual(['High jump']);
	});

	it('takes the option values from the caller', () => {
		expect(eventPicks([{ id: 10, name: '100m', rank: 1 }], (event) => `women-${event.id}`)).toEqual(
			[{ label: 'Sprints', options: [expect.objectContaining({ value: 'women-10' })] }]
		);
	});
});

describe('yearPicks and countPicks', () => {
	it('lists the years in the given order and counts the options', () => {
		const years = yearPicks([2024, 2016]);

		expect(labels(years)).toEqual(['2024', '2016']);
		expect(countPicks([...years, ...nations])).toBe(8);
	});
});
