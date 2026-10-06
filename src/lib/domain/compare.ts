import type { Gender } from './edition.js';
import type { MedalRecord } from './medal-search.js';

export interface CompareQuery {
	a: number | null;
	b: number | null;
	gender: Gender | null;
	event: number | null;
}

export interface CompareYear {
	year: number;
	a: MedalRecord[];
	b: MedalRecord[];
}

const GENDERS: Gender[] = ['men', 'women', 'mixed'];
const integer = (value: string | null) => (value && /^\d{1,9}$/.test(value) ? Number(value) : null);

export function parseCompareQuery(params: URLSearchParams): CompareQuery {
	const gender = params.get('gender') as Gender;
	return {
		a: integer(params.get('a')),
		b: integer(params.get('b')),
		gender: GENDERS.includes(gender) ? gender : null,
		event: integer(params.get('event'))
	};
}

export function isComplete(
	query: CompareQuery
): query is { a: number; b: number; gender: Gender; event: number } {
	return query.a !== null && query.b !== null && query.gender !== null && query.event !== null;
}

export function compareByYear(a: MedalRecord[], b: MedalRecord[]): CompareYear[] {
	const years = [...new Set([...a, ...b].map((row) => row.meeting.year))].sort((x, y) => y - x);
	const podium = (rows: MedalRecord[], year: number) =>
		rows.filter((row) => row.meeting.year === year).sort((x, y) => (x.place ?? 9) - (y.place ?? 9));

	return years.map((year) => ({ year, a: podium(a, year), b: podium(b, year) }));
}

export function markValue(mark: string | null): number | null {
	if (!mark) return null;
	const parts = mark.trim().split(':');
	if (parts.some((part) => !/^\d+(\.\d+)?$/.test(part))) return null;
	return parts.reduce((total, part) => total * 60 + Number(part), 0);
}

function decimalsOf(mark: string): number {
	return mark.split('.')[1]?.length ?? 0;
}

export function markDifference(a: string | null, b: string | null): string | null {
	const first = markValue(a);
	const second = markValue(b);
	if (first === null || second === null || !a || !b) return null;

	const decimals = Math.max(decimalsOf(a), decimalsOf(b));
	const difference = first - second;
	const size = Math.abs(difference);
	if (size < 10 ** -decimals / 2) return `±${(0).toFixed(decimals)}`;

	const minutes = Math.floor(size / 60);
	const seconds = size - minutes * 60;
	const body =
		minutes > 0
			? `${minutes}:${seconds.toFixed(decimals).padStart(decimals ? decimals + 3 : 2, '0')}`
			: size.toFixed(decimals);
	return `${difference > 0 ? '+' : '−'}${body}`;
}
