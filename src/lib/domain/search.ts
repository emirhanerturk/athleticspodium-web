import { fullName, type AthleteLifespan, type AthleteRef } from './athlete.js';
import type { Image } from './image.js';
import type { MedalTally } from './result.js';
import { foldText } from '#lib/utils/fold-text.js';

export type SearchScope = 'all' | 'athletes' | 'champs' | 'countries' | 'articles';

export const SEARCH_SCOPES: { key: SearchScope; label: string }[] = [
	{ key: 'all', label: 'All' },
	{ key: 'athletes', label: 'Athletes' },
	{ key: 'champs', label: 'Championships' },
	{ key: 'countries', label: 'Countries' },
	{ key: 'articles', label: 'Stories' }
];

export const MIN_QUERY_LENGTH = 2;
export const PAGE_SIZE = 20;

export interface SearchAthlete extends AthleteRef, AthleteLifespan {
	men: boolean;
	olympicChampion: boolean;
	olympian: boolean;
	events: string[];
	image: Image | null;
	medals: MedalTally;
}

export interface SearchChamp {
	id: number;
	name: string;
	slug: string;
	category: number;
}

export interface SearchCountry {
	code: string;
	name: string;
	isCountry: boolean;
}

export interface SearchPage<T> {
	count: number;
	rows: T[];
}

export interface SearchFilters {
	gender: 'men' | 'women' | null;
	bornFrom: number | null;
	bornTo: number | null;
	olympian: boolean;
}

export interface SearchRequest {
	query: string;
	scope: SearchScope;
	page: number;
	filters: SearchFilters;
}

export type TopResult<A, C, N> =
	{ kind: 'athlete'; item: A } | { kind: 'champ'; item: C } | { kind: 'country'; item: N } | null;

const YEAR = /^(1[89]\d\d|20\d\d)$/;

export function parseSearchRequest(params: URLSearchParams): SearchRequest {
	const scope = SEARCH_SCOPES.find((item) => item.key === params.get('type'))?.key ?? 'all';
	const page = Number(params.get('page'));
	const year = (key: string) => (YEAR.test(params.get(key) ?? '') ? Number(params.get(key)) : null);
	const gender = params.get('gender');

	return {
		query: (params.get('q') ?? '').trim().slice(0, 100),
		scope,
		page: scope !== 'all' && Number.isInteger(page) && page > 1 ? page : 1,
		filters: {
			gender: gender === 'men' || gender === 'women' ? gender : null,
			bornFrom: year('born_from'),
			bornTo: year('born_to'),
			olympian: params.get('olympian') === '1'
		}
	};
}

export function topResultOf<
	A extends Pick<AthleteRef, 'firstName' | 'lastName'>,
	C extends { name: string },
	N extends { code: string; name: string }
>(
	query: string,
	results: { athletes?: SearchPage<A>; champs?: SearchPage<C>; countries?: SearchPage<N> }
): TopResult<A, C, N> {
	const needle = foldText(query.trim());
	const country = results.countries?.rows.find(
		(item) => item.code.toLowerCase() === needle || foldText(item.name) === needle
	);
	if (country) return { kind: 'country', item: country };

	const champ = results.champs?.rows.find((item) => foldText(item.name) === needle);
	if (champ) return { kind: 'champ', item: champ };

	const athlete = results.athletes?.rows.find((item) => foldText(fullName(item)) === needle);
	return athlete ? { kind: 'athlete', item: athlete } : null;
}

export function highlight(text: string, query: string): [string, string, string] {
	const needle = foldText(query.trim());
	if (!needle) return [text, '', ''];

	const chars = [...text];
	const folded = chars.map((char) => foldText(char));
	const joined = folded.join('');
	const start = joined.indexOf(needle);
	if (start === -1) return [text, '', ''];

	let position = 0;
	let from = -1;
	let to = chars.length;
	for (let index = 0; index < chars.length; index++) {
		if (from === -1 && position + folded[index].length > start) from = index;
		position += folded[index].length;
		if (position >= start + needle.length) {
			to = index + 1;
			break;
		}
	}

	return [chars.slice(0, from).join(''), chars.slice(from, to).join(''), chars.slice(to).join('')];
}
