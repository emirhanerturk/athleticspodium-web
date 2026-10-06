import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { backend } }) => {
	const [countries, olympic] = await Promise.all([
		backend.countries.list(),
		backend.champs.getNations('olympic-games')
	]);

	return {
		countries: countries.filter((country) => country.isCountry),
		teams: countries.filter((country) => !country.isCountry),
		olympic
	};
};
