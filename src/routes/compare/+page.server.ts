import { isComplete, parseCompareQuery } from '#lib/domain/compare.js';
import type { CatalogueEvent } from '#lib/domain/event.js';
import type { FilterChamp } from '#lib/domain/medal-search.js';
import { createTtlCache } from '#lib/utils/ttl-cache.js';
import type { PageServerLoad } from './$types';

const ONE_HOUR = 60 * 60 * 1000;

const champsCache = createTtlCache<FilterChamp[]>(ONE_HOUR);
const eventsCache = createTtlCache<CatalogueEvent[]>(ONE_HOUR);

export const load: PageServerLoad = async ({ url, locals: { backend } }) => {
	const query = parseCompareQuery(url.searchParams);
	const [champs, events, medals] = await Promise.all([
		champsCache(() => backend.medals.filterChamps()),
		eventsCache(() => backend.events.catalogue()),
		isComplete(query)
			? Promise.all([
					backend.medals.allForEvent(query.a, query.event, query.gender),
					backend.medals.allForEvent(query.b, query.event, query.gender)
				])
			: null
	]);

	return { query, champs, events, medals };
};
