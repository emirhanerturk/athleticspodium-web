import type { IsoDate } from './date.js';

export interface DayOfYear {
	month: number;
	day: number;
}

export const MONTH_SLUGS = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december'
];
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const LEAP_YEAR = 2024;

export function dayOfDate(date: IsoDate): DayOfYear {
	return { month: Number(date.slice(5, 7)), day: Number(date.slice(8, 10)) };
}

export function dayOf(month: number | null, day: number | null): DayOfYear | null {
	if (!month || !day || month > 12 || day < 1 || day > DAYS_IN_MONTH[month - 1]) return null;
	return { month, day };
}

export function parseDaySlug(slug: string): DayOfYear | null {
	const match = /^([a-z]+)-(\d{1,2})$/i.exec(slug);
	if (!match) return null;
	return dayOf(MONTH_SLUGS.indexOf(match[1].toLowerCase()) + 1, Number(match[2]));
}

export function daySlug({ month, day }: DayOfYear): string {
	return `${MONTH_SLUGS[month - 1]}-${day}`;
}

export function shiftDay({ month, day }: DayOfYear, step: number): DayOfYear {
	const date = new Date(Date.UTC(LEAP_YEAR, month - 1, day + step));
	return { month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

export function everyDay(): DayOfYear[] {
	return Array.from({ length: 366 }, (_, index) => shiftDay({ month: 1, day: 1 }, index));
}

export function daysIn(month: number): number {
	return DAYS_IN_MONTH[month - 1];
}

export function monthDayParam({ month, day }: DayOfYear): string {
	return `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
