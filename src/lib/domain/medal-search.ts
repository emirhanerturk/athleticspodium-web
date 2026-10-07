import type { AthleteRef } from './athlete.js';
import type { Gender } from './edition.js';
import type { CatalogueEvent } from './event.js';

export const MEDAL_PAGE_SIZE = 100;
export const FIRST_YEAR = 1860;

export const GENDER_CODES: Record<Gender, number> = { men: 0, women: 1, mixed: 2 };
export const MEDAL_NAMES = { 1: 'gold', 2: 'silver', 3: 'bronze' } as const;

export interface MedalQuery {
	champ: number | null;
	country: string | null;
	event: number | null;
	year: number | null;
	gender: Gender | null;
	medal: 1 | 2 | 3 | null;
	page: number;
}

export interface MedalRecord {
	id: number;
	meeting: { id: number; name: string; slug: string; year: number; city: string | null };
	champ: { name: string; slug: string };
	event: string;
	gender: Gender;
	place: number | null;
	canceled: boolean;
	athlete: (AthleteRef & { olympicChampion: boolean; birthYear: number | null }) | null;
	athleteName: string | null;
	country: { code: string; name: string } | null;
	mark: string | null;
	markNote: string | null;
	wind: number | null;
	records: string[];
	notes: string | null;
	isTeam: boolean;
}

export interface MedalSearchTally {
	gold: number;
	silver: number;
	bronze: number;
	withdrawn: number;
}

export interface MedalSearchPage {
	count: number;
	tally: MedalSearchTally;
	rows: MedalRecord[];
}

export interface MedalEntry {
	record: MedalRecord;
	team: MedalRecord[];
}

export interface EditionMedals {
	meeting: MedalRecord['meeting'];
	champ: MedalRecord['champ'];
	entries: MedalEntry[];
	tally: MedalSearchTally;
}

export const MEDAL_QUESTIONS: { label: string; query: Partial<MedalQuery> }[] = [
	{ label: 'Turkey at the European Championships', query: { champ: 18, country: 'TUR' } },
	{ label: 'Kenya at the World Championships', query: { champ: 52, country: 'KEN' } },
	{
		label: 'Every Olympic women’s marathon podium',
		query: { champ: 40, event: 125, gender: 'women' }
	},
	{
		label: 'Men’s 4x100m at the World Championships',
		query: { champ: 52, event: 60, gender: 'men' }
	},
	{ label: 'Jamaica’s Olympic gold medals', query: { champ: 40, country: 'JAM', medal: 1 } }
];

export interface FilterChamp {
	id: number;
	name: string;
	slug: string;
	category: number;
	countries: string[];
	years: number[];
	events: Record<Gender, number[]>;
}

export interface FilterCountry {
	code: string;
	name: string;
	areas: number[];
}

const GLOBAL = 0;
const integer = (value: string | null) => (value && /^\d{1,9}$/.test(value) ? Number(value) : null);

const PLACES = [1, 2, 3] as const;
const GENDERS = Object.keys(GENDER_CODES) as Gender[];

function countryOf(value: string | null): string | null {
	const code = value?.toUpperCase() ?? '';
	return /^[A-Z]{3}$/.test(code) ? code : null;
}

export function parseMedalQuery(params: URLSearchParams): MedalQuery {
	const gender = params.get('gender');
	const medal = params.get('medal');

	return {
		champ: integer(params.get('champ')),
		country: countryOf(params.get('country')),
		event: integer(params.get('event')),
		year: integer(params.get('year')),
		gender: GENDERS.find((key) => key === gender) ?? null,
		medal: PLACES.find((place) => MEDAL_NAMES[place] === medal) ?? null,
		page: Math.max(1, integer(params.get('page')) ?? 1)
	};
}

export function parseLegacyMedalQuery(params: URLSearchParams): MedalQuery {
	const gender = integer(params.get('gender'));

	return {
		champ: integer(params.get('champs')),
		country: countryOf(params.get('country')),
		event: integer(params.get('event')),
		year: integer(params.get('year')),
		gender: GENDERS.find((key) => GENDER_CODES[key] === gender) ?? null,
		medal: PLACES.find((place) => place === integer(params.get('medal'))) ?? null,
		page: Math.max(1, integer(params.get('page')) ?? 1)
	};
}

export function isSearchable(query: Pick<MedalQuery, 'champ' | 'country'>): boolean {
	return query.champ !== null || query.country !== null;
}

export function countriesFor(
	champ: FilterChamp | undefined,
	countries: FilterCountry[]
): FilterCountry[] {
	if (!champ) return countries;
	if (champ.countries.length)
		return countries.filter((country) => champ.countries.includes(country.code));
	if (champ.category === GLOBAL) return countries;
	return countries.filter((country) => country.areas.includes(champ.category));
}

export function champsFor(
	country: FilterCountry | undefined,
	champs: FilterChamp[]
): FilterChamp[] {
	if (!country) return champs;
	return champs.filter((champ) =>
		champ.countries.length
			? champ.countries.includes(country.code)
			: champ.category === GLOBAL || country.areas.includes(champ.category)
	);
}

export function yearsFor(champ: FilterChamp | undefined, currentYear: number): number[] {
	if (champ?.years.length) return [...champ.years].sort((a, b) => b - a);
	return Array.from({ length: currentYear - FIRST_YEAR + 1 }, (_, index) => currentYear - index);
}

export function eventsFor(
	champ: FilterChamp | undefined,
	gender: Gender | null,
	catalogue: CatalogueEvent[]
): CatalogueEvent[] {
	if (!champ) return catalogue;
	const ids = new Set(gender ? champ.events[gender] : Object.values(champ.events).flat());
	return catalogue.filter((event) => ids.has(event.id));
}

function entryKey(record: MedalRecord): string {
	if (!record.isTeam) return `#${record.id}`;
	return [record.event, record.gender, record.place, record.canceled, record.country?.code].join(
		'|'
	);
}

function tallyOf(entries: MedalEntry[]): MedalSearchTally {
	const tally = { gold: 0, silver: 0, bronze: 0, withdrawn: 0 };
	for (const { record } of entries) {
		if (record.canceled) tally.withdrawn += 1;
		else if (record.place === 1) tally.gold += 1;
		else if (record.place === 2) tally.silver += 1;
		else if (record.place === 3) tally.bronze += 1;
	}
	return tally;
}

export function groupByEdition(rows: MedalRecord[]): EditionMedals[] {
	return [...Map.groupBy(rows, (row) => row.meeting.id).values()].map((records) => {
		const entries = [...Map.groupBy(records, entryKey).values()].map((team) => ({
			record: team[0],
			team
		}));
		return {
			meeting: records[0].meeting,
			champ: records[0].champ,
			entries,
			tally: tallyOf(entries)
		};
	});
}
