import { describe, expect, it } from 'vitest';
import type { EditionEntryDto, RecentResultDto } from './dto.js';
import { parseEditionEvents, parseResultsDesk } from './parse.js';

const athlete = { id: 10, slug: 'ann-smith', first_name: 'Ann', last_name: 'Smith' };

describe('parseEditionEvents', () => {
	const medal = (athlete_name: string | null): EditionEntryDto => ({
		id: 1,
		medal: 1,
		is_canceled: false,
		mark_display: '1.97',
		info: null,
		wind: null,
		records: null,
		notes: null,
		is_team: false,
		athlete_name,
		country: { code: 'GBR', name: 'Great Britain & NI' },
		athlete: { ...athlete, date_of_birth: null }
	});
	const nameOf = (athlete_name: string | null) =>
		parseEditionEvents({
			'1': [{ id: 111, name: 'HJ', notes: null, medals: [medal(athlete_name)] }]
		})[0].entries[0].athleteName;

	it('keeps the name a medal was won under and reads a blank one as none', () => {
		expect(nameOf('Ann Smith-Jones ')).toBe('Ann Smith-Jones');
		expect(nameOf('  ')).toBeNull();
		expect(nameOf(null)).toBeNull();
	});
});

describe('parseResultsDesk', () => {
	it('names a winner by the name they won under, linked to their profile', () => {
		const result: RecentResultDto = {
			name: '2026 Road Champs',
			slug: '2026-road-champs',
			city: null,
			country_code: 'GBR',
			start_date: '2026-10-04',
			end_date: null,
			champ: { name: 'Road Champs', slug: 'road-champs' },
			summary: {
				type: 'winners',
				winners: [
					{
						gender: 1,
						mark_display: '2:24:10',
						country_code: 'GBR',
						athlete_name: 'Ann Smith-Jones',
						athlete,
						event: { name: 'Marathon' }
					}
				]
			}
		};

		const [entry] = parseResultsDesk([result]);

		expect(entry.summary).toMatchObject({
			kind: 'winners',
			winners: [{ name: 'Ann Smith-Jones', athlete: { id: 10, slug: 'ann-smith' } }]
		});
	});
});
