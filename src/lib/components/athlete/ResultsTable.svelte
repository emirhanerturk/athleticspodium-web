<script lang="ts">
	import MedalDisc from '#lib/components/ui/MedalDisc.svelte';
	import RecordBadge from '#lib/components/ui/RecordBadge.svelte';
	import { levelCounts } from '#lib/domain/career.js';
	import { LEVEL_LABELS, levelOf, type Level } from '#lib/domain/championship.js';
	import type { Result } from '#lib/domain/result.js';
	import { champUrl, meetingUrl } from '#lib/routing/urls.js';
	import ResultMark from '#lib/components/medal/ResultMark.svelte';

	let {
		id,
		title,
		results,
		showEvent,
		filterable = false,
		class: className = 'pt-10'
	}: {
		id: string;
		title: string;
		results: Result[];
		showEvent: boolean;
		filterable?: boolean;
		class?: string;
	} = $props();

	let level = $state<Level | 'all'>('all');

	const levels = $derived(levelCounts(results));
	const rows = $derived(
		level === 'all' ? results : results.filter((result) => levelOf(result.champ.category) === level)
	);

	const chip = (active: boolean) =>
		`h-9 rounded-full border px-3.5 text-[13.5px] font-semibold ${
			active
				? 'border-brand bg-brand text-ink'
				: 'border-line-2 bg-surface text-ink-2 hover:border-ink'
		}`;
</script>

<section {id} class="page-container scroll-mt-4 pb-6 {className}">
	<div class="mb-4 flex flex-wrap items-center justify-between gap-4">
		<h2 class="font-display text-[34px] leading-[0.94] font-bold sm:text-[40px]">
			{title}
			<span class="font-data text-lg font-medium text-ink-3">{results.length}</span>
		</h2>
		{#if filterable}
			<div class="flex flex-wrap items-center gap-2">
				<button
					type="button"
					aria-pressed={level === 'all'}
					class={chip(level === 'all')}
					onclick={() => (level = 'all')}
				>
					All
				</button>
				{#if levels.length > 1}
					{#each levels as item (item.level)}
						<button
							type="button"
							aria-pressed={level === item.level}
							class={chip(level === item.level)}
							onclick={() => (level = item.level)}
						>
							{LEVEL_LABELS[item.level]}
							<span class="font-data opacity-85">{item.count}</span>
						</button>
					{/each}
				{/if}
			</div>
		{/if}
	</div>

	<div class="overflow-x-auto rounded-2xl border border-line bg-surface">
		<table class="w-full min-w-[880px] border-collapse text-[14.5px]">
			<thead>
				<tr class="bg-surface-2 font-data text-[11px] tracking-[0.1em] text-ink-3 uppercase">
					<th scope="col" class="w-16 px-4 py-[11px] text-left font-semibold">Year</th>
					<th scope="col" class="px-2 py-[11px] text-left font-semibold">Championship</th>
					{#if showEvent}
						<th scope="col" class="px-2 py-[11px] text-left font-semibold">Event</th>
					{/if}
					<th scope="col" class="px-2 py-[11px] text-left font-semibold">Venue</th>
					<th scope="col" class="w-16 px-2 py-[11px] font-semibold">Place</th>
					<th scope="col" class="w-28 px-2 py-[11px] text-right font-semibold">Mark</th>
					<th scope="col" class="w-24 px-2 py-[11px] text-left font-semibold">Record</th>
					<th scope="col" class="py-[11px] pr-4 pl-2 text-left font-semibold">Notes</th>
				</tr>
			</thead>
			<tbody>
				{#each rows as result (result.id)}
					<tr class="border-t border-line">
						<td class="px-4 py-[11px] font-data font-semibold">
							<a
								href={meetingUrl(result.champ.slug, result.meeting.slug)}
								class="hover:text-brand-ink"
							>
								{result.meeting.year}
							</a>
						</td>
						<td class="px-2 py-[11px]">
							<a href={champUrl(result.champ.slug)} class="font-semibold hover:text-brand-ink">
								{result.champ.name}
							</a>
						</td>
						{#if showEvent}
							<td class="px-2 py-[11px] text-ink-2">{result.event.name}</td>
						{/if}
						<td class="px-2 py-[11px] text-ink-2">{result.meeting.city ?? ''}</td>
						<td class="px-2 py-[11px] text-center">
							<MedalDisc place={result.place} canceled={result.canceled} />
						</td>
						<td class="px-2 py-[11px] text-right text-[15.5px]"><ResultMark {result} /></td>
						<td class="px-2 py-[11px]">
							<span class="flex flex-wrap gap-1">
								{#each result.records as record (record)}<RecordBadge {record} />{/each}
							</span>
						</td>
						<td class="py-[11px] pr-4 pl-2 text-[13px] text-ink-3">{result.notes ?? ''}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
