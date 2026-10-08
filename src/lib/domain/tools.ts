import { PAGES } from '#lib/routing/urls.js';

export interface Tool {
	key: 'search' | 'countdown' | 'compare';
	icon: string;
	title: string;
	text: string;
	href: string;
}

export const TOOLS: Tool[] = [
	{
		key: 'search',
		icon: 'MS',
		title: 'Medal search',
		text: 'Every podium, filtered by nation, championship, event, year.',
		href: PAGES.medalSearch
	},
	{
		key: 'countdown',
		icon: 'MC',
		title: 'Medal countdown',
		text: 'One nation at one championship, edition by edition.',
		href: PAGES.medalCountdown
	},
	{
		key: 'compare',
		icon: 'VS',
		title: 'Compare championships',
		text: 'Two championships, one event, year by year.',
		href: PAGES.compare
	}
];
