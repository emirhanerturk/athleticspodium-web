import { error, redirect } from '@sveltejs/kit';
import { daySlug, parseDaySlug } from '#lib/domain/day.js';
import { parsePageParam } from '#lib/routing/page-param.js';
import { onThisDayUrl } from '#lib/routing/urls.js';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 100;

export const load: PageServerLoad = async ({ params, url, locals: { backend } }) => {
	const day = parseDaySlug(params.day);
	if (!day) error(404, 'Not found');

	const raw = url.searchParams.get('page');
	const page = parsePageParam(raw);
	if (page === null) redirect(301, onThisDayUrl(day));
	if (raw === '1' || params.day !== daySlug(day)) redirect(301, onThisDayUrl(day, page));

	const offset = (page - 1) * PAGE_SIZE;
	const [born, died] = await Promise.all([
		backend.athletes.onThisDay(day, 'born', { limit: PAGE_SIZE, offset }),
		backend.athletes.onThisDay(day, 'died', { limit: PAGE_SIZE, offset })
	]);
	const lastPage = Math.max(
		1,
		Math.ceil(born.count / PAGE_SIZE),
		Math.ceil(died.count / PAGE_SIZE)
	);
	if (page > lastPage) error(404, 'Not found');

	return { day, page, lastPage, offset, born, died };
};
