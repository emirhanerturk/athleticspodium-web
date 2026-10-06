import type { Gender } from '#lib/domain/edition.js';
import type { SearchRequest } from '#lib/domain/search.js';

export const PAGES = {
	home: '/',
	champs: '/champs',
	athletes: '/athlete',
	countries: '/country',
	calendar: '/calendar',
	articles: '/article',
	medalSearch: '/medals/search',
	countryChamps: '/medals/country-champs',
	compare: '/compare',
	search: '/search',
	about: '/about',
	simpleNotes: '/simple-notes',
	missingInformation: '/missing-information'
} as const;

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

const GENDER_PARAMS: Record<Gender, number> = { men: 0, women: 1, mixed: 2 };

export function medalSearchUrl(filter: { champ: number; event?: number; gender?: Gender }): string {
	const query = new URLSearchParams({ champs: String(filter.champ) });
	if (filter.event !== undefined) query.set('event', String(filter.event));
	if (filter.gender) query.set('gender', String(GENDER_PARAMS[filter.gender]));
	return `${PAGES.medalSearch}?${query}`;
}

export function countryChampsUrl(countryCode: string, champId: number): string {
	return `${PAGES.countryChamps}?country=${countryCode.toUpperCase()}&champ=${champId}`;
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
