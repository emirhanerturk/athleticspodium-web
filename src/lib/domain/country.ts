import type { AthleteRef } from './athlete.js';
import { levelOf, type ChampRef, type Level } from './championship.js';
import type { IsoDate } from './date.js';
import type { Image } from './image.js';
import type { MedalTally } from './result.js';
import { foldText } from '#lib/utils/fold-text.js';

export interface CountryProfile {
	code: string;
	name: string;
	areas: number[];
	isCountry: boolean;
	about: string | null;
}

export interface CountryListing {
	code: string;
	name: string;
	areas: number[];
	isCountry: boolean;
}

export interface ChampionshipMedals {
	champ: ChampRef;
	tally: MedalTally;
}

export interface CountryAthlete {
	athlete: AthleteRef & {
		men: boolean;
		olympicChampion: boolean;
		image: Image | null;
		birthDate: IsoDate | null;
		events: string[];
	};
	tally: MedalTally;
}

export interface HostedMeeting {
	name: string;
	slug: string;
	champ: { name: string; slug: string };
	year: number;
	city: string | null;
	startDate: IsoDate | null;
	endDate: IsoDate | null;
	hasResults: boolean;
}

export const LEVEL_ORDER: Level[] = ['global', 'continental', 'regional', 'road', 'national'];

const EMPTY_TALLY: MedalTally = { gold: 0, silver: 0, bronze: 0, total: 0 };

export function addTallies(tallies: MedalTally[]): MedalTally {
	return tallies.reduce(
		(sum, tally) => ({
			gold: sum.gold + tally.gold,
			silver: sum.silver + tally.silver,
			bronze: sum.bronze + tally.bronze,
			total: sum.total + tally.total
		}),
		EMPTY_TALLY
	);
}

export function medalsByLevel(medals: ChampionshipMedals[]): Record<Level, ChampionshipMedals[]> {
	const groups = Object.fromEntries(LEVEL_ORDER.map((level) => [level, []])) as unknown as Record<
		Level,
		ChampionshipMedals[]
	>;
	for (const row of [...medals].sort((a, b) => a.champ.rank - b.champ.rank)) {
		groups[levelOf(row.champ.category)].push(row);
	}
	return groups;
}

export function internationalMedals(medals: ChampionshipMedals[]): MedalTally {
	return addTallies(
		medals.filter((row) => levelOf(row.champ.category) !== 'national').map((row) => row.tally)
	);
}

export function nationalTitles(medals: ChampionshipMedals[]): number {
	return medals
		.filter((row) => levelOf(row.champ.category) === 'national')
		.reduce((sum, row) => sum + row.tally.gold, 0);
}

export const AREA_TABS = [
	{ slug: null, label: 'All', category: null },
	{ slug: 'europe', label: 'Europe', category: 3 },
	{ slug: 'africa', label: 'Africa', category: 1 },
	{ slug: 'asia', label: 'Asia', category: 2 },
	{ slug: 'americas', label: 'Americas', category: 4 },
	{ slug: 'oceania', label: 'Oceania', category: 5 }
] as const;

export type AreaTab = (typeof AREA_TABS)[number];

export function areaTabOf(slug: string | null): AreaTab {
	return AREA_TABS.find((tab) => tab.slug === slug) ?? AREA_TABS[0];
}

export function inArea(country: CountryListing, tab: AreaTab): boolean {
	return tab.category === null || country.areas.includes(tab.category);
}

export function matchesCountry(country: CountryListing, query: string): boolean {
	const needle = foldText(query.trim());
	return (
		!needle || foldText(country.name).includes(needle) || country.code.toLowerCase() === needle
	);
}

export function groupByInitial<T extends { name: string }>(
	items: T[]
): { initial: string; items: T[] }[] {
	const groups = new Map<string, T[]>();
	for (const item of items) {
		const initial = foldText(item.name).charAt(0).toUpperCase();
		groups.set(initial, [...(groups.get(initial) ?? []), item]);
	}
	return [...groups.entries()]
		.sort(([a], [b]) => a.localeCompare(b, 'en'))
		.map(([initial, members]) => ({ initial, items: members }));
}
