import { describe, expect, it } from 'vitest';
import {
	dayOf,
	dayOfDate,
	daySlug,
	everyDay,
	monthDayParam,
	parseDaySlug,
	shiftDay
} from './day.js';

describe('parseDaySlug', () => {
	it('reads a month name and a day, leap day included', () => {
		expect(parseDaySlug('october-7')).toEqual({ month: 10, day: 7 });
		expect(parseDaySlug('February-29')).toEqual({ month: 2, day: 29 });
		expect(parseDaySlug('october-07')).toEqual({ month: 10, day: 7 });
	});

	it('rejects days that do not exist', () => {
		expect(parseDaySlug('february-30')).toBeNull();
		expect(parseDaySlug('april-31')).toBeNull();
		expect(parseDaySlug('octember-1')).toBeNull();
		expect(parseDaySlug('10-07')).toBeNull();
		expect(dayOf(13, 1)).toBeNull();
	});
});

describe('days of the year', () => {
	it('writes the slug and the backend parameter', () => {
		expect(daySlug({ month: 10, day: 7 })).toBe('october-7');
		expect(monthDayParam({ month: 3, day: 1 })).toBe('03-01');
		expect(dayOfDate('2026-10-07')).toEqual({ month: 10, day: 7 });
	});

	it('steps across months and the end of the year, through 29 February', () => {
		expect(shiftDay({ month: 2, day: 28 }, 1)).toEqual({ month: 2, day: 29 });
		expect(shiftDay({ month: 3, day: 1 }, -1)).toEqual({ month: 2, day: 29 });
		expect(shiftDay({ month: 12, day: 31 }, 1)).toEqual({ month: 1, day: 1 });
		expect(shiftDay({ month: 1, day: 1 }, -1)).toEqual({ month: 12, day: 31 });
	});

	it('lists all 366 days in order', () => {
		const days = everyDay();
		expect(days).toHaveLength(366);
		expect(days[59]).toEqual({ month: 2, day: 29 });
		expect(days.at(-1)).toEqual({ month: 12, day: 31 });
	});
});
