<script lang="ts">
	import type { SearchFilters, SearchRequest } from '#lib/domain/search.js';
	import { searchUrl } from '#lib/routing/urls.js';

	let { request }: { request: SearchRequest } = $props();

	const GENDERS: { value: SearchFilters['gender']; label: string }[] = [
		{ value: null, label: 'All' },
		{ value: 'men', label: 'Men' },
		{ value: 'women', label: 'Women' }
	];
	const ERAS: { label: string; bornFrom: number | null; bornTo: number | null }[] = [
		{ label: 'Any', bornFrom: null, bornTo: null },
		{ label: 'Before 1960', bornFrom: null, bornTo: 1959 },
		{ label: '1960–79', bornFrom: 1960, bornTo: 1979 },
		{ label: '1980–99', bornFrom: 1980, bornTo: 1999 },
		{ label: '2000+', bornFrom: 2000, bornTo: null }
	];

	const withFilters = (filters: Partial<SearchFilters>) =>
		searchUrl({
			...request,
			scope: 'athletes',
			page: 1,
			filters: { ...request.filters, ...filters }
		});
	const isEra = (era: (typeof ERAS)[number]) =>
		era.bornFrom === request.filters.bornFrom && era.bornTo === request.filters.bornTo;
	const LABEL = 'font-data text-[12px] tracking-[0.12em] text-ink-3 uppercase';
</script>

<nav
	aria-labelledby="refine"
	class="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-5"
>
	<h2 id="refine" class="text-[15px] font-bold">Refine athletes</h2>
	<div class="flex flex-col gap-2">
		<span class={LABEL}>Gender</span>
		<div class="flex rounded-full bg-surface-2 p-[3px]">
			{#each GENDERS as option (option.label)}
				<a
					href={withFilters({ gender: option.value })}
					aria-current={request.filters.gender === option.value ? 'true' : undefined}
					class="grid h-8 flex-1 place-items-center rounded-full text-[13.5px] font-bold {request
						.filters.gender === option.value
						? 'bg-surface text-ink shadow-[0_1px_3px_rgba(18,19,22,.12)]'
						: 'text-ink-3'}">{option.label}</a
				>
			{/each}
		</div>
	</div>
	<div class="flex flex-col gap-2">
		<span class={LABEL}>Born</span>
		<div class="flex flex-wrap gap-1.5">
			{#each ERAS as era (era.label)}
				<a
					href={withFilters({ bornFrom: era.bornFrom, bornTo: era.bornTo })}
					aria-current={isEra(era) ? 'true' : undefined}
					class="inline-flex h-[30px] items-center rounded-full border px-[11px] text-[13px] font-semibold {isEra(
						era
					)
						? 'border-ink bg-ink text-bg'
						: 'border-line-2 bg-surface text-ink hover:border-ink'}">{era.label}</a
				>
			{/each}
		</div>
	</div>
	<a
		href={withFilters({ olympian: !request.filters.olympian })}
		aria-current={request.filters.olympian ? 'true' : undefined}
		class="flex items-center justify-between gap-2.5 text-sm font-semibold text-ink-2"
	>
		Olympians only
		<span
			class="relative h-[22px] w-[38px] rounded-full {request.filters.olympian
				? 'bg-up'
				: 'bg-line-2'}"
		>
			<span
				class="absolute top-[3px] size-4 rounded-full bg-surface shadow-[0_1px_2px_rgba(0,0,0,.25)] {request
					.filters.olympian
					? 'left-[19px]'
					: 'left-[3px]'}"
			></span>
		</span>
	</a>
</nav>
