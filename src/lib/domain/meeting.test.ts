import { describe, expect, it } from 'vitest';
import { meetingTiming } from './meeting.js';

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
