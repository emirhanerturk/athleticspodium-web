import { BackendNotFoundError, type BackendClient } from '../client.js';
import type { ChampDetailDto } from './dto.js';
import { parseChampionshipEditions } from './parse.js';

export function createChamps(client: BackendClient) {
	return {
		async getEditions(slug: string) {
			const champ = await client.get<ChampDetailDto | null>(`/champs/${slug}`);
			if (!champ) throw new BackendNotFoundError(`/champs/${slug}`);
			return parseChampionshipEditions(champ);
		}
	};
}
