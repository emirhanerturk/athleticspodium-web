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

export interface ArticleDetailDto extends ArticleRowDto {
	spot: string | null;
	content: string | null;
	updated_date: string | null;
	related_champs_map: { name: string; slug: string }[] | null;
	related_meetings_map: { name: string; slug: string; champ: { slug: string } | null }[] | null;
	related_countries_map: { code: string; name: string }[] | null;
	related_athletes_map:
		| {
				id: number;
				slug: string;
				first_name: string | null;
				last_name: string | null;
				country_code: string | null;
		  }[]
		| null;
}
