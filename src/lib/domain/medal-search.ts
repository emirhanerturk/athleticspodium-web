import type { AthleteRef } from './athlete.js';
import type { Gender } from './edition.js';
import type { CatalogueEvent } from './event.js';

export const MEDAL_PAGE_SIZE = 100;
export const FIRST_YEAR = 1860;

export type MedalOrder = 'year' | 'champs' | 'event' | 'medal' | 'athlete' | 'gender' | 'country';

export const MEDAL_ORDERS: MedalOrder[] = [
	'year',
	'champs',
	'event',
	'medal',
	'athlete',
	'gender',
	'country'
];

export const GENDER_CODES: Record<Gender, number> = { men: 0, women: 1, mixed: 2 };

export interface MedalQuery {
	champ: number | null;
	country: string | null;
	event: number | null;
	year: number | null;
	gender: Gender | null;
	medal: 1 | 2 | 3 | null;
	page: number;
	order: MedalOrder;
}

export interface MedalRecord {
	id: number;
	meeting: { name: string; slug: string; year: number };
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
}

export interface MedalSearchPage {
	count: number;
	tally: { gold: number; silver: number; bronze: number };
	rows: MedalRecord[];
}

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

export function parseMedalQuery(params: URLSearchParams): MedalQuery {
	const gender = integer(params.get('gender'));
	const medal = integer(params.get('medal'));
	const country = params.get('country')?.toUpperCase() ?? '';
	const order = params.get('order') as MedalOrder;

	return {
		champ: integer(params.get('champs')),
		country: /^[A-Z]{3}$/.test(country) ? country : null,
		event: integer(params.get('event')),
		year: integer(params.get('year')),
		gender:
			(Object.keys(GENDER_CODES) as Gender[]).find((key) => GENDER_CODES[key] === gender) ?? null,
		medal: medal === 1 || medal === 2 || medal === 3 ? medal : null,
		page: Math.max(1, integer(params.get('page')) ?? 1),
		order: MEDAL_ORDERS.includes(order) ? order : 'year'
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
