import { describe, expect, it } from 'vitest';
import { foldText } from './fold-text.js';

describe('foldText', () => {
	it('drops case and diacritics', () => {
		expect(foldText('Zürich Çeşme')).toBe('zurich cesme');
	});
});
