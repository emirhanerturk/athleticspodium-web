import { error, redirect } from '@sveltejs/kit';
import { parsePageParam } from '#lib/routing/page-param.js';
import { articlesUrl } from '#lib/routing/urls.js';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 12;

export const load: PageServerLoad = async ({ url, locals: { backend } }) => {
	const raw = url.searchParams.get('page');
	const page = parsePageParam(raw);
	if (page === null || raw === '1') redirect(301, articlesUrl());

	const { count, articles } = await backend.articles.page(page, PAGE_SIZE);
	const lastPage = Math.max(1, Math.ceil(count / PAGE_SIZE));
	if (page > lastPage) error(404, 'Not found');

	return { page, lastPage, count, articles };
};
