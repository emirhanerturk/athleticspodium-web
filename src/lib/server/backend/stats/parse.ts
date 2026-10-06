import type { SiteStats } from '#lib/domain/stats.js';
import type { StatsDto } from './dto.js';

export function parseSiteStats(dto: StatsDto): SiteStats {
	const last = dto.last_addition;

	return {
		medals: dto.medals,
		placings: dto.placings,
		athletes: dto.athletes,
		championships: dto.championships,
		countries: dto.countries,
		seasonMeetings: dto.season_meetings,
		lastAddition:
			last && last.champ
				? {
						name: last.name,
						slug: last.slug,
						champSlug: last.champ.slug,
						addedOn: last.created_date.slice(0, 10)
					}
				: null
	};
}
