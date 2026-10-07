import { redirect } from '@sveltejs/kit';
import { PAGES } from '#lib/routing/urls.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => redirect(301, PAGES.databaseNotes);
