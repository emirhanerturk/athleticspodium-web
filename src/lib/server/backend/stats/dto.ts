export interface StatsDto {
	medals: number;
	placings: number;
	athletes: number;
	championships: number;
	countries: number;
	season_meetings: number;
	last_addition: {
		name: string;
		slug: string;
		created_date: string;
		champ: { slug: string } | null;
	} | null;
}
