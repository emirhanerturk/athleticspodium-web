import { describe, expect, it } from 'vitest';
import { parseAthleteProfile, parseBirthdaysToday, parseRelatives } from './parse.js';

const row = (id: number, deathDate: string | null) => ({
	id,
	slug: `athlete-${id}`,
	first_name: 'First',
	last_name: `Last${id}`,
	country_code: 'NZL',
	date_of_birth: '1984-10-06',
	date_of_death: deathDate
});

describe('parseBirthdaysToday', () => {
	it('features the first living athlete and keeps the full count', () => {
		const birthdays = parseBirthdaysToday({
			count: 134,
			rows: [row(1, '2020-01-01'), row(2, null)]
		});

		expect(birthdays.count).toBe(134);
		expect(birthdays.featured?.id).toBe(2);
	});

	it('features nobody when every candidate has died', () => {
		expect(parseBirthdaysToday({ count: 1, rows: [row(1, '2020-01-01')] }).featured).toBeNull();
	});
});

describe('parseRelatives', () => {
	const elisa = { id: 70203, slug: 'elisa-keitel', first_name: 'Elisa', last_name: 'Keitel' };
	const sebastian = {
		id: 14614,
		slug: 'sebastian-keitel',
		first_name: 'Sebastian',
		last_name: 'Keitel'
	};
	const relation = {
		athlete_from_id: elisa.id,
		relation_from: 0,
		relation_to: 3,
		athlete_from: elisa,
		athlete_to: sebastian
	};

	it('names the other athlete by their role towards the viewed one', () => {
		expect(parseRelatives(elisa.id, [relation])).toEqual([
			expect.objectContaining({ id: sebastian.id, relation: 'Father' })
		]);
		expect(parseRelatives(sebastian.id, [relation])).toEqual([
			expect.objectContaining({ id: elisa.id, relation: 'Daughter' })
		]);
	});
});

describe('parseAthleteProfile', () => {
	it('builds the media path of the first image and drops an empty biography', () => {
		const profile = parseAthleteProfile({
			...row(35017, null),
			aka: null,
			olympic_mark: true,
			place_of_birth: null,
			events: ['High jump'],
			image: [{ uri: 'photo.jpeg', credit: 'Photo by someone' }],
			biography: '  ',
			country: { code: 'UKR', name: 'Ukraine' }
		});

		expect(profile.image).toEqual({
			path: 'athletes/35017/photo.jpeg',
			credit: 'Photo by someone',
			caption: null
		});
		expect(profile.biography).toBeNull();
		expect(profile.aka).toEqual([]);
	});
});
