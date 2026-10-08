import type { OnThisDay } from '#lib/domain/athlete.js';
import { monthDayParam, type DayOfYear } from '#lib/domain/day.js';
import { BackendNotFoundError, type BackendClient } from '../client.js';
import type {
	AthleteDetailDto,
	AthleteLetterPageDto,
	AthleteSummaryDto,
	FeaturedAthleteDto,
	OlympicMeetingDto,
	RelationDto,
	ResultDto
} from './dto.js';
import {
	parseAthleteListing,
	parseAthleteProfile,
	parseAthleteSummary,
	parseFeaturedAthletes,
	parseOlympicGames,
	parseRelatives,
	parseResult
} from './parse.js';

export function createAthletes(client: BackendClient) {
	return {
		async getProfile(id: number) {
			const [athlete, results, olympics, relations] = await Promise.all([
				client.get<AthleteDetailDto | null>(`/athletes/${id}`),
				client.get<ResultDto[]>(`/athletes/${id}/medals`),
				client.get<OlympicMeetingDto[]>(`/athletes/${id}/olympians`),
				client.get<RelationDto[]>(`/athletes/${id}/relateds`)
			]);
			if (!athlete) throw new BackendNotFoundError(`/athletes/${id}`);

			return {
				athlete: parseAthleteProfile(athlete),
				results: results.map(parseResult),
				olympics: parseOlympicGames(olympics),
				relatives: parseRelatives(id, relations)
			};
		},

		async byLetter(letter: string, page: number) {
			const list = await client.get<AthleteLetterPageDto>(
				`/athletes/first-letter/${letter}/${page}`
			);
			return { count: list.count, athletes: list.rows.map(parseAthleteListing) };
		},

		async featured() {
			return parseFeaturedAthletes(await client.get<FeaturedAthleteDto[]>('/featured-athletes'));
		},

		async onThisDay(
			day: DayOfYear,
			kind: 'born' | 'died',
			{ limit, offset = 0 }: { limit: number; offset?: number }
		): Promise<OnThisDay> {
			const page = await client.get<{ count: number; rows: AthleteSummaryDto[] }>(
				'/athletes/on-this-day',
				{ kind, date: monthDayParam(day), limit, offset }
			);
			return { count: page.count, athletes: page.rows.map(parseAthleteSummary) };
		},

		async getSummary(id: number) {
			return parseAthleteSummary(await client.get<AthleteSummaryDto>(`/athletes/${id}/summary`));
		}
	};
}
