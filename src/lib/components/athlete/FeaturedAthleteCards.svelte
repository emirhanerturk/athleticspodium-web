<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import { fullName, type FeaturedAthlete } from '#lib/domain/athlete.js';
	import { athleteUrl } from '#lib/routing/urls.js';

	let { athletes }: { athletes: FeaturedAthlete[] } = $props();
</script>

<ul class="grid grid-cols-[repeat(auto-fit,minmax(min(170px,100%),1fr))] gap-3.5">
	{#each athletes as athlete (athlete.id)}
		<li>
			<a
				href={athleteUrl(athlete)}
				class="relative block aspect-[3/4] overflow-hidden rounded-[18px] bg-ink transition-transform motion-safe:hover:-translate-y-[3px]"
			>
				{#if athlete.image}
					<MediaImage
						image={athlete.image}
						alt={fullName(athlete)}
						width={400}
						height={533}
						class="absolute inset-0 size-full object-cover object-[50%_20%]"
					/>
				{/if}
				<span
					class="absolute inset-x-2.5 bottom-2.5 flex flex-col gap-1.5 rounded-xl bg-ink px-3 pt-3 pb-2.5 text-night-ink"
				>
					<strong class="font-display text-[21px] leading-none font-bold"
						>{fullName(athlete)}</strong
					>
					<span class="flex items-center justify-between font-data text-xs text-night-ink-3">
						{#if athlete.countryCode}
							<span class="inline-flex items-center gap-1.5">
								<Flag code={athlete.countryCode} class="h-3 w-4" />{athlete.countryCode}
							</span>
						{/if}
						<span class="font-semibold text-brand">{athlete.medals.gold} gold</span>
					</span>
				</span>
			</a>
		</li>
	{/each}
</ul>
