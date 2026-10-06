import type { PageServerLoad } from './$types';

const DECORATED_LIMIT = 12;
const HOSTED_LIMIT = 8;
const STORY_LIMIT = 3;

export const load: PageServerLoad = async ({ params: { code }, locals: { backend } }) => {
	const [country, medals, all, men, women, hosted, stories] = await Promise.all([
		backend.countries.getProfile(code),
		backend.countries.getMedals(code),
		backend.countries.getAthletes(code, { limit: DECORATED_LIMIT }),
		backend.countries.getAthletes(code, { gender: 'men', limit: DECORATED_LIMIT }),
		backend.countries.getAthletes(code, { gender: 'women', limit: DECORATED_LIMIT }),
		backend.meetings.hostedIn(code, HOSTED_LIMIT),
		backend.articles.latest({ country: code }, STORY_LIMIT)
	]);

	return { country, medals, decorated: { all, men, women }, hosted, stories };
};
