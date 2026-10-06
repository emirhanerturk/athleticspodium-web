<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import { isHeld, type EditionRef } from '#lib/domain/championship.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { meetingUrl } from '#lib/routing/urls.js';

	let {
		champSlug,
		editions,
		latest,
		today
	}: {
		champSlug: string;
		editions: EditionRef[];
		latest: EditionRef | null;
		today: IsoDate;
	} = $props();

	const STYLES = {
		latest: { tile: 'border-brand bg-brand text-ink', track: 'bg-ink/20', bar: 'bg-ink' },
		upcoming: {
			tile: 'border-[1.5px] border-dashed border-line-2 text-ink',
			track: 'bg-surface-2',
			bar: 'bg-ink-3'
		},
		past: { tile: 'border-line bg-bg text-ink', track: 'bg-surface-2', bar: 'bg-ink-3' }
	};

	const mostEvents = $derived(Math.max(1, ...editions.map((edition) => edition.eventsCount)));

	function kindOf(edition: EditionRef): keyof typeof STYLES {
		if (!isHeld(edition, today)) return 'upcoming';
		return edition.slug === latest?.slug ? 'latest' : 'past';
	}

	function sizeOf(edition: EditionRef, kind: keyof typeof STYLES): string {
		if (kind === 'upcoming') return 'upcoming';
		if (!edition.eventsCount) return 'no results yet';
		return edition.eventsCount === 1 ? '1 event' : `${edition.eventsCount} events`;
	}
</script>

<section class="border-y border-line bg-surface">
	<div class="page-container pt-11 pb-10">
		<div class="mb-[18px] flex flex-wrap items-baseline justify-between gap-3">
			<h2 class="font-display text-[34px] leading-[0.94] font-bold sm:text-[40px]">Editions</h2>
			<span class="text-sm text-ink-3">
				{editions.length > 6 ? `Scroll for all ${editions.length} · ` : ''}newest first
			</span>
		</div>
		<ol class="-mx-1 flex gap-3 overflow-x-auto px-1 pt-1 pb-2.5">
			{#each editions as edition (edition.slug)}
				{@const kind = kindOf(edition)}
				{@const style = STYLES[kind]}
				<li class="flex-none">
					<a
						href={meetingUrl(champSlug, edition.slug)}
						aria-current={kind === 'latest' ? 'true' : undefined}
						class="flex h-full w-[172px] flex-col gap-2.5 rounded-2xl border p-4 transition-transform motion-safe:hover:-translate-y-0.5 {style.tile}"
					>
						<span class="flex items-center justify-between gap-2">
							<span class="font-display text-4xl leading-none font-bold">{edition.year}</span>
							{#if edition.countryCode}<Flag code={edition.countryCode} class="h-[18px] w-6" />{/if}
						</span>
						<span class="text-[15px] font-semibold">{edition.city ?? edition.name}</span>
						<span class="mt-auto flex items-end gap-2">
							<span class="h-1.5 flex-1 overflow-hidden rounded-full {style.track}">
								<span
									class="block h-full {style.bar}"
									style:width="{Math.round((edition.eventsCount / mostEvents) * 100)}%"
								></span>
							</span>
							<span class="font-data text-xs whitespace-nowrap opacity-80">
								{sizeOf(edition, kind)}
							</span>
						</span>
					</a>
				</li>
			{/each}
		</ol>
	</div>
</section>
