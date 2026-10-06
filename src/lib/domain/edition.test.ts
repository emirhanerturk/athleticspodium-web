import { describe, expect, it } from 'vitest';
import {
	editionStats,
	podiumLines,
	recordSummary,
	recordsSet,
	sharedWind,
	type EditionEntry,
	type EditionEvent
} from './edition.js';

let nextId = 1;
function entry(
	place: number | null,
	code: string,
	extra: Partial<EditionEntry> = {}
): EditionEntry {
	const id = nextId++;
	return {
		id,
		place,
		canceled: false,
		mark: '10.00',
		markNote: null,
		wind: null,
		records: [],
		notes: null,
		isTeam: false,
		country: { code, name: code },
		athlete: {
			id,
			slug: `a-${id}`,
			firstName: 'First',
			lastName: `Last${id}`,
			countryCode: code,
			birthDate: null
		},
		athleteName: null,
		...extra
	};
}

function event(name: string, entries: EditionEntry[]): EditionEvent {
	return {
		id: nextId++,
		name,
		longName: name,
		discipline: null,
		gender: 'men',
		note: null,
		entries
	};
}

describe('podiumLines', () => {
	it('folds relay members into one line per team and keeps individuals apart', () => {
		const relay = [
			entry(1, 'GBR', { isTeam: true }),
			entry(1, 'GBR', { isTeam: true, athlete: null, athleteName: 'Unknown Runner' }),
			entry(2, 'GER', { isTeam: true })
		];

		const lines = podiumLines(relay);

		expect(lines).toHaveLength(2);
		expect(lines[0].athlete).toBeNull();
		expect(lines[0].members.map((member) => member.name)).toEqual([
			`First Last${relay[0].id}`,
			'Unknown Runner'
		]);
		expect(podiumLines([entry(1, 'ITA'), entry(2, 'ITA')])).toHaveLength(2);
	});
});

describe('sharedWind', () => {
	it('returns the wind only when every line shares it', () => {
		expect(
			sharedWind(podiumLines([entry(1, 'A', { wind: -0.4 }), entry(2, 'B', { wind: -0.4 })]))
		).toBe(-0.4);
		expect(
			sharedWind(podiumLines([entry(1, 'A', { wind: 1.2 }), entry(2, 'B', { wind: 0.3 })]))
		).toBeNull();
		expect(sharedWind(podiumLines([entry(1, 'A')]))).toBeNull();
	});
});

describe('editionStats', () => {
	it('counts events, medals, nations and world records, a relay once', () => {
		const events = [
			event('100m', [
				entry(1, 'ITA', { records: ['WR'] }),
				entry(2, 'GBR'),
				entry(3, 'GBR'),
				entry(4, 'FRA')
			]),
			event('4x100m', [
				entry(1, 'GBR', { isTeam: true }),
				entry(1, 'GBR', { isTeam: true }),
				entry(2, 'GER', { isTeam: true, canceled: true })
			]),
			event('Marathon', [entry(4, 'KEN')])
		];

		expect(editionStats(events)).toEqual({ events: 2, medals: 4, nations: 2, worldRecords: 1 });
	});
});

describe('recordsSet', () => {
	const events = [
		event('100m', [entry(1, 'ITA', { records: ['CR', 'NR'] })]),
		event('HJ', [
			entry(1, 'UKR', { records: ['WR'] }),
			entry(2, 'SWE', { records: ['CR=', 'AR'] })
		]),
		event('LJ', [entry(1, 'GRE', { records: ['CR'], canceled: true })])
	];

	it('lists every record but national ones, world records first', () => {
		expect(recordsSet(events).map((mark) => mark.record)).toEqual(['WR', 'CR', 'CR=', 'AR']);
	});

	it('summarises records by type, world records first', () => {
		expect(recordSummary(recordsSet(events))).toBe('1 WR · 2 CR · 1 AR');
	});
});
