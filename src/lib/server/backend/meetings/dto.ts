export interface MeetingDto {
	name: string;
	slug: string;
	city: string | null;
	country_code: string | null;
	start_date: string | null;
	end_date: string | null;
	champ: { name: string; slug: string } | null;
}
