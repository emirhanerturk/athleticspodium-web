<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import DayAthleteList from '#lib/components/day/DayAthleteList.svelte';
	import DayHero from '#lib/components/day/DayHero.svelte';
	import Breadcrumb from '#lib/components/layout/Breadcrumb.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import { fullName } from '#lib/domain/athlete.js';
	import { formatDay } from '#lib/format/date.js';
	import { onThisDayUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const day = $derived(data.day);
	const longDay = $derived(formatDay(day));
	const path = $derived(onThisDayUrl(day));
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
	title="Athletes born on {longDay}"
	description="{data.born.count} athletics medallists were born on {longDay}{famous
		? `, among them ${famous}`
		: ''}, and {data.died.count} died on this day."
	{path}
	fallbackImage="athletes"
/>
<JsonLd data={[breadcrumbJsonLd(PUBLIC_SITE_URL, crumbs)]} />

<div class="border-b border-line bg-surface-2">
	<Breadcrumb
		items={crumbs.map((crumb, index) => ({
			label: crumb.name,
			href: index < crumbs.length - 1 ? crumb.path : undefined
		}))}
	/>
	<DayHero {day} born={data.born.count} died={data.died.count} today={data.today} />
</div>

<div class="page-container pt-10 pb-16">
	{#if data.born.count || data.died.count}
		<div class="grid grid-cols-1 items-start gap-x-12 gap-y-10 lg:grid-cols-2">
			<DayAthleteList
				id="born"
				title="Born on {longDay}"
				kind="born"
				list={data.born}
				pageHref={(born) => onThisDayUrl(day, { born, died: data.died.page })}
				today={data.today}
			/>
			<DayAthleteList
				id="died"
				title="Died on {longDay}"
				kind="died"
				list={data.died}
				pageHref={(died) => onThisDayUrl(day, { born: data.born.page, died })}
				today={data.today}
			/>
		</div>
	{:else}
		<p class="rounded-[18px] border-2 border-dashed border-line-2 px-6 py-8 text-center text-ink-2">
			No athlete in the archive was born or died on {longDay}.
		</p>
	{/if}
</div>
