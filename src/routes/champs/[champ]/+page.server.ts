import { redirect } from '@sveltejs/kit';
import { championshipImage, programmeOf } from '#lib/domain/championship.js';
import { inCatalogueOrder, type CatalogueEvent } from '#lib/domain/event.js';
import { champUrl } from '#lib/routing/urls.js';
import { createTtlCache } from '#lib/utils/ttl-cache.js';
import type { PageServerLoad } from './$types';

const LEADER_LIMIT = 10;
const STORY_LIMIT = 3;
const ONE_HOUR = 60 * 60 * 1000;

const catalogueCache = createTtlCache<CatalogueEvent[]>(ONE_HOUR);

export const load: PageServerLoad = async ({ params, locals: { backend } }) => {
	const image = championshipImage(params.champ);
	const [profile, nations, leaders, catalogue, hasImage] = await Promise.all([
		backend.champs.getProfile(params.champ),
		backend.champs.getNations(params.champ),
		backend.champs.getLeaders(params.champ, LEADER_LIMIT),
		catalogueCache(() => backend.events.catalogue()),
		backend.media.exists(image)
	]);
	const { champ } = profile;

	if (params.champ !== champ.slug) redirect(301, champUrl(champ.slug));

	return {
		champ,
		history: profile.history,
		editions: profile.editions,
		image: hasImage ? image : null,
		nations,
		leaders: leaders.map((leader) => ({
			...leader,
			events: inCatalogueOrder(leader.events, catalogue)
		})),
		programme: programmeOf(profile.programme, catalogue),
		stories: await backend.articles.latest({ champ: champ.id }, STORY_LIMIT)
	};
};
