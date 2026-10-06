export interface ChampRef {
	id: number;
	name: string;
	slug: string;
	category: number;
	rank: number;
}

export type Level = 'global' | 'continental' | 'regional' | 'national' | 'road';

export const LEVEL_LABELS: Record<Level, string> = {
	global: 'Global',
	continental: 'Continental',
	regional: 'Regional',
	national: 'National',
	road: 'Road'
};

const NATIONAL = 7;

export function levelOf(category: number): Level {
	if (category === 0) return 'global';
	if (category <= 5) return 'continental';
	if (category === 6) return 'regional';
	if (category === NATIONAL) return 'national';
	return 'road';
}

export function isInternational(champ: Pick<ChampRef, 'category'>): boolean {
	return champ.category !== NATIONAL;
}
