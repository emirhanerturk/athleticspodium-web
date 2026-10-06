import { describe, expect, it } from 'vitest';
import { breadcrumbJsonLd, personJsonLd, serializeJsonLd } from './json-ld.js';

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
