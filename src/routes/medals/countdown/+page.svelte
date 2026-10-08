<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import CountdownAside from '#lib/components/countdown/CountdownAside.svelte';
	import CountdownQuestion from '#lib/components/countdown/CountdownQuestion.svelte';
	import CountdownSummary from '#lib/components/countdown/CountdownSummary.svelte';
	import CountdownTable from '#lib/components/countdown/CountdownTable.svelte';
	import EditionStrip from '#lib/components/countdown/EditionStrip.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import ToolsHero from '#lib/components/tools/ToolsHero.svelte';
	import { countdownFacts } from '#lib/domain/countdown.js';
	import { medalCountdownUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let open = $state<string | null>(null);

	const countdown = $derived(data.countdown);
	const subject = $derived(
		countdown ? `${countdown.country.name} at the ${countdown.champ.name}` : null
	);
	const medalled = $derived(countdown?.editions.some((item) => item.tally) ?? false);
</script>

<SeoHead
	title={subject ? `${subject} – medals by edition` : 'Medal countdown by championship'}
	description={subject
		? `Every medal ${subject}, edition by edition: gold, silver, bronze, totals, firsts and the all-time medal table.`
		: 'Pick a country and a championship to see its medals edition by edition.'}
	path={medalCountdownUrl(data.query.country, data.query.champ)}
	fallbackImage="tools"
/>
<JsonLd
	data={[
		breadcrumbJsonLd(PUBLIC_SITE_URL, [{ name: 'Medal countdown', path: PAGES.medalCountdown }])
	]}
/>

<ToolsHero active="countdown" medals={data.stats?.medals ?? null} />

<section class="border-b border-line bg-surface">
	<div class="page-container py-[26px]">
		<h2 class="sr-only">{subject ?? 'Medal countdown'}</h2>
		<CountdownQuestion query={data.query} champs={data.champs} countries={data.countries} />
	</div>
</section>

{#if countdown && medalled}
	{@const standing = countdown.standings.find(
		(nation) => nation.country.code === countdown.country.code
	)}
	<div class="page-container flex flex-col gap-[22px] pt-7 pb-16">
		<CountdownSummary
			editions={countdown.editions}
			{standing}
			nations={countdown.standings.length}
			withdrawn={countdown.withdrawn.length}
			firstMedal={countdown.firstMedal}
			firstGold={countdown.firstGold}
		/>
		<EditionStrip
			editions={countdown.editions}
			next={countdown.next}
			champSlug={countdown.champ.slug}
			bind:open
		/>
		<div class="grid grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,1fr)_320px]">
			<CountdownTable
				editions={countdown.editions}
				champ={countdown.champ}
				countryCode={countdown.country.code}
				today={data.today}
				bind:open
			/>
			<CountdownAside
				champ={countdown.champ}
				countryCode={countdown.country.code}
				standings={countdown.standings}
				withdrawn={countdown.withdrawn}
				next={countdown.next}
				nextOrdinal={countdownFacts(countdown.editions).held + 1}
			/>
		</div>
	</div>
{:else}
	<div class="page-container pt-8 pb-16">
		<p class="rounded-[18px] border-2 border-dashed border-line-2 px-6 py-8 text-center text-ink-2">
			{#if countdown}
				{countdown.country.name} has no medal at the {countdown.champ.name} in the archive yet.
			{:else}
				Pick a nation and a championship in the sentence above to count its medals edition by
				edition.
			{/if}
		</p>
	</div>
{/if}
