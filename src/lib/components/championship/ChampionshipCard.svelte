<script lang="ts">
	import {
		championshipStatus,
		type ChampionshipStatus,
		type ChampionshipSummary
	} from '#lib/domain/championship.js';
	import { champUrl } from '#lib/routing/urls.js';

	let {
		champ,
		currentYear,
		range
	}: {
		champ: ChampionshipSummary;
		currentYear: number;
		range: { from: number; to: number };
	} = $props();

	const STATUS_STYLES = {
		next: 'border-up text-up',
		held: 'border-line-2 bg-surface-2 text-ink',
		last: 'border-line-2 text-ink-3',
		none: 'border-line-2 text-ink-3'
	};

	const status = $derived(championshipStatus(champ.years, currentYear));
	const first = $derived(champ.years[0]);
	const last = $derived(champ.years.at(-1));
	const latestHeld = $derived(champ.years.filter((year) => year <= currentYear).at(-1));
	const editions = $derived(
		champ.years.length === 1 ? '1 edition' : `${champ.years.length} editions`
	);

	const position = (year: number) => `${((year - range.from) / (range.to - range.from)) * 100}%`;

	function statusLabel(status: ChampionshipStatus): string {
		switch (status.kind) {
			case 'next':
				return `Next ${status.year}`;
			case 'held':
				return `Held ${status.year}`;
			case 'last':
				return `Last held ${status.year}`;
			case 'none':
				return 'No editions yet';
		}
	}

	function dotClass(year: number): string {
		if (year > currentYear) return 'fill-surface stroke-up';
		return year === latestHeld ? 'fill-brand stroke-ink' : 'fill-ink-3';
	}
</script>

<a
	href={champUrl(champ.slug)}
	class="flex flex-col gap-3.5 rounded-2xl border border-line bg-surface px-[18px] pt-[18px] pb-4 hover:border-ink hover:shadow-[0_1px_2px_rgba(18,19,22,.05),0_8px_24px_rgba(18,19,22,.06)]"
>
	<span class="flex items-start justify-between gap-3">
		<span class="flex min-w-0 flex-col gap-1.5">
			<strong class="font-display text-[27px] leading-none font-bold">{champ.name}</strong>
			{#if first !== undefined}
				<span class="font-data text-[13.5px] text-ink-2">
					{first === last ? first : `${first} – ${last}`} · {editions}
				</span>
			{/if}
		</span>
		<span
			class="shrink-0 rounded-full border-[1.5px] px-[9px] py-1 font-data text-xs font-semibold whitespace-nowrap {STATUS_STYLES[
				status.kind
			]}"
		>
			{statusLabel(status)}
		</span>
	</span>
	<svg class="h-4 w-full overflow-visible" aria-hidden="true">
		<line x1="0" x2="100%" y1="8" y2="8" class="stroke-surface-2" stroke-width="2" />
		{#if first !== undefined && last !== undefined}
			<line
				x1={position(first)}
				x2={position(last)}
				y1="8"
				y2="8"
				class="stroke-line-2"
				stroke-width="2"
			/>
			{#each champ.years as year (year)}
				<circle
					cx={position(year)}
					cy="8"
					r={year > currentYear || year === latestHeld ? 3.25 : 4}
					stroke-width="1.5"
					class={dotClass(year)}
				/>
			{/each}
		{/if}
	</svg>
</a>
