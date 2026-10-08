import { fullName } from './athlete.js';
import { isHeld, type EditionRef } from './championship.js';
import type { IsoDate } from './date.js';
import type { NationTally } from './edition.js';
import { eventInSentence } from './event.js';
import { groupByEdition, type MedalRecord } from './medal-search.js';
import type { MedalTally } from './result.js';

export interface CountdownQuery {
	country: string | null;
	champ: number | null;
}

export interface EditionTally {
	meeting: { slug: string };
	tally: MedalTally;
}

export interface CountdownEdition {
	edition: EditionRef;
	ordinal: number;
	tally: MedalTally | null;
}

export interface CountdownFacts {
	held: number;
	onPodium: number;
	since: number | null;
	streakFrom: number | null;
	best: CountdownEdition | null;
}

export interface NationStanding extends NationTally {
	rank: number;
}

export const COUNTDOWN_PRESETS: { country: string; champ: number }[] = [
	{ country: 'TUR', champ: 60 },
	{ country: 'TUR', champ: 30 },
	{ country: 'KEN', champ: 40 },
	{ country: 'JAM', champ: 52 }
];

export const DOT_LIMIT = 12;

const MEDAL_WORDS: Record<number, string> = { 1: 'gold', 2: 'silver', 3: 'bronze' };
const STANDING_NEIGHBOURS = 4;

export function parseCountdownQuery(params: URLSearchParams): CountdownQuery {
	const code = params.get('country')?.toUpperCase() ?? '';
	const id = params.get('champ') ?? '';
	return {
		country: /^[A-Z]{3}$/.test(code) ? code : null,
		champ: /^\d{1,9}$/.test(id) ? Number(id) : null
	};
}

export function countdownEditions(
	editions: EditionRef[],
	tallies: EditionTally[],
	today: IsoDate
): CountdownEdition[] {
	const held = editions.filter((edition) => isHeld(edition, today));
	const years = [...new Set(held.map((edition) => edition.year))].sort((a, b) => a - b);
	const tallyBySlug = new Map(tallies.map(({ meeting, tally }) => [meeting.slug, tally]));

	return held
		.map((edition) => {
			const tally = tallyBySlug.get(edition.slug);
			return {
				edition,
				ordinal: years.indexOf(edition.year) + 1,
				tally: tally && tally.total > 0 ? tally : null
			};
		})
		.sort((a, b) => b.edition.year - a.edition.year);
}

export function countdownFacts(editions: CountdownEdition[]): CountdownFacts {
	const years = [...Map.groupBy(editions, (item) => item.edition.year)]
		.map(([year, items]) => ({ year, medalled: items.some((item) => item.tally) }))
		.sort((a, b) => b.year - a.year);
	const unbroken = years.findIndex((year) => !year.medalled);
	const streak = unbroken === -1 ? years : years.slice(0, unbroken);
	const medalled = editions.flatMap((item) => (item.tally ? [{ ...item, tally: item.tally }] : []));

	return {
		held: years.length,
		onPodium: years.filter((year) => year.medalled).length,
		since: years.at(-1)?.year ?? null,
		streakFrom: streak.length >= 2 ? (streak.at(-1)?.year ?? null) : null,
		best:
			medalled.toSorted(
				(a, b) => b.tally.total - a.tally.total || b.tally.gold - a.tally.gold
			)[0] ?? null
	};
}

const byMedals = (a: NationTally, b: NationTally) =>
	b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze;

export function nationStandings(nations: NationTally[]): NationStanding[] {
	const sorted = nations.toSorted(byMedals);
	const standings: NationStanding[] = [];
	sorted.forEach((nation, index) => {
		const previous = standings.at(-1);
		const tied = previous && byMedals(previous, nation) === 0;
		standings.push({ ...nation, rank: tied ? previous.rank : index + 1 });
	});
	return standings;
}

export function standingsAround(standings: NationStanding[], code: string): NationStanding[] {
	const index = standings.findIndex((nation) => nation.country.code === code);
	if (index === -1) return [];
	const size = STANDING_NEIGHBOURS * 2 + 1;
	const start = Math.max(0, Math.min(index - STANDING_NEIGHBOURS, standings.length - size));
	return standings.slice(start, start + size);
}

export type MedalEntry = MedalRecord[];

export function medalEntries(rows: MedalRecord[]): MedalEntry[] {
	return groupByEdition(rows)
		.toSorted((a, b) => b.meeting.year - a.meeting.year)
		.flatMap((edition) => edition.entries.map((entry) => entry.team));
}

export function bestMedalOf(rows: MedalRecord[]): MedalEntry | null {
	return (
		medalEntries(rows)
			.filter(([record]) => !record.canceled && record.place !== null)
			.toSorted(([a], [b]) => (a.place ?? 0) - (b.place ?? 0))[0] ?? null
	);
}

export function medallistName([record, ...teammates]: MedalEntry): string {
	const name = record.athleteName ?? (record.athlete ? fullName(record.athlete) : null);
	if (teammates.length || (record.isTeam && !name)) return 'Team';
	return name ?? '–';
}

export function medalWhat(record: MedalRecord, { withMedal = true } = {}): string {
	const medal = withMedal && record.place ? MEDAL_WORDS[record.place] : null;
	return [eventInSentence(record.event), medal].filter(Boolean).join(' ');
}

export function medalLine(entry: MedalEntry, options: { withMedal?: boolean } = {}): string {
	return `${medallistName(entry)}, ${medalWhat(entry[0], options)}`;
}
