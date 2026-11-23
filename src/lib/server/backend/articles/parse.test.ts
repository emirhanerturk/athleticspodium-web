import { describe, expect, it } from 'vitest';
import type { ArticleDetailDto } from './dto.js';
import { parseArticleDetail } from './parse.js';

const story: ArticleDetailDto = {
	id: 375,
	slug: 'melbournes-hottest-athletics-year',
	title: 'Melbourne’s hottest athletics year',
	description: null,
	created_date: '2026-11-22T10:28:38.680Z',
	image: null,
	spot: null,
	content: '<p><strong>By Athleticspodium - Editorial</strong></p><p>Seventy years ago today.</p>',
	updated_date: null,
	related_champs_map: [],
	related_countries_map: [],
	related_meetings_map: [
		{
			name: '1956 Olympic Games',
			slug: '1956-olympic-games',
			city: ' Melbourne ',
			champ: { slug: 'olympic-games' }
		}
	],
	related_athletes_map: [
		{
			id: 18538,
			slug: 'bobby-morrow',
			first_name: 'Bobby',
			last_name: 'Morrow',
			country_code: 'USA',
			image: { uri: 'morrow.jpeg', credit: ' AP ' },
			medals: [
				{ medal: 1, event: { name: '100m' } },
				{ medal: 1, event: { name: '200m' } }
			]
		},
		{ id: 32719, slug: 'betty-cuthbert', first_name: 'Betty', last_name: 'Cuthbert' }
	]
};

describe('parseArticleDetail', () => {
	const { related } = parseArticleDetail(story);

	it('reads the author out of the text, and how long the rest takes to read', () => {
		expect(parseArticleDetail(story)).toMatchObject({
			byline: 'Athleticspodium - Editorial',
			content: '<p>Seventy years ago today.</p>',
			readingMinutes: 1
		});
		expect(parseArticleDetail({ ...story, content: null })).toMatchObject({
			byline: null,
			content: null,
			readingMinutes: null
		});
	});

	it('reads an edition with its city', () => {
		expect(related.meetings).toEqual([
			{
				name: '1956 Olympic Games',
				slug: '1956-olympic-games',
				champSlug: 'olympic-games',
				city: 'Melbourne'
			}
		]);
	});

	it('reads an athlete with the country, the photo and the medals of the story’s editions', () => {
		expect(related.athletes[0]).toMatchObject({
			countryCode: 'USA',
			image: { path: 'athletes/18538/morrow.jpeg', credit: 'AP', caption: null },
			medals: [
				{ place: 1, event: '100m' },
				{ place: 1, event: '200m' }
			]
		});
	});

	it('reads an athlete of a backend that answers none of them', () => {
		expect(related.athletes[1]).toMatchObject({ countryCode: null, image: null, medals: [] });
	});
});
