<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import type { DoubleWinner } from '#lib/domain/compare.js';

	let { winners, traced = $bindable() }: { winners: DoubleWinner[]; traced: string | null } =
		$props();
</script>

<div class="flex flex-wrap items-center gap-2.5 rounded-[14px] bg-brand-soft px-[18px] py-3.5">
	<strong class="text-[14.5px]">Won both:</strong>
	{#each winners as winner (winner.key)}
		{@const pressed = traced === winner.key}
		<button
			type="button"
			aria-pressed={pressed}
			onclick={() => (traced = pressed ? null : winner.key)}
			class="inline-flex h-[34px] items-center gap-2 rounded-full border-2 bg-surface px-3 text-sm font-bold {pressed
				? 'border-ink'
				: 'border-transparent hover:border-line-2'}"
		>
			{#if winner.countryCode}<Flag code={winner.countryCode} class="h-[13.5px] w-[18px]" />{/if}
			{winner.name}
			<span class="font-data font-semibold text-ink-3">
				{winner.golds}
				{winner.golds === 1 ? 'gold' : 'golds'}
			</span>
		</button>
	{:else}
		<span class="text-sm text-ink-2">Nobody has won this event at both championships.</span>
	{/each}
	{#if winners.length}
		<span class="text-[13px] text-ink-2">
			Click a name to trace them through both championships.
		</span>
	{/if}
</div>
