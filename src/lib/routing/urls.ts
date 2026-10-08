import type { CompareQuery } from '#lib/domain/compare.js';
import { daySlug, type DayOfYear } from '#lib/domain/day.js';
import { MEDAL_NAMES, type MedalQuery } from '#lib/domain/medal-search.js';
import { MISSING_SECTIONS, type MissingSection } from '#lib/domain/missing.js';
import type { SearchRequest } from '#lib/domain/search.js';

export const PAGES = {
	home: '/',
	champs: '/champs',
	athletes: '/athlete',
	countries: '/country',
	calendar: '/calendar',
	articles: '/article',
	medalSearch: '/medals',
	medalCountdown: '/medals/countdown',
	compare: '/medals/compare',
	search: '/search',
	about: '/about',
	databaseNotes: '/how-to-read-the-database',
	missingInformation: '/missing-information',
	onThisDay: '/on-this-day'
} as const;

export function missingInformationUrl({
	tab,
	query,
	gap
}: { tab?: MissingSection; query?: string; gap?: string } = {}): string {
	const params = new URLSearchParams();
	if (tab && tab !== MISSING_SECTIONS[0]) params.set('tab', tab);
	if (query?.trim()) params.set('q', query.trim());
	if (gap) params.set('gap', gap);
	const search = params.toString();
	return search ? `${PAGES.missingInformation}?${search}` : PAGES.missingInformation;
}

export function onThisDayUrl(
	day: DayOfYear,
	{ born = 1, died = 1 }: { born?: number; died?: number } = {}
): string {
	const params = new URLSearchParams();
	if (born > 1) params.set('born', String(born));
	if (died > 1) params.set('died', String(died));
	const search = params.toString();
	const path = `${PAGES.onThisDay}/${daySlug(day)}`;
	return search ? `${path}?${search}` : path;
}

export function athleteUrl(athlete: { id: number; slug: string }): string {
	return `/athlete/${athlete.id}/${athlete.slug}`;
}

export function champUrl(champSlug: string): string {
	return `/champs/${champSlug}`;
}

export function meetingUrl(champSlug: string, meetingSlug: string): string {
	return `/champs/${champSlug}/${meetingSlug}`;
}

export function countryUrl(code: string): string {
	return `/country/${code.toUpperCase()}`;
}

export function countryAthletesUrl(code: string, page = 1): string {
	return `${countryUrl(code)}/athletes${page > 1 ? `?page=${page}` : ''}`;
}

export function articleUrl(article: { id: number; slug: string }): string {
	return `/article/${article.id}/${article.slug}`;
}

export function articlesUrl(page = 1): string {
	return page > 1 ? `${PAGES.articles}?page=${page}` : PAGES.articles;
}

export function calendarUrl(year: number): string {
	return `/calendar/${year}`;
}

export function medalSearchUrl(query: Partial<MedalQuery>): string {
	const params = new URLSearchParams();
	if (query.champ) params.set('champ', String(query.champ));
	if (query.country) params.set('country', query.country);
	if (query.event) params.set('event', String(query.event));
	if (query.year) params.set('year', String(query.year));
	if (query.gender) params.set('gender', query.gender);
	if (query.medal) params.set('medal', MEDAL_NAMES[query.medal]);
	if (query.page && query.page > 1) params.set('page', String(query.page));
	const search = params.toString();
	return search ? `${PAGES.medalSearch}?${search}` : PAGES.medalSearch;
}

export function medalCountdownUrl(countryCode: string | null, champId: number | null): string {
	const params = new URLSearchParams();
	if (countryCode) params.set('country', countryCode.toUpperCase());
	if (champId) params.set('champ', String(champId));
	const search = params.toString();
	return search ? `${PAGES.medalCountdown}?${search}` : PAGES.medalCountdown;
}

export function editionMedalsUrl(champId: number, countryCode: string, year: number): string {
	return `/internal/medals/${champId}/${countryCode}/${year}`;
}

export function countriesUrl(areaSlug?: string): string {
	return areaSlug ? `${PAGES.countries}?area=${areaSlug}` : PAGES.countries;
}

export function flagUrl(countryCode: string): string {
	return `/flags/${countryCode.toLowerCase()}.svg`;
}

export const SOCIAL_LINKS = {
	bluesky: 'https://bsky.app/profile/athleticspodium.bsky.social',
	facebook: 'https://www.facebook.com/athleticspodium',
	instagram: 'https://www.instagram.com/athleticspodium'
} as const;

export function athleteLetterUrl(letter: string, page = 1): string {
	return `${PAGES.athletes}/letter/${letter.toLowerCase()}${page > 1 ? `?page=${page}` : ''}`;
}

export function searchUrl(request: Partial<SearchRequest> & { query: string }): string {
	const params = new URLSearchParams({ q: request.query });
	if (request.scope && request.scope !== 'all') params.set('type', request.scope);
	const filters = request.filters;
	if (filters?.gender) params.set('gender', filters.gender);
	if (filters?.bornFrom) params.set('born_from', String(filters.bornFrom));
	if (filters?.bornTo) params.set('born_to', String(filters.bornTo));
	if (filters?.olympian) params.set('olympian', '1');
	if (request.page && request.page > 1) params.set('page', String(request.page));
	return `${PAGES.search}?${params}`;
}

export function compareUrl(query: Partial<CompareQuery>): string {
	const params = new URLSearchParams();
	if (query.a) params.set('a', String(query.a));
	if (query.b) params.set('b', String(query.b));
	if (query.gender) params.set('gender', query.gender);
	if (query.event) params.set('event', String(query.event));
	const search = params.toString();
	return search ? `${PAGES.compare}?${search}` : PAGES.compare;
}
