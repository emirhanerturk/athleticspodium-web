<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import MedalDisc from '#lib/components/ui/MedalDisc.svelte';
	import type { EditionRef } from '#lib/domain/championship.js';
	import {
		medallistName,
		medalWhat,
		standingsAround,
		type MedalEntry,
		type NationStanding
	} from '#lib/domain/countdown.js';
	import { formatOrdinal } from '#lib/format/number.js';
	import { champUrl, medalCountdownUrl, meetingUrl } from '#lib/routing/urls.js';

	let {
		champ,
		countryCode,
		standings,
		withdrawn,
		next,
		nextOrdinal
	}: {
		champ: { id: number; slug: string; name: string };
		countryCode: string;
		standings: NationStanding[];
		withdrawn: MedalEntry[];
		next: EditionRef | null;
		nextOrdinal: number;
	} = $props();

	const around = $derived(standingsAround(standings, countryCode));
</script>

<aside class="flex flex-col gap-4 md:sticky md:top-6">
	{#if around.length}
		<section class="rounded-[18px] border border-line bg-surface px-5 py-[18px]">
			<div class="mb-2 flex items-baseline justify-between gap-2">
				<h2 class="text-[14.5px] font-bold">All-time medal table</h2>
				<span class="text-xs text-ink-3">by golds · {standings.length} nations</span>
			</div>
			<ol>
				{#each around as nation (nation.country.code)}
					{@const current = nation.country.code === countryCode}
					<li>
						<a
							href={medalCountdownUrl(nation.country.code, champ.id)}
							aria-current={current ? 'page' : undefined}
							class="-mx-2 grid grid-cols-[26px_22px_minmax(0,1fr)_auto] items-center gap-2 rounded-lg px-2 py-[7px] hover:bg-surface-2 {current
								? 'bg-brand-soft font-bold'
								: ''}"
						>
							<span class="font-data text-[13px] text-ink-3">{nation.rank}</span>
							<Flag code={nation.country.code} />
							<span class="truncate text-[13.5px]">{nation.country.name}</span>
							<span class="font-data text-[13px]">
								<strong>{nation.gold}</strong> · {nation.silver} · {nation.bronze}
							</span>
						</a>
					</li>
				{/each}
			</ol>
			<a
				href="{champUrl(champ.slug)}#medal-table"
				class="mt-2.5 block text-[13.5px] font-bold text-brand-ink hover:underline"
			>
				Full medal table →
			</a>
		</section>
	{/if}
	{#if withdrawn.length}
		<section class="flex flex-col gap-2 rounded-[18px] border border-dq/25 bg-dq/5 px-5 py-[18px]">
			<h2 class="text-[14.5px] font-bold">Withdrawn medals</h2>
			<ul class="flex flex-col gap-2">
				{#each withdrawn as entry (entry[0].id)}
					{@const [record] = entry}
					<li class="grid grid-cols-[26px_minmax(0,1fr)] items-center gap-2.5 text-[13px]">
						<MedalDisc place={record.place} canceled class="size-6 text-[10px]" />
						<span>
							<strong>{medallistName(entry)}</strong> · {medalWhat(record)}, {record.meeting.year}
						</span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
	{#if next}
		<a
			href={meetingUrl(champ.slug, next.slug)}
			class="flex flex-col gap-1.5 rounded-[18px] bg-ink px-5 py-[18px] text-night-ink hover:ring-2 hover:ring-brand"
		>
			<span class="font-data text-xs tracking-[0.14em] text-night-up uppercase">Next edition</span>
			<strong class="font-display text-[30px] leading-none font-bold">
				{next.city ?? next.name}
				{next.year}
			</strong>
			<span class="text-[13px] text-night-ink-3">The {formatOrdinal(nextOrdinal)} {champ.name}</span
			>
		</a>
	{/if}
</aside>
