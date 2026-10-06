<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import { fullName } from '#lib/domain/athlete.js';
	import type { CountryAthlete } from '#lib/domain/country.js';
	import { athleteUrl } from '#lib/routing/urls.js';

	let { nations }: { nations: { code: string; name: string; athletes: CountryAthlete[] }[] } =
		$props();

	const BAR_HEIGHT = 44;
	const BARS = [
		{ key: 'gold', label: 'Gold', fill: 'bg-gold' },
		{ key: 'silver', label: 'Silver', fill: 'bg-silver' },
		{ key: 'bronze', label: 'Bronze', fill: 'bg-bronze' }
	] as const;

	let selected = $state(0);

	const current = $derived(nations[selected]);
	const most = $derived(
		Math.max(
			1,
			...current.athletes.flatMap(({ tally }) => [tally.gold, tally.silver, tally.bronze])
		)
	);
</script>

<div class="mb-4 flex flex-wrap items-baseline justify-between gap-3">
	<div class="flex flex-col gap-1">
		<h2 class="font-display text-[34px] leading-[0.94] font-bold sm:text-[44px]">
			Greatest by nation
		</h2>
		<span class="text-[13px] text-ink-3">International medals</span>
	</div>
	<div class="flex flex-wrap gap-2" role="group" aria-label="Nation">
		{#each nations as nation, index (nation.code)}
			<button
				type="button"
				aria-pressed={selected === index}
				onclick={() => (selected = index)}
				class="inline-flex h-[38px] items-center gap-2 rounded-full border pr-3 pl-2.5 text-[13.5px] font-semibold hover:border-ink {selected ===
				index
					? 'border-ink bg-ink text-night-ink'
					: 'border-line-2 bg-surface text-ink-2'}"
			>
				<Flag code={nation.code} class="h-[13.5px] w-[18px]" />{nation.name}
			</button>
		{/each}
	</div>
</div>
<ol class="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3">
	{#each current.athletes as { athlete, tally }, index (athlete.id)}
		<li>
			<a
				href={athleteUrl(athlete)}
				class="flex h-full flex-col gap-3 rounded-2xl border border-line bg-surface p-[18px] hover:border-ink"
			>
				<span class="flex items-center justify-between">
					<span class="font-display text-[40px] leading-[0.9] font-bold text-ink-3"
						>{index + 1}</span
					>
					{#if athlete.olympicChampion}
						<span
							title="Olympic champion"
							class="rounded bg-brand px-1.5 py-0.5 font-data text-[10.5px] font-bold text-ink"
							>OG</span
						>
					{/if}
				</span>
				<strong class="text-[17px] leading-tight font-bold">{fullName(athlete)}</strong>
				<span class="mt-auto flex h-11 items-end gap-1">
					{#each BARS as bar (bar.key)}
						<span
							title={bar.label}
							class="w-[22px] rounded-t {bar.fill}"
							style:height="{Math.max(3, Math.round((tally[bar.key] / most) * BAR_HEIGHT))}px"
						></span>
					{/each}
					<span class="ml-auto font-data text-[13.5px] text-ink-2">
						{tally.gold} · {tally.silver} · {tally.bronze}
					</span>
				</span>
			</a>
		</li>
	{/each}
</ol>
