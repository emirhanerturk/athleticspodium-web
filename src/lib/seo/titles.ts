import { fullName, type AthleteProfile } from '#lib/domain/athlete.js';
import type { CareerSummary } from '#lib/domain/career.js';

const SITE_NAME = 'Athletics Podium';

export function pageTitle(subject: string): string {
	return subject === SITE_NAME ? subject : `${subject} | ${SITE_NAME}`;
}

export function athleteTitle(athlete: AthleteProfile): string {
	const country = athlete.countryCode ? ` (${athlete.countryCode})` : '';
	return `${fullName(athlete)}${country} – medals and results`;
}

export function athleteDescription(athlete: AthleteProfile, career: CareerSummary): string {
	const who = [fullName(athlete), athlete.country?.name, athlete.events.join(', ').toLowerCase()]
		.filter(Boolean)
		.join(', ');
	const { international, podiumYears } = career;

	if (!international.total || !podiumYears) {
		return `${who}: international results, records and biography.`;
	}

	const span =
		podiumYears.first === podiumYears.last
			? `in ${podiumYears.first}`
			: `from ${podiumYears.first} to ${podiumYears.last}`;
	const medals = international.total === 1 ? 'medal' : 'medals';

	return `${who}: ${international.total} international ${medals} (${international.gold} gold, ${international.silver} silver, ${international.bronze} bronze) ${span}. Every result, record and the biography.`;
}
