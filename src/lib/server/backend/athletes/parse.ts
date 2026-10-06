import type { AthleteLifespan, AthleteRef, BirthdaysToday } from '#lib/domain/athlete.js';
import type { AthleteListDto, AthleteRowDto } from './dto.js';

export function parseAthleteWithLifespan(dto: AthleteRowDto): AthleteRef & AthleteLifespan {
	return {
		id: dto.id,
		slug: dto.slug,
		firstName: dto.first_name ?? '',
		lastName: dto.last_name ?? '',
		countryCode: dto.country_code,
		birthDate: dto.date_of_birth,
		deathDate: dto.date_of_death
	};
}

export function parseBirthdaysToday(dto: AthleteListDto): BirthdaysToday {
	const living = dto.rows.find((row) => row.date_of_death === null);

	return {
		featured: living ? parseAthleteWithLifespan(living) : null,
		count: dto.count
	};
}
