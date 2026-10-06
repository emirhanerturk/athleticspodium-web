<script lang="ts">
	import RecordBadge from '#lib/components/ui/RecordBadge.svelte';
	import { fullName } from '#lib/domain/athlete.js';
	import { GENDER_LABELS, recordSummary, type RecordMark } from '#lib/domain/edition.js';
	import { athleteUrl } from '#lib/routing/urls.js';

	let { marks }: { marks: RecordMark[] } = $props();
</script>

<div>
	<div class="mb-3.5 flex items-baseline justify-between gap-3">
		<h2 class="font-display text-[34px] leading-[0.94] font-bold sm:text-[40px]">Records set</h2>
		<span class="font-data text-[13.5px] text-ink-3">{recordSummary(marks)}</span>
	</div>
	<ul class="flex flex-col">
		{#each marks as { record, event, line }, index (index)}
			<li
				class="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 border-t border-line py-2.5"
			>
				<span class="justify-self-start"><RecordBadge {record} /></span>
				<span class="flex min-w-0 flex-col gap-0.5">
					{#if line.athlete}
						<a
							href={athleteUrl(line.athlete)}
							class="truncate text-[14.5px] font-semibold hover:text-brand-ink"
						>
							{fullName(line.athlete)}
						</a>
					{:else}
						<strong class="truncate text-[14.5px] font-semibold">
							{line.athleteName || line.country?.name}
						</strong>
					{/if}
					<span class="text-[12.5px] text-ink-3"
						>{event.longName} · {GENDER_LABELS[event.gender]}</span
					>
				</span>
				<span class="font-data text-[15.5px] font-bold tabular">{line.mark}</span>
			</li>
		{/each}
	</ul>
</div>
