import { describe, expect, it } from 'vitest';
import { formatEventList } from './event.js';

describe('formatEventList', () => {
	it('uses long names and folds relays into one item', () => {
		expect(formatEventList(['100m', '200m', '4x100m', '4x100m Mixed'])).toBe('100m, 200m, relays');
	});

	it('counts the events beyond the visible ones', () => {
		expect(formatEventList(['100m', '200m', '400m', 'LJ', '4x400m'])).toBe('100m, 200m, 400m +2');
	});

	it('writes a single event', () => {
		expect(formatEventList(['DT'])).toBe('Discus throw');
	});
});
