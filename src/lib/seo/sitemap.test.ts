import { describe, expect, it } from 'vitest';
import { daySitemapEntries, parseSitemapFileName, sitemapIndexXml, urlSetXml } from './sitemap.js';

const SITE = 'https://athleticspodium.com';

describe('parseSitemapFileName', () => {
	it('reads the type and page', () => {
		expect(parseSitemapFileName('athletes-3.xml')).toEqual({ type: 'athletes', page: 3 });
	});

	it('knows the day pages, which the site lists itself', () => {
		expect(parseSitemapFileName('days-1.xml')).toEqual({ type: 'days', page: 1 });
		const entries = daySitemapEntries('2026-10-07');
		expect(entries).toHaveLength(366);
		expect(entries[0]).toEqual({ path: '/on-this-day/january-1', lastModified: '2026-10-07' });
	});

	it('rejects unknown types, page zero and other names', () => {
		expect(parseSitemapFileName('people-1.xml')).toBeNull();
		expect(parseSitemapFileName('athletes-0.xml')).toBeNull();
		expect(parseSitemapFileName('athletes.xml')).toBeNull();
	});
});

describe('sitemapIndexXml', () => {
	it('lists one sitemap per file', () => {
		const xml = sitemapIndexXml(SITE, [
			{ type: 'athletes', page: 1 },
			{ type: 'champs', page: 1 }
		]);

		expect(xml).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		expect(xml).toContain('<loc>https://athleticspodium.com/sitemaps/athletes-1.xml</loc>');
		expect(xml).toContain('<loc>https://athleticspodium.com/sitemaps/champs-1.xml</loc>');
	});
});

describe('urlSetXml', () => {
	it('writes absolute, escaped locations with their last modification date', () => {
		const xml = urlSetXml(SITE, [{ path: '/article/1/fish-&-chips', lastModified: '2026-10-01' }]);

		expect(xml).toContain(
			'<url><loc>https://athleticspodium.com/article/1/fish-&amp;-chips</loc><lastmod>2026-10-01</lastmod></url>'
		);
	});
});
