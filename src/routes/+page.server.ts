import { dayOfDate } from '#lib/domain/day.js';
import { isoDateOf } from '#lib/domain/date.js';
import type { PageServerLoad } from './$types';

const LATEST_LIMIT = 5;
const DESK_LIMIT = 4;
const TIMELINE_DAYS = 183;
const TIMELINE_LIMIT = 8;
const BORN_LIMIT = 7;
const DIED_LIMIT = 6;
const PORTRAIT_LIMIT = 4;

export const load: PageServerLoad = async ({ locals: { backend } }) => {
	const today = isoDateOf(new Date());
	const [featured, teasers, desk, upcoming, born, died, athletes] = await Promise.all([
		backend.articles.featured(),
		backend.articles.teasers(LATEST_LIMIT + 1),
		backend.meetings.recentResults(DESK_LIMIT),
		backend.meetings.upcoming({ days: TIMELINE_DAYS, limit: TIMELINE_LIMIT }),
		backend.athletes.onThisDay(dayOfDate(today), 'born', { limit: BORN_LIMIT }),
		backend.athletes.onThisDay(dayOfDate(today), 'died', { limit: DIED_LIMIT }),
		backend.athletes.featured()
	]);
	const lead = featured[0] ?? teasers[0] ?? null;

	return {
		lead,
		latest: teasers.filter((story) => story.id !== lead?.id).slice(0, LATEST_LIMIT),
		desk,
		upcoming,
		timelineDays: TIMELINE_DAYS,
		born,
		died,
		portraits: athletes.filter((athlete) => athlete.biography).slice(0, PORTRAIT_LIMIT)
	};
};
