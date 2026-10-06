import { PUBLIC_SITE_ENV, PUBLIC_SITE_URL } from '$app/env/public';
import { robotsTxt } from '#lib/seo/robots.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () =>
	new Response(robotsTxt(PUBLIC_SITE_URL, PUBLIC_SITE_ENV === 'production'), {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
