import { describe, expect, it } from 'vitest';
import type { AthleteProfile } from '#lib/domain/athlete.js';
import type { EditionMeeting } from '#lib/domain/edition.js';
import {
	athleteDescription,
	athleteTitle,
	editionDescription,
	editionTitle,
	pageTitle
} from './titles.js';

const athlete: AthleteProfile = {
	id: 35017,
	slug: 'yaroslava-mahuchikh',
	firstName: 'Yaroslava',
	lastName: 'Mahuchikh',
	countryCode: 'UKR',
	birthDate: '2001-09-19',
	deathDate: null,
	aka: [],
	olympicChampion: true,
	birthPlace: null,
	events: ['High jump'],
	country: { code: 'UKR', name: 'Ukraine' },
	image: null,
	biography: null
};

describe('pageTitle', () => {
	it('appends the site name except on the site name itself', () => {
		expect(pageTitle('Calendar')).toBe('Calendar | Athletics Podium');
		expect(pageTitle('Athletics Podium')).toBe('Athletics Podium');
	});
});

describe('athleteTitle', () => {
	it('names the athlete and the country code', () => {
		expect(athleteTitle(athlete)).toBe('Yaroslava Mahuchikh (UKR) – medals and results');
	});
});

describe('athleteDescription', () => {
	it('summarises the international medals and the years', () => {
		expect(
			athleteDescription(athlete, {
				international: { gold: 19, silver: 3, bronze: 3, total: 25 },
				nationalTitles: 1,
				placings: 0,
				podiumYears: { first: 2017, last: 2026 }
			})
		).toBe(
			'Yaroslava Mahuchikh, Ukraine, high jump: 25 international medals (19 gold, 3 silver, 3 bronze) from 2017 to 2026. Every result, record and the biography.'
		);
	});

	it('falls back to a plain line without international medals', () => {
		expect(
			athleteDescription(athlete, {
				international: { gold: 0, silver: 0, bronze: 0, total: 0 },
				nationalTitles: 2,
				placings: 0,
				podiumYears: null
			})
		).toBe(
			'Yaroslava Mahuchikh, Ukraine, high jump: international results, records and biography.'
		);
	});
});

const meeting: EditionMeeting = {
	id: 2219,
	name: '2026 European Champs',
	slug: '2026-european-championships',
	year: 2026,
	city: 'Birmingham',
	country: { code: 'GBR', name: 'Great Britain & NI' },
	startDate: '2026-08-10',
	endDate: '2026-08-16',
	note: null,
	champ: { id: 18, name: 'European Championships', slug: 'european-champs', category: 3 }
};

describe('editionTitle and editionDescription', () => {
	it('name the edition with its place, dates and size', () => {
		expect(editionTitle(meeting)).toBe('2026 European Champs – medallists and results');
		expect(
			editionDescription(meeting, { events: 52, medals: 157, nations: 28, worldRecords: 2 })
		).toBe(
			'2026 European Champs in Birmingham, Great Britain & NI, 10–16 Aug 2026: medallists and results of 52 events, the medal table and the records set.'
		);
	});
});
