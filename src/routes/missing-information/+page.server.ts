import { MISSING_INFORMATION_SUBJECT } from '#lib/domain/contact.js';
import { contactAction } from '#lib/server/contact-form.js';
import type { Actions, PageServerLoad } from './$types';

const TABS = ['medallists', 'marks', 'names', 'relays'] as const;

export const load: PageServerLoad = async ({ url, locals: { backend } }) => {
	const requested = url.searchParams.get('tab');
	const tab = TABS.find((item) => item === requested) ?? TABS[0];
	return { tab, tabs: TABS, page: await backend.pages.get('missing-information', tab) };
};

export const actions = { default: contactAction(MISSING_INFORMATION_SUBJECT) } satisfies Actions;
