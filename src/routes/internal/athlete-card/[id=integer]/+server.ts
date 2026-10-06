import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) =>
	Response.json(await locals.backend.athletes.getSummary(params.id));
