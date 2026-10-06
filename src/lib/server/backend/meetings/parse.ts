import type {
	EditionEntry,
	EditionEvent,
	EditionMeeting,
	Gender,
	NationTally
} from '#lib/domain/edition.js';
import { describeEvent } from '#lib/domain/event.js';
import type { MeetingSummary } from '#lib/domain/meeting.js';
import type {
	EditionEntryDto,
	EditionMedalsDto,
	MeetingDetailDto,
	MeetingDto,
	NationTallyDto
} from './dto.js';

export function parseMeetingSummaries(dtos: MeetingDto[]): MeetingSummary[] {
	return dtos.flatMap((dto) =>
		dto.champ
			? [
					{
						name: dto.name,
						slug: dto.slug,
						champ: { name: dto.champ.name, slug: dto.champ.slug },
						city: dto.city,
						countryCode: dto.country_code,
						startDate: dto.start_date,
						endDate: dto.end_date
					}
				]
			: []
	);
}

const GENDERS: [keyof EditionMedalsDto, Gender][] = [
	['0', 'men'],
	['1', 'women'],
	['2', 'mixed']
];

export function parseEditionMeeting(dto: MeetingDetailDto): EditionMeeting | null {
	if (!dto.champ) return null;

	return {
		id: dto.id,
		name: dto.name,
		slug: dto.slug,
		year: dto.year,
		city: dto.city,
		country: dto.country,
		startDate: dto.start_date,
		endDate: dto.end_date,
		note: dto.content?.trim() || null,
		champ: dto.champ
	};
}

export function parseEditionEvents(dto: EditionMedalsDto): EditionEvent[] {
	return GENDERS.flatMap(([key, gender]) =>
		(dto[key] ?? []).map((event) => ({
			id: event.id,
			name: event.name,
			...describeEvent(event.name),
			gender,
			note: event.notes?.trim() || null,
			entries: event.medals.map(parseEditionEntry)
		}))
	);
}

export function parseNationTallies(dtos: NationTallyDto[]): NationTally[] {
	return dtos.map(({ gold, silver, bronze, total, country }) => ({
		country,
		gold,
		silver,
		bronze,
		total
	}));
}

function parseEditionEntry(dto: EditionEntryDto): EditionEntry {
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
		country: dto.country,
		athlete: dto.athlete && {
			id: dto.athlete.id,
			slug: dto.athlete.slug,
			firstName: dto.athlete.first_name ?? '',
			lastName: dto.athlete.last_name ?? '',
			countryCode: dto.country?.code ?? null,
			birthDate: dto.athlete.date_of_birth
		},
		athleteName: dto.athlete_name
	};
}
