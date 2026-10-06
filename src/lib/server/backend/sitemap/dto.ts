export interface SitemapRowDtos {
	athletes: { id: number; slug: string | null; last_modified: string };
	meetings: { slug: string | null; last_modified: string; champ: { slug: string } | null };
	champs: { slug: string | null; last_modified: string };
	countries: { code: string; last_modified: string };
	articles: { id: number; slug: string | null; last_modified: string };
}

export interface SitemapPageDto<Row> {
	count: number;
	page_size: number;
	rows: Row[];
}
