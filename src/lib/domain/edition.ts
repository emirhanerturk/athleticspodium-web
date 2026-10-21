import { fullName, type AthleteRef } from './athlete.js';
import type { ChampRef } from './championship.js';
import type { IsoDate } from './date.js';
import type { Discipline } from './event.js';
import { recordTier, type RecordTier } from './record.js';

export type Gender = 'men' | 'women' | 'mixed';

export const GENDER_LABELS: Record<Gender, string> = { men: 'Men', women: 'Women', mixed: 'Mixed' };

export interface Country {
	code: string;
	name: string;
}

export interface EditionMeeting {
	id: number;
	name: string;
	slug: string;
	year: number;
	city: string | null;
	country: Country | null;
	startDate: IsoDate | null;
	endDate: IsoDate | null;
	note: string | null;
	champ: Omit<ChampRef, 'rank'>;
}

export interface EditionEntry {
	id: number;
	place: number | null;
	canceled: boolean;
	mark: string | null;
	markNote: string | null;
	wind: number | null;
	records: string[];
	notes: string | null;
	isTeam: boolean;
	country: Country | null;
	athlete: (AthleteRef & { birthDate: IsoDate | null }) | null;
	/** The name the entry was won under, shown instead of the athlete’s profile name. */
	athleteName: string | null;
}

export interface EditionEvent {
	id: number;
	name: string;
	longName: string;
	discipline: Discipline | null;
	gender: Gender;
	note: string | null;
	entries: EditionEntry[];
}

export interface TeamMember {
	name: string;
	athlete: AthleteRef | null;
	/** The runner's own info, like a split or "Heat", when the team's runners don't share one. */
	info: string | null;
	/** The runner's own note, when it isn't the team's. */
	notes: string | null;
}

export interface PodiumLine {
	key: string;
	place: number | null;
	canceled: boolean;
	mark: string | null;
	markNote: string | null;
	wind: number | null;
	records: string[];
	notes: string | null;
	country: Country | null;
	athlete: EditionEntry['athlete'];
	athleteName: string | null;
	members: TeamMember[];
}

export interface NationTally {
	country: Country;
	gold: number;
	silver: number;
	bronze: number;
	total: number;
}

export interface EditionStats {
	events: number;
	medals: number;
	nations: number;
	worldRecords: number;
}

export interface RecordMark {
	record: string;
	tier: RecordTier;
	event: EditionEvent;
	line: PodiumLine;
}

const TIER_ORDER: RecordTier[] = ['world', 'major', 'other'];

export function memberName(entry: EditionEntry): string {
	return entry.athleteName ?? (entry.athlete ? fullName(entry.athlete) : '');
}

export function podiumLines(entries: EditionEntry[]): PodiumLine[] {
	const groups = new Map<string, EditionEntry[]>();
	for (const entry of entries) {
		const key = entry.isTeam
			? `team-${entry.place}-${entry.country?.code}-${entry.canceled}`
			: `entry-${entry.id}`;
		groups.set(key, [...(groups.get(key) ?? []), entry]);
	}

	return [...groups].map(([key, group]) =>
		group[0].isTeam ? teamLine(key, group) : individualLine(key, group[0])
	);
}

function individualLine(key: string, entry: EditionEntry): PodiumLine {
	return {
		key,
		place: entry.place,
		canceled: entry.canceled,
		mark: entry.mark,
		markNote: entry.markNote,
		wind: entry.wind,
		records: entry.records,
		notes: entry.notes,
		country: entry.country,
		athlete: entry.athlete,
		athleteName: memberName(entry),
		members: []
	};
}

/**
 * A team's mark is the one most of its runners hold, as runners of the heats only have none. Its
 * info is the one every runner shares and its note the one most runners share; a runner keeps
 * another one, like a split, as their own.
 */
function teamLine(key: string, entries: EditionEntry[]): PodiumLine {
	const mark = mostCommon(entries.map((entry) => entry.mark).filter((value) => value !== null));
	const finalist = entries.find((entry) => entry.mark === mark) ?? entries[0];
	const sharedInfo = entries.every((entry) => entry.markNote === entries[0].markNote);
	const note = mostCommon(entries.map((entry) => entry.notes));
	const notes =
		entries.filter((entry) => entry.notes === note).length * 2 > entries.length ? note : null;

	return {
		key,
		place: finalist.place,
		canceled: finalist.canceled,
		mark: mark ?? null,
		markNote: sharedInfo ? entries[0].markNote : null,
		wind: finalist.wind,
		records: finalist.records,
		notes: notes ?? null,
		country: finalist.country,
		athlete: null,
		athleteName: null,
		members: entries.map((entry) => ({
			name: memberName(entry),
			athlete: entry.athlete,
			info: sharedInfo ? null : entry.markNote,
			notes: entry.notes === notes ? null : entry.notes
		}))
	};
}

/** The value most items hold; the first one wins a tie. */
function mostCommon<T>(items: T[]): T | undefined {
	const count = (item: T) => items.filter((other) => other === item).length;
	return items.reduce<T | undefined>(
		(best, item) => (best === undefined || count(item) > count(best) ? item : best),
		undefined
	);
}

export function isMedalLine(line: Pick<PodiumLine, 'place' | 'canceled'>): boolean {
	return !line.canceled && (line.place === null || line.place <= 3);
}

export function sharedWind(lines: PodiumLine[]): number | null {
	const winds = new Set(lines.map((line) => line.wind).filter((wind) => wind !== null));
	return winds.size === 1 ? [...winds][0] : null;
}

export function editionStats(events: EditionEvent[]): EditionStats {
	const medalLines = events.flatMap((event) => podiumLines(event.entries).filter(isMedalLine));

	return {
		events: events.filter((event) => podiumLines(event.entries).some(isMedalLine)).length,
		medals: medalLines.length,
		nations: new Set(medalLines.map((line) => line.country?.code).filter(Boolean)).size,
		worldRecords: medalLines.filter((line) =>
			line.records.some((record) => recordTier(record) === 'world')
		).length
	};
}

export function recordsSet(events: EditionEvent[]): RecordMark[] {
	const marks = events.flatMap((event) =>
		podiumLines(event.entries)
			.filter((line) => !line.canceled)
			.flatMap((line) =>
				line.records
					.filter((record) => baseRecord(record) !== 'NR')
					.map((record) => ({ record, tier: recordTier(record), event, line }))
			)
	);

	return marks.sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));
}

export function recordSummary(marks: RecordMark[]): string {
	const counts = new Map<string, number>();
	for (const mark of marks) {
		const base = baseRecord(mark.record);
		counts.set(base, (counts.get(base) ?? 0) + 1);
	}

	return [...counts.entries()]
		.sort(
			([a, countA], [b, countB]) =>
				TIER_ORDER.indexOf(recordTier(a)) - TIER_ORDER.indexOf(recordTier(b)) || countB - countA
		)
		.map(([record, count]) => `${count} ${record}`)
		.join(' · ');
}

function baseRecord(record: string): string {
	return record.replace(/[=*]+$/, '');
}
