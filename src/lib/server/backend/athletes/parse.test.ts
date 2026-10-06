import { describe, expect, it } from 'vitest';
import { parseBirthdaysToday } from './parse.js';

const row = (id: number, deathDate: string | null) => ({
	id,
	slug: `athlete-${id}`,
	first_name: 'First',
	last_name: `Last${id}`,
	country_code: 'NZL',
	date_of_birth: '1984-10-06',
	date_of_death: deathDate
});

describe('parseBirthdaysToday', () => {
	it('features the first living athlete and keeps the full count', () => {
		const birthdays = parseBirthdaysToday({
			count: 134,
			rows: [row(1, '2020-01-01'), row(2, null)]
		});

		expect(birthdays.count).toBe(134);
		expect(birthdays.featured?.id).toBe(2);
	});

	it('features nobody when every candidate has died', () => {
		expect(parseBirthdaysToday({ count: 1, rows: [row(1, '2020-01-01')] }).featured).toBeNull();
	});
});
