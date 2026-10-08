import { describe, expect, it } from 'vitest';
import { foldText, searchWords, startsWords } from './fold-text.js';

describe('foldText', () => {
	it('drops case and diacritics', () => {
		expect(foldText('Zürich Çeşme')).toBe('zurich cesme');
	});

	it('folds letters that have no separate mark', () => {
		expect(foldText('Işık Bøe Łukasz Đorđe')).toBe('isik boe lukasz dorde');
	});
});

describe('searchWords and startsWords', () => {
	it('splits folded text into words', () => {
		expect(searchWords('Côte d’Ivoire (CIV)')).toEqual(['cote', 'd', 'ivoire', 'civ']);
	});

	it('needs every token to start one of the words', () => {
		const words = searchWords('Ramil Guliyev 100m');
		expect(startsWords(['ram', '100'], words)).toBe(true);
		expect(startsWords(['liyev'], words)).toBe(false);
	});
});
