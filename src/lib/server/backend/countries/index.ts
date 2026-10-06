import { BackendNotFoundError, type BackendClient } from '../client.js';
import type { CountryAthleteDto, CountryDto, CountryListDto, CountryMedalsDto } from './dto.js';
import {
	parseChampionshipMedals,
	parseCountryAthletes,
	parseCountryListing,
	parseCountryProfile
} from './parse.js';

export function createCountries(client: BackendClient) {
	return {
		async list() {
			const list = await client.get<CountryListDto>('/countries', {
				fields: 'code,name,categories,is_country',
				order: 'name'
			});
			return list.rows.map(parseCountryListing);
		},

		async getProfile(code: string) {
			const country = await client.get<CountryDto | null>(`/countries/${code}`);
			if (!country) throw new BackendNotFoundError(`/countries/${code}`);
			return parseCountryProfile(country);
		},

		async getMedals(code: string) {
			const medals = await client.get<CountryMedalsDto[]>(`/countries/${code}/medals`);
			return medals.map(parseChampionshipMedals);
		},

		async getAthletes(
			code: string,
			filter: { gender?: 'men' | 'women'; limit: number; offset?: number }
		) {
			const athletes = await client.get<CountryAthleteDto[]>(`/countries/${code}/athletes`, {
				international: 1,
				gender: filter.gender && (filter.gender === 'men' ? 0 : 1),
				limit: filter.limit,
				offset: filter.offset
			});
			return parseCountryAthletes(athletes, code);
		}
	};
}
