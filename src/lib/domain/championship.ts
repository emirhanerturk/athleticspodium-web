import type { AthleteRef } from './athlete.js';
import { yearOf, type IsoDate } from './date.js';
import type { Gender } from './edition.js';
import { describeEvent, type CatalogueEvent } from './event.js';
import type { Image } from './image.js';
import type { MedalTally } from './result.js';

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
