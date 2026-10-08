import { describe, expect, it } from 'vitest';
import type { EditionRef } from './championship.js';
import {
	bestMedalOf,
	countdownEditions,
	countdownFacts,
	medalEntries,
	medalLine,
	nationStandings,
	parseCountdownQuery,
	standingsAround
} from './countdown.js';
import type { NationTally } from './edition.js';
import type { MedalRecord } from './medal-search.js';

const edition = (year: number, slug = `${year}`): EditionRef => ({
	name: `${year} Champs`,
	slug,
	year,
	city: `City ${year}`,
	countryCode: null,
	startDate: `${year}-08-01`,
	eventsCount: 40
});
const tally = (slug: string, gold: number, silver: number, bronze: number) => ({
	meeting: { slug },
	tally: { gold, silver, bronze, total: gold + silver + bronze }
});
const nation = (code: string, gold: number, silver: number, bronze: number): NationTally => ({
	country: { code, name: code },
	gold,
	silver,
	bronze,
	total: gold + silver + bronze
});

let nextId = 1;
const medal = (year: number, place: number, event: string, options: Partial<MedalRecord> = {}) =>
	({
		id: nextId++,
		meeting: { id: year, name: `${year}`, slug: `${year}`, year, city: null },
		champ: { name: 'Champ', slug: 'champ' },
		event,
		gender: 'men',
		place,
		canceled: false,
		athlete: null,
		athleteName: 'Ruhi Sarialp',
		country: { code: 'TUR', name: 'Turkey' },
		mark: null,
		markNote: null,
		wind: null,
		records: [],
		notes: null,
		isTeam: false,
		...options
	}) satisfies MedalRecord;

describe('parseCountdownQuery', () => {
	it('reads the country code and the championship id', () => {
		expect(parseCountdownQuery(new URLSearchParams('country=tur&champ=18'))).toEqual({
			country: 'TUR',
			champ: 18
		});
		expect(parseCountdownQuery(new URLSearchParams('country=TURK&champ=x'))).toEqual({
			country: null,
			champ: null
		});
	});
});

describe('countdownEditions and countdownFacts', () => {
	const editions = countdownEditions(
		[
			edition(2028),
			edition(2024),
			edition(2022),
			edition(2018),
			edition(1938, '1938-men'),
			edition(1938, '1938-women'),
			edition(1934)
		],
		[
			tally('2024', 0, 1, 1),
			tally('2022', 1, 1, 1),
			tally('1938-women', 0, 0, 1),
			tally('1934', 0, 0, 0)
		],
		'2026-10-08'
	);

	it('lists every edition held, newest first, with its number and the medals won', () => {
		expect(
			editions.map((item) => [item.edition.slug, item.ordinal, item.tally?.total ?? 0])
		).toEqual([
			['2024', 5, 2],
			['2022', 4, 3],
			['2018', 3, 0],
			['1938-men', 2, 0],
			['1938-women', 2, 1],
			['1934', 1, 0]
		]);
	});

	it('counts the podium editions, the current run and the best edition', () => {
		expect(countdownFacts(editions)).toMatchObject({
			held: 5,
			onPodium: 3,
			since: 1934,
			streakFrom: 2022
		});
		expect(countdownFacts(editions).best?.edition.slug).toBe('2022');
	});
});

describe('nationStandings and standingsAround', () => {
	const standings = nationStandings([
		nation('GBR', 10, 5, 5),
		nation('TUR', 2, 1, 0),
		nation('GER', 12, 3, 1),
		nation('FRA', 2, 1, 0),
		nation('ITA', 1, 9, 9)
	]);

	it('ranks nations by gold, then silver and bronze, sharing tied places', () => {
		expect(standings.map((item) => [item.country.code, item.rank])).toEqual([
			['GER', 1],
			['GBR', 2],
			['TUR', 3],
			['FRA', 3],
			['ITA', 5]
		]);
	});

	it('keeps nine nations around the chosen one', () => {
		const many = nationStandings(
			Array.from({ length: 20 }, (_, index) => nation(`N${index}`, 20 - index, 0, 0))
		);

		expect(standingsAround(many, 'N10').map((item) => item.rank)).toEqual([
			7, 8, 9, 10, 11, 12, 13, 14, 15
		]);
		expect(standingsAround(many, 'N0').map((item) => item.rank)).toEqual([
			1, 2, 3, 4, 5, 6, 7, 8, 9
		]);
		expect(standingsAround(many, 'N19').at(-1)?.rank).toBe(20);
		expect(standingsAround(standings, 'USA')).toEqual([]);
	});
});

describe('medals of a nation', () => {
	it('picks the best medal that was not withdrawn', () => {
		const best = bestMedalOf([
			medal(1950, 3, 'TJ'),
			medal(1950, 1, '1500m', { canceled: true }),
			medal(1950, 2, 'PV', { athleteName: 'Ersu Şaşma' })
		]);

		expect(best && medalLine(best)).toBe('Ersu Şaşma, pole vault silver');
		expect(best && medalLine(best, { withMedal: false })).toBe('Ersu Şaşma, pole vault');
		expect(bestMedalOf([])).toBeNull();
	});

	it('shows a relay team once, and names a lone medallist even when flagged as a team', () => {
		const entries = medalEntries([
			medal(2018, 2, '4x100m', { isTeam: true, athleteName: 'A' }),
			medal(2018, 2, '4x100m', { isTeam: true, athleteName: 'B' }),
			medal(2012, 1, '1500m', { isTeam: true, athleteName: 'Aslı Çakır', canceled: true })
		]);

		expect(entries.map((team) => team.length)).toEqual([2, 1]);
		expect(medalLine(entries[0])).toBe('Team, 4x100m silver');
		expect(medalLine(entries[1])).toBe('Aslı Çakır, 1500m gold');
		expect(medalLine([medal(2012, 1, '4x100m', { isTeam: true, athleteName: null })])).toBe(
			'Team, 4x100m gold'
		);
	});
});
