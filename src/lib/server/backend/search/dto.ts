export interface SearchAthleteDto {
	id: number;
	slug: string;
	first_name: string | null;
	last_name: string | null;
	country_code: string | null;
	gender: boolean;
	olympic_mark: boolean;
	is_olympian: boolean;
	date_of_birth: string | null;
	date_of_death: string | null;
	events: string[] | null;
	image: { uri: string; credit?: string | null } | null;
	medals: { gold: number; silver: number; bronze: number; total: number };
}

export interface SearchArticleDto {
	id: number;
	slug: string;
	title: string;
	description: string | null;
	created_date: string;
	image: { uri: string; caption?: string | null; credit?: string | null } | null;
}

interface Page<T> {
	count: number;
	rows: T[];
}

export interface SearchDto {
	athletes?: Page<SearchAthleteDto>;
	champs?: Page<{ id: number; name: string; slug: string; category: number }>;
	countries?: Page<{ code: string; name: string; is_country: boolean }>;
	articles?: Page<SearchArticleDto>;
}
