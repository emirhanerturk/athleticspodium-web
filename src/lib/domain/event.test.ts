import { describe, expect, it } from 'vitest';
import { describeEvent, inCatalogueOrder, knownEventNames } from './event.js';

const ALL_EVENT_NAMES =
	`50m | 60m | 100m | 100 yards | 200m | 220 yards | 400m | 440 yards | 600m | 800m | 880 yards | 1000m | 1200m | 1500m | 1 mile | 3000m | 3000m team | 5000m | 5000m team | 3 miles | 3 miles Team | 4 miles | 5 miles | 6 miles | 10,000m | Half Mar | Half Mar Team | Marathon | Marathon Cup | 3000SC | Steeplechase | 1500SC | 2000SC | 50H | 60H | 80H | 80H 76.2 | 100H | 100H 83.8 | 100H 76.2 | 110H | 110H 99.0 | 110H 91.4 | 120yrd H | 200H | 220yrd H | 200H 76.2 | 300H | 300H 83.8 | 300H 76.2 | 400H | 400H 83.8 | 440yrd H | HJ | PV | LJ | TJ | SP | SP 6 kg | SP 5 kg | SP 3 kg | DT | DT 1.75kg | DT 1.5kg | HT | HT 6 kg | HT 5 kg | HT 3 kg | JT | JT 500g | JT 700g | SP (both hands) | Stone throw | 56pound weight throw | JT freestyle | JT (both arms) | DT Greek | DT (both arms) | HJ-Standing | LJ-Standing | TJ-Standing | 1500m Walk | 3000m Walk | 3000mW | 3500m Walk | 4000mW | 5000mW | 5kmW | 10kmW | 10kmW Team | 10,000mW | 10MilesW | 20kmW | 20kmW Team | 20,000mW | 5km Road Race | 30kmW | 35kmW | 35kmW Team | 50kmW | 50kmW Team | 10km Road Race | 20km Road Race | 20 miles Road Race | 30 km Road Race | Decathlon | Decathlon U20 | Decathlon U18 | All-Around | Heptathlon (Indoor) | Heptathlon | Heptathlon U18 | Pentathlon | Pentathlon (Indoor) | Pentathlon JR | Octathlon | Hexathlon | 4x100m | 4x110yards | 4x150m | 4x1 laps | 4x2 laps | 4x200m | 4x300m | 4x400m | 4x440yards | 4x4 laps | 4x100m Mixed | 4x400m Mixed | 4x800m | 4x1500m | Distance Medley | Medley Relay | Half Mar Race Walk | HM Race Walk Team | Marathon Race Walk | Marathon Race Walk Team | Relay 3x | Relay 4x | Shuttle hurdles Relay | Swedish Relay | 2x2x400m Relay | 3x1000m | 8x300m | Road Mile | 10km Road race Team | 1500m WC | 400m – Para (T54) | 800m WC | DT Para (F32/33/34) | Seniors | Seniors (Team) | Seniors (SC) | Seniors (Team) – SC | U23 | U23 (Team) | U20 | U20 (Team) | U18 | U18 (Team) | U17 (Team) | U17 | Mixed XC | Mixed | 3km XC | Cross Country | Cross Country Team | Overall Team`.split(
		' | '
	);

describe('describeEvent', () => {
	it('expands short names and assigns a discipline', () => {
		expect(describeEvent('HJ')).toEqual({ longName: 'High jump', discipline: 'jumps' });
		expect(describeEvent('3000SC')).toEqual({
			longName: '3000m steeplechase',
			discipline: 'middle'
		});
		expect(describeEvent('4x400m Mixed')).toEqual({
			longName: 'Mixed 4x400m',
			discipline: 'relays'
		});
		expect(describeEvent('100m')).toEqual({ longName: '100m', discipline: 'sprints' });
	});

	it('keeps an unknown event as it is, without a discipline', () => {
		expect(describeEvent('Tug of war')).toEqual({ longName: 'Tug of war', discipline: null });
	});

	it('covers every event in the database as of 2026-10-07', () => {
		expect(ALL_EVENT_NAMES).toHaveLength(168);
		expect(ALL_EVENT_NAMES.filter((name) => !knownEventNames().includes(name))).toEqual([]);
	});
});

describe('inCatalogueOrder', () => {
	it('sorts names by catalogue rank and keeps unknown names last', () => {
		const catalogue = [
			{ id: 10, name: '100m', rank: 3 },
			{ id: 30, name: '200m', rank: 5 },
			{ id: 113, name: '4x100m', rank: 150 }
		];

		expect(inCatalogueOrder(['4x100m', 'Mystery', '200m', '100m'], catalogue)).toEqual([
			'100m',
			'200m',
			'4x100m',
			'Mystery'
		]);
	});
});
