import type { IsoDate } from './date.js';
import type { Image } from './image.js';
import type { MedalTally } from './result.js';

export interface AthleteRef {
	id: number;
	slug: string;
	firstName: string;
	lastName: string;
	countryCode: string | null;
}

export interface AthleteListing extends AthleteRef, AthleteLifespan {
	olympicChampion: boolean;
	events: string[];
	image: Image | null;
}

export const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

export interface AthleteLifespan {
	birthDate: IsoDate | null;
	deathDate: IsoDate | null;
}

export interface BirthdaysToday {
	featured: (AthleteRef & AthleteLifespan) | null;
	count: number;
}

export function fullName(athlete: Pick<AthleteRef, 'firstName' | 'lastName'>): string {
	return `${athlete.firstName} ${athlete.lastName}`.trim();
}

export function ageOn(birthDate: IsoDate, today: IsoDate): number {
	const years = Number(today.slice(0, 4)) - Number(birthDate.slice(0, 4));
	const birthdayPassed = today.slice(5) >= birthDate.slice(5);
	return birthdayPassed ? years : years - 1;
}

export interface AthleteProfile extends AthleteRef, AthleteLifespan {
	aka: string[];
	olympicChampion: boolean;
	birthPlace: string | null;
	events: string[];
	country: { code: string; name: string } | null;
	photos: Image[];
	biography: string | null;
}

export interface Relative extends AthleteRef {
	relation: string;
}

const RELATIONS = [
	'Father',
	'Mother',
	'Son',
	'Daughter',
	'Wife',
	'Husband',
	'Ex-wife',
	'Ex-husband',
	'Sister',
	'Brother',
	'Grandfather',
	'Grandmother',
	'Grandson',
	'Granddaughter'
];

export function relationName(code: number): string {
	return RELATIONS[code] ?? 'Relative';
}

export interface AthleteSummary extends AthleteRef, AthleteLifespan {
	events: string[];
	olympicChampion: boolean;
	image: Image | null;
	medals: MedalTally;
}

export interface FeaturedAthlete extends AthleteSummary {
	biography: string | null;
}

export interface OnThisDay {
	count: number;
	athletes: AthleteSummary[];
}
