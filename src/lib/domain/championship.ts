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

const AREAS = [
	'Global',
	'Africa',
	'Asia',
	'Europe',
	'Americas',
	'Oceania',
	'Regional',
	'National',
	'Road'
];

export interface EditionRef {
	name: string;
	slug: string;
	year: number;
	city: string | null;
}

export interface ChampionshipEditions {
	champ: Omit<ChampRef, 'rank'>;
	firstYear: number | null;
	editions: EditionRef[];
}

export function areaName(category: number): string {
	return AREAS[category] ?? 'Championships';
}

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
