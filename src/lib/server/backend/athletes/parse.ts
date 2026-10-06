import {
	relationName,
	type AthleteLifespan,
	type AthleteListing,
	type AthleteProfile,
	type AthleteRef,
	type AthleteSummary,
	type BirthdaysToday,
	type FeaturedAthlete,
	type Relative
} from '#lib/domain/athlete.js';
import type { OlympicGames } from '#lib/domain/career.js';
import type { Result } from '#lib/domain/result.js';
import type {
	AthleteDetailDto,
	AthleteListDto,
	AthleteListingDto,
	AthleteRowDto,
	AthleteSummaryDto,
	FeaturedAthleteDto,
	OlympicMeetingDto,
	RelationDto,
	ResultDto
} from './dto.js';

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

export function parseAthleteListing(dto: AthleteListingDto): AthleteListing {
	const image = dto.image?.[0];
	return {
		...parseAthleteWithLifespan(dto),
		olympicChampion: dto.olympic_mark,
		events: dto.events ?? [],
		image: image
			? { path: `athletes/${dto.id}/${image.uri}`, credit: image.credit ?? null, caption: null }
			: null
	};
}

export function parseBirthdaysToday(dto: AthleteListDto): BirthdaysToday {
	const living = dto.rows.find((row) => row.date_of_death === null);

	return {
		featured: living ? parseAthleteWithLifespan(living) : null,
		count: dto.count
	};
}

export function parseAthleteProfile(dto: AthleteDetailDto): AthleteProfile {
	const image = dto.image?.[0];

	return {
		...parseAthleteWithLifespan(dto),
		aka: dto.aka ?? [],
		olympicChampion: dto.olympic_mark,
		birthPlace: dto.place_of_birth,
		events: dto.events ?? [],
		country: dto.country,
		image: image
			? { path: `athletes/${dto.id}/${image.uri}`, credit: image.credit ?? null, caption: null }
			: null,
		biography: dto.biography?.trim() || null
	};
}

export function parseResult(dto: ResultDto): Result {
	return {
		id: dto.id,
		place: dto.medal,
		canceled: dto.is_canceled,
		mark: dto.mark_display,
		markNote: dto.info,
		wind: dto.wind,
		records: dto.records ?? [],
		notes: dto.notes,
		isTeam: dto.is_team,
		event: dto.event,
		champ: dto.champ,
		meeting: {
			id: dto.meeting.id,
			name: dto.meeting.name,
			slug: dto.meeting.slug,
			year: dto.meeting.year,
			startDate: dto.meeting.start_date,
			city: dto.meeting.city ?? null,
			countryCode: dto.meeting.country_code ?? null
		}
	};
}

export function parseOlympicGames(dtos: OlympicMeetingDto[]): OlympicGames[] {
	return dtos.flatMap((dto) =>
		dto.champ
			? [
					{
						id: dto.id,
						name: dto.name,
						slug: dto.slug,
						year: dto.year,
						city: dto.city,
						champSlug: dto.champ.slug
					}
				]
			: []
	);
}

export function parseRelatives(athleteId: number, dtos: RelationDto[]): Relative[] {
	return dtos.map((dto) => {
		const viewedFromSide = dto.athlete_from_id === athleteId;
		const relative = viewedFromSide ? dto.athlete_to : dto.athlete_from;

		return {
			id: relative.id,
			slug: relative.slug,
			firstName: relative.first_name ?? '',
			lastName: relative.last_name ?? '',
			countryCode: null,
			relation: relationName(viewedFromSide ? dto.relation_from : dto.relation_to)
		};
	});
}

export function parseAthleteSummary(dto: AthleteSummaryDto): AthleteSummary {
	return {
		...parseAthleteWithLifespan(dto),
		events: dto.events ?? [],
		olympicChampion: dto.olympic_mark,
		image: dto.image
			? {
					path: `athletes/${dto.id}/${dto.image.uri}`,
					credit: dto.image.credit ?? null,
					caption: null
				}
			: null,
		medals: dto.medals
	};
}

export function parseFeaturedAthletes(dtos: FeaturedAthleteDto[]): FeaturedAthlete[] {
	return dtos.flatMap(({ athlete }) => {
		if (!athlete) return [];
		const image = athlete.image?.[0];
		return [
			{
				...parseAthleteWithLifespan(athlete),
				events: athlete.events ?? [],
				olympicChampion: athlete.olympic_mark,
				image: image
					? {
							path: `athletes/${athlete.id}/${image.uri}`,
							credit: image.credit ?? null,
							caption: null
						}
					: null,
				medals: athlete.medals ?? { gold: 0, silver: 0, bronze: 0, total: 0 },
				biography: athlete.biography?.trim() || null
			}
		];
	});
}
