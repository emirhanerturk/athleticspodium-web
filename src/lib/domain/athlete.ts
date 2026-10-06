import type { IsoDate } from './date.js';

export interface AthleteRef {
	id: number;
	slug: string;
	firstName: string;
	lastName: string;
	countryCode: string | null;
}

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
