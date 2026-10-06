export const CONTACT_SUBJECTS = [
	'General message',
	'Technical error',
	'Suggestion',
	'Missing information'
] as const;

export const MISSING_INFORMATION_SUBJECT = 3;

export interface ContactMessage {
	name: string;
	email: string;
	subject: number;
	message: string;
}

export type ContactErrors = Partial<Record<keyof ContactMessage, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function parseContactForm(
	form: FormData,
	fixedSubject?: number
): { values: ContactMessage; errors: ContactErrors; spam: boolean } {
	const text = (key: string) => String(form.get(key) ?? '').trim();
	const subject = fixedSubject ?? Number(text('subject'));
	const values = { name: text('name'), email: text('email'), subject, message: text('message') };
	const errors: ContactErrors = {};

	if (!values.name || values.name.length > 100)
		errors.name = 'Enter your name (up to 100 characters).';
	if (!EMAIL.test(values.email) || values.email.length > 100)
		errors.email = 'Enter a valid email address.';
	if (!Number.isInteger(subject) || subject < 0 || subject >= CONTACT_SUBJECTS.length) {
		errors.subject = 'Choose a subject.';
	}
	if (!values.message || values.message.length > 1000) {
		errors.message = 'Write a message (up to 1,000 characters).';
	}

	return { values, errors, spam: text('website') !== '' };
}
