import { describe, expect, it } from 'vitest';
import { robotsTxt } from './robots.js';

describe('robotsTxt', () => {
	it('keeps search and internal endpoints out and points to the sitemap', () => {
		expect(robotsTxt('https://athleticspodium.com', true)).toBe(
			'User-agent: *\nDisallow: /search\nDisallow: /internal/\n\nSitemap: https://athleticspodium.com/sitemap.xml\n'
		);
	});

	it('closes everything outside production', () => {
		expect(robotsTxt('https://next.athleticspodium.com', false)).toBe(
			'User-agent: *\nDisallow: /\n'
		);
	});
});
