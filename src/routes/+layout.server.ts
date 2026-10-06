import type { BirthdaysToday } from '#lib/domain/athlete.js';
import { isoDateOf, yearOf } from '#lib/domain/date.js';
import type { MeetingSummary } from '#lib/domain/meeting.js';
import type { SiteStats } from '#lib/domain/stats.js';
import { createTtlCache } from '#lib/utils/ttl-cache.js';
import type { LayoutServerLoad } from './$types';

const TEN_MINUTES = 10 * 60 * 1000;

const statsCache = createTtlCache<SiteStats>(TEN_MINUTES);
const upcomingCache = createTtlCache<MeetingSummary[]>(TEN_MINUTES);
const birthdaysCache = createTtlCache<BirthdaysToday>(TEN_MINUTES);

export const load: LayoutServerLoad = async ({ locals: { backend } }) => {
	const today = isoDateOf(new Date());

	const [stats, upcoming, birthdays] = await Promise.all([
		orNull(statsCache(() => backend.stats.get())),
		orNull(upcomingCache(() => backend.meetings.upcoming())),
		orNull(birthdaysCache(() => backend.athletes.bornOn(today)))
	]);

	return { today, year: yearOf(today), stats, nextMeeting: upcoming?.[0] ?? null, birthdays };
};

async function orNull<T>(value: Promise<T>): Promise<T | null> {
	try {
		return await value;
	} catch (error) {
		console.error('Layout data unavailable', error);
		return null;
	}
}
