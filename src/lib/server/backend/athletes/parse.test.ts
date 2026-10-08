import { describe, expect, it } from 'vitest';
import { parseAthleteProfile, parseRelatives } from './parse.js';

const row = (id: number, deathDate: string | null) => ({
	id,
	slug: `athlete-${id}`,
	first_name: 'First',
	last_name: `Last${id}`,
	country_code: 'NZL',
	date_of_birth: '1984-10-06',
	date_of_death: deathDate
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
	it('builds the media path of every photo and drops an empty biography', () => {
		const profile = parseAthleteProfile({
			...row(35017, null),
			aka: null,
			olympic_mark: true,
			place_of_birth: null,
			events: ['High jump'],
			image: [
				{ uri: 'photo.jpeg', credit: 'Photo by someone' },
				{ uri: 'second.jpeg', credit: ' ', caption: 'Competing at 2015 Balkan Indoor' }
			],
			biography: '  ',
			country: { code: 'UKR', name: 'Ukraine' }
		});

		expect(profile.photos).toEqual([
			{ path: 'athletes/35017/photo.jpeg', credit: 'Photo by someone', caption: null },
			{
				path: 'athletes/35017/second.jpeg',
				credit: null,
				caption: 'Competing at 2015 Balkan Indoor'
			}
		]);
		expect(profile.biography).toBeNull();
		expect(profile.aka).toEqual([]);
	});
});
