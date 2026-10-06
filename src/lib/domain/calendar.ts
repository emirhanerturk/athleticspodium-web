import { levelOf, type Level } from './championship.js';
import type { IsoDate } from './date.js';

export interface CalendarMeeting {
	name: string;
	slug: string;
	champ: { name: string; slug: string; category: number };
	city: string | null;
	countryCode: string | null;
	startDate: IsoDate | null;
	endDate: IsoDate | null;
	hasResults: boolean;
}

export type LevelFilter = 'all' | Exclude<Level, 'national'>;

export const LEVEL_FILTERS: { key: LevelFilter; label: string }[] = [
	{ key: 'all', label: 'All' },
	{ key: 'global', label: 'Global' },
	{ key: 'continental', label: 'Continental' },
	{ key: 'regional', label: 'Regional & multi-sport' },
	{ key: 'road', label: 'Road races' }
];

export const FIRST_SEASON = 1860;
export const SEASONS_AHEAD = 5;

export function isVisible(
	meeting: CalendarMeeting,
	filter: LevelFilter,
	showNational: boolean
): boolean {
	const level = levelOf(meeting.champ.category);
	if (level === 'national') return showNational && filter === 'all';
	return filter === 'all' || filter === level;
}

export function lastDayOf(meeting: Pick<CalendarMeeting, 'startDate' | 'endDate'>): IsoDate | null {
	return meeting.endDate ?? meeting.startDate;
}

export function groupByMonth(meetings: CalendarMeeting[]): {
	months: { month: number; meetings: CalendarMeeting[] }[];
	undated: CalendarMeeting[];
} {
	const dated = meetings
		.filter((meeting) => meeting.startDate)
		.sort((a, b) => a.startDate!.localeCompare(b.startDate!) || a.name.localeCompare(b.name));
	const months = new Map<number, CalendarMeeting[]>();
	for (const meeting of dated) {
		const month = Number(meeting.startDate!.slice(5, 7));
		months.set(month, [...(months.get(month) ?? []), meeting]);
	}

	return {
		months: [...months.entries()].map(([month, members]) => ({ month, meetings: members })),
		undated: meetings.filter((meeting) => !meeting.startDate)
	};
}

export function seasonCounts(meetings: CalendarMeeting[], today: IsoDate) {
	const held = meetings.filter((meeting) => {
		const lastDay = lastDayOf(meeting);
		return lastDay !== null && lastDay < today;
	}).length;
	const undated = meetings.filter((meeting) => !meeting.startDate).length;

	return {
		shown: meetings.length,
		held,
		toCome: meetings.length - held,
		dated: meetings.length - undated,
		undated
	};
}

export function monthCounts(meetings: CalendarMeeting[]): number[] {
	const counts = Array.from({ length: 12 }, () => 0);
	for (const meeting of meetings) {
		if (meeting.startDate) counts[Number(meeting.startDate.slice(5, 7)) - 1] += 1;
	}
	return counts;
}
