import { BackendNotFoundError, type BackendClient } from '../client.js';
import type { ArticleDetailDto, ArticleListDto, FeaturedArticleDto } from './dto.js';
import { parseArticleDetail, parseArticleSummary, parseArticleTeaser } from './parse.js';

const SUMMARY_FIELDS = 'created_date';

export function createArticles(client: BackendClient) {
	return {
		async latest(
			filter: { athlete?: number; champ?: number; country?: string; meeting?: number },
			limit: number
		) {
			const list = await client.get<ArticleListDto>('/articles', {
				...filter,
				limit,
				fields: SUMMARY_FIELDS
			});
			return list.rows.map(parseArticleSummary);
		},

		async page(page: number, size: number) {
			const list = await client.get<ArticleListDto>('/articles', {
				limit: size,
				offset: (page - 1) * size,
				fields: SUMMARY_FIELDS
			});
			return { count: list.count, articles: list.rows.map(parseArticleSummary) };
		},

		async get(id: number) {
			const article = await client.get<ArticleDetailDto | null>(`/articles/${id}`);
			if (!article) throw new BackendNotFoundError(`/articles/${id}`);
			return parseArticleDetail(article);
		},

		async teasers(limit: number) {
			const list = await client.get<ArticleListDto>('/articles', {
				limit,
				fields: SUMMARY_FIELDS,
				context: 1
			});
			return list.rows.map(parseArticleTeaser);
		},

		async featured() {
			const rows = await client.get<FeaturedArticleDto[]>('/featured-articles', { context: 1 });
			return rows.flatMap(({ article }) => (article ? [parseArticleTeaser(article)] : []));
		}
	};
}
