import { isoDateOf } from '#lib/domain/date.js';
import { FEATURED_NATIONS } from '#lib/domain/featured-nations.js';
import type { PageServerLoad } from './$types';

const BIRTHDAY_LIMIT = 6;
const GREATEST_LIMIT = 5;

export const load: PageServerLoad = async ({ locals: { backend } }) => {
	const today = isoDateOf(new Date());
	const [featured, born, nations] = await Promise.all([
		backend.athletes.featured(),
		backend.athletes.onThisDay(today, 'born', BIRTHDAY_LIMIT),
		Promise.all(
			FEATURED_NATIONS.map(async (nation) => ({
				...nation,
				athletes: await backend.countries.getAthletes(nation.code, { limit: GREATEST_LIMIT })
			}))
		)
	]);

	return { featured, born, nations };
};
