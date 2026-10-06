<script lang="ts">
	import AthleteName from '#lib/components/athlete/AthleteName.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import { fullName } from '#lib/domain/athlete.js';
	import type { ChampionshipLeader } from '#lib/domain/championship.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { formatYearSpan } from '#lib/format/date.js';
	import { formatEventList } from '#lib/format/event.js';

	let { leaders, today }: { leaders: ChampionshipLeader[]; today: IsoDate } = $props();

	const TALLY = [
		{ key: 'gold', label: 'Gold', fill: 'bg-gold' },
		{ key: 'silver', label: 'Silver', fill: 'bg-silver' },
		{ key: 'bronze', label: 'Bronze', fill: 'bg-bronze' }
	] as const;
</script>

<div>
	<h2 class="mb-3.5 font-display text-[34px] leading-[0.94] font-bold sm:text-[40px]">
		Most golds
	</h2>
	<ol>
		{#each leaders as leader, index (leader.athlete.id)}
			<li
				class="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 border-t border-line py-[11px]"
			>
				<span class="font-data text-[13.5px] text-ink-3">{index + 1}</span>
				<span class="flex min-w-0 flex-col gap-[3px]">
					<span class="flex min-w-0 items-center gap-[9px]">
						{#if leader.athlete.countryCode}<Flag code={leader.athlete.countryCode} />{/if}
						<AthleteName
							athlete={leader.athlete}
							{today}
							class="truncate text-[15px] font-semibold hover:text-brand-ink"
						>
							{fullName(leader.athlete)}
						</AthleteName>
					</span>
					<span class="truncate pl-[29px] text-[12.5px] text-ink-3">
						{formatEventList(leader.events)} ·
						<span class="font-data">{formatYearSpan(leader.firstYear, leader.lastYear)}</span>
					</span>
				</span>
				<span class="flex gap-2.5 font-data text-[14.5px] tabular">
					{#each TALLY as medal (medal.key)}
						<span
							class="inline-flex items-center gap-[5px] {medal.key === 'gold' ? 'font-bold' : ''}"
						>
							<span class="size-2.5 rounded-full {medal.fill}" aria-hidden="true"></span>
							<span class="sr-only">{medal.label}</span>
							{leader.tally[medal.key]}
						</span>
					{/each}
				</span>
			</li>
		{/each}
	</ol>
</div>
