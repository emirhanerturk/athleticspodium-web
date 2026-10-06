import { fullName, type AthleteProfile } from '#lib/domain/athlete.js';
import type { EditionMeeting } from '#lib/domain/edition.js';

export interface Crumb {
	name: string;
	path: string;
}

export function breadcrumbJsonLd(siteUrl: string, crumbs: Crumb[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((crumb, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: crumb.name,
			item: siteUrl + crumb.path
		}))
	};
}

export function personJsonLd(
	{ siteUrl, mediaUrl }: { siteUrl: string; mediaUrl: string },
	athlete: AthleteProfile,
	path: string
) {
	return withoutEmpty({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: fullName(athlete),
		alternateName: athlete.aka.length ? athlete.aka : undefined,
		url: siteUrl + path,
		image: athlete.image ? `${mediaUrl}/${athlete.image.path}` : undefined,
		birthDate: athlete.birthDate ?? undefined,
		deathDate: athlete.deathDate ?? undefined,
		birthPlace: athlete.birthPlace ? { '@type': 'Place', name: athlete.birthPlace } : undefined,
		nationality: athlete.country ? { '@type': 'Country', name: athlete.country.name } : undefined
	});
}

export function sportsEventJsonLd(siteUrl: string, meeting: EditionMeeting, path: string) {
	return withoutEmpty({
		'@context': 'https://schema.org',
		'@type': 'SportsEvent',
		name: meeting.name,
		url: siteUrl + path,
		sport: 'Athletics',
		startDate: meeting.startDate ?? undefined,
		endDate: meeting.endDate ?? undefined,
		location: meeting.city
			? {
					'@type': 'Place',
					name: meeting.city,
					address: withoutEmpty({
						'@type': 'PostalAddress',
						addressLocality: meeting.city,
						addressCountry: meeting.country?.name
					})
				}
			: undefined
	});
}

export function serializeJsonLd(data: unknown): string {
	return JSON.stringify(data).replaceAll('<', '\\u003c');
}

export function jsonLdScriptTag(data: unknown): string {
	return `<script type="application/ld+json">${serializeJsonLd(data)}</script>`;
}

function withoutEmpty<T extends Record<string, unknown>>(value: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(value).filter(([, item]) => item !== undefined)
	) as Partial<T>;
}
