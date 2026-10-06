import { describe, expect, it } from 'vitest';
import { formatWind } from './mark.js';

describe('formatWind', () => {
	it('signs tail winds and keeps one decimal', () => {
		expect(formatWind(0.2)).toBe('+0.2');
		expect(formatWind(-0.8)).toBe('-0.8');
		expect(formatWind(0)).toBe('0.0');
	});
});
