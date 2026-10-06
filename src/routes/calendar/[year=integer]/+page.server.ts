import { error } from '@sveltejs/kit';
import { FIRST_SEASON, SEASONS_AHEAD } from '#lib/domain/calendar.js';
import { isoDateOf, yearOf } from '#lib/domain/date.js';
import type { PageServerLoad } from './$types';

const UP_NEXT_DAYS = 365;
const UP_NEXT_LIMIT = 3;

export const load: PageServerLoad = async ({ params: { year }, locals: { backend } }) => {
	const lastSeason = yearOf(isoDateOf(new Date())) + SEASONS_AHEAD;
	if (year < FIRST_SEASON || year > lastSeason) error(404, 'Not found');

	const [meetings, upNext] = await Promise.all([
		backend.meetings.season(year),
		backend.meetings.upcoming({ days: UP_NEXT_DAYS, limit: UP_NEXT_LIMIT })
	]);

	return {
		season: year,
		meetings,
		upNext,
		previousSeason: year > FIRST_SEASON ? year - 1 : null,
		nextSeason: year < lastSeason ? year + 1 : null
	};
};
