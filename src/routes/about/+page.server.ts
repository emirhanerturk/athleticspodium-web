import { contactAction } from '#lib/server/contact-form.js';
import { createTtlCache } from '#lib/utils/ttl-cache.js';
import type { Actions, PageServerLoad } from './$types';

const ONE_HOUR = 60 * 60 * 1000;

const storiesCache = createTtlCache<number>(ONE_HOUR);

export const load: PageServerLoad = async ({ locals: { backend } }) => ({
	stories: await storiesCache(async () => (await backend.articles.page(1, 1)).count).catch(
		() => null
	)
});

export const actions = { default: contactAction() } satisfies Actions;
