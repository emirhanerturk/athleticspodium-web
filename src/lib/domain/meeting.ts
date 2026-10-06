import type { AthleteRef } from './athlete.js';
import { daysBetween, type IsoDate } from './date.js';
import type { NationTally } from './edition.js';

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

export interface TimelineItem<T> {
	item: T;
	offset: number;
	row: 0 | 1;
}

export function timelinePlacement<T extends Pick<MeetingSummary, 'startDate'>>(
	meetings: T[],
	today: IsoDate,
	spanDays: number
): TimelineItem<T>[] {
	return meetings
		.filter((meeting) => meeting.startDate)
		.map((meeting, index) => ({
			item: meeting,
			offset: Math.min(1, Math.max(0, daysBetween(today, meeting.startDate!) / spanDays)),
			row: (index % 2) as 0 | 1
		}));
}

export function monthTicks(today: IsoDate, spanDays: number): { label: string; offset: number }[] {
	const MONTHS = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	const start = new Date(`${today}T00:00:00Z`);
	const ticks = [{ label: MONTHS[start.getUTCMonth()], offset: 0 }];

	for (let month = 1; ; month++) {
		const first = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + month, 1));
		const offset = daysBetween(today, first.toISOString().slice(0, 10)) / spanDays;
		if (offset >= 1) return ticks;
		ticks.push({ label: MONTHS[first.getUTCMonth()], offset });
	}
}

export interface DeskWinner {
	athlete: AthleteRef | null;
	name: string;
	countryCode: string | null;
	event: string;
	mark: string | null;
}

export interface ResultsDeskEntry {
	meeting: MeetingSummary;
	summary: { kind: 'nations'; nations: NationTally[] } | { kind: 'winners'; winners: DeskWinner[] };
}
