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

export interface ImageDto {
	uri: string;
	credit?: string | null;
	caption?: string | null;
}

export interface AthleteDetailDto extends AthleteRowDto {
	aka: string[] | null;
	olympic_mark: boolean;
	place_of_birth: string | null;
	events: string[] | null;
	image: ImageDto[] | null;
	biography: string | null;
	country: { code: string; name: string } | null;
}

export interface ResultDto {
	id: number;
	medal: number | null;
	is_canceled: boolean;
	mark_display: string | null;
	info: string | null;
	wind: number | null;
	records: string[] | null;
	notes: string | null;
	is_team: boolean;
	event: { id: number; name: string };
	champ: { id: number; name: string; slug: string; category: number; rank: number };
	meeting: {
		id: number;
		name: string;
		slug: string;
		year: number;
		start_date: string | null;
		city?: string | null;
		country_code?: string | null;
	};
}

export interface OlympicMeetingDto {
	id: number;
	name: string;
	slug: string;
	year: number;
	city: string | null;
	champ: { slug: string } | null;
}

interface RelatedAthleteDto {
	id: number;
	slug: string;
	first_name: string | null;
	last_name: string | null;
}

export interface RelationDto {
	athlete_from_id: number;
	relation_from: number;
	relation_to: number;
	athlete_from: RelatedAthleteDto;
	athlete_to: RelatedAthleteDto;
}
