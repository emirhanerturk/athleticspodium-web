import type { Handle, HandleServerError } from '@sveltejs/kit/hooks';
import { BACKEND_URL } from '$app/env/private';
import { PUBLIC_MEDIA_URL, PUBLIC_SITE_ENV } from '$app/env/public';
import { cacheControlFor } from '#lib/routing/cache.js';
import { canonicalRedirect } from '#lib/routing/redirects.js';
import {
	BackendNotFoundError,
	BackendUnavailableError,
	createBackend
} from '#lib/server/backend/index.js';

export const handle: Handle = async ({ event, resolve }) => {
	const canonical = canonicalRedirect(event.url);
	if (canonical) return new Response(null, { status: 301, headers: { location: canonical } });

	event.locals.backend = createBackend(event.fetch, BACKEND_URL, PUBLIC_MEDIA_URL);

	const response = await resolve(event);

	if (!response.headers.has('cache-control')) {
		response.headers.set(
			'cache-control',
			cacheControlFor(event.route.id, response.status, event.request.method)
		);
	}
	if (PUBLIC_SITE_ENV !== 'production') {
		response.headers.set('x-robots-tag', 'noindex, nofollow');
	}

	return response;
};

export const handleError: HandleServerError = ({ kind, error, event }) => {
	if (kind !== 'unknown') return;
	if (error instanceof BackendNotFoundError) return { status: 404, message: 'Not found' };

	console.error(`${event.request.method} ${event.url.pathname}`, error);

	if (error instanceof BackendUnavailableError) {
		return { status: 503, message: 'The data is temporarily unavailable' };
	}
	return { status: 500, message: 'Something went wrong' };
};
