<script lang="ts">
	import AthleteName from '#lib/components/athlete/AthleteName.svelte';
	import ResultMark from '#lib/components/medal/ResultMark.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import MedalDisc from '#lib/components/ui/MedalDisc.svelte';
	import { fullName } from '#lib/domain/athlete.js';
	import { markDifference, type CompareYear } from '#lib/domain/compare.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import type { MedalRecord } from '#lib/domain/medal-search.js';
	import { countryUrl, meetingUrl } from '#lib/routing/urls.js';

	let { years, names, today }: { years: CompareYear[]; names: [string, string]; today: IsoDate } =
		$props();

	let open = $state<number[]>([]);

	const toggle = (year: number) =>
		(open = open.includes(year) ? open.filter((item) => item !== year) : [...open, year]);
	const difference = (a?: MedalRecord, b?: MedalRecord) =>
		a && b && !a.canceled && !b.canceled ? markDifference(a.mark, b.mark) : null;
</script>

{#snippet side(row: MedalRecord | undefined)}
	{#if row}
		<td class="border-l border-line px-3 py-2.5"
			><MedalDisc place={row.place} canceled={row.canceled} class="size-6 text-[11px]" /></td
		>
		<td class="px-2 py-2.5">
			{#if row.athlete}
				<AthleteName athlete={row.athlete} {today} class="font-semibold hover:text-brand-ink">
					{row.athleteName ?? fullName(row.athlete)}
				</AthleteName>
			{:else}
				<a
					href={meetingUrl(row.champ.slug, row.meeting.slug)}
					class="font-semibold hover:text-brand-ink"
					>{row.athleteName ?? row.country?.name ?? '–'}</a
				>
			{/if}
		</td>
		<td class="px-2 py-2.5">
			{#if row.country}
				<a
					href={countryUrl(row.country.code)}
					class="inline-flex items-center gap-1.5 font-data font-semibold hover:text-brand-ink"
				>
					<Flag code={row.country.code} />{row.country.code}
				</a>
			{/if}
		</td>
		<td class="px-2 py-2.5"><ResultMark result={row} /></td>
	{:else}
		<td class="border-l border-line px-3 py-2.5 text-ink-3" colspan="4">—</td>
	{/if}
{/snippet}

<div class="overflow-x-auto rounded-[20px] border border-line bg-surface">
	<table class="w-full min-w-[920px] border-collapse text-[14px]">
		<thead>
			<tr class="font-display text-lg font-bold">
				<th
					scope="col"
					rowspan="2"
					class="py-3 pl-5 text-left font-data text-[11px] tracking-[0.1em] text-ink-3 uppercase"
					>Year</th
				>
				<th scope="colgroup" colspan="4" class="border-l border-line px-3 pt-3 text-left"
					>{names[0]}</th
				>
				<th scope="colgroup" colspan="4" class="border-l border-line px-3 pt-3 text-left"
					>{names[1]}</th
				>
				<th
					scope="col"
					rowspan="2"
					class="border-l border-line px-3 py-3 text-right font-data text-[11px] tracking-[0.1em] text-ink-3 uppercase"
					>A − B</th
				>
			</tr>
			<tr class="font-data text-[11px] tracking-[0.1em] text-ink-3 uppercase">
				{#each [0, 1] as group (group)}
					<th scope="col" class="border-l border-line px-3 py-2 text-left font-semibold">Medal</th>
					<th scope="col" class="px-2 py-2 text-left font-semibold">Athlete</th>
					<th scope="col" class="px-2 py-2 text-left font-semibold">Country</th>
					<th scope="col" class="px-2 py-2 text-left font-semibold">Mark</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each years as { year, a, b } (year)}
				{@const goldA = a.find((row) => row.place === 1)}
				{@const goldB = b.find((row) => row.place === 1)}
				{@const others = Math.max(
					a.filter((row) => row !== goldA).length,
					b.filter((row) => row !== goldB).length
				)}
				{@const value = difference(goldA, goldB)}
				<tr class="border-t border-line">
					<td class="py-2.5 pl-5 font-data font-bold">
						{#if others}
							<button
								type="button"
								aria-expanded={open.includes(year)}
								onclick={() => toggle(year)}
								class="inline-flex items-center gap-1 hover:text-brand-ink"
							>
								{year}<span aria-hidden="true" class="text-ink-3"
									>{open.includes(year) ? '▾' : '▸'}</span
								>
							</button>
						{:else}
							{year}
						{/if}
					</td>
					{@render side(goldA)}
					{@render side(goldB)}
					<td class="border-l border-line px-3 py-2.5 text-right font-data font-semibold text-ink-2"
						>{value ?? ''}</td
					>
				</tr>
				{#if open.includes(year)}
					{@const restA = a.filter((row) => row !== goldA)}
					{@const restB = b.filter((row) => row !== goldB)}
					{#each Array.from({ length: others }, (_, index) => index) as index (index)}
						{@const extra = difference(restA[index], restB[index])}
						<tr class="bg-surface-2/60">
							<td class="py-2 pl-5"></td>
							{@render side(restA[index])}
							{@render side(restB[index])}
							<td class="border-l border-line px-3 py-2 text-right font-data text-ink-2"
								>{extra ?? ''}</td
							>
						</tr>
					{/each}
				{/if}
			{/each}
		</tbody>
	</table>
</div>
