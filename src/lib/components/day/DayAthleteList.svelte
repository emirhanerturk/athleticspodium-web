<script lang="ts">
	import AthleteName from '#lib/components/athlete/AthleteName.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import { ageOn, fullName, type AthleteSummary } from '#lib/domain/athlete.js';
	import { yearOf, type IsoDate } from '#lib/domain/date.js';

	let {
		id,
		title,
		count,
		athletes,
		kind,
		offset,
		today
	}: {
		id: string;
		title: string;
		count: number;
		athletes: AthleteSummary[];
		kind: 'born' | 'died';
		offset: number;
		today: IsoDate;
	} = $props();

	const MEDALS = [
		{ key: 'gold', dot: 'bg-gold' },
		{ key: 'silver', dot: 'bg-silver' },
		{ key: 'bronze', dot: 'bg-bronze' }
	] as const;

	function years(athlete: AthleteSummary): string {
		const born = athlete.birthDate?.slice(0, 4) ?? '?';
		return athlete.deathDate ? `${born}–${athlete.deathDate.slice(0, 4)}` : born;
	}

	function age(athlete: AthleteSummary): string {
		if (!athlete.birthDate) return '';
		if (kind === 'died' && athlete.deathDate)
			return `aged ${ageOn(athlete.birthDate, athlete.deathDate)}`;
		if (athlete.deathDate) return '';
		return `turns ${yearOf(today) - yearOf(athlete.birthDate)}`;
	}
</script>

<section {id} class="scroll-mt-6">
	<div class="mb-3.5 flex items-baseline justify-between gap-3 border-b-2 border-ink pb-2.5">
		<h2 class="font-display text-[30px] leading-none font-bold sm:text-[36px]">{title}</h2>
		<span class="font-data text-sm text-ink-3">{count}</span>
	</div>
	<ol>
		{#each athletes as athlete, index (athlete.id)}
			<li
				class="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-x-3.5 border-b border-line py-2.5 sm:grid-cols-[40px_minmax(0,1fr)_110px_90px_140px]"
			>
				<span class="font-data text-[13.5px] text-ink-3">{offset + index + 1}</span>
				<span class="flex min-w-0 flex-col gap-0.5">
					<span class="flex min-w-0 items-center gap-2">
						{#if athlete.countryCode}<Flag code={athlete.countryCode} />{/if}
						<AthleteName
							{athlete}
							{today}
							class="truncate text-[15px] font-semibold hover:text-brand-ink"
						>
							{fullName(athlete)}
						</AthleteName>
						{#if athlete.olympicChampion}
							<span
								title="Olympic champion"
								class="flex-none rounded bg-brand px-[5px] py-0.5 font-data text-[10.5px] font-bold text-ink"
								>OG</span
							>
						{/if}
					</span>
					<span class="truncate text-[12.5px] text-ink-3">
						{[athlete.countryCode, athlete.events.slice(0, 2).join(', ')]
							.filter(Boolean)
							.join(' · ')}
						<span class="sm:hidden"
							>· {[years(athlete), age(athlete)].filter(Boolean).join(' · ')}</span
						>
					</span>
				</span>
				<span class="font-data text-[13.5px] text-ink-2 max-sm:hidden">{years(athlete)}</span>
				<span class="font-data text-[13.5px] font-semibold max-sm:hidden">{age(athlete)}</span>
				<span class="flex items-center justify-end gap-2.5 font-data text-[13.5px] font-semibold">
					{#if athlete.medals.total}
						{#each MEDALS as medal (medal.key)}
							<span
								class="inline-flex items-center gap-1 {athlete.medals[medal.key]
									? ''
									: 'text-line-2'}"
							>
								<span aria-hidden="true" class="size-2.5 rounded-full {medal.dot}"></span>
								{athlete.medals[medal.key]}<span class="sr-only"> {medal.key}</span>
							</span>
						{/each}
					{:else}
						<span class="text-ink-3" title="No international medal">—</span>
					{/if}
				</span>
			</li>
		{/each}
	</ol>
</section>
