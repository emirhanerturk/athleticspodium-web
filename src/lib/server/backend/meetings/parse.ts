import type { MeetingSummary } from '#lib/domain/meeting.js';
import type { MeetingDto } from './dto.js';

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
