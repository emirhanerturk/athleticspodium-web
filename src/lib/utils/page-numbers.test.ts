import { describe, expect, it } from 'vitest';
import { pageNumbers } from './page-numbers.js';

describe('pageNumbers', () => {
	it('shows the first, the last and the pages around the current one', () => {
		expect(pageNumbers(1, 28)).toEqual([1, 2, null, 28]);
		expect(pageNumbers(10, 28)).toEqual([1, null, 9, 10, 11, null, 28]);
		expect(pageNumbers(28, 28)).toEqual([1, null, 27, 28]);
	});

	it('shows a single hidden page instead of a gap', () => {
		expect(pageNumbers(4, 28)).toEqual([1, 2, 3, 4, 5, null, 28]);
	});

	it('lists short runs in full', () => {
		expect(pageNumbers(1, 1)).toEqual([1]);
		expect(pageNumbers(2, 3)).toEqual([1, 2, 3]);
	});
});
