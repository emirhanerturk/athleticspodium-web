import type { AthleteRef } from './athlete.js';
import { yearOf, type IsoDate } from './date.js';
import type { Gender } from './edition.js';
import { describeEvent, type CatalogueEvent } from './event.js';
import type { Image } from './image.js';
import type { MedalTally } from './result.js';
import { foldText } from '#lib/utils/fold-text.js';

export interface ChampRef {
	id: number;
	name: string;
	slug: string;
	category: number;
	rank: number;
}

export type Level = 'global' | 'continental' | 'regional' | 'national' | 'road';

export const LEVEL_LABELS: Record<Level, string> = {
	global: 'Global',
	continental: 'Continental',
	regional: 'Regional',
	national: 'National',
	road: 'Road'
};

const NATIONAL = 7;

const AREAS = [
	'Global',
	'Africa',
	'Asia',
	'Europe',
	'Americas',
	'Oceania',
	'Regional',
	'National',
	'Road'
];

export interface ChampionshipSummary extends ChampRef {
	years: number[];
}

export const CATEGORY_GROUPS = [
	{ slug: 'global', label: 'Global', category: 0 },
	{ slug: 'africa', label: 'Africa', category: 1 },
	{ slug: 'asia', label: 'Asia', category: 2 },
	{ slug: 'europe', label: 'Europe', category: 3 },
	{ slug: 'americas', label: 'Americas', category: 4 },
	{ slug: 'oceania', label: 'Oceania', category: 5 },
	{ slug: 'multi-region', label: 'Multi-region', category: 6 },
	{ slug: 'national', label: 'National', category: 7 },
	{ slug: 'road', label: 'Road races', category: 8 }
] as const;

export type CategoryGroup = (typeof CATEGORY_GROUPS)[number];

export type ChampionshipStatus =
	{ kind: 'next' | 'held' | 'last'; year: number } | { kind: 'none' };

export type ChampionshipSort = 'rank' | 'name' | 'oldest' | 'editions';

export const SORT_LABELS: Record<ChampionshipSort, string> = {
	rank: 'importance',
	name: 'A–Z',
	oldest: 'oldest first',
	editions: 'most editions'
};

export interface ArchiveExtent {
	first: { year: number; name: string };
	last: { year: number; name: string };
}

export interface EditionRef {
	name: string;
	slug: string;
	year: number;
	city: string | null;
	countryCode: string | null;
	startDate: IsoDate | null;
	eventsCount: number;
}

export interface ChampionshipEditions {
	champ: Omit<ChampRef, 'rank'>;
	firstYear: number | null;
	editions: EditionRef[];
}

export interface ChampionshipProfile extends ChampionshipEditions {
	history: string | null;
	programme: Record<Gender, number[]>;
}

export interface ChampionshipFacts {
	first: EditionRef | null;
	latest: EditionRef | null;
	next: EditionRef | null;
	editionsHeld: number;
}

export interface ChampionshipLeader {
	athlete: AthleteRef;
	tally: MedalTally;
	firstYear: number;
	lastYear: number;
	events: string[];
}

export interface ProgrammeEvent {
	id: number;
	longName: string;
}

export function areaName(category: number): string {
	return AREAS[category] ?? 'Championships';
}

export function levelOf(category: number): Level {
	if (category === 0) return 'global';
	if (category <= 5) return 'continental';
	if (category === 6) return 'regional';
	if (category === NATIONAL) return 'national';
	return 'road';
}

export function isInternational(champ: Pick<ChampRef, 'category'>): boolean {
	return champ.category !== NATIONAL;
}

export function championshipImage(slug: string): Image {
	return { path: `champs/${slug}.jpg`, credit: null, caption: null };
}

export function isHeld(edition: Pick<EditionRef, 'year' | 'startDate'>, today: IsoDate): boolean {
	return edition.startDate ? edition.startDate <= today : edition.year <= yearOf(today);
}

export function championshipFacts(editions: EditionRef[], today: IsoDate): ChampionshipFacts {
	const chronological = [...editions].sort((a, b) => a.year - b.year);
	const held = chronological.filter((edition) => isHeld(edition, today));

	return {
		first: held[0] ?? null,
		latest: held.at(-1) ?? null,
		next: chronological.find((edition) => !isHeld(edition, today)) ?? null,
		editionsHeld: new Set(held.map((edition) => edition.year)).size
	};
}

export function programmeGrowth(
	editions: EditionRef[],
	today: IsoDate
): { from: EditionRef; to: EditionRef } | null {
	const withResults = editions
		.filter((edition) => edition.eventsCount > 0 && isHeld(edition, today))
		.sort((a, b) => a.year - b.year);
	const from = withResults[0];
	const to = withResults.at(-1);

	return from && to && from.year !== to.year ? { from, to } : null;
}

export function programmeOf(
	eventIds: Record<Gender, number[]>,
	catalogue: CatalogueEvent[]
): Record<Gender, ProgrammeEvent[]> {
	const eventsOf = (ids: number[]) =>
		catalogue
			.filter((event) => ids.includes(event.id))
			.map((event) => ({ id: event.id, longName: describeEvent(event.name).longName }));

	return {
		men: eventsOf(eventIds.men),
		women: eventsOf(eventIds.women),
		mixed: eventsOf(eventIds.mixed)
	};
}

export function categoryGroupOf(slug: string | null): CategoryGroup {
	return CATEGORY_GROUPS.find((group) => group.slug === slug) ?? CATEGORY_GROUPS[0];
}

export function championshipStatus(years: number[], currentYear: number): ChampionshipStatus {
	const next = years.find((year) => year > currentYear);
	if (next) return { kind: 'next', year: next };

	const last = years.filter((year) => year <= currentYear).at(-1);
	if (last === undefined) return { kind: 'none' };
	return { kind: last >= currentYear - 1 ? 'held' : 'last', year: last };
}

export function filterByName<T extends { name: string }>(items: T[], query: string): T[] {
	const needle = foldText(query.trim());
	return needle ? items.filter((item) => foldText(item.name).includes(needle)) : items;
}

export function sortChampionships(
	champs: ChampionshipSummary[],
	sort: ChampionshipSort
): ChampionshipSummary[] {
	const byRank = (a: ChampionshipSummary, b: ChampionshipSummary) => a.rank - b.rank;
	const firstYear = (champ: ChampionshipSummary) => champ.years[0] ?? Number.MAX_SAFE_INTEGER;
	const compare = {
		rank: byRank,
		name: (a: ChampionshipSummary, b: ChampionshipSummary) => a.name.localeCompare(b.name, 'en'),
		oldest: (a: ChampionshipSummary, b: ChampionshipSummary) =>
			firstYear(a) - firstYear(b) || byRank(a, b),
		editions: (a: ChampionshipSummary, b: ChampionshipSummary) =>
			b.years.length - a.years.length || byRank(a, b)
	}[sort];

	return [...champs].sort(compare);
}

export function archiveExtent(champs: ChampionshipSummary[]): ArchiveExtent | null {
	let extent: ArchiveExtent | null = null;

	for (const { name, years } of [...champs].sort((a, b) => a.rank - b.rank)) {
		const first = years[0];
		const last = years.at(-1);
		if (first === undefined || last === undefined) continue;

		extent ??= { first: { year: first, name }, last: { year: last, name } };
		if (first < extent.first.year) extent.first = { year: first, name };
		if (last > extent.last.year) extent.last = { year: last, name };
	}

	return extent;
}

export function timelineRange(extent: ArchiveExtent): { from: number; to: number } {
	return {
		from: Math.floor(extent.first.year / 5) * 5,
		to: Math.ceil(extent.last.year / 5) * 5
	};
}
