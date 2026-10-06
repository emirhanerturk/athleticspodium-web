import { redirect } from '@sveltejs/kit';
import { meetingUrl } from '#lib/routing/urls.js';
import type { PageServerLoad } from './$types';

const STORY_LIMIT = 4;

export const load: PageServerLoad = async ({ params, locals: { backend } }) => {
	const edition = await backend.meetings.getEdition(params.meeting);
	const { meeting } = edition;

	if (params.champ !== meeting.champ.slug || params.meeting !== meeting.slug) {
		redirect(301, meetingUrl(meeting.champ.slug, meeting.slug));
	}

	const [championship, stories] = await Promise.all([
		backend.champs.getEditions(meeting.champ.slug),
		backend.articles.latest({ meeting: meeting.id }, STORY_LIMIT)
	]);

	return { ...edition, championship, stories };
};
