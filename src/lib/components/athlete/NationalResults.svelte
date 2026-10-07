<script lang="ts">
	import MedalDisc from '#lib/components/ui/MedalDisc.svelte';
	import type { Result } from '#lib/domain/result.js';
	import { meetingUrl } from '#lib/routing/urls.js';
	import ResultMark from '#lib/components/medal/ResultMark.svelte';

	let { results }: { results: Result[] } = $props();

	const showEvent = $derived(new Set(results.map((result) => result.event.id)).size > 1);
</script>

<section id="national" class="page-container scroll-mt-4 pt-10 pb-6">
	<h2 class="mb-3.5 font-display text-[30px] leading-[0.94] font-bold sm:text-4xl">
		National results
		<span class="font-data text-lg font-medium text-ink-3">{results.length}</span>
	</h2>
	<ul class="grid grid-cols-1 gap-2 lg:grid-cols-2">
		{#each results as result (result.id)}
			<li
				class="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-[14px] bg-surface-2 px-[18px] py-3.5 text-sm"
			>
				<span class="font-data font-semibold">{result.meeting.year}</span>
				<a
					href={meetingUrl(result.champ.slug, result.meeting.slug)}
					class="flex-1 hover:text-brand-ink"
				>
					{result.champ.name}{#if result.meeting.city}&nbsp;· {result.meeting.city}{/if}
				</a>
				{#if showEvent}<span class="text-ink-2">{result.event.name}</span>{/if}
				<MedalDisc place={result.place} canceled={result.canceled} class="size-6 text-[11px]" />
				<ResultMark {result} />
			</li>
		{/each}
	</ul>
</section>
