import { parseLegacyMedalQuery } from '#lib/domain/medal-search.js';
import { medalSearchUrl, PAGES } from './urls.js';

const COUNTRY_CODE_SEGMENT = /^\/country\/([a-z]{3})(?=\/|$)/i;

export function canonicalRedirect(url: URL): string | null {
	const target = new URL(url);

	target.hostname = target.hostname.replace(/^www\./, '');
	moveMatrixParamsToQuery(target);
	moveLegacyTools(target);
	target.pathname = target.pathname.replace(
		COUNTRY_CODE_SEGMENT,
		(_, code: string) => `/country/${code.toUpperCase()}`
	);

	return target.href === url.href ? null : target.href;
}

function moveMatrixParamsToQuery(url: URL) {
	const matrixParams: [string, string][] = [];

	url.pathname = url.pathname
		.split('/')
		.map((segment) => {
			const [name, ...params] = segment.split(';');
			for (const param of params) {
				const [key, value = ''] = param.split('=').map(decodeURIComponent);
				matrixParams.push([key, value]);
			}
			return name;
		})
		.join('/');

	for (const [key, value] of matrixParams) {
		if (key && value && !url.searchParams.has(key)) {
			url.searchParams.set(key, value);
		}
	}
}

const MOVED_TOOLS = new Map([
	['/medals/country-champs', PAGES.medalCountdown],
	['/compare', PAGES.compare]
]);

function moveLegacyTools(url: URL) {
	if (url.pathname === '/medals/search') {
		const moved = new URL(medalSearchUrl(parseLegacyMedalQuery(url.searchParams)), url);
		url.pathname = moved.pathname;
		url.search = moved.search;
	}
	url.pathname = MOVED_TOOLS.get(url.pathname) ?? url.pathname;
}
