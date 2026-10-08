import type {
	ArticleContext,
	ArticleDetail,
	ArticleSummary,
	ArticleTeaser
} from '#lib/domain/article.js';
import type {
	ArticleContextDto,
	ArticleDetailDto,
	ArticleRowDto,
	ArticleTeaserDto
} from './dto.js';

export function parseArticleSummary(dto: ArticleRowDto): ArticleSummary {
	return {
		id: dto.id,
		slug: dto.slug,
		title: dto.title.trim(),
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

export function parseArticleDetail(dto: ArticleDetailDto): ArticleDetail {
	return {
		...parseArticleSummary(dto),
		standfirst: dto.spot?.trim() || null,
		content: dto.content?.trim() || null,
		updatedOn: dto.updated_date?.slice(0, 10) ?? null,
		related: {
			champs: (dto.related_champs_map ?? []).map(({ name, slug }) => ({ name, slug })),
			meetings: (dto.related_meetings_map ?? []).flatMap(({ name, slug, champ }) =>
				champ ? [{ name, slug, champSlug: champ.slug }] : []
			),
			countries: (dto.related_countries_map ?? []).map(({ code, name }) => ({ code, name })),
			athletes: (dto.related_athletes_map ?? []).map((athlete) => ({
				id: athlete.id,
				slug: athlete.slug,
				firstName: athlete.first_name ?? '',
				lastName: athlete.last_name ?? '',
				countryCode: athlete.country_code
			}))
		}
	};
}
