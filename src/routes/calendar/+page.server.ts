import { redirect } from '@sveltejs/kit';
import { isoDateOf, yearOf } from '#lib/domain/date.js';
import { calendarUrl } from '#lib/routing/urls.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	redirect(302, calendarUrl(yearOf(isoDateOf(new Date()))));
};
