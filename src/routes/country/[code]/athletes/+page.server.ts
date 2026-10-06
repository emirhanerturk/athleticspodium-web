import { error, redirect } from '@sveltejs/kit';
import { parsePageParam } from '#lib/routing/page-param.js';
import { countryAthletesUrl } from '#lib/routing/urls.js';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 100;

export const load: PageServerLoad = async ({ params: { code }, url, locals: { backend } }) => {
	const raw = url.searchParams.get('page');
	const page = parsePageParam(raw);
	if (page === null || raw === '1') redirect(301, countryAthletesUrl(code));

	const [country, rows] = await Promise.all([
		backend.countries.getProfile(code),
		backend.countries.getAthletes(code, {
			limit: PAGE_SIZE + 1,
			offset: (page - 1) * PAGE_SIZE
		})
	]);
	if (!rows.length && page > 1) error(404, 'Not found');

	return {
		country,
		page,
		offset: (page - 1) * PAGE_SIZE,
		athletes: rows.slice(0, PAGE_SIZE),
		hasMore: rows.length > PAGE_SIZE
	};
};
