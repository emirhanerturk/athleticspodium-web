import {
	relationName,
	type AthleteLifespan,
	type AthleteListing,
	type AthleteProfile,
	type AthleteRef,
	type AthleteSummary,
	type FeaturedAthlete,
	type Relative
} from '#lib/domain/athlete.js';
import type { OlympicGames } from '#lib/domain/career.js';
import type { Image } from '#lib/domain/image.js';
import type { Result } from '#lib/domain/result.js';
import type {
	AthleteDetailDto,
	AthleteListingDto,
	AthleteRowDto,
	AthleteSummaryDto,
	FeaturedAthleteDto,
	ImageDto,
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

function parseImage(athleteId: number, dto: ImageDto): Image {
	return {
		path: `athletes/${athleteId}/${dto.uri}`,
		credit: dto.credit?.trim() || null,
		caption: dto.caption?.trim() || null
	};
}

function parseCover(athleteId: number, dtos: ImageDto[] | null): Image | null {
	return dtos?.[0] ? parseImage(athleteId, dtos[0]) : null;
}

export function parseAthleteListing(dto: AthleteListingDto): AthleteListing {
	return {
		...parseAthleteWithLifespan(dto),
		olympicChampion: dto.olympic_mark,
		events: dto.events ?? [],
		image: parseCover(dto.id, dto.image)
	};
}

export function parseAthleteProfile(dto: AthleteDetailDto): AthleteProfile {
	return {
		...parseAthleteWithLifespan(dto),
		aka: dto.aka ?? [],
		olympicChampion: dto.olympic_mark,
		birthPlace: dto.place_of_birth,
		events: dto.events ?? [],
		country: dto.country,
		photos: (dto.image ?? []).map((image) => parseImage(dto.id, image)),
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
		image: dto.image ? parseImage(dto.id, dto.image) : null,
		medals: dto.medals
	};
}

export function parseFeaturedAthletes(dtos: FeaturedAthleteDto[]): FeaturedAthlete[] {
	return dtos.flatMap(({ athlete }) => {
		if (!athlete) return [];
		return [
			{
				...parseAthleteWithLifespan(athlete),
				events: athlete.events ?? [],
				olympicChampion: athlete.olympic_mark,
				image: parseCover(athlete.id, athlete.image),
				medals: athlete.medals ?? { gold: 0, silver: 0, bronze: 0, total: 0 },
				biography: athlete.biography?.trim() || null
			}
		];
	});
}
