import { error, redirect } from '@sveltejs/kit';
import type { CountryAthlete, CountryProfile } from '#lib/domain/country.js';
import {
	browseAthletes,
	countAthletes,
	parseCountryAthletesQuery
} from '#lib/domain/country-athletes.js';
import { inCatalogueOrder, type CatalogueEvent } from '#lib/domain/event.js';
import { countryAthletesUrl } from '#lib/routing/urls.js';
import { createKeyedTtlCache, createTtlCache } from '#lib/utils/ttl-cache.js';
import type { PageServerLoad } from './$types';

const TEN_MINUTES = 10 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;
const CACHED_COUNTRIES = 30;
const QUERY_PARAMS = new Set(['q', 'gender', 'era', 'sort', 'page']);

const countryCache = createKeyedTtlCache<{ country: CountryProfile; athletes: CountryAthlete[] }>(
	TEN_MINUTES,
	CACHED_COUNTRIES
);
const catalogueCache = createTtlCache<CatalogueEvent[]>(ONE_HOUR);

const queryParamsOf = (url: URL) =>
	new URLSearchParams([...url.searchParams].filter(([key]) => QUERY_PARAMS.has(key))).toString();

export const load: PageServerLoad = async ({ params: { code }, url, locals: { backend } }) => {
	const query = parseCountryAthletesQuery(url.searchParams);
	const canonical = countryAthletesUrl(code, query);
	if (queryParamsOf(url) !== new URL(canonical, url).searchParams.toString()) {
		redirect(301, canonical);
	}

	const { country, athletes } = await countryCache(code, async () => {
		const [country, rows, catalogue] = await Promise.all([
			backend.countries.getProfile(code),
			backend.countries.getAthletes(code),
			catalogueCache(() => backend.events.catalogue())
		]);
		return {
			country,
			athletes: rows.map((row) => ({ ...row, events: inCatalogueOrder(row.events, catalogue) }))
		};
	});

	const browse = browseAthletes(athletes, query);
	if (query.page > browse.pageCount) error(404, 'Not found');

	return { country, query, counts: countAthletes(athletes), ...browse };
};
