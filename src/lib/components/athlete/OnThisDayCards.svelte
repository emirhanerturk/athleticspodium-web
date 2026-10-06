<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import { ageOn, fullName, type AthleteSummary } from '#lib/domain/athlete.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { athleteUrl } from '#lib/routing/urls.js';

	let { athletes, today }: { athletes: AthleteSummary[]; today: IsoDate } = $props();

	const years = (athlete: AthleteSummary) =>
		athlete.deathDate
			? `${athlete.birthDate?.slice(0, 4) ?? '?'}–${athlete.deathDate.slice(0, 4)}`
			: (athlete.birthDate?.slice(0, 4) ?? '');
</script>

<ul class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5">
	{#each athletes as athlete, index (athlete.id)}
		<li>
			<a
				href={athleteUrl(athlete)}
				class="flex h-full flex-col gap-2 rounded-[14px] bg-surface-2 p-3.5 hover:bg-brand-soft"
			>
				<span
					class="font-display text-[46px] leading-[0.9] font-bold {athlete.deathDate
						? 'text-ink-3'
						: index === 0
							? 'text-brand-ink'
							: ''}"
				>
					{#if athlete.deathDate}†{:else if athlete.birthDate}{ageOn(athlete.birthDate, today)}{/if}
				</span>
				<strong class="text-[14.5px] leading-tight font-bold">{fullName(athlete)}</strong>
				<span class="mt-auto flex items-center gap-1.5 font-data text-xs text-ink-3">
					{#if athlete.countryCode}<Flag
							code={athlete.countryCode}
							class="h-3 w-4"
						/>{athlete.countryCode}
						·{/if}
					{years(athlete)}
				</span>
			</a>
		</li>
	{/each}
</ul>
