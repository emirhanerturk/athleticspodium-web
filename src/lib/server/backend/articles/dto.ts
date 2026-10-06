export interface ArticleRowDto {
	id: number;
	slug: string;
	title: string;
	description: string | null;
	created_date: string;
	image: { uri: string; caption?: string | null; credit?: string | null } | null;
}

export type ArticleContextDto =
	| { type: 'meeting'; name: string; slug: string; champ: { name: string; slug: string } | null }
	| { type: 'champ'; name: string; slug: string }
	| null;

export interface ArticleTeaserDto extends ArticleRowDto {
	context?: ArticleContextDto;
}

export interface FeaturedArticleDto {
	article: ArticleTeaserDto | null;
}

export interface ArticleListDto {
	count: number;
	rows: ArticleTeaserDto[];
}
