import { BackendNotFoundError, type BackendClient } from '../client.js';
import { parseNationTallies, type NationTallyDto } from '../nation-tally.js';
import type { EditionMedalsDto, MeetingDetailDto, MeetingDto, MeetingListDto } from './dto.js';
import {
	parseEditionEvents,
	parseEditionMeeting,
	parseHostedMeetings,
	parseMeetingSummaries
} from './parse.js';

export function createMeetings(client: BackendClient) {
	return {
		async getEdition(slug: string) {
			const [meeting, medals, nations] = await Promise.all([
				client.get<MeetingDetailDto | null>(`/meetings/${slug}`),
				client.get<EditionMedalsDto>(`/meetings/${slug}/medals`),
				client.get<NationTallyDto[]>(`/meetings/${slug}/counts`)
			]);
			const edition = meeting && parseEditionMeeting(meeting);
			if (!edition) throw new BackendNotFoundError(`/meetings/${slug}`);

			return {
				meeting: edition,
				events: parseEditionEvents(medals),
				nations: parseNationTallies(nations)
			};
		},

		async hostedIn(countryCode: string, limit: number) {
			const list = await client.get<MeetingListDto>('/meetings', {
				country: countryCode,
				international: 1,
				has_results: 1,
				fields: 'country_code,start_date,end_date',
				limit
			});
			return parseHostedMeetings(list);
		},

		async upcoming() {
			return parseMeetingSummaries(await client.get<MeetingDto[]>('/meetings/upcoming-meetings'));
		}
	};
}
