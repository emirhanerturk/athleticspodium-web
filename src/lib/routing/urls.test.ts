import { describe, expect, it } from 'vitest';
import { medalSearchUrl } from './urls.js';

describe('medalSearchUrl', () => {
	it('filters the medal search by championship', () => {
		expect(medalSearchUrl({ champ: 18 })).toBe('/medals/search?champs=18');
	});

	it('adds the event and gender', () => {
		expect(medalSearchUrl({ champ: 18, event: 10, gender: 'women' })).toBe(
			'/medals/search?champs=18&event=10&gender=1'
		);
	});
});
