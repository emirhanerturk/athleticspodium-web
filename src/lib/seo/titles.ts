import { fullName, type AthleteProfile } from '#lib/domain/athlete.js';
import type { CareerSummary } from '#lib/domain/career.js';
import type { ChampionshipFacts } from '#lib/domain/championship.js';
import { yearOf } from '#lib/domain/date.js';
import type { EditionMeeting, EditionStats } from '#lib/domain/edition.js';
import { formatDateRange } from '#lib/format/date.js';

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

export function editionTitle(meeting: EditionMeeting): string {
	return `${meeting.name} – medallists and results`;
}

export function editionDescription(meeting: EditionMeeting, stats: EditionStats): string {
	const where = [meeting.city, meeting.country?.name].filter(Boolean).join(', ');
	const when = meeting.startDate
		? `${formatDateRange(meeting.startDate, meeting.endDate)} ${yearOf(meeting.endDate ?? meeting.startDate)}`
		: null;
	const context = [where && `in ${where}`, when].filter(Boolean).join(', ');
	const events = stats.events === 1 ? '1 event' : `${stats.events} events`;

	return `${meeting.name}${context ? ` ${context}` : ''}: medallists and results of ${events}, the medal table and the records set.`;
}

export function championshipTitle(name: string): string {
	return `${name} – editions, medal table and history`;
}

export function championshipDescription(
	name: string,
	facts: ChampionshipFacts,
	nations: number
): string {
	const { first, editionsHeld } = facts;
	if (!first) return `${name}: editions, results and the programme.`;

	const editions =
		editionsHeld === 1
			? `the ${first.year} edition`
			: `${editionsHeld} editions since ${first.year}`;
	const table = nations ? `the all-time medal table of ${nations} nations` : 'the medal table';

	return `${name}: ${editions}, ${table} and the most successful athletes.`;
}
