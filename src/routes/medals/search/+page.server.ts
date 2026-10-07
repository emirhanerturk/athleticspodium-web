import type { CatalogueEvent } from '#lib/domain/event.js';
import {
	isSearchable,
	parseMedalQuery,
	type FilterChamp,
	type FilterCountry
} from '#lib/domain/medal-search.js';
import { createTtlCache } from '#lib/utils/ttl-cache.js';
import type { PageServerLoad } from './$types';

const ONE_HOUR = 60 * 60 * 1000;

const champsCache = createTtlCache<FilterChamp[]>(ONE_HOUR);
const countriesCache = createTtlCache<FilterCountry[]>(ONE_HOUR);
const eventsCache = createTtlCache<CatalogueEvent[]>(ONE_HOUR);

export const load: PageServerLoad = async ({ url, locals: { backend } }) => {
	const query = parseMedalQuery(url.searchParams);
	const searchable = isSearchable(query);
	const [champs, countries, events, results, everyMedal] = await Promise.all([
		champsCache(() => backend.medals.filterChamps()),
		countriesCache(async () =>
			(await backend.countries.list()).map(({ code, name, areas }) => ({ code, name, areas }))
		),
		eventsCache(() => backend.events.catalogue()),
		searchable ? backend.medals.search(query) : null,
		searchable && query.medal ? backend.medals.search({ ...query, medal: null, page: 1 }) : null
	]);

	return {
		query,
		champs,
		countries,
		events,
		results,
		medalTally: (everyMedal ?? results)?.tally ?? null
	};
};
