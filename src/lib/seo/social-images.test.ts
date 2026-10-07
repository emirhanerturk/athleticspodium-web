import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ogImage, SOCIAL_IMAGE_NAMES } from './social-images.js';

const SITE_URL = 'https://athleticspodium.com';

describe('ogImage', () => {
	it("uses the page's own picture when there is one", () => {
		expect(ogImage(SITE_URL, 'https://api.athleticspodium.com/media/a.jpeg', 'athletes')).toEqual({
			url: 'https://api.athleticspodium.com/media/a.jpeg'
		});
	});

	it('falls back to the social image of the section', () => {
		expect(ogImage(SITE_URL, undefined, 'countries')).toEqual({
			url: 'https://athleticspodium.com/og/countries.png',
			alt: 'Athletics Podium: the medal record of every nation',
			width: 1200,
			height: 630
		});
	});

	it('has a generated file for every social image', () => {
		const missing = SOCIAL_IMAGE_NAMES.filter((name) => !existsSync(`static/og/${name}.png`));
		expect(missing).toEqual([]);
	});
});
