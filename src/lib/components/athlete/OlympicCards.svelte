<script lang="ts">
	import MedalDisc from '#lib/components/ui/MedalDisc.svelte';
	import type { OlympicAppearance } from '#lib/domain/career.js';
	import { meetingUrl } from '#lib/routing/urls.js';

	let { appearances }: { appearances: OlympicAppearance[] } = $props();
</script>

<div>
	<h3 class="mb-3 text-[13px] font-bold tracking-[0.08em] text-ink-3 uppercase">Olympic Games</h3>
	<div class="grid grid-cols-2 gap-2.5">
		{#each appearances as { games, best } (games.id)}
			<a
				href={meetingUrl(games.champSlug, games.slug)}
				class="flex items-center justify-between gap-2.5 rounded-[14px] border border-line bg-surface px-4 py-3.5 hover:border-ink"
			>
				<span class="flex flex-col gap-0.5">
					<strong class="font-display text-[26px] leading-none font-bold">
						{games.city ?? games.name}
						{games.year}
					</strong>
					<span class="text-[13px] text-ink-3">{best?.mark ?? 'Competed'}</span>
				</span>
				{#if best}
					<MedalDisc place={best.place} class="size-[30px] text-sm" />
				{/if}
			</a>
		{/each}
	</div>
</div>
