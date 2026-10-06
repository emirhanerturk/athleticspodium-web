import { describe, expect, it } from 'vitest';
import { parseContactForm } from './contact.js';

const form = (fields: Record<string, string>) => {
	const data = new FormData();
	for (const [key, value] of Object.entries(fields)) data.set(key, value);
	return data;
};

describe('parseContactForm', () => {
	it('accepts a complete message', () => {
		const result = parseContactForm(
			form({ name: ' Ana ', email: 'Ana@Example.org', subject: '2', message: 'Hello' })
		);

		expect(result).toEqual({
			values: { name: 'Ana', email: 'Ana@Example.org', subject: 2, message: 'Hello' },
			errors: {},
			spam: false
		});
	});

	it('explains each missing or invalid field', () => {
		const { errors } = parseContactForm(form({ email: 'nope', subject: '9', message: '' }));

		expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name', 'subject']);
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
