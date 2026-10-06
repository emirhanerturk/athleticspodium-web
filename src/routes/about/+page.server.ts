import { contactAction } from '#lib/server/contact-form.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { backend } }) => {
	const [main, box] = await Promise.all([
		backend.pages.get('about', 'main'),
		backend.pages.get('about', 'box')
	]);
	return { main, box };
};

export const actions = { default: contactAction() } satisfies Actions;
