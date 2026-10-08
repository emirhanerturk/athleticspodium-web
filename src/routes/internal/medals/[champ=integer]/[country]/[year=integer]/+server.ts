import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!/^[A-Z]{3}$/.test(params.country)) error(404, 'Not found');
	return Response.json(
		await locals.backend.medals.forEdition(
			Number(params.champ),
			params.country,
			Number(params.year)
		)
	);
};
