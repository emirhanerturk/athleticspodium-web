export interface MedalRowDto {
	id: number;
	medal: number | null;
	is_team: boolean;
	gender: number;
	is_canceled: boolean;
	athlete_name: string | null;
	mark_display: string | null;
	info: string | null;
	wind: number | null;
	records: string[] | null;
	notes: string | null;
	champ: { name: string; slug: string } | null;
	meeting: { id: number; name: string; slug: string; year: number; city: string | null } | null;
	event: { name: string } | null;
	country: { code: string; name: string } | null;
	athlete: {
		id: number;
		slug: string;
		first_name: string | null;
		last_name: string | null;
		olympic_mark: boolean;
		date_of_birth: string | null;
	} | null;
}

export interface MedalSearchDto {
	count: number;
	counts: { gold: number; silver: number; bronze: number; withdrawn?: number };
	rows: MedalRowDto[];
}

export interface FilterChampDto {
	id: number;
	name: string;
	slug: string;
	category: number;
	countries: string[] | null;
	years: number[] | null;
	events_men: number[] | null;
	events_women: number[] | null;
	events_mixed: number[] | null;
}

export interface CountryMedalsByEditionDto {
	gold: number;
	silver: number;
	bronze: number;
	total: number;
	meeting: { id: number; name: string; year: number; slug: string; city: string | null };
}
