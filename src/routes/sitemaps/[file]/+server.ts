import { error } from '@sveltejs/kit';
import { PUBLIC_SITE_URL } from '$app/env/public';
import { parseSitemapFileName, urlSetXml } from '#lib/seo/sitemap.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	const file = parseSitemapFileName(params.file);
	if (!file) error(404, 'Not found');

	const page = await locals.backend.sitemap.page(file.type, file.page);
	if (!page.entries.length) error(404, 'Not found');

	return new Response(urlSetXml(PUBLIC_SITE_URL, page.entries), {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
};
