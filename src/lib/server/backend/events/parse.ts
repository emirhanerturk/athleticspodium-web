import type { CatalogueEvent } from '#lib/domain/event.js';
import type { EventListDto } from './dto.js';

export function parseCatalogue(dto: EventListDto): CatalogueEvent[] {
	return dto.rows.map(({ id, name, rank }) => ({ id, name, rank })).sort((a, b) => a.rank - b.rank);
}
