import { redirect } from '@sveltejs/kit';
import { articleUrl } from '#lib/routing/urls.js';
import type { PageServerLoad } from './$types';

const MORE_LIMIT = 3;

export const load: PageServerLoad = async ({ params, locals: { backend } }) => {
	const [article, latest] = await Promise.all([
		backend.articles.get(params.id),
		backend.articles.latest({}, MORE_LIMIT + 1)
	]);
	if (params.slug !== article.slug) redirect(301, articleUrl(article));

	return { article, more: latest.filter((story) => story.id !== article.id).slice(0, MORE_LIMIT) };
};
