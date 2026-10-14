const AI_TRAINING_CRAWLERS = [
	'Amazonbot',
	'Applebot-Extended',
	'Bytespider',
	'CCBot',
	'ClaudeBot',
	'Diffbot',
	'Google-Extended',
	'GPTBot',
	'omgili',
	'anthropic-ai',
	'Claude-Web',
	'cohere-ai',
	'MistralAI-Training',
	'meta-externalagent',
	'GoogleOther',
	'AwarioSmartBot',
	'AwarioRssBot',
	'Google-CloudVertexBot',
	'QualifiedBot',
	'Cotoyogi',
	'ICC-Crawler',
	'atlassian-bot',
	'FishBot',
	'BorderxBot',
	'NavuBot',
	'SemrushBot-SWA',
	'WARDBot',
	'magpie-crawler',
	'KimiBot',
	'CitibotSiteCrawler'
];

export function robotsTxt(siteUrl: string, indexable: boolean): string {
	if (!indexable) return 'User-agent: *\nDisallow: /\n';

	return [
		...AI_TRAINING_CRAWLERS.map((crawler) => `User-agent: ${crawler}`),
		'Disallow: /',
		'',
		'User-agent: *',
		'Disallow: /search',
		'Disallow: /internal/',
		'',
		`Sitemap: ${siteUrl}/sitemap.xml`,
		''
	].join('\n');
}
