<script lang="ts">
	import QuickSearchBox from '#lib/components/search/QuickSearchBox.svelte';
	import { formatCount } from '#lib/format/number.js';

	let { athleteCount }: { athleteCount: number | null } = $props();
</script>

<section class="border-b border-line bg-surface">
	<div
		class="mx-auto flex max-w-[1040px] flex-col items-center gap-[18px] px-4 pt-16 pb-[72px] text-center sm:px-8"
	>
		{#if athleteCount}
			<span class="font-data text-xs tracking-[0.16em] text-ink-3 uppercase">
				{formatCount(athleteCount)} medallists & finalists
			</span>
		{/if}
		<h1 class="font-display text-[56px] leading-[0.94] font-bold sm:text-[104px]">
			Find an athlete
		</h1>
		<p class="text-lg text-ink-2">Search by name, former name or nation.</p>
		<div class="mt-2.5 w-full max-w-[760px]">
			<QuickSearchBox
				variant="hero"
				label="Search athletes"
				placeholder="e.g. Mahuchikh, Bolt, Kipchoge"
			/>
		</div>
	</div>
</section>
