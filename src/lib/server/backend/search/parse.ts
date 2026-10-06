import type { ArticleSummary } from '#lib/domain/article.js';
import type { SearchAthlete, SearchChamp, SearchCountry, SearchPage } from '#lib/domain/search.js';
import type { SearchAthleteDto, SearchDto } from './dto.js';

export interface SearchResults {
	athletes?: SearchPage<SearchAthlete>;
	champs?: SearchPage<SearchChamp>;
	countries?: SearchPage<SearchCountry>;
	articles?: SearchPage<ArticleSummary>;
}

export function parseSearchResults(dto: SearchDto): SearchResults {
	return {
		...(dto.athletes && {
			athletes: { count: dto.athletes.count, rows: dto.athletes.rows.map(parseSearchAthlete) }
		}),
		...(dto.champs && { champs: dto.champs }),
		...(dto.countries && {
			countries: {
				count: dto.countries.count,
				rows: dto.countries.rows.map(({ code, name, is_country }) => ({
					code,
					name,
					isCountry: is_country
				}))
			}
		}),
		...(dto.articles && {
			articles: {
				count: dto.articles.count,
				rows: dto.articles.rows.map((article) => ({
					id: article.id,
					slug: article.slug,
					title: article.title,
					description: article.description,
					publishedOn: article.created_date.slice(0, 10),
					image: article.image
						? {
								path: `articles/${article.image.uri}`,
								caption: article.image.caption ?? null,
								credit: article.image.credit ?? null
							}
						: null
				}))
			}
		})
	};
}

function parseSearchAthlete(dto: SearchAthleteDto): SearchAthlete {
	return {
		id: dto.id,
		slug: dto.slug,
		firstName: dto.first_name ?? '',
		lastName: dto.last_name ?? '',
		countryCode: dto.country_code,
		birthDate: dto.date_of_birth,
		deathDate: dto.date_of_death,
		men: dto.gender,
		olympicChampion: dto.olympic_mark,
		olympian: dto.is_olympian,
		events: dto.events ?? [],
		image: dto.image
			? {
					path: `athletes/${dto.id}/${dto.image.uri}`,
					credit: dto.image.credit ?? null,
					caption: null
				}
			: null,
		medals: dto.medals
	};
}
