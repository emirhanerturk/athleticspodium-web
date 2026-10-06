const PAGE = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400';
const SHORT = 'public, max-age=0, s-maxage=300';
const DAILY = 'public, max-age=0, s-maxage=86400';
const HOVER_CARD = 'public, max-age=3600, s-maxage=86400';
const NEVER = 'no-store';

const POLICY_BY_ROUTE_PREFIX: [string, string][] = [
	['/internal/athlete-card', HOVER_CARD],
	['/internal/search', SHORT],
	['/search', SHORT],
	['/sitemap', DAILY],
	['/robots.txt', DAILY]
];

export function cacheControlFor(routeId: string | null, status: number): string {
	if (status >= 500) return NEVER;
	if (routeId === null || status === 404) return SHORT;

	const match = POLICY_BY_ROUTE_PREFIX.find(([prefix]) => routeId.startsWith(prefix));
	return match ? match[1] : PAGE;
}
