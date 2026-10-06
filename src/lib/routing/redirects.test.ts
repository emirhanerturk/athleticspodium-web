import { describe, expect, it } from 'vitest';
import { canonicalRedirect } from './redirects.js';

const redirectOf = (href: string) => canonicalRedirect(new URL(href));

describe('canonicalRedirect', () => {
	it('leaves canonical URLs alone', () => {
		expect(redirectOf('https://athleticspodium.com/athlete/1/miruts-yifter')).toBeNull();
		expect(redirectOf('https://athleticspodium.com/medals/search?country=TUR')).toBeNull();
	});

	it('moves www to the apex host', () => {
		expect(redirectOf('https://www.athleticspodium.com/athlete/1/miruts-yifter?x=1')).toBe(
			'https://athleticspodium.com/athlete/1/miruts-yifter?x=1'
		);
	});

	it('turns Angular matrix parameters into a query string without empty values', () => {
		expect(
			redirectOf('https://athleticspodium.com/medals/search;champs=;country=TUR;page=2;order=year')
		).toBe('https://athleticspodium.com/medals/search?country=TUR&page=2&order=year');
	});

	it('keeps an existing query value over a matrix parameter with the same name', () => {
		expect(redirectOf('https://athleticspodium.com/medals/search;page=2?page=3')).toBe(
			'https://athleticspodium.com/medals/search?page=3'
		);
	});

	it('upper-cases country codes', () => {
		expect(redirectOf('https://athleticspodium.com/country/tur')).toBe(
			'https://athleticspodium.com/country/TUR'
		);
		expect(redirectOf('https://athleticspodium.com/country/Ken/athletes')).toBe(
			'https://athleticspodium.com/country/KEN/athletes'
		);
	});

	it('applies every fix in a single redirect', () => {
		expect(redirectOf('https://www.athleticspodium.com/country/tur')).toBe(
			'https://athleticspodium.com/country/TUR'
		);
	});
});
