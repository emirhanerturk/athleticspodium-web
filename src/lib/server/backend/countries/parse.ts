import type {
	ChampionshipMedals,
	CountryAthlete,
	CountryListing,
	CountryProfile
} from '#lib/domain/country.js';
import type { CountryAthleteDto, CountryDto, CountryMedalsDto } from './dto.js';

export function parseCountryListing(dto: CountryDto): CountryListing {
	return {
		code: dto.code,
		name: dto.name,
		areas: dto.categories ?? [],
		isCountry: dto.is_country
	};
}

export function parseCountryProfile(dto: CountryDto): CountryProfile {
	return { ...parseCountryListing(dto), about: dto.content?.trim() || null };
}

export function parseChampionshipMedals(dto: CountryMedalsDto): ChampionshipMedals {
	const { gold, silver, bronze, total, champ } = dto;
	return { champ, tally: { gold, silver, bronze, total } };
}

export function parseCountryAthletes(
	dtos: CountryAthleteDto[],
	countryCode: string
): CountryAthlete[] {
	return dtos.flatMap(({ athlete, gold, silver, bronze }) => {
		if (!athlete) return [];
		const image = athlete.image?.[0];
		const tally = { gold: Number(gold), silver: Number(silver), bronze: Number(bronze) };

		return [
			{
				athlete: {
					id: athlete.id,
					slug: athlete.slug,
					firstName: athlete.first_name ?? '',
					lastName: athlete.last_name ?? '',
					countryCode,
					men: athlete.gender,
					image: image
						? {
								path: `athletes/${athlete.id}/${image.uri}`,
								credit: image.credit ?? null,
								caption: null
							}
						: null,
					birthDate: athlete.date_of_birth,
					events: athlete.events ?? []
				},
				tally: { ...tally, total: tally.gold + tally.silver + tally.bronze }
			}
		];
	});
}
