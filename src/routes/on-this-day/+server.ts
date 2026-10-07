import { isoDateOf } from '#lib/domain/date.js';
import { dayOf, dayOfDate, daysIn } from '#lib/domain/day.js';
import { onThisDayUrl } from '#lib/routing/urls.js';
import type { RequestHandler } from './$types';

const number = (value: string | null) => (value && /^\d{1,2}$/.test(value) ? Number(value) : null);

export const GET: RequestHandler = ({ url }) => {
	const month = number(url.searchParams.get('month'));
	const day = number(url.searchParams.get('day'));
	const chosen = month && month <= 12 && day ? dayOf(month, Math.min(day, daysIn(month))) : null;
	const location = onThisDayUrl(chosen ?? dayOfDate(isoDateOf(new Date())));
	return new Response(null, { status: 302, headers: { location, 'cache-control': 'no-store' } });
};
