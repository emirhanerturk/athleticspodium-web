import { levelOf } from '#lib/domain/championship.js';
import type { FilterChamp, FilterCountry } from '#lib/domain/medal-search.js';
import { createTtlCache } from '#lib/utils/ttl-cache.js';
import type { PageServerLoad } from './$types';

const ONE_HOUR = 60 * 60 * 1000;

const champsCache = createTtlCache<FilterChamp[]>(ONE_HOUR);
const countriesCache = createTtlCache<FilterCountry[]>(ONE_HOUR);

export const load: PageServerLoad = async ({ url, locals: { backend } }) => {
	const code = url.searchParams.get('country')?.toUpperCase() ?? '';
	const id = url.searchParams.get('champ') ?? '';
	const countryCode = /^[A-Z]{3}$/.test(code) ? code : null;
	const champId = /^\d{1,9}$/.test(id) ? Number(id) : null;

	const [champs, countries, editions] = await Promise.all([
		champsCache(async () =>
			(await backend.medals.filterChamps()).filter((champ) => {
				const level = levelOf(champ.category);
				return level !== 'national' && level !== 'road';
			})
		),
		countriesCache(async () =>
			(await backend.countries.list())
				.filter((country) => country.isCountry)
				.map(({ code, name, areas }) => ({ code, name, areas }))
		),
		countryCode && champId ? backend.medals.byCountryAndChamp(countryCode, champId) : null
	]);

	return { champs, countries, countryCode, champId, editions };
};
