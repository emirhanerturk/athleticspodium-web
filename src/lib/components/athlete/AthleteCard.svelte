<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import { ageOn, fullName, type AthleteSummary } from '#lib/domain/athlete.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { formatDate } from '#lib/format/date.js';
	import { athleteUrl } from '#lib/routing/urls.js';

	let { athlete, today, result }: { athlete: AthleteSummary; today: IsoDate; result?: string } =
		$props();

	const name = $derived(fullName(athlete));
	const initials = $derived(`${athlete.firstName[0] ?? ''}${athlete.lastName[0] ?? ''}`);
	const tally = $derived([
		{ key: 'gold', count: athlete.medals.gold, dot: 'bg-gold' },
		{ key: 'silver', count: athlete.medals.silver, dot: 'bg-silver' },
		{ key: 'bronze', count: athlete.medals.bronze, dot: 'bg-bronze' }
	]);
</script>

<div
	class="relative flex w-64 flex-col gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 text-left shadow-[0_10px_28px_rgba(18,19,22,.16)]"
>
	<span
		aria-hidden="true"
		class="absolute -top-1.5 left-[22px] size-2.5 rotate-45 border-t border-l border-line bg-surface"
	></span>
	<div class="flex items-center gap-2.5">
		{#if athlete.image}
			<MediaImage
				image={athlete.image}
				alt=""
				width={40}
				height={40}
				class="size-10 shrink-0 rounded-full bg-surface-2 object-cover object-top"
			/>
		{:else}
			<span
				class="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 font-display text-base font-bold text-ink-2"
			>
				{initials}
			</span>
		{/if}
		<div class="flex min-w-0 flex-col gap-[3px]">
			<strong class="truncate font-display text-[19px] leading-none font-bold">{name}</strong>
			<span class="flex items-center gap-1.5 text-xs whitespace-nowrap text-ink-2">
				{#if athlete.countryCode}
					<Flag code={athlete.countryCode} class="h-3 w-4" />
					<span class="font-data font-bold">{athlete.countryCode}</span>
				{/if}
				{#if athlete.events.length}
					<span class="text-ink-3">·</span>
					<span class="truncate">{athlete.events.join(', ')}</span>
				{/if}
				{#if athlete.olympicChampion}
					<span
						title="Olympic champion"
						class="rounded-[3px] bg-brand px-1 font-data text-[9.5px] leading-[14px] font-bold text-ink"
					>
						OG
					</span>
				{/if}
			</span>
		</div>
	</div>
	{#if athlete.birthDate}
		<span class="text-xs text-ink-2">
			b. <strong class="font-semibold text-ink">{formatDate(athlete.birthDate)}</strong>
			{#if athlete.deathDate}
				· † {formatDate(athlete.deathDate)}
			{:else}
				· {ageOn(athlete.birthDate, today)} yrs
			{/if}
		</span>
	{/if}
	{#if result}<span class="text-xs text-ink-2">{result}</span>{/if}
	<div
		class="flex items-center gap-2.5 border-t border-line pt-2 font-data text-[13px] font-semibold tabular"
	>
		{#if athlete.medals.total}
			{#each tally as medal (medal.key)}
				<span class="inline-flex items-center gap-1">
					<span class="size-2 rounded-full {medal.dot}"></span>{medal.count}
				</span>
			{/each}
		{/if}
		<a
			href={athleteUrl(athlete)}
			class="ml-auto font-text text-[12.5px] font-bold text-brand-ink hover:underline"
		>
			Profile →
		</a>
	</div>
</div>
