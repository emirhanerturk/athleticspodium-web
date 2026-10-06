import type {
	ChampionshipEditions,
	ChampionshipLeader,
	ChampionshipProfile,
	EditionRef
} from '#lib/domain/championship.js';
import type { ChampDetailDto, ChampionshipLeaderDto, EditionDto } from './dto.js';

export function parseChampionshipEditions(dto: ChampDetailDto): ChampionshipEditions {
	const years = dto.years ?? [];

	return {
		champ: { id: dto.id, name: dto.name, slug: dto.slug, category: dto.category },
		firstYear: years.length ? Math.min(...years) : null,
		editions: dto.meetings.map(parseEdition).sort((a, b) => b.year - a.year)
	};
}

export function parseChampionshipProfile(dto: ChampDetailDto): ChampionshipProfile {
	return {
		...parseChampionshipEditions(dto),
		history: dto.content?.trim() || null,
		programme: {
			men: dto.events_men ?? [],
			women: dto.events_women ?? [],
			mixed: dto.events_mixed ?? []
		}
	};
}

export function parseChampionshipLeaders(dtos: ChampionshipLeaderDto[]): ChampionshipLeader[] {
	return dtos.flatMap(({ athlete, gold, silver, bronze, total, first_year, last_year, events }) =>
		athlete
			? [
					{
						athlete: {
							id: athlete.id,
							slug: athlete.slug,
							firstName: athlete.first_name ?? '',
							lastName: athlete.last_name ?? '',
							countryCode: athlete.country_code
						},
						tally: { gold, silver, bronze, total },
						firstYear: first_year,
						lastYear: last_year,
						events: events ?? []
					}
				]
			: []
	);
}

function parseEdition(dto: EditionDto): EditionRef {
	return {
		name: dto.name,
		slug: dto.slug,
		year: dto.year,
		city: dto.city,
		countryCode: dto.country_code,
		startDate: dto.start_date,
		eventsCount: dto.events_count
	};
}
