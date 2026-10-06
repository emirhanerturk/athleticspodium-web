const COUNTRY_CODE_SEGMENT = /^\/country\/([a-z]{3})(?=\/|$)/i;

export function canonicalRedirect(url: URL): string | null {
	const target = new URL(url);

	target.hostname = target.hostname.replace(/^www\./, '');
	moveMatrixParamsToQuery(target);
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
