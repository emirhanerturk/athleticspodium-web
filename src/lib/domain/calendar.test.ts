import { describe, expect, it } from 'vitest';
import {
	groupByMonth,
	isVisible,
	monthCounts,
	seasonCounts,
	type CalendarMeeting
} from './calendar.js';

const meeting = (
	name: string,
	category: number,
	startDate: string | null,
	endDate: string | null = null
): CalendarMeeting => ({
	name,
	slug: name.toLowerCase().replaceAll(' ', '-'),
	champ: { name, slug: name, category },
	city: null,
	countryCode: null,
	startDate,
	endDate,
	hasResults: false
});

const season = [
	meeting('European XC', 3, '2026-12-13'),
	meeting('Turkish Championships', 7, '2026-07-20', '2026-07-22'),
	meeting('Youth Olympics', 0, '2026-10-30', '2026-11-15'),
	meeting('Asian Games', 2, '2026-09-19', '2026-10-04'),
	meeting('Pacific Games', 5, null)
];

describe('isVisible', () => {
	it('hides national championships unless they are switched on', () => {
		expect(isVisible(season[1], 'all', false)).toBe(false);
		expect(isVisible(season[1], 'all', true)).toBe(true);
		expect(isVisible(season[1], 'global', true)).toBe(false);
	});

	it('filters by level', () => {
		expect(isVisible(season[0], 'continental', false)).toBe(true);
		expect(isVisible(season[0], 'global', false)).toBe(false);
	});
});

describe('groupByMonth', () => {
	it('groups dated meetings by start month and keeps undated ones apart', () => {
		const { months, undated } = groupByMonth(season);

		expect(months.map(({ month, meetings }) => [month, meetings.map((item) => item.name)])).toEqual(
			[
				[7, ['Turkish Championships']],
				[9, ['Asian Games']],
				[10, ['Youth Olympics']],
				[12, ['European XC']]
			]
		);
		expect(undated.map((item) => item.name)).toEqual(['Pacific Games']);
	});
});

describe('seasonCounts and monthCounts', () => {
	it('counts held, coming and undated meetings', () => {
		expect(seasonCounts(season, '2026-10-07')).toEqual({
			shown: 5,
			held: 2,
			toCome: 3,
			dated: 4,
			undated: 1
		});
	});

	it('counts meetings per start month', () => {
		expect(monthCounts(season)).toEqual([0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1]);
	});
});
