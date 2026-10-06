import type { NationTally } from '#lib/domain/edition.js';

export interface NationTallyDto {
	gold: number;
	silver: number;
	bronze: number;
	total: number;
	country: { code: string; name: string };
}

export function parseNationTallies(dtos: NationTallyDto[]): NationTally[] {
	return dtos.map(({ gold, silver, bronze, total, country }) => ({
		country,
		gold,
		silver,
		bronze,
		total
	}));
}
