import type { Gender } from '#lib/domain/edition.js';
import { GENDER_CODES, type MedalQuery, type MedalRecord } from '#lib/domain/medal-search.js';
import type { BackendClient } from '../client.js';
import type { CountryMedalsByEditionDto, FilterChampDto, MedalSearchDto } from './dto.js';
import { parseFilterChamp, parseMedalSearch } from './parse.js';

const MAX_PAGES = 10;

type MedalFilter = Partial<Omit<MedalQuery, 'page'>> & { canceled?: boolean };

export function createMedals(client: BackendClient) {
	async function fetchPage(filter: MedalFilter, page: number) {
		const result = await client.get<MedalSearchDto>('/medals', {
			champs: filter.champ ?? undefined,
			country: filter.country ?? undefined,
			event: filter.event ?? undefined,
			year: filter.year ?? undefined,
			gender: filter.gender ? GENDER_CODES[filter.gender] : undefined,
			medal: filter.medal ?? undefined,
			is_canceled: filter.canceled ? 1 : undefined,
			page,
			order: 'year'
		});
		return parseMedalSearch(result);
	}

	async function everyPage(filter: MedalFilter) {
		const rows: MedalRecord[] = [];
		for (let number = 1; number <= MAX_PAGES; number++) {
			const result = await fetchPage(filter, number);
			rows.push(...result.rows);
			if (!result.rows.length || rows.length >= result.count) break;
		}
		return rows;
	}

	return {
		search: (query: MedalQuery) => fetchPage(query, query.page),

		allForEvent: (champ: number, event: number, gender: Gender) =>
			everyPage({ champ, event, gender }),

		async forEdition(champ: number, country: string, year: number) {
			const rows = await everyPage({ champ, country, year });
			return rows.filter((row) => row.meeting.year === year);
		},

		async withdrawn(champ: number, country: string) {
			const rows = await everyPage({ champ, country, canceled: true });
			return rows.filter((row) => row.canceled);
		},

		async firstPage(filter: MedalFilter) {
			return (await fetchPage(filter, 1)).rows;
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
