import { redirect } from '@sveltejs/kit';
import { isoDateOf } from '#lib/domain/date.js';
import { dayOf, dayOfDate, daysIn } from '#lib/domain/day.js';
import { onThisDayUrl } from '#lib/routing/urls.js';
import type { PageServerLoad } from './$types';

const number = (value: string | null) => (value && /^\d{1,2}$/.test(value) ? Number(value) : null);

export const load: PageServerLoad = ({ url }) => {
	const month = number(url.searchParams.get('month'));
	const day = number(url.searchParams.get('day'));
	const chosen = month && month <= 12 && day ? dayOf(month, Math.min(day, daysIn(month))) : null;
	if (chosen) redirect(302, onThisDayUrl(chosen));

	return { serverDay: dayOfDate(isoDateOf(new Date())) };
};
