import { describe, expect, it } from 'vitest';
import { CONTRIBUTORS, countryCount, initialsOf, TEAM } from './about.js';

describe('about credits', () => {
	it('takes the initials of the first and last names', () => {
		expect(initialsOf('Şevket F. Erbay')).toBe('ŞE');
		expect(initialsOf('Yavuz Yavuz')).toBe('YY');
	});

	it('counts each contributor country once', () => {
		expect(countryCount(CONTRIBUTORS)).toBe(21);
		expect(TEAM.length + CONTRIBUTORS.length).toBe(37);
	});
});
