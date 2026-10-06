export interface ArticleRowDto {
	id: number;
	slug: string;
	title: string;
	description: string | null;
	created_date: string;
	image: { uri: string; caption?: string | null; credit?: string | null } | null;
}

export interface ArticleListDto {
	count: number;
	rows: ArticleRowDto[];
}
