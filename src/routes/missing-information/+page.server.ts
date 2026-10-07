import { MISSING_INFORMATION_SUBJECT } from '#lib/domain/contact.js';
import { contactAction } from '#lib/server/contact-form.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { backend } }) => ({
	lists: await backend.pages.missingInformation()
});

export const actions = { default: contactAction(MISSING_INFORMATION_SUBJECT) } satisfies Actions;
