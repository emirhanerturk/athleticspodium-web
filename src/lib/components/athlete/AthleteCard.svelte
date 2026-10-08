<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import { ageOn, fullName, type AthleteRef, type AthleteSummary } from '#lib/domain/athlete.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { formatDate } from '#lib/format/date.js';
	import { athleteUrl } from '#lib/routing/urls.js';
	import type { PopoverAlign } from '#lib/utils/popover-align.js';

	let {
		athlete,
		summary,
		loading,
		today,
		result,
		align = 'start'
	}: {
		athlete: AthleteRef;
		summary: AthleteSummary | null;
		loading: boolean;
		today: IsoDate;
		result?: string;
		align?: PopoverAlign;
	} = $props();

	const SKELETON = 'rounded bg-surface-2 motion-safe:animate-pulse';

	const arrowSide = $derived(align === 'end' ? 'right-[22px]' : 'left-[22px]');

	const initials = $derived(`${athlete.firstName[0] ?? ''}${athlete.lastName[0] ?? ''}`);
	const tally = $derived(
		summary
			? [
					{ key: 'gold', count: summary.medals.gold, dot: 'bg-gold' },
					{ key: 'silver', count: summary.medals.silver, dot: 'bg-silver' },
					{ key: 'bronze', count: summary.medals.bronze, dot: 'bg-bronze' }
				]
			: []
	);
</script>

<div
	aria-busy={loading}
	class="relative flex w-64 flex-col gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 text-left shadow-[0_10px_28px_rgba(18,19,22,.16)]"
>
	<span
		aria-hidden="true"
		class="absolute -top-1.5 {arrowSide} size-2.5 rotate-45 border-t border-l border-line bg-surface"
	></span>
	<div class="flex items-center gap-2.5">
		{#if summary?.image}
			<MediaImage
				image={summary.image}
				alt=""
				width={40}
				height={40}
				class="size-10 shrink-0 rounded-full bg-surface-2 object-cover object-top"
			/>
		{:else if loading}
			<span class="size-10 shrink-0 rounded-full bg-surface-2 motion-safe:animate-pulse"></span>
		{:else}
			<span
				class="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 font-display text-base font-bold text-ink-2"
			>
				{initials}
			</span>
		{/if}
		<div class="flex min-w-0 flex-col gap-[3px]">
			<strong class="truncate font-display text-[19px] leading-none font-bold">
				{fullName(athlete)}
			</strong>
			<span class="flex items-center gap-1.5 text-xs whitespace-nowrap text-ink-2">
				{#if athlete.countryCode}
					<Flag code={athlete.countryCode} class="h-3 w-4" />
					<span class="font-data font-bold">{athlete.countryCode}</span>
				{/if}
				{#if summary?.events.length}
					<span class="text-ink-3">·</span>
					<span class="truncate">{summary.events.join(', ')}</span>
				{:else if loading}
					<span class="h-3 w-20 {SKELETON}"></span>
				{/if}
				{#if summary?.olympicChampion}
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
	{#if summary?.birthDate}
		<span class="text-xs text-ink-2">
			b. <strong class="font-semibold text-ink">{formatDate(summary.birthDate)}</strong>
			{#if summary.deathDate}
				· † {formatDate(summary.deathDate)}
			{:else}
				· {ageOn(summary.birthDate, today)} yrs
			{/if}
		</span>
	{:else if loading}
		<span class="h-3.5 w-36 {SKELETON}"></span>
	{/if}
	{#if result}<span class="text-xs text-ink-2">{result}</span>{/if}
	<div
		class="flex items-center gap-2.5 border-t border-line pt-2 font-data text-[13px] font-semibold tabular"
	>
		{#if summary?.medals.total}
			{#each tally as medal (medal.key)}
				<span class="inline-flex items-center gap-1">
					<span class="size-2 rounded-full {medal.dot}"></span>{medal.count}
				</span>
			{/each}
		{:else if loading}
			<span class="h-3.5 w-24 {SKELETON}"></span>
		{/if}
		<a
			href={athleteUrl(athlete)}
			class="ml-auto font-text text-[12.5px] font-bold text-brand-ink hover:underline"
		>
			Profile →
		</a>
	</div>
</div>
