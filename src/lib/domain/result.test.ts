import { describe, expect, it } from 'vitest';
import { placeName, tallyOf } from './result.js';

describe('placeName', () => {
	it('names medals and numbers finals places', () => {
		expect(placeName(1)).toBe('Gold');
		expect(placeName(3)).toBe('Bronze');
		expect(placeName(4)).toBe('4th');
		expect(placeName(8)).toBe('8th');
		expect(placeName(null)).toBe('Medal');
	});
});

describe('tallyOf', () => {
	it('counts medals that were not cancelled and ignores finals places', () => {
		expect(
			tallyOf([
				{ place: 1, canceled: false },
				{ place: 1, canceled: true },
				{ place: 2, canceled: false },
				{ place: 5, canceled: false }
			])
		).toEqual({ gold: 1, silver: 1, bronze: 0, total: 2 });
	});
});
