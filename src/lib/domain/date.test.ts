import { describe, expect, it } from 'vitest';
import { localIsoDateOf } from './date.js';

describe('localIsoDateOf', () => {
	it('uses the calendar date where the code runs', () => {
		expect(localIsoDateOf(new Date(2026, 9, 8, 1, 30))).toBe('2026-10-08');
		expect(localIsoDateOf(new Date(2026, 0, 1, 23, 59))).toBe('2026-01-01');
	});
});
