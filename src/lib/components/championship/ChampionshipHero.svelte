<script lang="ts">
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import {
		areaName,
		LEVEL_LABELS,
		levelOf,
		type ChampionshipFacts,
		type ChampRef
	} from '#lib/domain/championship.js';
	import type { Image } from '#lib/domain/image.js';

	let {
		champ,
		image,
		facts,
		nations
	}: {
		champ: Omit<ChampRef, 'rank'>;
		image: Image | null;
		facts: ChampionshipFacts;
		nations: number;
	} = $props();

	const area = $derived(areaName(champ.category));
	const level = $derived(LEVEL_LABELS[levelOf(champ.category)]);
	const COLUMNS = ['', 'sm:grid-cols-1', 'sm:grid-cols-2', 'sm:grid-cols-3', 'sm:grid-cols-4'];
	const place = (edition: { city: string | null; name: string }) => edition.city ?? edition.name;

	const figures = $derived(
		[
			facts.first && {
				value: facts.first.year,
				label: `first edition, ${place(facts.first)}`,
				highlight: false
			},
			facts.editionsHeld > 0 && {
				value: facts.editionsHeld,
				label: facts.editionsHeld === 1 ? 'edition held' : 'editions held',
				highlight: false
			},
			nations > 0 && {
				value: nations,
				label: 'medal nations',
				highlight: false
			},
			facts.next
				? {
						value: facts.next.year,
						label: `next · ${place(facts.next)}`,
						highlight: true
					}
				: facts.latest && {
						value: facts.latest.year,
						label: `latest · ${place(facts.latest)}`,
						highlight: false
					}
		].filter((figure) => !!figure)
	);
</script>

<section class="page-container pb-10">
	<div class="relative">
		{#if image}
			<MediaImage
				{image}
				alt={champ.name}
				width={1344}
				height={460}
				eager
				class="block h-[300px] w-full rounded-3xl object-cover object-[50%_60%] sm:h-[460px]"
			/>
		{/if}
		<div
			class="flex flex-col gap-4 rounded-[20px] bg-ink px-6 pt-[30px] pb-7 text-night-ink shadow-[0_20px_50px_rgba(0,0,0,.35)] sm:px-8 {image
				? 'relative mx-4 -mt-[60px] md:absolute md:bottom-7 md:left-7 md:m-0 md:w-[min(640px,calc(100%-56px))]'
				: ''}"
		>
			<span
				class="inline-flex items-center gap-2.5 font-data text-xs tracking-[0.14em] text-night-ink-3 uppercase"
			>
				<span class="rounded-[5px] bg-brand px-2 py-[3px] font-bold text-ink">{area}</span>
				{#if level !== area}{level}{/if}
			</span>
			<h1 class="font-display text-[50px] leading-[0.94] font-bold text-balance sm:text-[76px]">
				{champ.name}
			</h1>
			{#if figures.length}
				<dl
					class="grid grid-cols-2 gap-3 border-t border-night-line-2 pt-4 {COLUMNS[figures.length]}"
				>
					{#each figures as figure (figure.label)}
						<div class="flex flex-col-reverse gap-0.5">
							<dt class="text-[12.5px] text-night-ink-3">{figure.label}</dt>
							<dd
								class="font-data text-[26px] font-semibold tabular {figure.highlight
									? 'text-brand'
									: ''}"
							>
								{figure.value}
							</dd>
						</div>
					{/each}
				</dl>
			{/if}
		</div>
	</div>
</section>
