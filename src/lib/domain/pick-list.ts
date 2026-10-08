import { searchWords, startsWords } from '#lib/utils/fold-text.js';
import { CATEGORY_GROUPS } from './championship.js';
import { describeEvent, DISCIPLINE_LABELS, type CatalogueEvent, type Discipline } from './event.js';
import type { FilterChamp, FilterCountry } from './medal-search.js';

export interface PickOption {
	value: string;
	label: string;
	hint?: string;
	flag?: string;
	keywords?: string[];
}

export interface PickGroup {
	label: string | null;
	options: PickOption[];
}

const DISCIPLINES = Object.keys(DISCIPLINE_LABELS) as Discipline[];

export function matchPicks(groups: PickGroup[], query: string): PickGroup[] {
	const tokens = searchWords(query);
	if (!tokens.length) return groups;

	const matches = (option: PickOption) =>
		startsWords(tokens, searchWords([option.label, ...(option.keywords ?? [])].join(' ')));
	return groups
		.map((group) => ({ ...group, options: group.options.filter(matches) }))
		.filter((group) => group.options.length > 0);
}

export function countPicks(groups: PickGroup[]): number {
	return groups.reduce((sum, group) => sum + group.options.length, 0);
}

export function nationPicks(countries: Pick<FilterCountry, 'code' | 'name'>[]): PickGroup[] {
	return [
		{
			label: null,
			options: countries.map(({ code, name }) => ({
				value: code,
				label: name,
				hint: code,
				flag: code,
				keywords: [code]
			}))
		}
	];
}

function yearSpan(years: number[]): string | undefined {
	if (!years.length) return undefined;
	const first = Math.min(...years);
	const last = Math.max(...years);
	return first === last ? String(first) : `${first}–${last}`;
}

export function champPicks(
	champs: Pick<FilterChamp, 'id' | 'name' | 'category' | 'years'>[]
): PickGroup[] {
	const known = new Set<number>(CATEGORY_GROUPS.map((group) => group.category));
	const groups = [
		...CATEGORY_GROUPS.map(({ label, category }) => ({
			label,
			champs: champs.filter((champ) => champ.category === category)
		})),
		{ label: 'Other', champs: champs.filter((champ) => !known.has(champ.category)) }
	];
	return groups
		.filter((group) => group.champs.length > 0)
		.map((group) => ({
			label: group.label,
			options: group.champs.map((champ) => ({
				value: String(champ.id),
				label: champ.name,
				hint: yearSpan(champ.years)
			}))
		}));
}

export function eventPicks(
	events: CatalogueEvent[],
	valueOf: (event: CatalogueEvent) => string = (event) => String(event.id)
): PickGroup[] {
	const described = events.map((event) => ({ event, info: describeEvent(event.name) }));
	return [...DISCIPLINES, null]
		.map((discipline) => ({
			label: discipline ? DISCIPLINE_LABELS[discipline] : 'Other',
			options: described
				.filter(({ info }) => info.discipline === discipline)
				.map(({ event, info }) => ({
					value: valueOf(event),
					label: info.longName,
					keywords: [event.name, event.name.replace(/[,\s]/g, '')]
				}))
		}))
		.filter((group) => group.options.length > 0);
}

export function yearPicks(years: number[]): PickGroup[] {
	return [
		{ label: null, options: years.map((year) => ({ value: String(year), label: String(year) })) }
	];
}
