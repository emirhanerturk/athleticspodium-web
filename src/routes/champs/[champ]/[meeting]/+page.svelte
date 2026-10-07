<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import StoryCards from '#lib/components/article/StoryCards.svelte';
	import Breadcrumb from '#lib/components/layout/Breadcrumb.svelte';
	import EditionHero from '#lib/components/meeting/EditionHero.svelte';
	import EditionSwitcher from '#lib/components/meeting/EditionSwitcher.svelte';
	import PodiumBoard from '#lib/components/meeting/PodiumBoard.svelte';
	import RecordsSet from '#lib/components/meeting/RecordsSet.svelte';
	import NationTable from '#lib/components/medal/NationTable.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import { editionStats, recordsSet } from '#lib/domain/edition.js';
	import { champUrl, meetingUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd, sportsEventJsonLd } from '#lib/seo/json-ld.js';
	import { editionDescription, editionTitle } from '#lib/seo/titles.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const meeting = $derived(data.meeting);
	const path = $derived(meetingUrl(meeting.champ.slug, meeting.slug));
	const stats = $derived(editionStats(data.events));
	const records = $derived(recordsSet(data.events));

	const crumbs = $derived([
		{ name: 'Championships', path: PAGES.champs },
		{ name: meeting.champ.name, path: champUrl(meeting.champ.slug) },
		{ name: [meeting.year, meeting.city].filter(Boolean).join(' '), path }
	]);
</script>

<SeoHead
	title={editionTitle(meeting)}
	description={editionDescription(meeting, stats)}
	{path}
	fallbackImage="championships"
/>
<JsonLd
	data={[
		sportsEventJsonLd(PUBLIC_SITE_URL, meeting, path),
		breadcrumbJsonLd(PUBLIC_SITE_URL, crumbs)
	]}
/>

<div class="page-container flex flex-wrap items-center justify-between gap-3 pt-5">
	<Breadcrumb
		items={crumbs.map((crumb, index) => ({
			label: crumb.name,
			href: index < crumbs.length - 1 ? crumb.path : undefined
		}))}
		class=""
	/>
	<EditionSwitcher
		champSlug={meeting.champ.slug}
		editions={data.championship.editions}
		current={meeting.slug}
	/>
</div>

<EditionHero {meeting} firstYear={data.championship.firstYear} {stats} />

{#if data.events.length}
	<PodiumBoard events={data.events} today={data.today} />
{:else}
	<section class="page-container pb-14">
		<p class="rounded-2xl border border-line bg-surface px-6 py-8 text-ink-2">
			No results are in the archive for this edition yet.
		</p>
	</section>
{/if}

{#if data.nations.length || records.length}
	<section class="border-y border-line bg-surface">
		<div
			class="page-container grid grid-cols-1 gap-12 py-14 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
		>
			{#if data.nations.length}<NationTable nations={data.nations} medals={stats.medals} />{/if}
			{#if records.length}<RecordsSet marks={records} />{/if}
		</div>
	</section>
{/if}

{#if meeting.note || data.stories.length}
	<section class="page-container flex flex-col gap-12 pt-14 pb-[72px]">
		{#if meeting.note}
			<article class="max-w-[720px]">
				<h2 class="mb-3.5 font-display text-[34px] leading-[0.94] font-bold sm:text-[40px]">
					About this edition
				</h2>
				<div class="edition-note flex flex-col gap-3.5 text-[16.5px] leading-[1.65] text-ink-2">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- edition notes are written by editors in the CMS -->
					{@html meeting.note}
				</div>
			</article>
		{/if}
		{#if data.stories.length}
			<div>
				<h2 class="mb-[18px] font-display text-[34px] leading-[0.94] font-bold sm:text-[40px]">
					Stories from {meeting.city ?? meeting.name}
				</h2>
				<StoryCards stories={data.stories} />
			</div>
		{/if}
	</section>
{/if}

<style>
	.edition-note :global(p) {
		margin: 0;
	}
</style>
