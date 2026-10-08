import type { CountryAthlete } from '#lib/domain/country.js';
import { inCatalogueOrder, type CatalogueEvent } from '#lib/domain/event.js';
import { createTtlCache } from '#lib/utils/ttl-cache.js';
import type { PageServerLoad } from './$types';

const DECORATED_LIMIT = 12;
const HOSTED_LIMIT = 8;
const STORY_LIMIT = 3;
const ONE_HOUR = 60 * 60 * 1000;

const catalogueCache = createTtlCache<CatalogueEvent[]>(ONE_HOUR);

export const load: PageServerLoad = async ({ params: { code }, locals: { backend } }) => {
	const [country, medals, all, men, women, hosted, stories, catalogue] = await Promise.all([
		backend.countries.getProfile(code),
		backend.countries.getMedals(code),
		backend.countries.getAthletes(code, { limit: DECORATED_LIMIT }),
		backend.countries.getAthletes(code, { gender: 'men', limit: DECORATED_LIMIT }),
		backend.countries.getAthletes(code, { gender: 'women', limit: DECORATED_LIMIT }),
		backend.meetings.hostedIn(code, HOSTED_LIMIT),
		backend.articles.latest({ country: code }, STORY_LIMIT),
		catalogueCache(() => backend.events.catalogue())
	]);
	const ordered = (list: CountryAthlete[]) =>
		list.map((row) => ({ ...row, events: inCatalogueOrder(row.events, catalogue) }));

	return {
		country,
		medals,
		decorated: { all: ordered(all), men: ordered(men), women: ordered(women) },
		hosted,
		stories
	};
};
