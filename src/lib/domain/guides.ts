import type { Image } from './image.js';

export interface Guide {
	article: { id: number; slug: string };
	topic: string;
	title: string;
	summary: string;
	image: Image;
	facts: { value: string; label: string }[];
}

export const GUIDES: Guide[] = [
	{
		article: { id: 199, slug: 'paris-2024-all-information' },
		topic: 'Olympic Games',
		title: 'Paris 2024: all information',
		summary:
			'Event infoboxes, daily reports from all ten days and every final with its winner — the Games in one page.',
		image: {
			path: 'articles/2024/07/498194c8-b3ce-462a-8733-62475baeeff5.jpeg',
			caption: null,
			credit: null
		},
		facts: [
			{ value: '10', label: 'daily reports' },
			{ value: '2', label: 'marathon reports' },
			{ value: 'All', label: 'finals, timetable' }
		]
	},
	{
		article: { id: 229, slug: 'info-world-marathon-majors' },
		topic: 'Road',
		title: 'World Marathon Majors',
		summary:
			'Every race of the series since Boston 2006, the stops, and the countdown of race winners.',
		image: {
			path: 'articles/2024/12/b0c2a857-d499-470d-9fb1-307ade5b59c7.jpeg',
			caption: null,
			credit: null
		},
		facts: [
			{ value: '107', label: 'races, 2006–2026' },
			{ value: '7', label: 'majors incl. Sydney' },
			{ value: '11', label: 'wins · Kipchoge' }
		]
	}
];
