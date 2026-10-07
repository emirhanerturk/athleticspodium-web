<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import CountryChampsForm from '#lib/components/medal/CountryChampsForm.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import ToolsHero from '#lib/components/tools/ToolsHero.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import { addTallies } from '#lib/domain/country.js';
	import {
		champUrl,
		medalCountdownUrl,
		countryUrl,
		medalSearchUrl,
		meetingUrl,
		PAGES
	} from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const champ = $derived(data.champs.find((item) => item.id === data.champId));
	const country = $derived(data.countries.find((item) => item.code === data.countryCode));
	const total = $derived(addTallies((data.editions ?? []).map((edition) => edition.tally)));
	const subject = $derived(country && champ ? `${country.name} at the ${champ.name}` : null);
	const path = $derived(
		data.countryCode && data.champId
			? medalCountdownUrl(data.countryCode, data.champId)
			: PAGES.medalCountdown
	);
	const CELL = 'py-2.5 text-center font-data tabular';
</script>

<SeoHead
	title={subject ? `${subject} – medals by edition` : 'Medal countdown by championship'}
	description={subject
		? `Every medal ${subject}, edition by edition: gold, silver, bronze and totals.`
		: 'Pick a country and a championship to see its medals edition by edition.'}
	{path}
	fallbackImage="tools"
/>
<JsonLd
	data={[
		breadcrumbJsonLd(PUBLIC_SITE_URL, [{ name: 'Medal countdown', path: PAGES.medalCountdown }])
	]}
/>

<ToolsHero active="countdown" medals={data.stats?.medals ?? null} />

<section class="border-b border-line bg-surface">
	<div class="page-container flex flex-col gap-5 py-[26px]">
		<h2 class="font-display text-[30px] leading-[1.05] font-bold text-balance sm:text-[40px]">
			{subject ?? 'One nation at one championship, edition by edition'}
		</h2>
		<CountryChampsForm
			champs={data.champs}
			countries={data.countries}
			champId={data.champId}
			countryCode={data.countryCode}
		/>
	</div>
</section>

<section class="page-container pb-16">
	{#if data.editions && champ && country}
		{#if data.editions.length}
			<div class="mt-8 overflow-x-auto rounded-[20px] border border-line bg-surface">
				<table class="w-full min-w-[560px] border-collapse text-[14.5px]">
					<thead>
						<tr class="font-data text-[11px] tracking-[0.1em] text-ink-3 uppercase">
							<th scope="col" class="py-3 pl-5 text-left font-semibold">Edition</th>
							<th scope="col" class="w-14 py-3"
								><span title="Gold" class="inline-block size-3 rounded-full bg-gold"></span></th
							>
							<th scope="col" class="w-14 py-3"
								><span title="Silver" class="inline-block size-3 rounded-full bg-silver"></span></th
							>
							<th scope="col" class="w-14 py-3"
								><span title="Bronze" class="inline-block size-3 rounded-full bg-bronze"></span></th
							>
							<th scope="col" class="w-16 py-3 font-semibold">Total</th>
							<th scope="col" class="w-28 py-3 pr-5"><span class="sr-only">Details</span></th>
						</tr>
					</thead>
					<tbody>
						{#each data.editions as { meeting, tally } (meeting.slug)}
							<tr class="border-t border-line">
								<td class="py-2.5 pl-5">
									<a
										href={meetingUrl(champ.slug, meeting.slug)}
										class="font-semibold hover:text-brand-ink">{meeting.name}</a
									>
									{#if meeting.city}<span class="text-[13px] text-ink-3">
											· {meeting.city}</span
										>{/if}
								</td>
								<td class="{CELL} font-bold">{tally.gold}</td>
								<td class={CELL}>{tally.silver}</td>
								<td class={CELL}>{tally.bronze}</td>
								<td class="{CELL} font-bold">{tally.total}</td>
								<td class="py-2.5 pr-5 text-right">
									<a
										href={medalSearchUrl({
											champ: champ.id,
											country: country.code,
											year: meeting.year
										})}
										class="text-sm font-semibold text-brand-ink hover:underline">Details →</a
									>
								</td>
							</tr>
						{/each}
						<tr class="border-t-2 border-ink bg-surface-2">
							<td class="py-3 pl-5 font-bold">Total</td>
							<td class="{CELL} font-bold">{total.gold}</td>
							<td class="{CELL} font-bold">{total.silver}</td>
							<td class="{CELL} font-bold">{total.bronze}</td>
							<td class="{CELL} font-bold">{total.total}</td>
							<td></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
				<a
					href={countryUrl(country.code)}
					class="inline-flex items-center gap-2 text-brand-ink hover:underline"
				>
					<Flag code={country.code} />{country.name} →
				</a>
				<a href={champUrl(champ.slug)} class="text-brand-ink hover:underline">{champ.name} →</a>
			</div>
		{:else}
			<p class="mt-8 rounded-2xl border border-line bg-surface px-6 py-8 text-ink-2">
				{country.name} has no medal at the {champ.name} in the archive.
			</p>
		{/if}
	{/if}
</section>
