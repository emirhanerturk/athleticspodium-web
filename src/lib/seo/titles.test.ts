import { describe, expect, it } from 'vitest';
import type { AthleteProfile } from '#lib/domain/athlete.js';
import type { EditionMeeting } from '#lib/domain/edition.js';
import type { EditionRef } from '#lib/domain/championship.js';
import {
	athleteDescription,
	athleteTitle,
	championshipDescription,
	championshipsDescription,
	championshipsTitle,
	championshipTitle,
	countryAthletesTitle,
	countryDescription,
	countryTitle,
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
	photos: [],
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

describe('championshipTitle and championshipDescription', () => {
	const edition = (year: number): EditionRef => ({
		name: `${year} European Championships`,
		slug: `${year}-european-championships`,
		year,
		city: null,
		countryCode: null,
		startDate: null,
		eventsCount: 0
	});

	it('name the championship with its editions and nations', () => {
		expect(championshipTitle('European Championships')).toBe(
			'European Championships – editions, medal table and history'
		);
		expect(
			championshipDescription(
				'European Championships',
				{ first: edition(1934), latest: edition(2026), next: null, editionsHeld: 27 },
				43
			)
		).toBe(
			'European Championships: 27 editions since 1934, the all-time medal table of 43 nations and the most successful athletes.'
		);
	});

	it('describe a championship that has not been held', () => {
		expect(
			championshipDescription(
				'Grand Slam Track',
				{ first: null, latest: null, next: edition(2027), editionsHeld: 0 },
				0
			)
		).toBe('Grand Slam Track: editions, results and the programme.');
	});
});

describe('championshipsTitle and championshipsDescription', () => {
	it('describe the whole archive', () => {
		expect(championshipsTitle()).toBe('Athletics championships – the complete archive');
		expect(
			championshipsDescription(212, {
				first: { year: 1873, name: 'Irish Championships' },
				last: { year: 2031, name: 'World Championships' }
			})
		).toBe(
			'212 athletics championships from 1873 to 2031: global, continental, multi-region and national championships and road races, with every edition and medallist.'
		);
	});
});

describe('country titles', () => {
	const turkey = { code: 'TUR', name: 'Turkey' };

	it('name the country with its code and medal record', () => {
		expect(countryTitle(turkey)).toBe('Turkey (TUR) – athletics medals and athletes');
		expect(
			countryDescription(turkey, { gold: 1201, silver: 1300, bronze: 1400, total: 3901 }, 3284)
		).toBe(
			'Turkey in athletics: 3,901 international medals (1,201 gold), 3,284 national titles, the most decorated athletes and the championships it hosted.'
		);
	});

	it('describe a country without medals', () => {
		expect(countryDescription(turkey, { gold: 0, silver: 0, bronze: 0, total: 0 }, 0)).toBe(
			'Turkey in athletics: medals, athletes and the championships it hosted.'
		);
	});

	it('number the athlete pages after the first', () => {
		expect(countryAthletesTitle(turkey, 1)).toBe('Turkey – athletes by international medals');
		expect(countryAthletesTitle(turkey, 3)).toBe(
			'Turkey – athletes by international medals, page 3'
		);
	});
});
