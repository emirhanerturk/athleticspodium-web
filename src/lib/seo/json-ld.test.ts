import { describe, expect, it } from 'vitest';
import {
	breadcrumbJsonLd,
	organizationJsonLd,
	personJsonLd,
	serializeJsonLd,
	sportsEventJsonLd,
	websiteJsonLd
} from './json-ld.js';

const SITE = {
	siteUrl: 'https://athleticspodium.com',
	mediaUrl: 'https://api.athleticspodium.com/media'
};

describe('personJsonLd', () => {
	it('describes the athlete and leaves unknown facts out', () => {
		const person = personJsonLd(
			SITE,
			{
				id: 35017,
				slug: 'yaroslava-mahuchikh',
				firstName: 'Yaroslava',
				lastName: 'Mahuchikh',
				countryCode: 'UKR',
				birthDate: '2001-09-19',
				deathDate: null,
				aka: [],
				olympicChampion: true,
				birthPlace: 'Dnipropetrovsk, Ukraine',
				events: ['High jump'],
				country: { code: 'UKR', name: 'Ukraine' },
				image: { path: 'athletes/35017/photo.jpeg', credit: null, caption: null },
				biography: null
			},
			'/athlete/35017/yaroslava-mahuchikh'
		);

		expect(person).toEqual({
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: 'Yaroslava Mahuchikh',
			url: 'https://athleticspodium.com/athlete/35017/yaroslava-mahuchikh',
			image: 'https://api.athleticspodium.com/media/athletes/35017/photo.jpeg',
			birthDate: '2001-09-19',
			birthPlace: { '@type': 'Place', name: 'Dnipropetrovsk, Ukraine' },
			nationality: { '@type': 'Country', name: 'Ukraine' }
		});
	});
});

describe('breadcrumbJsonLd', () => {
	it('numbers the crumbs and makes their URLs absolute', () => {
		expect(
			breadcrumbJsonLd(SITE.siteUrl, [
				{ name: 'Athletes', path: '/athlete' },
				{ name: 'Ukraine', path: '/country/UKR' }
			]).itemListElement
		).toEqual([
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Athletes',
				item: 'https://athleticspodium.com/athlete'
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Ukraine',
				item: 'https://athleticspodium.com/country/UKR'
			}
		]);
	});
});

describe('serializeJsonLd', () => {
	it('cannot close the surrounding script tag', () => {
		expect(serializeJsonLd({ name: '</script><script>' })).toBe(
			'{"name":"\\u003c/script>\\u003cscript>"}'
		);
	});
});

describe('sportsEventJsonLd', () => {
	it('describes the edition with dates and location', () => {
		expect(
			sportsEventJsonLd(
				SITE.siteUrl,
				{
					id: 2219,
					name: '2026 European Champs',
					slug: '2026-european-championships',
					year: 2026,
					city: 'Birmingham',
					country: { code: 'GBR', name: 'Great Britain & NI' },
					startDate: '2026-08-10',
					endDate: '2026-08-16',
					note: null,
					champ: { id: 18, name: 'European Championships', slug: 'european-champs', category: 3 }
				},
				'/champs/european-champs/2026-european-championships'
			)
		).toEqual({
			'@context': 'https://schema.org',
			'@type': 'SportsEvent',
			name: '2026 European Champs',
			url: 'https://athleticspodium.com/champs/european-champs/2026-european-championships',
			sport: 'Athletics',
			startDate: '2026-08-10',
			endDate: '2026-08-16',
			location: {
				'@type': 'Place',
				name: 'Birmingham',
				address: {
					'@type': 'PostalAddress',
					addressLocality: 'Birmingham',
					addressCountry: 'Great Britain & NI'
				}
			}
		});
	});
});

describe('websiteJsonLd and organizationJsonLd', () => {
	it('describe the site with its search and profiles', () => {
		expect(websiteJsonLd('https://athleticspodium.com', '/search').potentialAction.target).toEqual({
			'@type': 'EntryPoint',
			urlTemplate: 'https://athleticspodium.com/search?q={search_term_string}'
		});
		expect(
			organizationJsonLd('https://athleticspodium.com', 'https://athleticspodium.com/logo.svg', [
				'https://bsky.app/profile/athleticspodium.bsky.social'
			])
		).toMatchObject({ '@type': 'Organization', url: 'https://athleticspodium.com/' });
	});
});
