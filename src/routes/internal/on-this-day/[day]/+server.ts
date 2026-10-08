import { error, json } from '@sveltejs/kit';
import { daySlug, parseDaySlug } from '#lib/domain/day.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals: { backend } }) => {
	const day = parseDaySlug(params.day);
	if (!day || params.day !== daySlug(day)) error(404, 'Not found');

	const [born, died] = await Promise.all([
		backend.athletes.onThisDay(day, 'born', { limit: 10 }),
		backend.athletes.onThisDay(day, 'died', { limit: 6 })
	]);
	return json({ born, died });
};
