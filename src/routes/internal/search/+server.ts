import { MIN_QUERY_LENGTH } from '#lib/domain/search.js';
import type { RequestHandler } from './$types';

const QUICK_LIMIT = 5;
const EMPTY = { athletes: [], champs: [], countries: [], total: 0 };

export const GET: RequestHandler = async ({ url, locals }) => {
	const query = (url.searchParams.get('q') ?? '').trim().slice(0, 100);
	if (query.length < MIN_QUERY_LENGTH) return Response.json(EMPTY);

	const results = await locals.backend.search.find(query, { scope: 'all', limit: QUICK_LIMIT });
	return Response.json({
		athletes: results.athletes?.rows ?? [],
		champs: results.champs?.rows.slice(0, 3) ?? [],
		countries: results.countries?.rows.slice(0, 3) ?? [],
		total:
			(results.athletes?.count ?? 0) +
			(results.champs?.count ?? 0) +
			(results.countries?.count ?? 0) +
			(results.articles?.count ?? 0)
	});
};
