import type { Gender } from '#lib/domain/edition.js';
import { describeEvent } from '#lib/domain/event.js';
import type { FilterChamp, MedalRecord, MedalSearchPage } from '#lib/domain/medal-search.js';
import type { FilterChampDto, MedalRowDto, MedalSearchDto } from './dto.js';

const GENDERS: Gender[] = ['men', 'women', 'mixed'];

export function parseMedalSearch(dto: MedalSearchDto): MedalSearchPage {
	return {
		count: dto.count,
		tally: { ...dto.counts, withdrawn: dto.counts.withdrawn ?? 0 },
		rows: dto.rows.flatMap((row) => {
			const record = parseMedalRecord(row);
			return record ? [record] : [];
		})
	};
}

export function parseFilterChamp(dto: FilterChampDto): FilterChamp {
	return {
		id: dto.id,
		name: dto.name,
		slug: dto.slug,
		category: dto.category,
		countries: dto.countries ?? [],
		years: dto.years ?? [],
		events: {
			men: dto.events_men ?? [],
			women: dto.events_women ?? [],
			mixed: dto.events_mixed ?? []
		}
	};
}

function parseMedalRecord(dto: MedalRowDto): MedalRecord | null {
	if (!dto.meeting || !dto.champ) return null;
	const { athlete } = dto;

	return {
		id: dto.id,
		meeting: {
			id: dto.meeting.id,
			name: dto.meeting.name,
			slug: dto.meeting.slug,
			year: dto.meeting.year,
			city: dto.meeting.city
		},
		champ: dto.champ,
		event: describeEvent(dto.event?.name ?? '').longName,
		gender: GENDERS[dto.gender] ?? 'mixed',
		place: dto.medal,
		canceled: dto.is_canceled,
		athlete: athlete && {
			id: athlete.id,
			slug: athlete.slug,
			firstName: athlete.first_name ?? '',
			lastName: athlete.last_name ?? '',
			countryCode: dto.country?.code ?? null,
			olympicChampion: athlete.olympic_mark,
			birthYear: athlete.date_of_birth ? Number(athlete.date_of_birth.slice(0, 4)) : null
		},
		athleteName: dto.athlete_name,
		country: dto.country,
		mark: dto.mark_display,
		markNote: dto.info,
		wind: dto.wind,
		records: dto.records ?? [],
		notes: dto.notes?.trim() || null,
		isTeam: dto.is_team
	};
}
