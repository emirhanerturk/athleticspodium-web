import type { BackendClient } from '../client.js';
import type { ArticleListDto } from './dto.js';
import { parseArticleSummary } from './parse.js';

const SUMMARY_FIELDS = 'created_date';

export function createArticles(client: BackendClient) {
	return {
		async latest(filter: { athlete?: number }, limit: number) {
			const list = await client.get<ArticleListDto>('/articles', {
				...filter,
				limit,
				fields: SUMMARY_FIELDS
			});
			return list.rows.map(parseArticleSummary);
		}
	};
}
