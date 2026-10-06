import type { ArticleContext, ArticleSummary, ArticleTeaser } from '#lib/domain/article.js';
import type { ArticleContextDto, ArticleRowDto, ArticleTeaserDto } from './dto.js';

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

export function parseArticleTeaser(dto: ArticleTeaserDto): ArticleTeaser {
	return { ...parseArticleSummary(dto), context: parseContext(dto.context ?? null) };
}

function parseContext(dto: ArticleContextDto): ArticleContext | null {
	if (!dto) return null;
	if (dto.type === 'champ') return { kind: 'champ', name: dto.name, slug: dto.slug };
	return dto.champ
		? { kind: 'meeting', name: dto.name, slug: dto.slug, champSlug: dto.champ.slug }
		: null;
}
