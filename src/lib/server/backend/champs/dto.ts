export interface EditionDto {
	name: string;
	slug: string;
	year: number;
	city: string | null;
	country_code: string | null;
	start_date: string | null;
	events_count: number;
}

export interface ChampDetailDto {
	id: number;
	name: string;
	slug: string;
	category: number;
	years: number[] | null;
	content: string | null;
	events_men: number[] | null;
	events_women: number[] | null;
	events_mixed: number[] | null;
	meetings: EditionDto[];
}

export interface ChampionshipLeaderDto {
	athlete?: {
		id: number;
		slug: string;
		first_name: string | null;
		last_name: string | null;
		country_code: string | null;
	};
	gold: number;
	silver: number;
	bronze: number;
	total: number;
	first_year: number;
	last_year: number;
	events: string[] | null;
}
