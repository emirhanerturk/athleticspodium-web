import { describe, expect, it } from 'vitest';
import { parseMark } from './mark.js';

describe('parseMark', () => {
	it('keeps a formatted mark', () => {
		expect(parseMark('9.96')).toBe('9.96');
	});

	it('turns a mark the backend leaves unformatted, such as points, into text', () => {
		expect(parseMark(8732)).toBe('8732');
	});

	it('keeps a missing mark missing', () => {
		expect(parseMark(null)).toBeNull();
	});
});
