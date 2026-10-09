import { describe, expect, it } from 'vitest';
import { canonicalRedirect } from './redirects.js';

const redirectOf = (href: string) => canonicalRedirect(new URL(href));

describe('canonicalRedirect', () => {
	it('leaves canonical URLs alone', () => {
		expect(redirectOf('https://athleticspodium.com/athlete/1/miruts-yifter')).toBeNull();
		expect(redirectOf('https://athleticspodium.com/medals?country=TUR')).toBeNull();
	});

	it('moves www to the apex host', () => {
		expect(redirectOf('https://www.athleticspodium.com/athlete/1/miruts-yifter?x=1')).toBe(
			'https://athleticspodium.com/athlete/1/miruts-yifter?x=1'
		);
	});

	it('turns Angular matrix parameters into a query string without empty values', () => {
		expect(redirectOf('https://athleticspodium.com/athlete/letter/a;page=2;sort=')).toBe(
			'https://athleticspodium.com/athlete/letter/a?page=2'
		);
	});

	it('keeps an existing query value over a matrix parameter with the same name', () => {
		expect(redirectOf('https://athleticspodium.com/medals/search;page=2?page=3')).toBe(
			'https://athleticspodium.com/medals?page=3'
		);
	});

	it('moves the tools under /medals with readable parameters', () => {
		expect(
			redirectOf(
				'https://athleticspodium.com/medals/search;champs=18;country=TUR;gender=1;medal=1;order=year'
			)
		).toBe('https://athleticspodium.com/medals?champ=18&country=TUR&gender=women&medal=gold');
		expect(redirectOf('https://athleticspodium.com/medals/search')).toBe(
			'https://athleticspodium.com/medals'
		);
		expect(
			redirectOf('https://athleticspodium.com/medals/country-champs?country=TUR&champ=18')
		).toBe('https://athleticspodium.com/medals/countdown?country=TUR&champ=18');
		expect(redirectOf('https://athleticspodium.com/compare?a=18&b=40')).toBe(
			'https://athleticspodium.com/medals/compare?a=18&b=40'
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

	it('keeps any host when no canonical host is given', () => {
		expect(redirectOf('https://next.athleticspodium.com/athlete/1/miruts-yifter')).toBeNull();
	});

	it('moves every other host to the canonical host', () => {
		const toCanonical = (href: string) => canonicalRedirect(new URL(href), 'athleticspodium.com');

		expect(toCanonical('https://athleticspodium.com/athlete/1/miruts-yifter')).toBeNull();
		expect(toCanonical('https://next.athleticspodium.com/athlete/1/miruts-yifter?x=1')).toBe(
			'https://athleticspodium.com/athlete/1/miruts-yifter?x=1'
		);
		expect(toCanonical('https://athleticspodium-web-production.up.railway.app/')).toBe(
			'https://athleticspodium.com/'
		);
		expect(toCanonical('https://www.athleticspodium.com/country/tur')).toBe(
			'https://athleticspodium.com/country/TUR'
		);
	});

	it('answers the health check on any host', () => {
		expect(
			canonicalRedirect(
				new URL('https://healthcheck.railway.app/robots.txt'),
				'athleticspodium.com'
			)
		).toBeNull();
	});

	it('keeps a production build that runs locally on its own host', () => {
		expect(
			canonicalRedirect(
				new URL('http://localhost:4173/athlete/1/miruts-yifter'),
				'athleticspodium.com'
			)
		).toBeNull();
		expect(
			canonicalRedirect(new URL('http://127.0.0.1:4173/country/tur'), 'athleticspodium.com')
		).toBe('http://127.0.0.1:4173/country/TUR');
	});
});
