<script lang="ts">
	import AthleteName from '#lib/components/athlete/AthleteName.svelte';
	import ResultMark from '#lib/components/medal/ResultMark.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import MedalDisc from '#lib/components/ui/MedalDisc.svelte';
	import RecordBadge from '#lib/components/ui/RecordBadge.svelte';
	import type { IsoDate } from '#lib/domain/date.js';
	import { sharedWind, type EditionEvent, type PodiumLine } from '#lib/domain/edition.js';
	import { DISCIPLINE_LABELS } from '#lib/domain/event.js';
	import { placeName } from '#lib/domain/result.js';
	import { formatWind } from '#lib/format/mark.js';

	let { event, lines, today }: { event: EditionEvent; lines: PodiumLine[]; today: IsoDate } =
		$props();

	const wind = $derived(sharedWind(lines));

	const resultLine = (line: PodiumLine) =>
		[
			placeName(line.place) + ' here',
			event.longName,
			[line.mark, ...line.records].filter(Boolean).join(' ')
		]
			.filter(Boolean)
			.join(' · ');
</script>

<article class="flex flex-col rounded-2xl border border-line bg-surface px-[18px] pt-4 pb-1.5">
	<header class="flex items-center justify-between gap-2.5 border-b border-line pb-2.5">
		<span class="flex min-w-0 flex-col gap-0.5">
			{#if event.discipline}
				<span class="font-data text-[11px] tracking-[0.12em] text-ink-3 uppercase">
					{DISCIPLINE_LABELS[event.discipline]}
				</span>
			{/if}
			<h3 class="font-display text-[28px] leading-none font-bold">{event.longName}</h3>
		</span>
		{#if wind !== null}
			<span
				title="Wind (m/s)"
				class="shrink-0 rounded-md px-2 py-1 font-data text-xs {wind > 2
					? 'bg-brand-soft text-brand-ink'
					: 'bg-surface-2 text-ink-2'}"
			>
				wind {formatWind(wind)}
			</span>
		{/if}
	</header>
	{#each lines as line (line.key)}
		<div
			class="grid grid-cols-[26px_minmax(0,1fr)_auto] items-center gap-3 border-b border-line py-2.5 last:border-b-0"
		>
			<MedalDisc place={line.place} canceled={line.canceled} />
			<span class="flex min-w-0 flex-col gap-0.5">
				<span class="flex min-w-0 items-center gap-[9px]">
					{#if line.country}<Flag code={line.country.code} />{/if}
					{#if line.athlete}
						<AthleteName
							athlete={line.athlete}
							{today}
							result={resultLine(line)}
							class="truncate text-[15px] font-semibold hover:text-brand-ink"
						>
							{line.athleteName}
						</AthleteName>
					{:else}
						<strong class="truncate text-[15px] font-semibold">
							{line.athleteName || line.country?.name}
						</strong>
					{/if}
				</span>
				{#if line.members.length}
					<p class="pl-[29px] text-xs leading-relaxed text-ink-3">
						{#each line.members as member, index (index)}
							<span class="mr-1 inline-block whitespace-nowrap">
								{#if member.athlete}
									<AthleteName
										athlete={member.athlete}
										{today}
										result={resultLine(line)}
										class="text-ink-2 underline decoration-line-2 underline-offset-2 hover:text-brand-ink hover:decoration-brand-ink"
									>
										{member.name}
									</AthleteName>
								{:else}
									{member.name}
								{/if}{#if index < line.members.length - 1}<span aria-hidden="true" class="pl-1"
										>·</span
									>{/if}
							</span>
						{/each}
					</p>
				{:else if line.notes}
					<span class="truncate pl-[29px] text-xs text-ink-3">{line.notes}</span>
				{/if}
			</span>
			<span class="flex items-center gap-2">
				{#each line.records as record (record)}<RecordBadge {record} />{/each}
				<span class="min-w-16 text-right text-[16.5px]">
					<ResultMark result={line} showWind={wind === null} />
				</span>
			</span>
		</div>
	{/each}
	{#if event.note}
		<p class="py-2.5 text-xs text-ink-3">{event.note}</p>
	{/if}
</article>
