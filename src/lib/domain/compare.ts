import { fullName } from './athlete.js';
import type { Gender } from './edition.js';
import { describeEvent, type CatalogueEvent, type MarkKind } from './event.js';
import { groupByEdition, type FilterChamp, type MedalRecord } from './medal-search.js';

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

export type CompareSide = 'a' | 'b';

export interface Winner {
	key: string;
	name: string;
	countryCode: string | null;
}

export interface ChampStats {
	editions: number;
	since: number | null;
	best: MedalRecord | null;
	titles: { count: number; winners: Winner[] } | null;
	nations: number;
}

export interface DoubleWinner extends Winner {
	golds: number;
}

export interface RaceGroup {
	gender: Gender;
	events: CatalogueEvent[];
}

export const COMPARE_PRESETS: CompareQuery[] = [
	{ a: 40, b: 52, gender: 'women', event: 10 },
	{ a: 40, b: 52, gender: 'men', event: 111 },
	{ a: 52, b: 40, gender: 'women', event: 125 },
	{ a: 18, b: 17, gender: 'men', event: 20 },
	{ a: 40, b: 52, gender: 'men', event: 60 }
];

const GENDERS: Gender[] = ['men', 'women', 'mixed'];
const RACE = /^(men|women|mixed)-(\d{1,9})$/;
const POSSESSIVE: Record<Gender, string> = { men: 'Men’s', women: 'Women’s', mixed: 'Mixed' };
const integer = (value: string | null) => (value && /^\d{1,9}$/.test(value) ? Number(value) : null);

export function parseRace(value: string | null): { gender: Gender; event: number } | null {
	const match = RACE.exec(value ?? '');
	return match ? { gender: match[1] as Gender, event: Number(match[2]) } : null;
}

export function parseCompareQuery(params: URLSearchParams): CompareQuery {
	const gender = params.get('gender') as Gender;
	return {
		a: integer(params.get('a')),
		b: integer(params.get('b')),
		gender: GENDERS.includes(gender) ? gender : null,
		event: integer(params.get('event')),
		...parseRace(params.get('race'))
	};
}

export function isComplete(
	query: CompareQuery
): query is { a: number; b: number; gender: Gender; event: number } {
	return query.a !== null && query.b !== null && query.gender !== null && query.event !== null;
}

export const raceValue = (gender: Gender, event: number) => `${gender}-${event}`;

export function raceName(gender: Gender, eventName: string): string {
	const { longName } = describeEvent(eventName);
	const name = /^[A-Z][a-z]/.test(longName)
		? longName[0].toLowerCase() + longName.slice(1)
		: longName;
	return `${POSSESSIVE[gender]} ${name}`;
}

export function racesFor(champs: FilterChamp[], catalogue: CatalogueEvent[]): RaceGroup[] {
	if (!champs.length) return [];
	return GENDERS.map((gender) => ({
		gender,
		events: catalogue.filter((event) =>
			champs.every((champ) => champ.events[gender].includes(event.id))
		)
	})).filter((group) => group.events.length > 0);
}

const byPlace = (x: MedalRecord, y: MedalRecord) =>
	(x.place ?? 9) - (y.place ?? 9) || Number(x.canceled) - Number(y.canceled);

function podiumsByYear(rows: MedalRecord[]): Map<number, MedalRecord[]> {
	const podiums = new Map<number, MedalRecord[]>();
	for (const edition of groupByEdition(rows)) {
		const records = edition.entries.map((entry) => entry.record);
		podiums.set(edition.meeting.year, [...(podiums.get(edition.meeting.year) ?? []), ...records]);
	}
	return podiums;
}

export function compareByYear(a: MedalRecord[], b: MedalRecord[]): CompareYear[] {
	const podiumsA = podiumsByYear(a);
	const podiumsB = podiumsByYear(b);
	const years = [...new Set([...podiumsA.keys(), ...podiumsB.keys()])].sort((x, y) => y - x);

	return years.map((year) => ({
		year,
		a: (podiumsA.get(year) ?? []).toSorted(byPlace),
		b: (podiumsB.get(year) ?? []).toSorted(byPlace)
	}));
}

export function winnerOf(record: MedalRecord): Winner {
	const countryCode = record.country?.code ?? null;
	if (record.isTeam)
		return { key: `country:${countryCode}`, name: record.country?.name ?? '', countryCode };
	if (record.athlete)
		return {
			key: `athlete:${record.athlete.id}`,
			name: record.athleteName ?? fullName(record.athlete),
			countryCode
		};
	return { key: `name:${record.athleteName}`, name: record.athleteName ?? '', countryCode };
}

export function markValue(mark: string | null): number | null {
	if (!mark) return null;
	const parts = mark.trim().split(':');
	if (parts.some((part) => !/^\d+(\.\d+)?$/.test(part))) return null;
	return parts.reduce((total, part) => total * 60 + Number(part), 0);
}

const goldsOf = (years: CompareYear[], side: CompareSide) =>
	years.flatMap((year) => year[side].filter((record) => record.place === 1 && !record.canceled));

function titlesBy(golds: MedalRecord[]): Map<string, { winner: Winner; count: number }> {
	const titles = new Map<string, { winner: Winner; count: number }>();
	for (const record of golds) {
		const winner = winnerOf(record);
		titles.set(winner.key, { winner, count: (titles.get(winner.key)?.count ?? 0) + 1 });
	}
	return titles;
}

function bestOf(golds: MedalRecord[], kind: MarkKind): MedalRecord | null {
	let best: { record: MedalRecord; value: number } | null = null;
	for (const record of golds) {
		const value = markValue(record.mark);
		if (value === null) continue;
		if (!best || (kind === 'time' ? value < best.value : value > best.value))
			best = { record, value };
	}
	return best?.record ?? null;
}

export function champStats(years: CompareYear[], side: CompareSide, kind: MarkKind): ChampStats {
	const held = years.filter((year) => year[side].length > 0).map((year) => year.year);
	const golds = goldsOf(years, side);
	const titles = [...titlesBy(golds).values()];
	const most = Math.max(0, ...titles.map((title) => title.count));

	return {
		editions: held.length,
		since: held.at(-1) ?? null,
		best: bestOf(golds, kind),
		titles: most
			? {
					count: most,
					winners: titles.filter((title) => title.count === most).map((title) => title.winner)
				}
			: null,
		nations: new Set(golds.flatMap((record) => record.country?.code ?? [])).size
	};
}

export function doubleWinners(years: CompareYear[]): DoubleWinner[] {
	const titlesA = titlesBy(goldsOf(years, 'a'));
	const titlesB = titlesBy(goldsOf(years, 'b'));

	return [...titlesA.values()]
		.filter(({ winner }) => titlesB.has(winner.key))
		.map(({ winner, count }) => ({
			...winner,
			golds: count + (titlesB.get(winner.key)?.count ?? 0)
		}))
		.sort((x, y) => y.golds - x.golds || x.name.localeCompare(y.name));
}
