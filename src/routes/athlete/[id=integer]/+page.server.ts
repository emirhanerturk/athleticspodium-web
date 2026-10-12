import { redirect } from '@sveltejs/kit';
import { athleteUrl } from '#lib/routing/urls.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { backend } }) => {
	redirect(301, athleteUrl(await backend.athletes.getSummary(params.id)));
};
