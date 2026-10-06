import { error, redirect } from '@sveltejs/kit';
import { parsePageParam } from '#lib/routing/page-param.js';
import { athleteLetterUrl } from '#lib/routing/urls.js';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 100;

export const load: PageServerLoad = async ({ params: { letter }, url, locals: { backend } }) => {
	const raw = url.searchParams.get('page');
	const page = parsePageParam(raw);
	if (page === null) redirect(301, athleteLetterUrl(letter));
	if (raw === '1' || letter !== letter.toLowerCase()) redirect(301, athleteLetterUrl(letter, page));

	const { count, athletes } = await backend.athletes.byLetter(letter, page);
	const lastPage = Math.max(1, Math.ceil(count / PAGE_SIZE));
	if (page > lastPage) error(404, 'Not found');

	return { letter, page, lastPage, count, offset: (page - 1) * PAGE_SIZE, athletes };
};
