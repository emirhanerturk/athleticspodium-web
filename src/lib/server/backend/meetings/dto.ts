export interface MeetingDto {
	name: string;
	slug: string;
	city: string | null;
	country_code: string | null;
	start_date: string | null;
	end_date: string | null;
	champ: { name: string; slug: string } | null;
}

export interface MeetingDetailDto extends MeetingDto {
	id: number;
	year: number;
	content: string | null;
	champ: { id: number; name: string; slug: string; category: number } | null;
	country: { code: string; name: string } | null;
}

export interface EditionEntryDto {
	id: number;
	medal: number | null;
	is_canceled: boolean;
	mark_display: string | null;
	info: string | null;
	wind: number | null;
	records: string[] | null;
	notes: string | null;
	is_team: boolean;
	athlete_name: string | null;
	country: { code: string; name: string } | null;
	athlete: {
		id: number;
		slug: string;
		first_name: string | null;
		last_name: string | null;
		date_of_birth: string | null;
	} | null;
}

export interface EditionEventDto {
	id: number;
	name: string;
	notes: string | null;
	medals: EditionEntryDto[];
}

export type EditionMedalsDto = Partial<Record<'0' | '1' | '2', EditionEventDto[]>>;
