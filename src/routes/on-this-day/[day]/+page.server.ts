import { error, redirect } from '@sveltejs/kit';
import { daySlug, parseDaySlug } from '#lib/domain/day.js';
import { parsePageParam } from '#lib/routing/page-param.js';
import { onThisDayUrl } from '#lib/routing/urls.js';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 25;

export const load: PageServerLoad = async ({ params, url, locals: { backend } }) => {
	const day = parseDaySlug(params.day);
	if (!day) error(404, 'Not found');

	const raw = { born: url.searchParams.get('born'), died: url.searchParams.get('died') };
	const pages = { born: parsePageParam(raw.born), died: parsePageParam(raw.died) };
	if (pages.born === null || pages.died === null) {
		redirect(301, onThisDayUrl(day, { born: pages.born ?? 1, died: pages.died ?? 1 }));
	}
	if (raw.born === '1' || raw.died === '1' || params.day !== daySlug(day)) {
		redirect(301, onThisDayUrl(day, { born: pages.born, died: pages.died }));
	}

	const list = async (kind: 'born' | 'died', page: number) => {
		const result = await backend.athletes.onThisDay(day, kind, {
			limit: PAGE_SIZE,
			offset: (page - 1) * PAGE_SIZE
		});
		const lastPage = Math.max(1, Math.ceil(result.count / PAGE_SIZE));
		if (page > lastPage) error(404, 'Not found');
		return { ...result, page, lastPage, offset: (page - 1) * PAGE_SIZE };
	};

	const [born, died] = await Promise.all([list('born', pages.born), list('died', pages.died)]);
	return { day, born, died };
};
