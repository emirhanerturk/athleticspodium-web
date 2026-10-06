import { isInternational, levelOf, type ChampRef, type Level } from './championship.js';
import { countsAsMedal, isPlacing, tallyOf, type MedalTally, type Result } from './result.js';

export interface CareerSummary {
	international: MedalTally;
	nationalTitles: number;
	placings: number;
	podiumYears: { first: number; last: number } | null;
}

export interface ChampionshipTally extends MedalTally {
	champ: ChampRef;
}

export interface OlympicGames {
	id: number;
	name: string;
	slug: string;
	year: number;
	city: string | null;
	champSlug: string;
}

export interface OlympicAppearance {
	games: OlympicGames;
	best: Result | null;
}

const LEVEL_ORDER: Level[] = ['global', 'continental', 'regional', 'road', 'national'];

export function internationalResults(results: Result[]): Result[] {
	return results.filter((result) => isInternational(result.champ));
}

export function nationalResults(results: Result[]): Result[] {
	return results.filter((result) => !isInternational(result.champ));
}

export function careerSummary(results: Result[]): CareerSummary {
	const international = internationalResults(results);
	const podiumYears = international.filter(countsAsMedal).map((result) => result.meeting.year);

	return {
		international: tallyOf(international),
		nationalTitles: nationalResults(results).filter(
			(result) => result.place === 1 && !result.canceled
		).length,
		placings: international.filter((result) => isPlacing(result) && !result.canceled).length,
		podiumYears: podiumYears.length
			? { first: Math.min(...podiumYears), last: Math.max(...podiumYears) }
			: null
	};
}

export function medalsByChampionship(results: Result[]): ChampionshipTally[] {
	const byChamp = Map.groupBy(
		internationalResults(results).filter(countsAsMedal),
		(result) => result.champ.id
	);

	return [...byChamp.values()]
		.map((champResults) => ({ champ: champResults[0].champ, ...tallyOf(champResults) }))
		.sort((a, b) => a.champ.rank - b.champ.rank || a.champ.name.localeCompare(b.champ.name));
}

export function olympicAppearances(games: OlympicGames[], results: Result[]): OlympicAppearance[] {
	return games
		.map((edition) => ({
			games: edition,
			best:
				results
					.filter((result) => result.meeting.id === edition.id && !result.canceled)
					.sort((a, b) => (a.place ?? Infinity) - (b.place ?? Infinity))[0] ?? null
		}))
		.sort((a, b) => b.games.year - a.games.year);
}

export function levelCounts(results: Result[]): { level: Level; count: number }[] {
	const counts = Map.groupBy(results, (result) => levelOf(result.champ.category));
	return LEVEL_ORDER.filter((level) => counts.has(level)).map((level) => ({
		level,
		count: counts.get(level)!.length
	}));
}
