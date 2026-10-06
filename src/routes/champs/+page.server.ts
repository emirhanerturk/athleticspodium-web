import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { backend } }) => ({
	champs: await backend.champs.list()
});
