<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import DayAthleteList from '#lib/components/day/DayAthleteList.svelte';
	import DayHero from '#lib/components/day/DayHero.svelte';
	import Breadcrumb from '#lib/components/layout/Breadcrumb.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import Pagination from '#lib/components/ui/Pagination.svelte';
	import { fullName } from '#lib/domain/athlete.js';
	import { formatDay } from '#lib/format/date.js';
	import { onThisDayUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const day = $derived(data.day);
	const longDay = $derived(formatDay(day));
	const path = $derived(onThisDayUrl(day, data.page));
	const crumbs = $derived([
		{ name: 'Athletes', path: PAGES.athletes },
		{ name: `On this day: ${longDay}`, path: onThisDayUrl(day) }
	]);
	const famous = $derived(
		data.born.athletes
			.slice(0, 3)
			.map((athlete) => fullName(athlete))
			.join(', ')
	);
</script>

<SeoHead
	title="Athletes born on {longDay}{data.page > 1 ? `, page ${data.page}` : ''}"
	description="{data.born.count} athletics medallists were born on {longDay}{famous
		? `, among them ${famous}`
		: ''}, and {data.died.count} died on this day."
	{path}
	fallbackImage="athletes"
/>
<JsonLd data={[breadcrumbJsonLd(PUBLIC_SITE_URL, crumbs)]} />

<Breadcrumb
	items={crumbs.map((crumb, index) => ({
		label: crumb.name,
		href: index < crumbs.length - 1 ? crumb.path : undefined
	}))}
/>

<DayHero {day} born={data.born.count} died={data.died.count} today={data.today} />

<div class="page-container flex flex-col gap-12 pt-10 pb-16">
	{#if data.born.athletes.length}
		<DayAthleteList
			id="born"
			title="Born on {longDay}"
			count={data.born.count}
			athletes={data.born.athletes}
			kind="born"
			offset={data.offset}
			today={data.today}
		/>
	{/if}
	{#if data.died.athletes.length}
		<DayAthleteList
			id="died"
			title="Died on {longDay}"
			count={data.died.count}
			athletes={data.died.athletes}
			kind="died"
			offset={data.offset}
			today={data.today}
		/>
	{/if}
	{#if !data.born.count && !data.died.count}
		<p class="rounded-[18px] border-2 border-dashed border-line-2 px-6 py-8 text-center text-ink-2">
			No athlete in the archive was born or died on {longDay}.
		</p>
	{/if}
	{#if data.lastPage > 1}
		<Pagination
			page={data.page}
			lastPage={data.lastPage}
			href={(page) => onThisDayUrl(day, page)}
		/>
	{/if}
</div>
