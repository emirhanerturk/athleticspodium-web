<script lang="ts">
	import { goto } from '$app/navigation';
	import Picker from '#lib/components/ui/Picker.svelte';
	import { describeEvent, type CatalogueEvent } from '#lib/domain/event.js';
	import { champPicks, eventPicks, nationPicks, yearPicks } from '#lib/domain/pick-list.js';
	import {
		champsFor,
		countriesFor,
		eventsFor,
		MEDAL_NAMES,
		yearsFor,
		type FilterChamp,
		type FilterCountry,
		type MedalQuery
	} from '#lib/domain/medal-search.js';
	import { medalSearchUrl, PAGES } from '#lib/routing/urls.js';

	let {
		query,
		champs,
		countries,
		events,
		currentYear
	}: {
		query: MedalQuery;
		champs: FilterChamp[];
		countries: FilterCountry[];
		events: CatalogueEvent[];
		currentYear: number;
	} = $props();

	const champ = $derived(champs.find((item) => item.id === query.champ));
	const country = $derived(countries.find((item) => item.code === query.country));
	const event = $derived(events.find((item) => item.id === query.event));

	const number = (value: string) => (value ? Number(value) : null);

	function choose(change: Partial<MedalQuery>) {
		goto(medalSearchUrl({ ...query, ...change, page: 1 }), { reset: false });
	}

	function chooseChamp(id: number | null) {
		const next = champs.find((item) => item.id === id);
		const keepsEvent = eventsFor(next, query.gender, events).some(
			(item) => item.id === query.event
		);
		const keepsYear = !query.year || yearsFor(next, currentYear).includes(query.year);
		choose({
			champ: id,
			event: keepsEvent ? query.event : null,
			year: keepsYear ? query.year : null
		});
	}
</script>

<form
	method="get"
	action={PAGES.medalSearch}
	class="flex flex-wrap items-center gap-x-2.5 gap-y-2 font-display text-[24px] leading-[1.3] font-bold sm:text-[30px]"
>
	{#if query.medal}<input type="hidden" name="medal" value={MEDAL_NAMES[query.medal]} />{/if}
	{#if query.gender}<input type="hidden" name="gender" value={query.gender} />{/if}
	<span>Show medals</span>
	<span class="text-ink-3">won by</span>
	<Picker
		label="Nation"
		name="country"
		value={query.country ?? ''}
		text={country?.name ?? 'any nation'}
		flag={country?.code}
		anyLabel="any nation"
		placeholder="Search nations or codes"
		groups={nationPicks(countriesFor(champ, countries))}
		onchoose={(code) => choose({ country: code || null })}
	/>
	<span class="text-ink-3">at the</span>
	<Picker
		label="Championship"
		name="champ"
		value={query.champ ? String(query.champ) : ''}
		text={champ?.name ?? 'any championship'}
		anyLabel="any championship"
		placeholder="Search championships"
		groups={champPicks(champsFor(country, champs))}
		onchoose={(id) => chooseChamp(number(id))}
	/>
	<span class="text-ink-3">in</span>
	<Picker
		label="Event"
		name="event"
		value={query.event ? String(query.event) : ''}
		text={event ? describeEvent(event.name).longName : 'any event'}
		anyLabel="any event"
		placeholder="Search events"
		groups={eventPicks(eventsFor(champ, query.gender, events))}
		onchoose={(id) => choose({ event: number(id) })}
	/>
	<span class="text-ink-3">·</span>
	<Picker
		label="Year"
		name="year"
		value={query.year ? String(query.year) : ''}
		text={query.year ? String(query.year) : 'all years'}
		anyLabel="all years"
		placeholder="Search years"
		groups={yearPicks(yearsFor(champ, currentYear))}
		onchoose={(year) => choose({ year: number(year) })}
	/>
	<noscript>
		<button type="submit" class="h-11 rounded-xl bg-ink px-4 text-lg text-bg">Show</button>
	</noscript>
</form>
