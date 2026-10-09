import { describe, expect, it } from 'vitest';
import { cacheControlFor } from './cache.js';

describe('cacheControlFor', () => {
	it('caches content pages for five minutes at the edge and serves stale for a day', () => {
		expect(cacheControlFor('/athlete/[id=integer]/[slug]', 200)).toBe(
			'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
		);
	});

	it('caches hover cards and medallist drawers in the browser too', () => {
		expect(cacheControlFor('/internal/athlete-card/[id=integer]', 200)).toBe(
			'public, max-age=3600, s-maxage=86400'
		);
		expect(cacheControlFor('/internal/medals/[champ=integer]/[country]/[year=integer]', 200)).toBe(
			'public, max-age=3600, s-maxage=86400'
		);
	});

	it('keeps search results short-lived', () => {
		expect(cacheControlFor('/search', 200)).toBe('public, max-age=0, s-maxage=300');
		expect(cacheControlFor('/internal/search', 200)).toBe('public, max-age=0, s-maxage=300');
	});

	it('caches the sitemap and robots.txt for a day', () => {
		expect(cacheControlFor('/sitemap.xml', 200)).toBe('public, max-age=0, s-maxage=86400');
		expect(cacheControlFor('/sitemaps/[file]', 200)).toBe('public, max-age=0, s-maxage=86400');
		expect(cacheControlFor('/robots.txt', 200)).toBe('public, max-age=0, s-maxage=86400');
	});

	it('keeps not-found answers short-lived and never caches server errors', () => {
		expect(cacheControlFor(null, 404)).toBe('public, max-age=0, s-maxage=300');
		expect(cacheControlFor('/athlete/[id=integer]/[slug]', 404)).toBe(
			'public, max-age=0, s-maxage=300'
		);
		expect(cacheControlFor('/athlete/[id=integer]/[slug]', 503)).toBe('no-store');
	});

	it('never caches form posts', () => {
		expect(cacheControlFor('/about', 200, 'POST')).toBe('no-store');
	});
});
