import { MIN_QUERY_LENGTH, PAGE_SIZE, parseSearchRequest } from '#lib/domain/search.js';
import type { PageServerLoad } from './$types';

const OVERVIEW_LIMIT = 6;

export const load: PageServerLoad = async ({ url, locals: { backend } }) => {
	const request = parseSearchRequest(url.searchParams);
	if (request.query.length < MIN_QUERY_LENGTH) return { request, overview: null, scoped: null };

	const [overview, scoped] = await Promise.all([
		backend.search.find(request.query, {
			scope: 'all',
			limit: OVERVIEW_LIMIT,
			filters: request.filters
		}),
		request.scope === 'all'
			? null
			: backend.search.find(request.query, {
					scope: request.scope,
					limit: PAGE_SIZE,
					offset: (request.page - 1) * PAGE_SIZE,
					filters: request.filters
				})
	]);

	return { request, overview, scoped };
};
