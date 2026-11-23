import {
	readingMinutes,
	splitByline,
	type ArticleContext,
	type ArticleDetail,
	type ArticleSummary,
	type ArticleTeaser
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
	const { byline, body } = splitByline(dto.content?.trim() ?? '');
	return {
		...parseArticleSummary(dto),
		standfirst: dto.spot?.trim() || null,
		byline,
		content: body || null,
		readingMinutes: body ? readingMinutes(body) : null,
		updatedOn: dto.updated_date?.slice(0, 10) ?? null,
		publishedAt: dto.created_date,
		updatedAt: dto.updated_date ?? null,
		related: {
			champs: (dto.related_champs_map ?? []).map(({ name, slug }) => ({ name, slug })),
			meetings: (dto.related_meetings_map ?? []).flatMap(({ name, slug, city, champ }) =>
				champ ? [{ name, slug, champSlug: champ.slug, city: city?.trim() || null }] : []
			),
			countries: (dto.related_countries_map ?? []).map(({ code, name }) => ({ code, name })),
			athletes: (dto.related_athletes_map ?? []).map((athlete) => ({
				id: athlete.id,
				slug: athlete.slug,
				firstName: athlete.first_name ?? '',
				lastName: athlete.last_name ?? '',
				countryCode: athlete.country_code ?? null,
				image: athlete.image
					? {
							path: `athletes/${athlete.id}/${athlete.image.uri}`,
							caption: athlete.image.caption?.trim() || null,
							credit: athlete.image.credit?.trim() || null
						}
					: null,
				medals: (athlete.medals ?? []).map(({ medal, event }) => ({
					place: medal,
					event: event.name
				}))
			}))
		}
	};
}
