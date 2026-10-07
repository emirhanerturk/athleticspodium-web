import { describe, expect, it } from 'vitest';
import { imageNote } from './image.js';

describe('imageNote', () => {
	it('joins the caption and the credit that exist', () => {
		const path = 'athletes/1/a.jpeg';

		expect(imageNote({ path, caption: '1924 Olympics', credit: 'Source: TAF' })).toBe(
			'1924 Olympics · Source: TAF'
		);
		expect(imageNote({ path, caption: null, credit: 'Source: TAF' })).toBe('Source: TAF');
		expect(imageNote({ path, caption: null, credit: null })).toBe('');
	});
});
