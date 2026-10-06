const SITE_NAME = 'Athletics Podium';

export function pageTitle(subject: string): string {
	return subject === SITE_NAME ? subject : `${subject} | ${SITE_NAME}`;
}
