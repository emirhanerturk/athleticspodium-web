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

export function countryAthletesUrl(code: string): string {
	return `${countryUrl(code)}/athletes`;
}

export function articleUrl(article: { id: number; slug: string }): string {
	return `/article/${article.id}/${article.slug}`;
}

export function calendarUrl(year: number): string {
	return `/calendar/${year}`;
}

export function flagUrl(countryCode: string): string {
	return `/flags/${countryCode.toLowerCase()}.svg`;
}

export const SOCIAL_LINKS = {
	bluesky: 'https://bsky.app/profile/athleticspodium.bsky.social',
	facebook: 'https://www.facebook.com/athleticspodium',
	instagram: 'https://www.instagram.com/athleticspodium'
} as const;
