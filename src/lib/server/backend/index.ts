import { createArticles } from './articles/index.js';
import { createAthletes } from './athletes/index.js';
import { createChamps } from './champs/index.js';
import { createClient } from './client.js';
import { createCountries } from './countries/index.js';
import { createEvents } from './events/index.js';
import { createMedia } from './media/index.js';
import { createMeetings } from './meetings/index.js';
import { createSitemap } from './sitemap/index.js';
import { createStats } from './stats/index.js';

export { BackendNotFoundError, BackendUnavailableError } from './client.js';

export function createBackend(fetch: typeof globalThis.fetch, baseUrl: string, mediaUrl: string) {
	const client = createClient(fetch, baseUrl);

	return {
		articles: createArticles(client),
		athletes: createAthletes(client),
		champs: createChamps(client),
		countries: createCountries(client),
		events: createEvents(client),
		media: createMedia(fetch, mediaUrl),
		meetings: createMeetings(client),
		sitemap: createSitemap(client),
		stats: createStats(client)
	};
}

export type Backend = ReturnType<typeof createBackend>;
