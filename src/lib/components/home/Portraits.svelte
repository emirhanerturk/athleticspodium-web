<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import { fullName, type FeaturedAthlete } from '#lib/domain/athlete.js';
	import { excerptFromHtml } from '#lib/format/text.js';
	import { athleteUrl } from '#lib/routing/urls.js';

	let { athletes }: { athletes: FeaturedAthlete[] } = $props();

	const QUOTE_LENGTH = 160;
</script>

<section class="page-container pt-10 pb-14">
	<div
		class="mb-5 flex flex-wrap items-baseline justify-between gap-3 border-t-[3px] border-ink pt-3.5"
	>
		<h2 class="font-display text-[34px] leading-[0.94] font-bold sm:text-[44px]">Portraits</h2>
		<span class="text-sm text-ink-2"
			>Featured athletes, in the words of their archive biographies</span
		>
	</div>
	<ul class="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-7">
		{#each athletes as athlete (athlete.id)}
			<li>
				<a href={athleteUrl(athlete)} class="flex flex-col gap-3.5 hover:text-brand-ink">
					{#if athlete.image}
						<MediaImage
							image={athlete.image}
							alt={fullName(athlete)}
							width={560}
							height={560}
							class="block aspect-square w-full rounded object-cover object-[50%_25%]"
						/>
					{/if}
					<span
						class="flex items-center gap-[9px] font-data text-xs tracking-[0.08em] text-ink-3 uppercase"
					>
						{#if athlete.countryCode}<Flag
								code={athlete.countryCode}
								class="h-[13.5px] w-[18px]"
							/>{athlete.countryCode}{/if}
						{#if athlete.events.length}· {athlete.events.slice(0, 2).join(', ')}{/if}
					</span>
					<strong class="font-display text-[34px] leading-[0.98] font-bold"
						>{fullName(athlete)}</strong
					>
					{#if athlete.biography}
						<span class="flex gap-2.5 text-base leading-normal text-ink-2">
							<span
								aria-hidden="true"
								class="font-display text-[44px] leading-[0.8] font-bold text-brand">“</span
							>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -- biographies are written by editors in the CMS -->
							<span>{@html excerptFromHtml(athlete.biography, QUOTE_LENGTH)}</span>
						</span>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
</section>
