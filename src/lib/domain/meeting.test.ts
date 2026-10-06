import { describe, expect, it } from 'vitest';
import { meetingTiming, monthTicks, timelinePlacement } from './meeting.js';

describe('meetingTiming', () => {
	const meeting = { startDate: '2026-10-30', endDate: '2026-11-15' };

	it('counts the days to a scheduled meeting', () => {
		expect(meetingTiming(meeting, '2026-10-05')).toEqual({ status: 'scheduled', daysToGo: 25 });
	});

	it('is live from the first to the last day', () => {
		expect(meetingTiming(meeting, '2026-10-30')).toEqual({ status: 'live' });
		expect(meetingTiming(meeting, '2026-11-15')).toEqual({ status: 'live' });
	});

	it('is finished after the last day', () => {
		expect(meetingTiming(meeting, '2026-11-16')).toEqual({ status: 'finished' });
	});

	it('treats a one-day meeting without an end date as live on its day', () => {
		expect(meetingTiming({ startDate: '2026-10-06', endDate: null }, '2026-10-06')).toEqual({
			status: 'live'
		});
	});

	it('is unscheduled without a start date', () => {
		expect(meetingTiming({ startDate: null, endDate: null }, '2026-10-06')).toEqual({
			status: 'unscheduled'
		});
	});
});

describe('timelinePlacement and monthTicks', () => {
	it('places meetings by days from today and alternates rows', () => {
		const placed = timelinePlacement(
			[
				{ startDate: '2026-10-07' },
				{ startDate: '2026-11-06' },
				{ startDate: null },
				{ startDate: '2027-12-01' }
			],
			'2026-10-07',
			60
		);

		expect(placed.map(({ offset, row }) => [offset, row])).toEqual([
			[0, 0],
			[0.5, 1],
			[1, 0]
		]);
	});

	it('marks the start of each month inside the span', () => {
		expect(monthTicks('2026-10-20', 60)).toEqual([
			{ label: 'Oct', offset: 0 },
			{ label: 'Nov', offset: 12 / 60 },
			{ label: 'Dec', offset: 42 / 60 }
		]);
	});
});
