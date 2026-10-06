import type { ChampRef } from './championship.js';
import type { IsoDate } from './date.js';

export interface Result {
	id: number;
	place: number | null;
	canceled: boolean;
	mark: string | null;
	markNote: string | null;
	wind: number | null;
	records: string[];
	notes: string | null;
	isTeam: boolean;
	event: { id: number; name: string };
	champ: ChampRef;
	meeting: {
		id: number;
		name: string;
		slug: string;
		year: number;
		startDate: IsoDate | null;
		city: string | null;
		countryCode: string | null;
	};
}

export interface MedalTally {
	gold: number;
	silver: number;
	bronze: number;
	total: number;
}

const LAST_MEDAL_PLACE = 3;

export function isMedal(result: Pick<Result, 'place'>): boolean {
	return result.place === null || result.place <= LAST_MEDAL_PLACE;
}

export function isPlacing(result: Pick<Result, 'place'>): boolean {
	return !isMedal(result);
}

export function countsAsMedal(result: Pick<Result, 'place' | 'canceled'>): boolean {
	return isMedal(result) && !result.canceled;
}

export function tallyOf(results: Pick<Result, 'place' | 'canceled'>[]): MedalTally {
	const tally = { gold: 0, silver: 0, bronze: 0, total: 0 };
	for (const result of results.filter(countsAsMedal)) {
		if (result.place === 1) tally.gold += 1;
		if (result.place === 2) tally.silver += 1;
		if (result.place === 3) tally.bronze += 1;
	}
	tally.total = tally.gold + tally.silver + tally.bronze;
	return tally;
}
