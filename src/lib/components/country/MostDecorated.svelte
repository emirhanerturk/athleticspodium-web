<script lang="ts">
	import AthleteName from '#lib/components/athlete/AthleteName.svelte';
	import AthletePortrait from '#lib/components/athlete/AthletePortrait.svelte';
	import { fullName } from '#lib/domain/athlete.js';
	import type { CountryAthlete } from '#lib/domain/country.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { formatEventList } from '#lib/format/event.js';

	let {
		lists,
		allHref,
		countryName,
		today
	}: {
		lists: Record<'all' | 'men' | 'women', CountryAthlete[]>;
		allHref: string;
		countryName: string;
		today: IsoDate;
	} = $props();

	const FILTERS = [
		{ key: 'all', label: 'All' },
		{ key: 'men', label: 'Men' },
		{ key: 'women', label: 'Women' }
	] as const;
	const TALLY = [
		{ key: 'gold', label: 'Gold', fill: 'bg-gold' },
		{ key: 'silver', label: 'Silver', fill: 'bg-silver' },
		{ key: 'bronze', label: 'Bronze', fill: 'bg-bronze' }
	] as const;

	let filter = $state<'all' | 'men' | 'women'>('all');
</script>

<section class="border-y border-line bg-surface">
	<div class="page-container pt-12 pb-14">
		<div class="mb-[22px] flex flex-wrap items-baseline justify-between gap-3">
			<div class="flex flex-wrap items-baseline gap-3.5">
				<h2 class="font-display text-[34px] leading-[0.94] font-bold sm:text-5xl">
					Most decorated
				</h2>
				<span class="text-sm text-ink-3">International medals</span>
			</div>
			<div class="inline-flex rounded-full bg-surface-2 p-[3px]" role="group" aria-label="Gender">
				{#each FILTERS as option (option.key)}
					<button
						type="button"
						aria-pressed={filter === option.key}
						onclick={() => (filter = option.key)}
						class="h-8 rounded-full px-3.5 text-[13.5px] font-bold {filter === option.key
							? 'bg-surface text-ink shadow-[0_1px_3px_rgba(18,19,22,.12)]'
							: 'text-ink-3'}"
					>
						{option.label}
					</button>
				{/each}
			</div>
		</div>
		{#if lists[filter].length}
			<ol class="grid grid-cols-[repeat(auto-fill,minmax(min(380px,100%),1fr))] gap-x-10">
				{#each lists[filter] as { athlete, tally, events }, index (athlete.id)}
					<li
						class="grid grid-cols-[28px_44px_minmax(0,1fr)_auto] items-center gap-3.5 border-b border-line py-3"
					>
						<span class="text-right font-display text-2xl font-bold text-ink-3">{index + 1}</span>
						<AthletePortrait
							image={athlete.image}
							firstName={athlete.firstName}
							lastName={athlete.lastName}
						/>
						<span class="flex min-w-0 flex-col gap-[3px]">
							<AthleteName
								{athlete}
								{today}
								class="truncate text-[15.5px] font-semibold underline decoration-line-2 decoration-dotted underline-offset-4 hover:text-brand-ink"
							>
								{fullName(athlete)}
							</AthleteName>
							<span class="truncate text-[12.5px] text-ink-3">
								{[athlete.men ? 'Men' : 'Women', formatEventList(events, 2)]
									.filter(Boolean)
									.join(' · ')}
							</span>
						</span>
						<span class="flex items-center gap-1.5 font-data text-[14.5px] tabular">
							{#each TALLY as medal (medal.key)}
								<span
									class="inline-flex items-center gap-1 {medal.key === 'gold'
										? 'font-bold'
										: 'text-ink-2'}"
								>
									<span class="size-2.5 rounded-full {medal.fill}" aria-hidden="true"></span>
									<span class="sr-only">{medal.label}</span>
									{tally[medal.key]}
								</span>
							{/each}
						</span>
					</li>
				{/each}
			</ol>
		{:else}
			<p class="text-ink-2">No international medallists in the archive yet.</p>
		{/if}
		<a
			href={allHref}
			class="mt-[18px] inline-block text-sm font-semibold text-brand-ink hover:underline"
		>
			All athletes from {countryName} →
		</a>
	</div>
</section>
