export type Discipline =
	| 'sprints'
	| 'middle'
	| 'hurdles'
	| 'jumps'
	| 'throws'
	| 'combined'
	| 'relays'
	| 'walks'
	| 'road'
	| 'cross-country';

export const DISCIPLINE_LABELS: Record<Discipline, string> = {
	sprints: 'Sprints',
	middle: 'Middle & long',
	hurdles: 'Hurdles',
	jumps: 'Jumps',
	throws: 'Throws',
	combined: 'Combined',
	relays: 'Relays',
	walks: 'Race walks',
	road: 'Road',
	'cross-country': 'Cross country'
};

export interface CatalogueEvent {
	id: number;
	name: string;
	rank: number;
}

export interface EventInfo {
	longName: string;
	discipline: Discipline | null;
}

const same = (discipline: Discipline, names: string[]) =>
	Object.fromEntries(names.map((name) => [name, [name, discipline] as const]));

const EVENTS: Record<string, readonly [string, Discipline]> = {
	...same('sprints', ['50m', '60m', '100m', '100 yards', '200m', '220 yards', '400m', '440 yards']),
	'400m – Para (T54)': ['400m, para (T54)', 'sprints'],
	...same('middle', [
		'600m',
		'800m',
		'880 yards',
		'1000m',
		'1200m',
		'1500m',
		'1 mile',
		'3000m',
		'5000m',
		'3 miles',
		'4 miles',
		'5 miles',
		'6 miles',
		'10,000m',
		'3x1000m'
	]),
	'3000m team': ['3000m team', 'middle'],
	'5000m team': ['5000m team', 'middle'],
	'3 miles Team': ['3 miles team', 'middle'],
	'3000SC': ['3000m steeplechase', 'middle'],
	Steeplechase: ['Steeplechase', 'middle'],
	'1500SC': ['1500m steeplechase', 'middle'],
	'2000SC': ['2000m steeplechase', 'middle'],
	'800m WC': ['800m wheelchair', 'middle'],
	'1500m WC': ['1500m wheelchair', 'middle'],
	'Half Mar': ['Half marathon', 'road'],
	'Half Mar Team': ['Half marathon team', 'road'],
	Marathon: ['Marathon', 'road'],
	'Marathon Cup': ['Marathon Cup', 'road'],
	'Road Mile': ['Road mile', 'road'],
	'5km Road Race': ['5 km road race', 'road'],
	'10km Road Race': ['10 km road race', 'road'],
	'10km Road race Team': ['10 km road race team', 'road'],
	'20km Road Race': ['20 km road race', 'road'],
	'20 miles Road Race': ['20 miles road race', 'road'],
	'30 km Road Race': ['30 km road race', 'road'],
	'50H': ['50m hurdles', 'hurdles'],
	'60H': ['60m hurdles', 'hurdles'],
	'80H': ['80m hurdles', 'hurdles'],
	'80H 76.2': ['80m hurdles (76.2 cm)', 'hurdles'],
	'100H': ['100m hurdles', 'hurdles'],
	'100H 83.8': ['100m hurdles (83.8 cm)', 'hurdles'],
	'100H 76.2': ['100m hurdles (76.2 cm)', 'hurdles'],
	'110H': ['110m hurdles', 'hurdles'],
	'110H 99.0': ['110m hurdles (99.0 cm)', 'hurdles'],
	'110H 91.4': ['110m hurdles (91.4 cm)', 'hurdles'],
	'120yrd H': ['120 yards hurdles', 'hurdles'],
	'200H': ['200m hurdles', 'hurdles'],
	'200H 76.2': ['200m hurdles (76.2 cm)', 'hurdles'],
	'220yrd H': ['220 yards hurdles', 'hurdles'],
	'300H': ['300m hurdles', 'hurdles'],
	'300H 83.8': ['300m hurdles (83.8 cm)', 'hurdles'],
	'300H 76.2': ['300m hurdles (76.2 cm)', 'hurdles'],
	'400H': ['400m hurdles', 'hurdles'],
	'400H 83.8': ['400m hurdles (83.8 cm)', 'hurdles'],
	'440yrd H': ['440 yards hurdles', 'hurdles'],
	HJ: ['High jump', 'jumps'],
	PV: ['Pole vault', 'jumps'],
	LJ: ['Long jump', 'jumps'],
	TJ: ['Triple jump', 'jumps'],
	'HJ-Standing': ['Standing high jump', 'jumps'],
	'LJ-Standing': ['Standing long jump', 'jumps'],
	'TJ-Standing': ['Standing triple jump', 'jumps'],
	SP: ['Shot put', 'throws'],
	'SP 6 kg': ['Shot put (6 kg)', 'throws'],
	'SP 5 kg': ['Shot put (5 kg)', 'throws'],
	'SP 3 kg': ['Shot put (3 kg)', 'throws'],
	'SP (both hands)': ['Shot put (both hands)', 'throws'],
	DT: ['Discus throw', 'throws'],
	'DT 1.75kg': ['Discus throw (1.75 kg)', 'throws'],
	'DT 1.5kg': ['Discus throw (1.5 kg)', 'throws'],
	'DT Greek': ['Discus throw (Greek style)', 'throws'],
	'DT (both arms)': ['Discus throw (both arms)', 'throws'],
	'DT Para (F32/33/34)': ['Discus throw, para (F32/33/34)', 'throws'],
	HT: ['Hammer throw', 'throws'],
	'HT 6 kg': ['Hammer throw (6 kg)', 'throws'],
	'HT 5 kg': ['Hammer throw (5 kg)', 'throws'],
	'HT 3 kg': ['Hammer throw (3 kg)', 'throws'],
	JT: ['Javelin throw', 'throws'],
	'JT 500g': ['Javelin throw (500 g)', 'throws'],
	'JT 700g': ['Javelin throw (700 g)', 'throws'],
	'JT freestyle': ['Javelin throw (freestyle)', 'throws'],
	'JT (both arms)': ['Javelin throw (both arms)', 'throws'],
	'Stone throw': ['Stone throw', 'throws'],
	'56pound weight throw': ['56-pound weight throw', 'throws'],
	'1500m Walk': ['1500m race walk', 'walks'],
	'3000m Walk': ['3000m race walk', 'walks'],
	'3000mW': ['3000m race walk', 'walks'],
	'3500m Walk': ['3500m race walk', 'walks'],
	'4000mW': ['4000m race walk', 'walks'],
	'5000mW': ['5000m race walk', 'walks'],
	'5kmW': ['5 km race walk', 'walks'],
	'10kmW': ['10 km race walk', 'walks'],
	'10kmW Team': ['10 km race walk team', 'walks'],
	'10,000mW': ['10,000m race walk', 'walks'],
	'10MilesW': ['10 miles race walk', 'walks'],
	'20kmW': ['20 km race walk', 'walks'],
	'20kmW Team': ['20 km race walk team', 'walks'],
	'20,000mW': ['20,000m race walk', 'walks'],
	'30kmW': ['30 km race walk', 'walks'],
	'35kmW': ['35 km race walk', 'walks'],
	'35kmW Team': ['35 km race walk team', 'walks'],
	'50kmW': ['50 km race walk', 'walks'],
	'50kmW Team': ['50 km race walk team', 'walks'],
	'Half Mar Race Walk': ['Half marathon race walk', 'walks'],
	'HM Race Walk Team': ['Half marathon race walk team', 'walks'],
	'Marathon Race Walk': ['Marathon race walk', 'walks'],
	'Marathon Race Walk Team': ['Marathon race walk team', 'walks'],
	...same('combined', ['Decathlon', 'Heptathlon', 'Pentathlon', 'Octathlon', 'Hexathlon']),
	'Decathlon U20': ['Decathlon (U20)', 'combined'],
	'Decathlon U18': ['Decathlon (U18)', 'combined'],
	'All-Around': ['All-around', 'combined'],
	'Heptathlon (Indoor)': ['Heptathlon (indoor)', 'combined'],
	'Heptathlon U18': ['Heptathlon (U18)', 'combined'],
	'Pentathlon (Indoor)': ['Pentathlon (indoor)', 'combined'],
	'Pentathlon JR': ['Pentathlon (junior)', 'combined'],
	...same('relays', [
		'4x100m',
		'4x150m',
		'4x200m',
		'4x300m',
		'4x400m',
		'4x800m',
		'4x1500m',
		'8x300m'
	]),
	'4x110yards': ['4x110 yards', 'relays'],
	'4x440yards': ['4x440 yards', 'relays'],
	'4x1 laps': ['4x1 lap', 'relays'],
	'4x2 laps': ['4x2 laps', 'relays'],
	'4x4 laps': ['4x4 laps', 'relays'],
	'4x100m Mixed': ['Mixed 4x100m', 'relays'],
	'4x400m Mixed': ['Mixed 4x400m', 'relays'],
	'Distance Medley': ['Distance medley relay', 'relays'],
	'Medley Relay': ['Medley relay', 'relays'],
	'Swedish Relay': ['Swedish relay', 'relays'],
	'Relay 3x': ['3x relay', 'relays'],
	'Relay 4x': ['4x relay', 'relays'],
	'2x2x400m Relay': ['2x2x400m relay', 'relays'],
	'Shuttle hurdles Relay': ['Shuttle hurdles relay', 'relays'],
	Seniors: ['Senior race', 'cross-country'],
	'Seniors (Team)': ['Senior team', 'cross-country'],
	'Seniors (SC)': ['Senior short course', 'cross-country'],
	'Seniors (Team) – SC': ['Senior team, short course', 'cross-country'],
	U23: ['U23 race', 'cross-country'],
	'U23 (Team)': ['U23 team', 'cross-country'],
	U20: ['U20 race', 'cross-country'],
	'U20 (Team)': ['U20 team', 'cross-country'],
	U18: ['U18 race', 'cross-country'],
	'U18 (Team)': ['U18 team', 'cross-country'],
	U17: ['U17 race', 'cross-country'],
	'U17 (Team)': ['U17 team', 'cross-country'],
	'Mixed XC': ['Mixed relay', 'cross-country'],
	Mixed: ['Mixed race', 'cross-country'],
	'3km XC': ['3 km cross country', 'cross-country'],
	'Cross Country': ['Cross country', 'cross-country'],
	'Cross Country Team': ['Cross country team', 'cross-country'],
	'Overall Team': ['Overall team', 'cross-country']
};

export function describeEvent(name: string): EventInfo {
	const known = EVENTS[name];
	return known
		? { longName: known[0], discipline: known[1] }
		: { longName: name, discipline: null };
}

export function knownEventNames(): string[] {
	return Object.keys(EVENTS);
}

export function inCatalogueOrder(names: string[], catalogue: CatalogueEvent[]): string[] {
	const rankOf = new Map(catalogue.map((event) => [event.name, event.rank]));
	const rank = (name: string) => rankOf.get(name) ?? Number.MAX_SAFE_INTEGER;
	return [...names].sort((a, b) => rank(a) - rank(b));
}
