<script lang="ts">
	import AthleteName from '#lib/components/athlete/AthleteName.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import { ageOn, fullName, type AthleteSummary } from '#lib/domain/athlete.js';
	import { yearOf, type IsoDate } from '#lib/domain/date.js';

	let {
		id,
		title,
		kind,
		list,
		pageHref,
		today
	}: {
		id: string;
		title: string;
		kind: 'born' | 'died';
		list: {
			count: number;
			athletes: AthleteSummary[];
			page: number;
			lastPage: number;
			offset: number;
		};
		pageHref: (page: number) => string;
		today: IsoDate;
	} = $props();

	const MEDALS = [
		{ key: 'gold', dot: 'bg-gold' },
		{ key: 'silver', dot: 'bg-silver' },
		{ key: 'bronze', dot: 'bg-bronze' }
	] as const;

	function lifeNote(athlete: AthleteSummary): string {
		const born = athlete.birthDate?.slice(0, 4) ?? '?';
		if (athlete.deathDate) {
			const years = `${born}–${athlete.deathDate.slice(0, 4)}`;
			return kind === 'died' && athlete.birthDate
				? `${years} · ${ageOn(athlete.birthDate, athlete.deathDate)}`
				: years;
		}
		return athlete.birthDate ? `${born} · ${yearOf(today) - yearOf(athlete.birthDate)}` : '';
	}

	const lifeTitle = (athlete: AthleteSummary) =>
		athlete.deathDate
			? kind === 'died'
				? 'Life years · age at death'
				: 'Life years'
			: 'Born · age this year';
	const first = $derived(list.offset + 1);
	const last = $derived(list.offset + list.athletes.length);
	const PAGER = 'grid size-8 place-items-center rounded-full border border-line-2 hover:border-ink';
</script>

<section {id} class="min-w-0 scroll-mt-6">
	<div class="mb-1 flex items-baseline justify-between gap-3 border-b-2 border-ink pb-2.5">
		<h2 class="font-display text-[28px] leading-none font-bold sm:text-[32px]">{title}</h2>
		<span class="font-data text-sm text-ink-3">{list.count}</span>
	</div>
	<ol>
		{#each list.athletes as athlete, index (athlete.id)}
			<li
				class="grid grid-cols-[28px_minmax(0,1fr)_auto_auto] items-center gap-x-3 border-b border-line py-2"
			>
				<span class="font-data text-[12.5px] text-ink-3">{list.offset + index + 1}</span>
				<span class="flex min-w-0 items-center gap-2">
					{#if athlete.countryCode}<Flag code={athlete.countryCode} />{/if}
					<AthleteName
						{athlete}
						{today}
						class="truncate text-[14.5px] font-semibold hover:text-brand-ink"
					>
						{fullName(athlete)}
					</AthleteName>
					{#if athlete.olympicChampion}
						<span
							title="Olympic champion"
							class="flex-none rounded bg-brand px-1 font-data text-[10px] font-bold text-ink"
							>OG</span
						>
					{/if}
				</span>
				<span
					title={lifeTitle(athlete)}
					class="font-data text-[12.5px] whitespace-nowrap text-ink-3"
				>
					{lifeNote(athlete)}
				</span>
				<span
					class="flex w-[92px] items-center justify-end gap-1.5 font-data text-[12.5px] font-semibold"
				>
					{#if athlete.medals.total}
						{#each MEDALS as medal (medal.key)}
							<span
								class="inline-flex items-center gap-[3px] {athlete.medals[medal.key]
									? ''
									: 'text-line-2'}"
							>
								<span aria-hidden="true" class="size-2 rounded-full {medal.dot}"></span>
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
	{#if list.lastPage > 1}
		<nav
			aria-label="{title} pages"
			class="mt-3 flex items-center justify-between gap-3 font-data text-[13px] text-ink-3"
		>
			<span>{first}–{last} of {list.count}</span>
			<span class="flex gap-1.5">
				{#if list.page > 1}
					<a href={pageHref(list.page - 1)} rel="prev" data-sveltekit-reset="false" class={PAGER}>
						<span aria-hidden="true">←</span><span class="sr-only">Previous page</span>
					</a>
				{/if}
				{#if list.page < list.lastPage}
					<a href={pageHref(list.page + 1)} rel="next" data-sveltekit-reset="false" class={PAGER}>
						<span aria-hidden="true">→</span><span class="sr-only">Next page</span>
					</a>
				{/if}
			</span>
		</nav>
	{/if}
</section>
