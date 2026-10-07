import type { IsoDate } from '#lib/domain/date.js';
import { everyDay } from '#lib/domain/day.js';
import { onThisDayUrl } from '#lib/routing/urls.js';

export const SITEMAP_TYPES = ['athletes', 'meetings', 'champs', 'countries', 'articles'] as const;

export type SitemapType = (typeof SITEMAP_TYPES)[number];
export type SitemapFileType = SitemapType | 'days';

export interface SitemapEntry {
	path: string;
	lastModified: IsoDate;
}

export interface SitemapPage {
	entries: SitemapEntry[];
	pageCount: number;
}

export interface SitemapFile {
	type: SitemapFileType;
	page: number;
}

const FILE_NAME = /^([a-z]+)-([1-9]\d*)\.xml$/;

export function sitemapFileName({ type, page }: SitemapFile): string {
	return `${type}-${page}.xml`;
}

export function parseSitemapFileName(name: string): SitemapFile | null {
	const match = FILE_NAME.exec(name);
	if (!match || !isSitemapFileType(match[1])) return null;
	return { type: match[1], page: Number(match[2]) };
}

export function sitemapIndexXml(siteUrl: string, files: SitemapFile[]): string {
	const items = files.map(
		(file) =>
			`<sitemap><loc>${escapeXml(`${siteUrl}/sitemaps/${sitemapFileName(file)}`)}</loc></sitemap>`
	);
	return xmlDocument('sitemapindex', items);
}

export function urlSetXml(siteUrl: string, entries: SitemapEntry[]): string {
	const items = entries.map(
		(entry) =>
			`<url><loc>${escapeXml(siteUrl + entry.path)}</loc><lastmod>${entry.lastModified}</lastmod></url>`
	);
	return xmlDocument('urlset', items);
}

function isSitemapFileType(value: string): value is SitemapFileType {
	return value === 'days' || (SITEMAP_TYPES as readonly string[]).includes(value);
}

export function daySitemapEntries(today: IsoDate): SitemapEntry[] {
	return everyDay().map((day) => ({ path: onThisDayUrl(day), lastModified: today }));
}

function xmlDocument(root: string, items: string[]): string {
	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		`<${root} xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...items,
		`</${root}>`
	].join('\n');
}

function escapeXml(text: string): string {
	return text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}
