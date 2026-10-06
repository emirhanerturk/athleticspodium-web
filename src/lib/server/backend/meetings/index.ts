import type { BackendClient } from '../client.js';
import type { MeetingDto } from './dto.js';
import { parseMeetingSummaries } from './parse.js';

export function createMeetings(client: BackendClient) {
	return {
		async upcoming() {
			return parseMeetingSummaries(await client.get<MeetingDto[]>('/meetings/upcoming-meetings'));
		}
	};
}
