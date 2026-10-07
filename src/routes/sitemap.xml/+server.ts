import { PUBLIC_SITE_URL } from '$app/env/public';
import { SITEMAP_TYPES, sitemapIndexXml } from '#lib/seo/sitemap.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const firstPages = await Promise.all(
		SITEMAP_TYPES.map((type) => locals.backend.sitemap.page(type, 1))
	);
	const files = [
		...SITEMAP_TYPES.flatMap((type, index) =>
			Array.from({ length: firstPages[index].pageCount }, (_, offset) => ({
				type,
				page: offset + 1
			}))
		),
		{ type: 'days' as const, page: 1 }
	];

	return new Response(sitemapIndexXml(PUBLIC_SITE_URL, files), {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
};
