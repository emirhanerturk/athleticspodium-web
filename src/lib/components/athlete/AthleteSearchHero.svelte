<script lang="ts">
	import SearchIcon from '#lib/components/ui/icons/SearchIcon.svelte';
	import { formatCount } from '#lib/format/number.js';
	import { PAGES } from '#lib/routing/urls.js';

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
		<form action={PAGES.search} method="get" role="search" class="mt-2.5 w-full max-w-[760px]">
			<input type="hidden" name="type" value="athletes" />
			<label
				class="flex h-[68px] items-center gap-3.5 rounded-[18px] border-2 border-ink bg-bg px-5 text-ink-3"
			>
				<SearchIcon class="size-6" />
				<input
					type="search"
					name="q"
					required
					minlength="2"
					aria-label="Search athletes"
					placeholder="e.g. Mahuchikh, Bolt, Kipchoge"
					class="min-w-0 flex-1 bg-transparent text-[22px] font-medium text-ink outline-none"
				/>
				<button
					type="submit"
					class="h-11 rounded-full bg-ink px-5 text-[14.5px] font-bold text-bg hover:opacity-90"
				>
					Search
				</button>
			</label>
		</form>
	</div>
</section>
