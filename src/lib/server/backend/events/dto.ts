export interface EventListDto {
	count: number;
	rows: { id: number; name: string; rank: number }[];
}
