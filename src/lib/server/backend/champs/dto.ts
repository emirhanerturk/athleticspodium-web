export interface ChampDetailDto {
	id: number;
	name: string;
	slug: string;
	category: number;
	years: number[] | null;
	meetings: { name: string; slug: string; year: number; city: string | null }[];
}
