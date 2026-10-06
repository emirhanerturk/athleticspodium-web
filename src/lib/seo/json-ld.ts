import type { ArticleDetail } from '#lib/domain/article.js';
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

const SITE_NAME = 'Athletics Podium';

export function articleJsonLd(
	{ siteUrl, mediaUrl }: { siteUrl: string; mediaUrl: string },
	article: ArticleDetail,
	path: string
) {
	return withoutEmpty({
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: article.title,
		description: article.description ?? undefined,
		image: article.image ? `${mediaUrl}/${article.image.path}` : undefined,
		datePublished: article.publishedOn,
		dateModified: article.updatedOn ?? undefined,
		url: siteUrl + path,
		author: { '@type': 'Organization', name: SITE_NAME, url: `${siteUrl}/` },
		publisher: { '@type': 'Organization', name: SITE_NAME, url: `${siteUrl}/` }
	});
}

export function websiteJsonLd(siteUrl: string, searchPath: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: `${siteUrl}/`,
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${siteUrl}${searchPath}?q={search_term_string}`
			},
			'query-input': 'required name=search_term_string'
		}
	};
}

export function organizationJsonLd(siteUrl: string, logoUrl: string, profiles: string[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: SITE_NAME,
		url: `${siteUrl}/`,
		logo: logoUrl,
		sameAs: profiles
	};
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
