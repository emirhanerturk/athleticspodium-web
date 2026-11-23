import { redirect } from '@sveltejs/kit';
import { articleUrl } from '#lib/routing/urls.js';
import type { PageServerLoad } from './$types';

const MORE_LIMIT = 3;

export const load: PageServerLoad = async ({ params, locals: { backend } }) => {
	const [article, more] = await Promise.all([
		backend.articles.get(params.id),
		backend.articles.related(params.id, MORE_LIMIT)
	]);
	if (params.slug !== article.slug) redirect(301, articleUrl(article));

	return { article, more };
};
