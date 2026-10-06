import { GENDER_CODES, type MedalQuery } from '#lib/domain/medal-search.js';
import type { BackendClient } from '../client.js';
import type { CountryMedalsByEditionDto, FilterChampDto, MedalSearchDto } from './dto.js';
import { parseFilterChamp, parseMedalSearch } from './parse.js';

export function createMedals(client: BackendClient) {
	return {
		async search(query: MedalQuery) {
			const page = await client.get<MedalSearchDto>('/medals', {
				champs: query.champ ?? undefined,
				country: query.country ?? undefined,
				event: query.event ?? undefined,
				year: query.year ?? undefined,
				gender: query.gender ? GENDER_CODES[query.gender] : undefined,
				medal: query.medal ?? undefined,
				page: query.page,
				order: query.order
			});
			return parseMedalSearch(page);
		},

		async filterChamps() {
			const list = await client.get<{ rows: FilterChampDto[] }>('/champs', {
				fields: 'id,name,slug,category,countries,years,events_men,events_women,events_mixed',
				order: 'name'
			});
			return list.rows.map(parseFilterChamp);
		},

		async byCountryAndChamp(countryCode: string, champId: number) {
			const rows = await client.get<CountryMedalsByEditionDto[]>('/medals/country-champs', {
				country: countryCode,
				champ: champId
			});
			return rows
				.map(({ gold, silver, bronze, total, meeting }) => ({
					meeting: {
						name: meeting.name,
						slug: meeting.slug,
						year: meeting.year,
						city: meeting.city
					},
					tally: { gold, silver, bronze, total }
				}))
				.sort((a, b) => b.meeting.year - a.meeting.year);
		}
	};
}
