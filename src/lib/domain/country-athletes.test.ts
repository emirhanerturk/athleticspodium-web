import { describe, expect, it } from 'vitest';
import type { CountryAthlete } from './country.js';
import {
	ATHLETES_PAGE_SIZE,
	browseAthletes,
	countAthletes,
	filterAthletes,
	isNarrowed,
	parseCountryAthletesQuery,
	sortAthletes
} from './country-athletes.js';

let nextId = 1;

function athlete(
	name: string,
	{
		men = true,
		medals = [0, 0, 1],
		born = null,
		events = [],
		years = [null, null]
	}: {
		men?: boolean;
		medals?: [number, number, number];
		born?: string | null;
		events?: string[];
		years?: [number | null, number | null];
	} = {}
): CountryAthlete {
	const [firstName, ...rest] = name.split(' ');
	const [gold, silver, bronze] = medals;
	const id = nextId++;
	return {
		athlete: {
			id,
			slug: name.toLowerCase().replace(/\s+/g, '-'),
			firstName,
			lastName: rest.join(' '),
			countryCode: 'TUR',
			men,
			olympicChampion: false,
			image: null,
			birthDate: born,
			events: []
		},
		tally: { gold, silver, bronze, total: gold + silver + bronze },
		events,
		firstYear: years[0],
		lastYear: years[1]
	};
}

const dereli = athlete('Emel Dereli', {
	men: false,
	medals: [18, 9, 8],
	born: '1996-02-25',
	events: ['SP', 'SP 3 kg'],
	years: [2012, 2026]
});
const guliyev = athlete('Ramil Guliyev', {
	medals: [17, 11, 3],
	born: '1990-05-29',
	events: ['100m', '200m', '4x100m'],
	years: [2013, 2025]
});
const can = athlete('Yasemin Can', {
	men: false,
	medals: [15, 3, 6],
	born: '1996-12-11',
	events: ['10,000m', '5000m'],
	years: [2016, 2025]
});
const isik = athlete('Işık Öztürk', { medals: [0, 30, 0], events: ['HJ'], years: [1955, 1962] });
const all = [dereli, guliyev, can, isik];
const names = (rows: CountryAthlete[]) => rows.map((row) => row.athlete.lastName);

describe('parseCountryAthletesQuery', () => {
	it('reads the search, filters, sort and page', () => {
		expect(
			parseCountryAthletesQuery(
				new URLSearchParams('q=+yasemin++can&gender=women&era=since-2000&sort=name&page=3')
			)
		).toEqual({ q: 'yasemin can', gender: 'women', era: 'since-2000', sort: 'name', page: 3 });
	});

	it('falls back to the defaults for unknown values', () => {
		expect(
			parseCountryAthletesQuery(new URLSearchParams('gender=x&era=1990s&sort=fast&page=0'))
		).toEqual({ q: '', gender: null, era: null, sort: 'golds', page: 1 });
	});

	it('knows when the list is narrowed or reordered', () => {
		const plain = parseCountryAthletesQuery(new URLSearchParams('page=4'));
		expect(isNarrowed(plain)).toBe(false);
		expect(isNarrowed({ ...plain, sort: 'youngest' })).toBe(true);
		expect(isNarrowed({ ...plain, q: 'can' })).toBe(true);
	});
});

describe('filterAthletes', () => {
	const none = { q: '', gender: null, era: null } as const;

	it('filters by gender', () => {
		expect(names(filterAthletes(all, { ...none, gender: 'women' }))).toEqual(['Dereli', 'Can']);
	});

	it('keeps athletes whose medal years touch the era', () => {
		expect(names(filterAthletes(all, { ...none, era: 'before-1960' }))).toEqual(['Öztürk']);
		expect(names(filterAthletes(all, { ...none, era: '1960-1979' }))).toEqual(['Öztürk']);
		expect(names(filterAthletes(all, { ...none, era: 'since-2000' }))).toEqual([
			'Dereli',
			'Guliyev',
			'Can'
		]);
	});

	it('finds athletes by the start of their names, folding letters', () => {
		expect(names(filterAthletes(all, { ...none, q: 'isik oz' }))).toEqual(['Öztürk']);
		expect(names(filterAthletes(all, { ...none, q: 'liyev' }))).toEqual([]);
	});

	it('finds athletes by their medal events and disciplines', () => {
		expect(names(filterAthletes(all, { ...none, q: 'shot' }))).toEqual(['Dereli']);
		expect(names(filterAthletes(all, { ...none, q: '10000' }))).toEqual(['Can']);
		expect(names(filterAthletes(all, { ...none, q: 'relay' }))).toEqual(['Guliyev']);
		expect(names(filterAthletes(all, { ...none, q: 'high jump' }))).toEqual(['Öztürk']);
	});
});

describe('sortAthletes', () => {
	it('ranks by golds, by total medals, by age or by surname', () => {
		expect(names(sortAthletes([can, isik, guliyev, dereli], 'golds'))).toEqual([
			'Dereli',
			'Guliyev',
			'Can',
			'Öztürk'
		]);
		expect(names(sortAthletes(all, 'medals'))).toEqual(['Dereli', 'Guliyev', 'Öztürk', 'Can']);
		expect(names(sortAthletes(all, 'youngest'))).toEqual(['Can', 'Dereli', 'Guliyev', 'Öztürk']);
		expect(names(sortAthletes(all, 'name'))).toEqual(['Can', 'Dereli', 'Guliyev', 'Öztürk']);
	});
});

describe('browseAthletes', () => {
	const many = Array.from({ length: ATHLETES_PAGE_SIZE + 3 }, (_, index) =>
		athlete(`Runner ${index}`, { medals: [0, 0, 100 - index] })
	);

	it('cuts the sorted list into pages', () => {
		const second = browseAthletes(many, {
			q: '',
			gender: null,
			era: null,
			sort: 'golds',
			page: 2
		});

		expect(second.matched).toBe(ATHLETES_PAGE_SIZE + 3);
		expect(second.pageCount).toBe(2);
		expect(second.offset).toBe(ATHLETES_PAGE_SIZE);
		expect(names(second.rows)).toEqual(['25', '26', '27']);
	});

	it('still has one page when nothing matches', () => {
		const result = browseAthletes(many, {
			q: 'nobody',
			gender: null,
			era: null,
			sort: 'golds',
			page: 1
		});

		expect(result).toEqual({ rows: [], matched: 0, offset: 0, pageCount: 1 });
	});
});

describe('countAthletes', () => {
	it('counts medallists, men and women and finds the highest total', () => {
		expect(countAthletes(all)).toEqual({ medallists: 4, men: 2, women: 2, mostMedals: 35 });
	});
});
