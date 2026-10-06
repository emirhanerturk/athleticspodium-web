import {
	articleUrl,
	athleteUrl,
	champUrl,
	countryAthletesUrl,
	countryUrl,
	meetingUrl
} from '#lib/routing/urls.js';
import type { SitemapPage, SitemapType } from '#lib/seo/sitemap.js';
import type { SitemapPageDto, SitemapRowDtos } from './dto.js';

const PATHS_OF: { [Type in SitemapType]: (row: SitemapRowDtos[Type]) => string[] } = {
	athletes: (row) => (row.slug ? [athleteUrl({ id: row.id, slug: row.slug })] : []),
	meetings: (row) => (row.slug && row.champ ? [meetingUrl(row.champ.slug, row.slug)] : []),
	champs: (row) => (row.slug ? [champUrl(row.slug)] : []),
	countries: (row) => [countryUrl(row.code), countryAthletesUrl(row.code)],
	articles: (row) => (row.slug ? [articleUrl({ id: row.id, slug: row.slug })] : [])
};

export function parseSitemapPage<Type extends SitemapType>(
	type: Type,
	dto: SitemapPageDto<SitemapRowDtos[Type]>
): SitemapPage {
	return {
		entries: dto.rows.flatMap((row) =>
			PATHS_OF[type](row).map((path) => ({ path, lastModified: row.last_modified.slice(0, 10) }))
		),
		pageCount: Math.ceil(dto.count / dto.page_size)
	};
}
