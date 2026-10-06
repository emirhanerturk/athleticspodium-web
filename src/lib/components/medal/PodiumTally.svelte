<script lang="ts">
	import type { MedalTally } from '#lib/domain/result.js';

	let { tally }: { tally: MedalTally } = $props();

	const steps = $derived([
		{ place: 2, count: tally.silver, bar: 'h-[58px] bg-silver', number: 'text-[40px]' },
		{ place: 1, count: tally.gold, bar: 'h-[86px] bg-gold', number: 'text-[64px]' },
		{ place: 3, count: tally.bronze, bar: 'h-[42px] bg-bronze', number: 'text-[40px]' }
	]);
</script>

<div
	class="flex items-end gap-2.5"
	aria-label="{tally.gold} gold, {tally.silver} silver, {tally.bronze} bronze"
	role="img"
>
	{#each steps as step (step.place)}
		<div class="flex flex-col items-center gap-2">
			<span class="font-display leading-none font-bold {step.number}">{step.count}</span>
			<span
				class="{step.bar} grid w-[84px] place-items-center rounded-t-[10px] font-data font-bold text-ink"
			>
				{step.place}
			</span>
		</div>
	{/each}
</div>
