<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import type { NationTally } from '#lib/domain/edition.js';
	import { countryUrl } from '#lib/routing/urls.js';

	let {
		nations,
		medals,
		title = 'Medal table'
	}: { nations: NationTally[]; medals?: number; title?: string } = $props();

	const COLLAPSED_ROWS = 12;

	let expanded = $state(false);

	const leader = $derived(Math.max(1, ...nations.map((nation) => nation.total)));
	const share = (part: number, whole: number) => `${Math.round((part / whole) * 100)}%`;
</script>

<div>
	<div class="mb-3.5 flex items-baseline justify-between gap-3">
		<h2 class="font-display text-[34px] leading-[0.94] font-bold sm:text-[40px]">{title}</h2>
		<span class="font-data text-[13.5px] text-ink-3">
			{nations.length} nations{#if medals !== undefined}&nbsp;· {medals} medals{/if}
		</span>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full min-w-[480px] border-collapse text-[14.5px]">
			<thead>
				<tr class="font-data text-[11px] tracking-[0.1em] text-ink-3 uppercase">
					<th scope="col" class="w-9 py-2 text-left font-semibold">#</th>
					<th scope="col" class="py-2 text-left font-semibold">Nation</th>
					<th scope="col" class="w-[52px] py-2"
						><span title="Gold" class="inline-block size-3 rounded-full bg-gold"></span></th
					>
					<th scope="col" class="w-[52px] py-2"
						><span title="Silver" class="inline-block size-3 rounded-full bg-silver"></span></th
					>
					<th scope="col" class="w-[52px] py-2"
						><span title="Bronze" class="inline-block size-3 rounded-full bg-bronze"></span></th
					>
					<th scope="col" class="w-14 py-2 text-right font-semibold">Total</th>
					<th scope="col" class="hidden w-[30%] py-2 pl-[18px] sm:table-cell"
						><span class="sr-only">Share</span></th
					>
				</tr>
			</thead>
			<tbody class="font-data tabular">
				{#each nations as nation, index (nation.country.code)}
					<tr class="border-t border-line {expanded || index < COLLAPSED_ROWS ? '' : 'hidden'}">
						<td class="py-[11px] text-[13.5px] text-ink-3">{index + 1}</td>
						<td class="py-[11px] font-text">
							<a
								href={countryUrl(nation.country.code)}
								class="inline-flex items-center gap-2.5 font-semibold hover:text-brand-ink"
							>
								<Flag code={nation.country.code} class="h-[16.5px] w-[22px]" />
								{nation.country.name}
								<span class="font-data text-xs font-medium text-ink-3">{nation.country.code}</span>
							</a>
						</td>
						<td class="py-[11px] text-center font-bold">{nation.gold}</td>
						<td class="py-[11px] text-center">{nation.silver}</td>
						<td class="py-[11px] text-center">{nation.bronze}</td>
						<td class="py-[11px] text-right font-bold">{nation.total}</td>
						<td class="hidden py-[11px] pl-[18px] sm:table-cell">
							<span
								class="flex h-2.5 overflow-hidden rounded-full bg-surface-2"
								style:width={share(nation.total, leader)}
							>
								<span class="bg-gold" style:width={share(nation.gold, nation.total)}></span>
								<span class="bg-silver" style:width={share(nation.silver, nation.total)}></span>
								<span class="bg-bronze" style:width={share(nation.bronze, nation.total)}></span>
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	{#if nations.length > COLLAPSED_ROWS}
		<button
			type="button"
			aria-expanded={expanded}
			onclick={() => (expanded = !expanded)}
			class="mt-3.5 h-11 rounded-full border-[1.5px] border-ink px-[18px] text-sm font-semibold hover:bg-surface-2"
		>
			{expanded ? 'Show fewer nations' : `Show all ${nations.length} nations`}
		</button>
	{/if}
</div>
