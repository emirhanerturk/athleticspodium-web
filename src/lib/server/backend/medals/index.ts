import type { Gender } from '#lib/domain/edition.js';
import { GENDER_CODES, type MedalQuery, type MedalRecord } from '#lib/domain/medal-search.js';
import type { BackendClient } from '../client.js';
import type { CountryMedalsByEditionDto, FilterChampDto, MedalSearchDto } from './dto.js';
import { parseFilterChamp, parseMedalSearch } from './parse.js';

const MAX_PAGES = 10;

export function createMedals(client: BackendClient) {
	async function search(query: MedalQuery) {
		const page = await client.get<MedalSearchDto>('/medals', {
			champs: query.champ ?? undefined,
			country: query.country ?? undefined,
			event: query.event ?? undefined,
			year: query.year ?? undefined,
			gender: query.gender ? GENDER_CODES[query.gender] : undefined,
			medal: query.medal ?? undefined,
			page: query.page,
			order: 'year'
		});
		return parseMedalSearch(page);
	}

	return {
		search,

		async allForEvent(champId: number, eventId: number, gender: Gender) {
			const rows: MedalRecord[] = [];
			for (let page = 1; page <= MAX_PAGES; page++) {
				const result = await search({
					champ: champId,
					country: null,
					event: eventId,
					year: null,
					gender,
					medal: null,
					page
				});
				rows.push(...result.rows);
				if (!result.rows.length || rows.length >= result.count) break;
			}
			return rows;
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
