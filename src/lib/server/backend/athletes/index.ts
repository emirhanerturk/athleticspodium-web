import { monthDayOf, type IsoDate } from '#lib/domain/date.js';
import type { BackendClient } from '../client.js';
import type { AthleteListDto } from './dto.js';
import { parseBirthdaysToday } from './parse.js';

const BIRTHDAY_CANDIDATES = 10;

export function createAthletes(client: BackendClient) {
	return {
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
