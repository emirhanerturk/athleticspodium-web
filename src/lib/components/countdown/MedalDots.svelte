<script lang="ts">
	import { DOT_LIMIT } from '#lib/domain/countdown.js';
	import type { MedalTally } from '#lib/domain/result.js';

	let {
		tally,
		most,
		vertical = false
	}: { tally: MedalTally; most: number; vertical?: boolean } = $props();

	const TOP_DOWN = [
		{ key: 'gold', fill: 'bg-gold' },
		{ key: 'silver', fill: 'bg-silver' },
		{ key: 'bronze', fill: 'bg-bronze' }
	] as const;

	const medals = $derived(vertical ? TOP_DOWN.toReversed() : TOP_DOWN);
	const dots = $derived(
		medals.flatMap((medal) => Array.from({ length: tally[medal.key] }, () => medal.fill))
	);
	const share = (count: number) => `${(count / most) * 100}%`;
</script>

{#if most <= DOT_LIMIT}
	{#each dots as fill, index (index)}
		<span class="shrink-0 rounded-full {vertical ? 'size-[13px]' : 'size-3'} {fill}"></span>
	{/each}
{:else}
	<span class="flex gap-px {vertical ? 'h-[170px] w-[13px] flex-col justify-end' : 'h-3 w-full'}">
		{#each medals as medal (medal.key)}
			{#if tally[medal.key]}
				<span
					class="rounded-[3px] {medal.fill} {vertical ? 'w-full' : 'h-full'}"
					style:height={vertical ? share(tally[medal.key]) : undefined}
					style:width={vertical ? undefined : share(tally[medal.key])}
				></span>
			{/if}
		{/each}
	</span>
{/if}
