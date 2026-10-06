export function robotsTxt(siteUrl: string, indexable: boolean): string {
	if (!indexable) return 'User-agent: *\nDisallow: /\n';

	return [
		'User-agent: *',
		'Disallow: /search',
		'Disallow: /internal/',
		'',
		`Sitemap: ${siteUrl}/sitemap.xml`,
		''
	].join('\n');
}
