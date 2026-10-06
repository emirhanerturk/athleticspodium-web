import { describe, expect, it } from 'vitest';
import {
	formatDate,
	formatDateRange,
	formatDayMonth,
	formatDaysToGo,
	formatYearSpan
} from './date.js';

describe('formatDate', () => {
	it('writes day, short month and year', () => {
		expect(formatDate('2026-09-27')).toBe('27 Sep 2026');
	});
});

describe('formatDateRange', () => {
	it('spans two months', () => {
		expect(formatDateRange('2026-10-30', '2026-11-15')).toBe('30 Oct – 15 Nov');
	});

	it('shares the month inside one month', () => {
		expect(formatDateRange('2026-08-10', '2026-08-16')).toBe('10–16 Aug');
	});

	it('writes both years when the range crosses a year', () => {
		expect(formatDateRange('2026-12-30', '2027-01-02')).toBe('30 Dec 2026 – 2 Jan 2027');
	});

	it('shows a single day without an end date', () => {
		expect(formatDateRange('2026-10-06', null)).toBe('6 Oct');
	});
});

describe('formatDaysToGo', () => {
	it('says tomorrow for one day', () => {
		expect(formatDaysToGo(1)).toBe('tomorrow');
	});

	it('counts days otherwise', () => {
		expect(formatDaysToGo(25)).toBe('in 25 days');
	});
});

describe('formatYearSpan', () => {
	it('writes one year for a single season', () => {
		expect(formatYearSpan(2016, 2016)).toBe('2016');
	});

	it('shortens the last year inside one century', () => {
		expect(formatYearSpan(2016, 2026)).toBe('2016–26');
	});

	it('writes both years in full across centuries', () => {
		expect(formatYearSpan(1998, 2006)).toBe('1998–2006');
	});
});

describe('formatDayMonth', () => {
	it('writes the day and short month', () => {
		expect(formatDayMonth('2026-10-07')).toBe('7 Oct');
	});
});
