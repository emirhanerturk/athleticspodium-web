export interface CountryDto {
	code: string;
	name: string;
	categories: number[] | null;
	is_country: boolean;
	content?: string | null;
}

export interface CountryListDto {
	count: number;
	rows: CountryDto[];
}

export interface CountryMedalsDto {
	gold: number;
	silver: number;
	bronze: number;
	total: number;
	champ: { id: number; name: string; slug: string; category: number; rank: number };
}

export interface CountryAthleteDto {
	gold: string;
	silver: string;
	bronze: string;
	total: string;
	athlete?: {
		id: number;
		slug: string;
		first_name: string | null;
		last_name: string | null;
		gender: boolean;
		olympic_mark: boolean;
		image: { uri: string; credit?: string | null }[] | null;
		date_of_birth: string | null;
		events: string[] | null;
	};
}
