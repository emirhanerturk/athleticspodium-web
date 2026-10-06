import { daysBetween, type IsoDate } from './date.js';

export interface MeetingSummary {
	name: string;
	slug: string;
	champ: { name: string; slug: string };
	city: string | null;
	countryCode: string | null;
	startDate: IsoDate | null;
	endDate: IsoDate | null;
}

export type MeetingTiming =
	| { status: 'scheduled'; daysToGo: number }
	| { status: 'live' }
	| { status: 'finished' }
	| { status: 'unscheduled' };

export function meetingTiming(
	meeting: Pick<MeetingSummary, 'startDate' | 'endDate'>,
	today: IsoDate
): MeetingTiming {
	if (!meeting.startDate) return { status: 'unscheduled' };

	const daysToGo = daysBetween(today, meeting.startDate);
	if (daysToGo > 0) return { status: 'scheduled', daysToGo };

	const lastDay = meeting.endDate ?? meeting.startDate;
	return daysBetween(today, lastDay) >= 0 ? { status: 'live' } : { status: 'finished' };
}
