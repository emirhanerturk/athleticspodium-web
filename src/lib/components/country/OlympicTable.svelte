<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import type { NationTally } from '#lib/domain/edition.js';
	import { champUrl, countryUrl } from '#lib/routing/urls.js';

	let { nations, limit = 10 }: { nations: NationTally[]; limit?: number } = $props();

	const top = $derived(nations.slice(0, limit));
	const leader = $derived(Math.max(1, ...top.map((nation) => nation.total)));
</script>

<div class="rounded-[20px] bg-ink px-[22px] pt-[22px] pb-[18px] text-night-ink">
	<h2 class="mb-1 font-display text-[28px] leading-none font-bold">Olympic table</h2>
	<span class="mb-3.5 block text-[13px] text-night-ink-3">
		All-time athletics medals at the Olympic Games
	</span>
	<ol>
		{#each top as nation, index (nation.country.code)}
			<li class="border-t border-night-line">
				<a
					href={countryUrl(nation.country.code)}
					class="grid grid-cols-[20px_24px_minmax(0,1fr)_auto] items-center gap-2.5 py-[7px] hover:text-brand"
				>
					<span class="font-data text-[13px] text-night-ink-4">{index + 1}</span>
					<Flag code={nation.country.code} class="h-[18px] w-6" />
					<span class="flex min-w-0 flex-col gap-1">
						<span class="truncate text-[13.5px] font-semibold">{nation.country.name}</span>
						<span
							class="flex h-1 overflow-hidden rounded-sm"
							style:width="{Math.max(8, Math.round((nation.total / leader) * 100))}%"
						>
							<span class="bg-gold" style:flex={nation.gold}></span>
							<span class="bg-silver" style:flex={nation.silver}></span>
							<span class="bg-bronze" style:flex={nation.bronze}></span>
						</span>
					</span>
					<span class="text-right font-data text-[13.5px] font-semibold whitespace-nowrap">
						<span class="text-brand">{nation.gold}</span> · {nation.total}
					</span>
				</a>
			</li>
		{/each}
	</ol>
	<a
		href={champUrl('olympic-games')}
		class="mt-2.5 block border-t border-night-line pt-3 text-[13.5px] font-semibold text-brand"
	>
		Full Olympic medal table →
	</a>
</div>
