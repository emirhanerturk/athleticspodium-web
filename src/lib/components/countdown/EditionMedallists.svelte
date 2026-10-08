<script lang="ts" module>
	import type { MedalRecord } from '#lib/domain/medal-search.js';

	const medallists: Record<string, Promise<MedalRecord[] | null>> = {};

	function loadMedallists(url: string): Promise<MedalRecord[] | null> {
		medallists[url] ??= fetch(url)
			.then((response) => (response.ok ? response.json() : null))
			.catch(() => null);
		return medallists[url];
	}
</script>

<script lang="ts">
	import AthleteName from '#lib/components/athlete/AthleteName.svelte';
	import ResultMark from '#lib/components/medal/ResultMark.svelte';
	import MedalDisc from '#lib/components/ui/MedalDisc.svelte';
	import RecordBadge from '#lib/components/ui/RecordBadge.svelte';
	import { fullName } from '#lib/domain/athlete.js';
	import { medalEntries } from '#lib/domain/countdown.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { GENDER_LABELS } from '#lib/domain/edition.js';
	import { describeEvent } from '#lib/domain/event.js';

	let { url, details, today }: { url: string; details: string; today: IsoDate } = $props();

	const medals = $derived(loadMedallists(url));
</script>

{#snippet person(record: MedalRecord)}
	{#if record.athlete}
		<AthleteName
			athlete={record.athlete}
			{today}
			class="underline decoration-line-2 decoration-dotted underline-offset-4 hover:text-brand-ink"
		>
			{record.athleteName ?? fullName(record.athlete)}
		</AthleteName>
	{:else}
		{record.athleteName ?? '–'}
	{/if}
{/snippet}

{#await medals}
	<p class="py-3 text-sm text-ink-3">Loading the medallists…</p>
{:then rows}
	{#if rows?.length}
		<ul class="overflow-hidden rounded-[14px] border border-line bg-bg">
			{#each medalEntries(rows) as team (team[0].id)}
				{@const record = team[0]}
				<li
					class="grid grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5 border-t border-line px-3.5 py-[9px] first:border-t-0 sm:grid-cols-[30px_150px_minmax(0,1fr)_100px_70px] {record.canceled
						? 'bg-dq/5'
						: ''}"
				>
					<MedalDisc
						place={record.place}
						canceled={record.canceled}
						class="size-[26px] text-[11px] max-sm:row-span-2"
					/>
					<span class="flex flex-col max-sm:col-start-2 max-sm:row-start-2">
						<strong class="text-[13.5px] font-semibold">
							{describeEvent(record.event).longName}
						</strong>
						<span class="text-[11.5px] text-ink-3">{GENDER_LABELS[record.gender]}</span>
					</span>
					<span
						class="flex min-w-0 flex-col max-sm:col-start-2 max-sm:row-start-1 {record.canceled
							? 'text-ink-3'
							: ''}"
					>
						<span class="text-sm font-semibold">
							{#if team.length > 1}
								{#each team as member, index (member.id)}
									{@render person(member)}{#if index < team.length - 1}<span
											aria-hidden="true"
											class="px-1 text-ink-3">·</span
										>{/if}
								{/each}
							{:else}
								{@render person(record)}
							{/if}
						</span>
						{#if record.canceled}
							<span class="text-[11.5px] text-ink-3">Disqualified · medal withdrawn</span>
						{:else if team.length > 1}
							<span class="text-[11.5px] text-ink-3">Team</span>
						{/if}
					</span>
					<span class="text-right max-sm:col-start-3 max-sm:row-start-1">
						<ResultMark result={record} showWind={false} />
					</span>
					<span class="flex justify-end gap-[3px] max-sm:col-start-3 max-sm:row-start-2">
						{#each record.records as mark (mark)}<RecordBadge record={mark} />{/each}
					</span>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="py-3 text-sm text-ink-2">
			The medallists could not be loaded.
			<a href={details} class="font-semibold text-brand-ink hover:underline"
				>See them in the medal search →</a
			>
		</p>
	{/if}
{/await}
