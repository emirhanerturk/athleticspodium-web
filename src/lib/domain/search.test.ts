import { describe, expect, it } from 'vitest';
import { highlight, parseSearchRequest, topResultOf } from './search.js';

const page = <T>(rows: T[]) => ({ count: rows.length, rows });

describe('parseSearchRequest', () => {
	it('reads the query, scope, page and filters', () => {
		expect(
			parseSearchRequest(
				new URLSearchParams('q= bolt &type=athletes&page=3&gender=men&born_from=1980&olympian=1')
			)
		).toEqual({
			query: 'bolt',
			scope: 'athletes',
			page: 3,
			filters: { gender: 'men', bornFrom: 1980, bornTo: null, olympian: true }
		});
	});

	it('falls back to all scopes and the first page', () => {
		expect(
			parseSearchRequest(new URLSearchParams('q=jam&type=x&page=2&born_to=abc'))
		).toMatchObject({
			scope: 'all',
			page: 1,
			filters: { bornTo: null }
		});
	});
});

describe('topResultOf', () => {
	const athletes = page([{ firstName: 'Usain', lastName: 'Bolt' }]);

	it('prefers an IOC code or country name', () => {
		expect(
			topResultOf('jam', { athletes, countries: page([{ code: 'JAM', name: 'Jamaica' }]) })
		).toEqual({ kind: 'country', item: { code: 'JAM', name: 'Jamaica' } });
	});

	it('finds a full championship or athlete name only', () => {
		expect(
			topResultOf('European Championships', { champs: page([{ name: 'European Championships' }]) })
				?.kind
		).toBe('champ');
		expect(topResultOf('usain bolt', { athletes })?.kind).toBe('athlete');
		expect(topResultOf('bolt', { athletes })).toBeNull();
	});
});

describe('highlight', () => {
	it('splits the text around the match, ignoring case and accents', () => {
		expect(highlight('Marlies Göhr', 'gohr')).toEqual(['Marlies ', 'Göhr', '']);
		expect(highlight('Eliud Kipchoge', 'KIP')).toEqual(['Eliud ', 'Kip', 'choge']);
	});

	it('leaves text without a match whole', () => {
		expect(highlight('Usain Bolt', 'xyz')).toEqual(['Usain Bolt', '', '']);
	});
});
