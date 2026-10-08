<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import CompareQuestion from '#lib/components/compare/CompareQuestion.svelte';
	import CompareStats from '#lib/components/compare/CompareStats.svelte';
	import CompareTimeline from '#lib/components/compare/CompareTimeline.svelte';
	import DoubleWinners from '#lib/components/compare/DoubleWinners.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import ToolsHero from '#lib/components/tools/ToolsHero.svelte';
	import {
		champStats,
		COMPARE_PRESETS,
		compareByYear,
		doubleWinners,
		raceName,
		type ChampStats,
		type CompareQuery
	} from '#lib/domain/compare.js';
	import { describeEvent, markKind } from '#lib/domain/event.js';
	import type { FilterChamp } from '#lib/domain/medal-search.js';
	import { compareUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let traced = $state<string | null>(null);

	const query = $derived(data.query);
	const subjectOf = ({ a, b, gender, event }: CompareQuery) => {
		const champA = data.champs.find((champ) => champ.id === a);
		const champB = data.champs.find((champ) => champ.id === b);
		const item = data.events.find((candidate) => candidate.id === event);
		return champA && champB && item && gender
			? { champs: [champA, champB] as [FilterChamp, FilterChamp], event: item, gender }
			: null;
	};
	const subject = $derived(subjectOf(query));
	const title = $derived(
		subject
			? `${subject.champs[0].name} vs ${subject.champs[1].name} · ${raceName(subject.gender, subject.event.name)}`
			: null
	);
	const comparison = $derived.by(() => {
		if (!subject || !data.medals) return null;
		const years = compareByYear(data.medals[0], data.medals[1]);
		const kind = markKind(describeEvent(subject.event.name).discipline);
		return {
			years,
			kind,
			stats: [champStats(years, 'a', kind), champStats(years, 'b', kind)] as [
				ChampStats,
				ChampStats
			],
			winners: doubleWinners(years)
		};
	});
	const presets = $derived(
		COMPARE_PRESETS.flatMap((preset) => {
			const found = subjectOf(preset);
			return found
				? [
						{
							href: compareUrl(preset),
							label: `${found.champs[0].name} vs ${found.champs[1].name} · ${raceName(found.gender, found.event.name)}`
						}
					]
				: [];
		})
	);
</script>

<SeoHead
	title={title ?? 'Compare championships'}
	description={title
		? `${title}: both podiums year by year, the fastest or best winning marks, the most titles and who won both.`
		: 'Compare the podiums of two athletics championships event by event, year by year.'}
	path={compareUrl(query)}
	fallbackImage="tools"
/>
<JsonLd data={[breadcrumbJsonLd(PUBLIC_SITE_URL, [{ name: 'Compare', path: PAGES.compare }])]} />

<ToolsHero active="compare" medals={data.stats?.medals ?? null} />

<section class="border-b border-line bg-surface">
	<div class="page-container py-[26px]">
		<h2 class="sr-only">{title ?? 'Compare two championships'}</h2>
		<CompareQuestion {query} champs={data.champs} events={data.events} />
	</div>
</section>

{#if subject && comparison}
	{@const names = [subject.champs[0].name, subject.champs[1].name] as [string, string]}
	<div class="page-container flex flex-col gap-[18px] pt-7 pb-16">
		{#if comparison.years.length}
			<CompareStats stats={comparison.stats} {names} kind={comparison.kind} />
			<DoubleWinners winners={comparison.winners} bind:traced />
			<div class="mt-1.5">
				<CompareTimeline
					years={comparison.years}
					champs={subject.champs}
					kind={comparison.kind}
					{traced}
					today={data.today}
				/>
			</div>
		{:else}
			<p
				class="rounded-[18px] border-2 border-dashed border-line-2 px-6 py-8 text-center text-ink-2"
			>
				Neither championship has medals in this event yet.
			</p>
		{/if}
	</div>
{:else}
	<div
		class="page-container grid grid-cols-1 items-start gap-9 pt-8 pb-16 md:grid-cols-[minmax(0,1fr)_360px]"
	>
		<p class="rounded-[18px] border-2 border-dashed border-line-2 px-6 py-8 text-center text-ink-2">
			Pick two championships and an event in the sentence above to line up their podiums year by
			year.
		</p>
		<nav
			aria-labelledby="compare-presets"
			class="flex flex-col gap-2.5 rounded-[18px] bg-surface-2 px-5 py-[18px]"
		>
			<h2 id="compare-presets" class="text-sm font-bold">Try a comparison</h2>
			<ul>
				{#each presets as preset (preset.href)}
					<li class="border-t border-line">
						<a
							href={preset.href}
							class="block py-2 text-sm leading-snug text-ink-2 hover:text-brand-ink"
						>
							{preset.label} →
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
{/if}
