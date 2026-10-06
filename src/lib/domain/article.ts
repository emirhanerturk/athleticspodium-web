import type { AthleteRef } from './athlete.js';
import type { IsoDate } from './date.js';
import type { Image } from './image.js';

export interface ArticleSummary {
	id: number;
	slug: string;
	title: string;
	description: string | null;
	publishedOn: IsoDate;
	image: Image | null;
}

export type ArticleContext =
	| { kind: 'meeting'; name: string; slug: string; champSlug: string }
	| { kind: 'champ'; name: string; slug: string };

export interface ArticleTeaser extends ArticleSummary {
	context: ArticleContext | null;
}

export interface ArticleDetail extends ArticleSummary {
	standfirst: string | null;
	content: string | null;
	updatedOn: IsoDate | null;
	related: {
		champs: { name: string; slug: string }[];
		meetings: { name: string; slug: string; champSlug: string }[];
		countries: { code: string; name: string }[];
		athletes: AthleteRef[];
	};
}
