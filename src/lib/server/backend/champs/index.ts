import { BackendNotFoundError, type BackendClient } from '../client.js';
import { parseNationTallies, type NationTallyDto } from '../nation-tally.js';
import type { ChampDetailDto, ChampionshipLeaderDto, ChampListDto } from './dto.js';
import {
	parseChampionshipEditions,
	parseChampionshipLeaders,
	parseChampionshipProfile,
	parseChampionshipSummaries
} from './parse.js';

export function createChamps(client: BackendClient) {
	async function getDetail(slug: string) {
		const champ = await client.get<ChampDetailDto | null>(`/champs/${slug}`);
		if (!champ) throw new BackendNotFoundError(`/champs/${slug}`);
		return champ;
	}

	return {
		async list() {
			return parseChampionshipSummaries(
				await client.get<ChampListDto>('/champs', { fields: 'years' })
			);
		},

		async getEditions(slug: string) {
			return parseChampionshipEditions(await getDetail(slug));
		},

		async getProfile(slug: string) {
			return parseChampionshipProfile(await getDetail(slug));
		},

		async getNations(slug: string) {
			return parseNationTallies(await client.get<NationTallyDto[]>(`/champs/${slug}/counts`));
		},

		async getLeaders(slug: string, limit: number) {
			const leaders = await client.get<ChampionshipLeaderDto[]>(`/champs/${slug}/top-athletes`, {
				limit
			});
			return parseChampionshipLeaders(leaders);
		}
	};
}
