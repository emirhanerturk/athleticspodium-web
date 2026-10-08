<script lang="ts">
	import AthleteName from '#lib/components/athlete/AthleteName.svelte';
	import ResultMark from '#lib/components/medal/ResultMark.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import MedalDisc from '#lib/components/ui/MedalDisc.svelte';
	import RecordBadge from '#lib/components/ui/RecordBadge.svelte';
	import { winnerOf, type CompareYear } from '#lib/domain/compare.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import type { MarkKind } from '#lib/domain/event.js';
	import type { FilterChamp, MedalRecord } from '#lib/domain/medal-search.js';
	import { countryUrl } from '#lib/routing/urls.js';

	let {
		years,
		champs,
		kind,
		traced,
		today
	}: {
		years: CompareYear[];
		champs: [FilterChamp, FilterChamp];
		kind: MarkKind;
		traced: string | null;
		today: IsoDate;
	} = $props();

	const TENTHS = /\.\d$/;

	const records = $derived(years.flatMap((year) => [...year.a, ...year.b]));
	const handTimed = $derived(
		kind === 'time' && records.some((record) => TENTHS.test(record.mark ?? ''))
	);
	const withdrawn = $derived(records.some((record) => record.canceled));
	const isTraced = (record: MedalRecord) => traced !== null && winnerOf(record).key === traced;
</script>

{#snippet who(record: MedalRecord)}
	<span class={record.canceled ? 'line-through decoration-dq' : ''}>
		{#if record.isTeam && record.country}
			<a href={countryUrl(record.country.code)} class="hover:text-brand-ink">
				{record.country.name}
			</a>
		{:else if record.athlete}
			<AthleteName athlete={record.athlete} {today} class="hover:text-brand-ink">
				{winnerOf(record).name}
			</AthleteName>
		{:else}
			{record.athleteName ?? '–'}
		{/if}
	</span>
{/snippet}

{#snippet extras(record: MedalRecord)}
	{#if record.country}
		<Flag code={record.country.code} class="inline-block h-[13.5px] w-[18px] align-[-1px]" />
	{/if}
	{#each record.records as mark (mark)}
		<span class="align-[1px]"><RecordBadge record={mark} /></span>
	{/each}
{/snippet}

{#snippet entry(record: MedalRecord, mirrored: boolean)}
	{@const gold = record.place === 1 && !record.canceled}
	<li
		class="flex items-center gap-2 rounded-lg px-1.5 py-0.5 sm:gap-2.5 {mirrored
			? '-mr-1.5 flex-row-reverse text-right'
			: '-ml-1.5'} {isTraced(record) ? 'bg-brand-soft' : ''} {gold
			? 'text-[15px] font-bold text-ink sm:text-base'
			: `text-[13px] font-medium sm:text-[13.5px] ${record.canceled ? 'text-ink-3' : 'text-ink-2'}`}"
	>
		<MedalDisc
			place={record.place}
			canceled={record.canceled}
			class="{gold ? 'size-[22px]' : 'size-[18px]'} text-[10.5px]"
		/>
		<span
			class="flex min-w-0 flex-wrap items-center gap-x-2.5 {mirrored
				? 'flex-row-reverse justify-start'
				: ''}"
		>
			<ResultMark result={record} showWind={false} />
			<span class="min-w-0 leading-snug">
				{#if mirrored}
					{@render extras(record)}
					{@render who(record)}
				{:else}
					{@render who(record)}
					{@render extras(record)}
				{/if}
			</span>
		</span>
	</li>
{/snippet}

{#snippet podium(year: number, records: MedalRecord[], mirrored: boolean, champ: FilterChamp)}
	{#if records.length}
		<ul class="flex flex-col gap-1 {mirrored ? 'items-end' : 'items-start'}">
			{#each records as record (record.id)}{@render entry(record, mirrored)}{/each}
		</ul>
	{:else}
		<span class="block pt-1 text-[13px] text-ink-3">
			{champ.years.includes(year) ? 'not held' : 'no edition'}
		</span>
	{/if}
{/snippet}

<table class="w-full table-fixed border-separate border-spacing-0">
	<caption class="sr-only">{champs[0].name} and {champs[1].name}, podiums by year</caption>
	<colgroup>
		<col />
		<col class="w-[52px] sm:w-[84px]" />
		<col />
	</colgroup>
	<thead>
		<tr class="font-display text-lg leading-none font-bold sm:text-[26px]">
			<th
				scope="col"
				class="sticky top-0 z-[4] border-b-2 border-ink bg-bg py-2.5 pr-3 text-right sm:pr-[18px]"
			>
				<span aria-hidden="true" class="mr-2 inline-block size-3 rounded-[3px] bg-brand"></span>
				{champs[0].name}
			</th>
			<th
				scope="col"
				class="sticky top-0 z-[4] border-b-2 border-ink bg-bg py-2.5 text-center font-data text-xs font-normal tracking-[0.12em] text-ink-3 uppercase"
			>
				Year
			</th>
			<th
				scope="col"
				class="sticky top-0 z-[4] border-b-2 border-ink bg-bg py-2.5 pl-3 text-left sm:pl-[18px]"
			>
				<span aria-hidden="true" class="mr-2 inline-block size-3 rounded-[3px] bg-ink"></span>
				{champs[1].name}
			</th>
		</tr>
	</thead>
	<tbody>
		{#each years as { year, a, b } (year)}
			{@const highlighted = [...a, ...b].some(isTraced)}
			<tr>
				<td class="border-b border-line py-3 pr-2.5 text-right align-top sm:pr-[18px]">
					{@render podium(year, a, true, champs[0])}
				</td>
				<th
					scope="row"
					class="border-x border-b border-line font-display text-lg leading-none font-bold sm:text-[26px] {highlighted
						? 'bg-brand text-ink'
						: 'bg-surface'}"
				>
					{year}
				</th>
				<td class="border-b border-line py-3 pl-2.5 align-top sm:pl-[18px]">
					{@render podium(year, b, false, champs[1])}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
{#if handTimed || withdrawn}
	<p class="mt-[18px] text-[13px] text-ink-3">
		{#if handTimed}Marks given to a tenth of a second were hand-timed.{/if}
		{#if withdrawn}Struck-through rows in red are results annulled for doping; the medal was
			withdrawn.{/if}
	</p>
{/if}
