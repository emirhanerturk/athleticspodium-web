import type { BackendClient } from '../client.js';
import type { StatsDto } from './dto.js';
import { parseSiteStats } from './parse.js';

export function createStats(client: BackendClient) {
	return {
		async get() {
			return parseSiteStats(await client.get<StatsDto>('/stats'));
		}
	};
}
