import { describe, expect, it } from 'vitest';
import { parsePageParam } from './page-param.js';

describe('parsePageParam', () => {
	it('defaults to the first page', () => {
		expect(parsePageParam(null)).toBe(1);
	});

	it('reads positive whole numbers', () => {
		expect(parsePageParam('3')).toBe(3);
	});

	it('rejects anything else', () => {
		for (const value of ['0', '-1', '1.5', 'abc', '', '01'])
			expect(parsePageParam(value)).toBeNull();
	});
});
