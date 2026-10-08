import { describe, expect, it } from 'vitest';
import { parseContactForm, topicByKey, topicBySubject } from './contact.js';

const form = (fields: Record<string, string>) => {
	const data = new FormData();
	for (const [key, value] of Object.entries(fields)) data.set(key, value);
	return data;
};

describe('parseContactForm', () => {
	it('accepts a complete message', () => {
		const result = parseContactForm(
			form({ name: ' Ana ', email: 'Ana@Example.org', subject: '5', message: 'Hello' })
		);

		expect(result).toEqual({
			values: { name: 'Ana', email: 'Ana@Example.org', subject: 5, message: 'Hello' },
			errors: {},
			spam: false
		});
	});

	it('explains each missing or invalid field', () => {
		const { errors } = parseContactForm(form({ email: 'nope', subject: '9', message: '' }));

		expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name', 'subject']);
	});

	it('takes only the subjects of the offered topics', () => {
		const subjectError = (subject: string) =>
			parseContactForm(form({ name: 'Ana', email: 'a@b.co', message: 'x', subject })).errors
				.subject;

		expect(['0', '3', '4', '5', '6'].map(subjectError)).toEqual(Array(5).fill(undefined));
		expect(subjectError('1')).toBe('Choose a topic.');
	});

	it('uses a fixed subject and flags the honeypot', () => {
		const result = parseContactForm(
			form({ name: 'Ana', email: 'a@b.co', message: 'x', subject: '0', website: 'spam.example' }),
			3
		);

		expect(result.values.subject).toBe(3);
		expect(result.spam).toBe(true);
	});
});

describe('topicByKey and topicBySubject', () => {
	it('finds a topic and falls back to missing information', () => {
		expect(topicByKey('other').subject).toBe(0);
		expect(topicByKey('nonsense').key).toBe('missing');
		expect(topicBySubject(4).label).toBe('Correction');
	});
});
