import type { IsoDate } from '#lib/domain/date.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function partsOf(date: IsoDate) {
	return {
		day: Number(date.slice(8, 10)),
		month: MONTHS[Number(date.slice(5, 7)) - 1],
		year: date.slice(0, 4)
	};
}

export function formatDate(date: IsoDate): string {
	const { day, month, year } = partsOf(date);
	return `${day} ${month} ${year}`;
}

export function formatDateRange(start: IsoDate, end: IsoDate | null): string {
	const from = partsOf(start);
	if (!end || end === start) return `${from.day} ${from.month}`;

	const to = partsOf(end);
	if (from.year !== to.year) return `${formatDate(start)} – ${formatDate(end)}`;
	if (from.month !== to.month) return `${from.day} ${from.month} – ${to.day} ${to.month}`;
	return `${from.day}–${to.day} ${to.month}`;
}

export function formatDaysToGo(days: number): string {
	if (days === 1) return 'tomorrow';
	return `in ${days} days`;
}

export function formatYearSpan(first: number, last: number): string {
	if (first === last) return String(first);
	const sameCentury = Math.floor(first / 100) === Math.floor(last / 100);
	return `${first}–${sameCentury ? String(last).slice(2) : last}`;
}
