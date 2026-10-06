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
