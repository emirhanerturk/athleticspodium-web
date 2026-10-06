import type { BackendClient } from '../client.js';
import type { ArticleListDto, FeaturedArticleDto } from './dto.js';
import { parseArticleSummary, parseArticleTeaser } from './parse.js';

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
