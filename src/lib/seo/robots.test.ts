import { describe, expect, it } from 'vitest';
import { robotsTxt } from './robots.js';

const SITE = 'https://athleticspodium.com';

describe('robotsTxt', () => {
	it('keeps search and internal endpoints out and points to the sitemap', () => {
		expect(
			robotsTxt(SITE, true).endsWith(
				'\n\nUser-agent: *\nDisallow: /search\nDisallow: /internal/\n\nSitemap: https://athleticspodium.com/sitemap.xml\n'
			)
		).toBe(true);
	});

	it('closes the whole site to AI training crawlers', () => {
		const [training] = robotsTxt(SITE, true).split('\n\n');

		expect(training).toMatch(/^User-agent: Google-Extended$/m);
		expect(training).toMatch(/^User-agent: Applebot-Extended$/m);
		expect(training).toMatch(/^User-agent: GPTBot$/m);
		expect(training).toMatch(/^User-agent: ClaudeBot$/m);
		expect(training.endsWith('\nDisallow: /')).toBe(true);
	});

	it('leaves search engine crawlers to the general rules', () => {
		expect(robotsTxt(SITE, true)).not.toMatch(
			/^User-agent: (Googlebot|Bingbot|Applebot|Baiduspider|PetalBot|DuckDuckBot)$/im
		);
	});

	it('closes everything outside production', () => {
		expect(robotsTxt('https://next.athleticspodium.com', false)).toBe(
			'User-agent: *\nDisallow: /\n'
		);
	});
});
