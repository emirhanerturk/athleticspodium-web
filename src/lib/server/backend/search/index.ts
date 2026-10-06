import type { SearchFilters, SearchScope } from '#lib/domain/search.js';
import type { BackendClient } from '../client.js';
import type { SearchDto } from './dto.js';
import { parseSearchResults } from './parse.js';

export type { SearchResults } from './parse.js';

export function createSearch(client: BackendClient) {
	return {
		async find(
			query: string,
			options: { scope: SearchScope; limit: number; offset?: number; filters?: SearchFilters }
		) {
			const { filters } = options;
			const dto = await client.get<SearchDto>('/search/v2', {
				q: query,
				type: options.scope,
				limit: options.limit,
				offset: options.offset,
				gender: filters?.gender ? (filters.gender === 'men' ? 0 : 1) : undefined,
				born_from: filters?.bornFrom ?? undefined,
				born_to: filters?.bornTo ?? undefined,
				olympian: filters?.olympian ? 1 : undefined
			});
			return parseSearchResults(dto);
		}
	};
}
