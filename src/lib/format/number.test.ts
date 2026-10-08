import { describe, expect, it } from 'vitest';
import { formatOrdinal } from './number.js';

describe('formatOrdinal', () => {
	it('adds the English suffix', () => {
		expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 28, 101, 111].map(formatOrdinal)).toEqual([
			'1st',
			'2nd',
			'3rd',
			'4th',
			'11th',
			'12th',
			'13th',
			'21st',
			'22nd',
			'28th',
			'101st',
			'111th'
		]);
	});
});
