import { redirect } from '@sveltejs/kit';
import { athleteUrl } from '#lib/routing/urls.js';
import type { PageServerLoad } from './$types';

const STORY_LIMIT = 3;

export const load: PageServerLoad = async ({ params, locals: { backend } }) => {
	const [profile, stories] = await Promise.all([
		backend.athletes.getProfile(params.id),
		backend.articles.latest({ athlete: params.id }, STORY_LIMIT)
	]);

	if (params.slug !== profile.athlete.slug) redirect(301, athleteUrl(profile.athlete));

	return { ...profile, stories };
};
