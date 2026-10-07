<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import CompareForm from '#lib/components/compare/CompareForm.svelte';
	import CompareTable from '#lib/components/compare/CompareTable.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import ToolsHero from '#lib/components/tools/ToolsHero.svelte';
	import { compareByYear } from '#lib/domain/compare.js';
	import { GENDER_LABELS } from '#lib/domain/edition.js';
	import { describeEvent } from '#lib/domain/event.js';
	import { compareUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const query = $derived(data.query);
	const champA = $derived(data.champs.find((champ) => champ.id === query.a));
	const champB = $derived(data.champs.find((champ) => champ.id === query.b));
	const event = $derived(data.events.find((item) => item.id === query.event));
	const years = $derived(data.medals ? compareByYear(data.medals[0], data.medals[1]) : null);
	const subject = $derived(
		champA && champB && event && query.gender
			? `${champA.name} vs ${champB.name}: ${describeEvent(event.name).longName}, ${GENDER_LABELS[query.gender].toLowerCase()}`
			: null
	);
</script>

<SeoHead
	title={subject ?? 'Compare championships'}
	description={subject
		? `${subject}: the podiums of both championships year by year, with the difference between the winning marks.`
		: 'Compare the podiums of two athletics championships event by event, year by year.'}
	path={compareUrl(query)}
	fallbackImage="tools"
/>
<JsonLd data={[breadcrumbJsonLd(PUBLIC_SITE_URL, [{ name: 'Compare', path: PAGES.compare }])]} />

<ToolsHero active="compare" medals={data.stats?.medals ?? null} />

<section class="border-b border-line bg-surface">
	<div class="page-container flex flex-col gap-5 py-[26px]">
		<div class="flex flex-col gap-2">
			<h2 class="font-display text-[30px] leading-[1.05] font-bold text-balance sm:text-[40px]">
				{subject ?? 'Two championships, one event'}
			</h2>
			<p class="max-w-[640px] text-[15px] leading-[1.55] text-ink-2">
				Pick two championships and an event to line up their podiums year by year. The last column
				is the winning mark of A minus that of B.
			</p>
		</div>
		<CompareForm {query} champs={data.champs} events={data.events} />
	</div>
</section>

<section class="page-container pb-16">
	{#if years && champA && champB}
		<div class="mt-8">
			{#if years.length}
				<CompareTable {years} names={[champA.name, champB.name]} today={data.today} />
			{:else}
				<p class="rounded-2xl border border-line bg-surface px-6 py-8 text-ink-2">
					No comparable years found for this selection.
				</p>
			{/if}
		</div>
	{/if}
</section>
