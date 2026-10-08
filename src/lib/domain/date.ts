export type IsoDate = string;

const DAY_MS = 24 * 60 * 60 * 1000;

export function isoDateOf(moment: Date): IsoDate {
	return moment.toISOString().slice(0, 10);
}

export function localIsoDateOf(moment: Date): IsoDate {
	const month = String(moment.getMonth() + 1).padStart(2, '0');
	const day = String(moment.getDate()).padStart(2, '0');
	return `${moment.getFullYear()}-${month}-${day}`;
}

export function daysBetween(from: IsoDate, to: IsoDate): number {
	return Math.round((Date.parse(to) - Date.parse(from)) / DAY_MS);
}

export function monthDayOf(date: IsoDate): string {
	return date.slice(5, 10);
}

export function yearOf(date: IsoDate): number {
	return Number(date.slice(0, 4));
}
