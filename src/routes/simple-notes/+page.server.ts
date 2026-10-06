import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { backend } }) => ({
	page: await backend.pages.get('simple-notes')
});
