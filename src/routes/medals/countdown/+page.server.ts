import { championshipFacts, levelOf } from '#lib/domain/championship.js';
import {
	bestMedalOf,
	countdownEditions,
	medalEntries,
	nationStandings,
	parseCountdownQuery
} from '#lib/domain/countdown.js';
import type { FilterChamp, FilterCountry } from '#lib/domain/medal-search.js';
import { createTtlCache } from '#lib/utils/ttl-cache.js';
import type { PageServerLoad } from './$types';

const ONE_HOUR = 60 * 60 * 1000;

const champsCache = createTtlCache<FilterChamp[]>(ONE_HOUR);
const countriesCache = createTtlCache<FilterCountry[]>(ONE_HOUR);

export const load: PageServerLoad = async ({ url, parent, locals: { backend } }) => {
	const query = parseCountdownQuery(url.searchParams);

	const [champs, countries] = await Promise.all([
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
		)
	]);

	const champ = champs.find((item) => item.id === query.champ);
	const country = countries.find((item) => item.code === query.country);
	if (!champ || !country) return { query, champs, countries, countdown: null };

	const { today } = await parent();
	const [tallies, championship, nations, withdrawn] = await Promise.all([
		backend.medals.byCountryAndChamp(country.code, champ.id),
		backend.champs.getEditions(champ.slug),
		backend.champs.getNations(champ.slug),
		backend.medals.withdrawn(champ.id, country.code)
	]);
	const editions = countdownEditions(championship.editions, tallies, today);
	const first = editions.findLast((item) => item.tally);
	const firstGold = editions.findLast((item) => item.tally?.gold);
	const filter = { champ: champ.id, country: country.code };
	const [firstMedals, firstGolds] = await Promise.all([
		first ? backend.medals.firstPage({ ...filter, year: first.edition.year }) : [],
		firstGold ? backend.medals.firstPage({ ...filter, year: firstGold.edition.year, medal: 1 }) : []
	]);

	return {
		query,
		champs,
		countries,
		countdown: {
			champ,
			country,
			editions,
			next: championshipFacts(championship.editions, today).next,
			standings: nationStandings(nations),
			withdrawn: medalEntries(withdrawn),
			firstMedal: first && { edition: first.edition, record: bestMedalOf(firstMedals) },
			firstGold: firstGold && { edition: firstGold.edition, record: bestMedalOf(firstGolds) }
		}
	};
};
