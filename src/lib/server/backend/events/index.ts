import type { BackendClient } from '../client.js';
import type { EventListDto } from './dto.js';
import { parseCatalogue } from './parse.js';

const ALL_EVENTS = 1000;

export function createEvents(client: BackendClient) {
	return {
		async catalogue() {
			return parseCatalogue(await client.get<EventListDto>('/events', { limit: ALL_EVENTS }));
		}
	};
}
