import type { OnThisDay } from '#lib/domain/athlete.js';
import type { IsoDate } from '#lib/domain/date.js';
import { dayOfDate, daySlug } from '#lib/domain/day.js';

export interface DayHighlights {
	born: OnThisDay;
	died: OnThisDay;
}

let visitorToday = $state<IsoDate | null>(null);
const highlightsByDate: Record<IsoDate, Promise<DayHighlights | null>> = {};

export function setVisitorToday(date: IsoDate) {
	visitorToday = date;
}

export function todayFor(serverToday: IsoDate): IsoDate {
	return visitorToday ?? serverToday;
}

function highlightsOf(date: IsoDate): Promise<DayHighlights | null> {
	highlightsByDate[date] ??= fetch(`/internal/on-this-day/${daySlug(dayOfDate(date))}`)
		.then((response) => (response.ok ? response.json() : null))
		.catch(() => null);
	return highlightsByDate[date];
}

export function visitorHighlights(serverToday: () => IsoDate, server: () => DayHighlights) {
	const today = $derived(todayFor(serverToday()));
	let loaded = $state<DayHighlights | null>(null);

	$effect(() => {
		if (today === serverToday()) {
			loaded = null;
			return;
		}
		let current = true;
		highlightsOf(today).then((highlights) => {
			if (current) loaded = highlights;
		});
		return () => {
			current = false;
		};
	});

	return {
		get today() {
			return today;
		},
		get born() {
			return loaded?.born ?? server().born;
		},
		get died() {
			return loaded?.died ?? server().died;
		}
	};
}
