export const CONTACT_TOPICS = [
	{
		key: 'missing',
		subject: 3,
		label: 'Missing info',
		field: 'Which championship, year and event — and what you know',
		hint: 'Championship, year, event — then the name, mark or leg you know …'
	},
	{
		key: 'correction',
		subject: 4,
		label: 'Correction',
		field: 'What is wrong, and where you found the right version',
		hint: 'Link the page, then tell us what should change …'
	},
	{
		key: 'photo',
		subject: 5,
		label: 'Photo',
		field: 'What the photo shows and who took it',
		hint: 'Tell us about the photo — we will reply with an upload link.'
	},
	{
		key: 'collaborate',
		subject: 6,
		label: 'Collaborate',
		field: 'Your country, language and what you could cover',
		hint: 'Which championships or countries could you help verify?'
	},
	{ key: 'other', subject: 0, label: 'Other', field: 'Message', hint: '' }
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export const MISSING_INFORMATION_SUBJECT = 3;

export interface ContactMessage {
	name: string;
	email: string;
	subject: number;
	message: string;
}

export type ContactErrors = Partial<Record<keyof ContactMessage, string>>;

export interface ContactFormResult {
	sent?: boolean;
	failed?: boolean;
	values?: ContactMessage;
	errors?: ContactErrors;
}

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
	if (!CONTACT_TOPICS.some((topic) => topic.subject === subject)) {
		errors.subject = 'Choose a topic.';
	}
	if (!values.message || values.message.length > 1000) {
		errors.message = 'Write a message (up to 1,000 characters).';
	}

	return { values, errors, spam: text('website') !== '' };
}

export function topicByKey(key: string | null): ContactTopic {
	return CONTACT_TOPICS.find((topic) => topic.key === key) ?? CONTACT_TOPICS[0];
}

export function topicBySubject(subject: number): ContactTopic {
	return CONTACT_TOPICS.find((topic) => topic.subject === subject) ?? CONTACT_TOPICS[0];
}
