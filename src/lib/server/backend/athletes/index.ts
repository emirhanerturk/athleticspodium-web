import { byMedals, type OnThisDay } from '#lib/domain/athlete.js';
import { monthDayOf, type IsoDate } from '#lib/domain/date.js';
import { BackendNotFoundError, type BackendClient } from '../client.js';
import type {
	AthleteDetailDto,
	AthleteLetterPageDto,
	AthleteListDto,
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
	parseBirthdaysToday,
	parseFeaturedAthletes,
	parseOlympicGames,
	parseRelatives,
	parseResult
} from './parse.js';

const BIRTHDAY_CANDIDATES = 10;
const ON_THIS_DAY_CANDIDATES = 50;

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

		async onThisDay(date: IsoDate, kind: 'born' | 'died', limit: number): Promise<OnThisDay> {
			const field = kind === 'born' ? 'date_of_birth' : 'date_of_death';
			const list = await client.get<AthleteListDto>('/athletes', {
				[field]: monthDayOf(date),
				order: field,
				limit: ON_THIS_DAY_CANDIDATES,
				fields: 'country_code,date_of_death'
			});
			if (!list.rows.length) return { count: list.count, athletes: [] };

			const summaries = await client.get<AthleteSummaryDto[]>('/athletes/summaries', {
				ids: list.rows.map((row) => row.id).join(',')
			});
			return {
				count: list.count,
				athletes: summaries.map(parseAthleteSummary).sort(byMedals).slice(0, limit)
			};
		},

		async getSummary(id: number) {
			return parseAthleteSummary(await client.get<AthleteSummaryDto>(`/athletes/${id}/summary`));
		},

		async bornOn(date: IsoDate) {
			const list = await client.get<AthleteListDto>('/athletes', {
				date_of_birth: monthDayOf(date),
				order: 'date_of_birth',
				limit: BIRTHDAY_CANDIDATES,
				fields: 'country_code,date_of_death'
			});
			return parseBirthdaysToday(list);
		}
	};
}
