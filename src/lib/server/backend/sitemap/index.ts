import type { SitemapType } from '#lib/seo/sitemap.js';
import type { BackendClient } from '../client.js';
import type { SitemapPageDto, SitemapRowDtos } from './dto.js';
import { parseSitemapPage } from './parse.js';

export function createSitemap(client: BackendClient) {
	return {
		async page<Type extends SitemapType>(type: Type, page: number) {
			const dto = await client.get<SitemapPageDto<SitemapRowDtos[Type]>>(`/sitemap/${type}`, {
				page
			});
			return parseSitemapPage(type, dto);
		}
	};
}
