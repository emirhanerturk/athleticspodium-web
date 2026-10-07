import { error } from '@sveltejs/kit';
import { PUBLIC_SITE_URL } from '$app/env/public';
import { isoDateOf } from '#lib/domain/date.js';
import { daySitemapEntries, parseSitemapFileName, urlSetXml } from '#lib/seo/sitemap.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	const file = parseSitemapFileName(params.file);
	if (!file) error(404, 'Not found');

	const entries =
		file.type === 'days'
			? file.page === 1
				? daySitemapEntries(isoDateOf(new Date()))
				: []
			: (await locals.backend.sitemap.page(file.type, file.page)).entries;
	if (!entries.length) error(404, 'Not found');

	return new Response(urlSetXml(PUBLIC_SITE_URL, entries), {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
};
