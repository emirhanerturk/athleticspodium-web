import { monthDayOf, type IsoDate } from '#lib/domain/date.js';
import { BackendNotFoundError, type BackendClient } from '../client.js';
import type {
	AthleteDetailDto,
	AthleteListDto,
	OlympicMeetingDto,
	RelationDto,
	ResultDto
} from './dto.js';
import {
	parseAthleteProfile,
	parseBirthdaysToday,
	parseOlympicGames,
	parseRelatives,
	parseResult
} from './parse.js';

const BIRTHDAY_CANDIDATES = 10;

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
