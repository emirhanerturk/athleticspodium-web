import type { ArticleSummary } from '#lib/domain/article.js';
import type { ArticleRowDto } from './dto.js';

export function parseArticleSummary(dto: ArticleRowDto): ArticleSummary {
	return {
		id: dto.id,
		slug: dto.slug,
		title: dto.title,
		description: dto.description,
		publishedOn: dto.created_date.slice(0, 10),
		image: dto.image
			? {
					path: `articles/${dto.image.uri}`,
					caption: dto.image.caption ?? null,
					credit: dto.image.credit ?? null
				}
			: null
	};
}
