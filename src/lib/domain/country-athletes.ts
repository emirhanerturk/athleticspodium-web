import { parsePageParam } from '#lib/routing/page-param.js';
import { searchWords, startsWords } from '#lib/utils/fold-text.js';
import { fullName } from './athlete.js';
import type { CountryAthlete } from './country.js';
import { describeEvent, DISCIPLINE_LABELS } from './event.js';

export type AthleteSort = 'golds' | 'medals' | 'youngest' | 'name';
export type MedalEra = 'before-1960' | '1960-1979' | '1980-1999' | 'since-2000';

export interface CountryAthletesQuery {
	q: string;
	gender: 'men' | 'women' | null;
	era: MedalEra | null;
	sort: AthleteSort;
	page: number;
}

export interface AthleteBrowse {
	rows: CountryAthlete[];
	matched: number;
	offset: number;
	pageCount: number;
}

export const ATHLETES_PAGE_SIZE = 25;
export const DEFAULT_ATHLETE_SORT: AthleteSort = 'golds';

export const ATHLETE_SORTS: { key: AthleteSort; label: string }[] = [
	{ key: 'golds', label: 'Most golds' },
	{ key: 'medals', label: 'Most medals' },
	{ key: 'youngest', label: 'Youngest first' },
	{ key: 'name', label: 'A–Z' }
];

export const MEDAL_ERAS: { key: MedalEra; label: string; from: number; to: number }[] = [
	{ key: 'before-1960', label: 'Before 1960', from: -Infinity, to: 1959 },
	{ key: '1960-1979', label: '1960–79', from: 1960, to: 1979 },
	{ key: '1980-1999', label: '1980–99', from: 1980, to: 1999 },
	{ key: 'since-2000', label: '2000+', from: 2000, to: Infinity }
];

const SEARCH_LIMIT = 80;
const collator = new Intl.Collator('en', { sensitivity: 'base' });

export function cleanSearch(text: string): string {
	return text.trim().replace(/\s+/g, ' ').slice(0, SEARCH_LIMIT).trim();
}

export function parseCountryAthletesQuery(params: URLSearchParams): CountryAthletesQuery {
	const gender = params.get('gender');
	const era = params.get('era');
	const sort = params.get('sort');

	return {
		q: cleanSearch(params.get('q') ?? ''),
		gender: gender === 'men' || gender === 'women' ? gender : null,
		era: MEDAL_ERAS.find((item) => item.key === era)?.key ?? null,
		sort: ATHLETE_SORTS.find((item) => item.key === sort)?.key ?? DEFAULT_ATHLETE_SORT,
		page: parsePageParam(params.get('page')) ?? 1
	};
}

export function isNarrowed({ q, gender, era, sort }: CountryAthletesQuery): boolean {
	return !!q || !!gender || !!era || sort !== DEFAULT_ATHLETE_SORT;
}

function searchText({ athlete, events }: CountryAthlete): string {
	const eventWords = events.flatMap((name) => {
		const { longName, discipline } = describeEvent(name);
		return [
			name,
			name.replace(/[,\s]/g, ''),
			longName,
			discipline ? DISCIPLINE_LABELS[discipline] : ''
		];
	});
	return [fullName(athlete), ...eventWords].join(' ');
}

function medalledIn({ firstYear, lastYear }: CountryAthlete, era: MedalEra): boolean {
	const { from, to } = MEDAL_ERAS.find((item) => item.key === era)!;
	return firstYear !== null && lastYear !== null && firstYear <= to && lastYear >= from;
}

export function filterAthletes(
	athletes: CountryAthlete[],
	{ q, gender, era }: Pick<CountryAthletesQuery, 'q' | 'gender' | 'era'>
): CountryAthlete[] {
	const tokens = searchWords(q);
	return athletes.filter(
		(row) =>
			(!gender || row.athlete.men === (gender === 'men')) &&
			(!era || medalledIn(row, era)) &&
			(!tokens.length || startsWords(tokens, searchWords(searchText(row))))
	);
}

const byMedals = (a: CountryAthlete, b: CountryAthlete) =>
	b.tally.gold - a.tally.gold || b.tally.silver - a.tally.silver || b.tally.bronze - a.tally.bronze;
const sortName = ({ athlete }: CountryAthlete) => athlete.lastName || athlete.firstName;

const SORTERS: Record<AthleteSort, (a: CountryAthlete, b: CountryAthlete) => number> = {
	golds: byMedals,
	medals: (a, b) => b.tally.total - a.tally.total || byMedals(a, b),
	youngest: (a, b) =>
		(b.athlete.birthDate ?? '').localeCompare(a.athlete.birthDate ?? '') || byMedals(a, b),
	name: (a, b) =>
		collator.compare(sortName(a), sortName(b)) ||
		collator.compare(a.athlete.firstName, b.athlete.firstName)
};

export function sortAthletes(athletes: CountryAthlete[], sort: AthleteSort): CountryAthlete[] {
	return athletes.toSorted(SORTERS[sort]);
}

export function browseAthletes(
	athletes: CountryAthlete[],
	query: CountryAthletesQuery
): AthleteBrowse {
	const matched = sortAthletes(filterAthletes(athletes, query), query.sort);
	const offset = (query.page - 1) * ATHLETES_PAGE_SIZE;
	return {
		rows: matched.slice(offset, offset + ATHLETES_PAGE_SIZE),
		matched: matched.length,
		offset,
		pageCount: Math.max(1, Math.ceil(matched.length / ATHLETES_PAGE_SIZE))
	};
}

export function countAthletes(athletes: CountryAthlete[]) {
	const men = athletes.filter((row) => row.athlete.men).length;
	return {
		medallists: athletes.length,
		men,
		women: athletes.length - men,
		mostMedals: athletes.reduce((most, row) => Math.max(most, row.tally.total), 0)
	};
}
