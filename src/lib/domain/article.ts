import type { AthleteRef } from './athlete.js';
import type { IsoDate } from './date.js';
import { htmlToText } from '#lib/utils/html-text.js';
import type { Image } from './image.js';

export interface ArticleSummary {
	id: number;
	slug: string;
	title: string;
	description: string | null;
	publishedOn: IsoDate;
	image: Image | null;
}

export interface StoryAthlete extends AthleteRef {
	image: Image | null;
	medals: { place: number; event: string }[];
}

export type ArticleContext =
	| { kind: 'meeting'; name: string; slug: string; champSlug: string }
	| { kind: 'champ'; name: string; slug: string };

export interface ArticleTeaser extends ArticleSummary {
	context: ArticleContext | null;
}

export interface ArticleDetail extends ArticleSummary {
	standfirst: string | null;
	byline: string | null;
	content: string | null;
	readingMinutes: number | null;
	updatedOn: IsoDate | null;
	publishedAt: string;
	updatedAt: string | null;
	related: {
		champs: { name: string; slug: string }[];
		meetings: {
			name: string;
			slug: string;
			champSlug: string;
			city: string | null;
		}[];
		countries: { code: string; name: string }[];
		athletes: StoryAthlete[];
	};
}

const INLINE = '(?:strong|em|b|i|span)';
const BYLINE = new RegExp(
	`^\\s*<p[^>]*>(?:\\s*<${INLINE}\\b[^>]*>)+\\s*By\\s+([^<]{2,80}?)\\s*(?:</${INLINE}>\\s*)+</p>`,
	'i'
);

/** The editors write a story's author as its first paragraph, a bold or italic "By <name>": the name, and the story without it. */
export function splitByline(html: string): { byline: string | null; body: string } {
	const match = BYLINE.exec(html);
	if (!match) return { byline: null, body: html };
	return { byline: htmlToText(match[1]), body: html.slice(match[0].length).trim() };
}

const WORDS_PER_MINUTE = 220;

export function readingMinutes(html: string): number {
	const words = htmlToText(html).split(' ').filter(Boolean).length;
	return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Whether a byline names the site's desk rather than a person, as "Editorial - Athleticspodium.com". */
export function isDeskByline(byline: string): boolean {
	return byline.replace(/athletics\s*podium(\.com)?|editorial|crew|[\s-]/gi, '') === '';
}
