import { describe, expect, it } from 'vitest';
import { ageOn, fullName } from './athlete.js';

describe('ageOn', () => {
	it('counts full years', () => {
		expect(ageOn('1966-10-05', '2026-10-06')).toBe(60);
	});

	it('turns a year older on the birthday', () => {
		expect(ageOn('1984-10-06', '2026-10-06')).toBe(42);
	});

	it('is a year younger the day before the birthday', () => {
		expect(ageOn('1984-10-07', '2026-10-06')).toBe(41);
	});
});

describe('fullName', () => {
	it('joins first and last name', () => {
		expect(fullName({ firstName: 'Valerie', lastName: 'Adams' })).toBe('Valerie Adams');
	});

	it('copes with a missing first name', () => {
		expect(fullName({ firstName: '', lastName: 'Pelé' })).toBe('Pelé');
	});
});
