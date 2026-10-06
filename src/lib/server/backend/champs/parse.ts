import type { ChampionshipEditions } from '#lib/domain/championship.js';
import type { ChampDetailDto } from './dto.js';

export function parseChampionshipEditions(dto: ChampDetailDto): ChampionshipEditions {
	const years = dto.years ?? [];

	return {
		champ: { id: dto.id, name: dto.name, slug: dto.slug, category: dto.category },
		firstYear: years.length ? Math.min(...years) : null,
		editions: dto.meetings
			.map(({ name, slug, year, city }) => ({ name, slug, year, city }))
			.sort((a, b) => b.year - a.year)
	};
}
