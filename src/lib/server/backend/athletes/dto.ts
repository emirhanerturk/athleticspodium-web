export interface AthleteRowDto {
	id: number;
	slug: string;
	first_name: string | null;
	last_name: string | null;
	country_code: string | null;
	date_of_birth: string | null;
	date_of_death: string | null;
}

export interface AthleteListDto {
	count: number;
	rows: AthleteRowDto[];
}
