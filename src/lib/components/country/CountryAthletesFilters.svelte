<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import SearchIcon from '#lib/components/ui/icons/SearchIcon.svelte';
	import {
		ATHLETE_SORTS,
		MEDAL_ERAS,
		type AthleteSort,
		type CountryAthletesQuery
	} from '#lib/domain/country-athletes.js';
	import { countryAthletesUrl } from '#lib/routing/urls.js';

	let { code, query }: { code: string; query: CountryAthletesQuery } = $props();

	const TYPING_PAUSE_MS = 250;
	const GENDERS: { value: CountryAthletesQuery['gender']; label: string }[] = [
		{ value: null, label: 'All' },
		{ value: 'men', label: 'Men' },
		{ value: 'women', label: 'Women' }
	];
	const ERAS = [{ key: null, label: 'Any era' }, ...MEDAL_ERAS];

	let typed = $state<string | null>(null);
	let timer: ReturnType<typeof setTimeout> | undefined;

	const hrefWith = (change: Partial<CountryAthletesQuery>) =>
		countryAthletesUrl(code, { ...query, page: 1, ...change });

	afterNavigate(({ type }) => {
		if (type !== 'goto') typed = null;
	});

	function search(text: string) {
		clearTimeout(timer);
		goto(hrefWith({ q: text }), { replace: true, reset: false });
	}

	function type(event: Event & { currentTarget: HTMLInputElement }) {
		const text = event.currentTarget.value;
		typed = text;
		clearTimeout(timer);
		timer = setTimeout(() => search(text), TYPING_PAUSE_MS);
	}

	function submit(event: SubmitEvent) {
		event.preventDefault();
		search(typed ?? query.q);
	}

	function sortBy(event: Event & { currentTarget: HTMLSelectElement }) {
		goto(hrefWith({ sort: event.currentTarget.value as AthleteSort }), { reset: false });
	}
</script>

<section class="border-b border-line bg-bg sm:sticky sm:top-0 sm:z-20">
	<form
		method="get"
		action={countryAthletesUrl(code)}
		role="search"
		aria-label="Filter athletes"
		onsubmit={submit}
		class="page-container flex flex-wrap items-center gap-2.5 py-3"
	>
		{#if query.gender}<input type="hidden" name="gender" value={query.gender} />{/if}
		{#if query.era}<input type="hidden" name="era" value={query.era} />{/if}
		<label
			class="flex h-10 w-full items-center gap-2.5 rounded-[10px] border border-line-2 bg-surface px-3.5 text-ink-3 focus-within:border-ink sm:w-[300px]"
		>
			<SearchIcon class="size-4 shrink-0" />
			<input
				type="search"
				name="q"
				value={typed ?? query.q}
				oninput={type}
				aria-label="Filter by name or event"
				placeholder="Filter by name or event"
				autocomplete="off"
				class="min-w-0 flex-1 bg-transparent text-[14.5px] text-ink outline-none"
			/>
		</label>
		<div role="group" aria-label="Gender" class="inline-flex rounded-full bg-surface-2 p-[3px]">
			{#each GENDERS as option (option.label)}
				{@const current = query.gender === option.value}
				<a
					href={hrefWith({ gender: option.value })}
					aria-current={current ? 'true' : undefined}
					data-sveltekit-reset="false"
					class="inline-flex h-8 items-center rounded-full px-3.5 text-[13.5px] font-bold {current
						? 'bg-surface text-ink shadow-[0_1px_3px_rgba(18,19,22,.12)]'
						: 'text-ink-3 hover:text-ink'}">{option.label}</a
				>
			{/each}
		</div>
		<div
			role="group"
			aria-label="Medal years"
			class="flex gap-1.5 max-sm:-mx-4 max-sm:w-[calc(100%+32px)] max-sm:[scrollbar-width:none] max-sm:overflow-x-auto max-sm:px-4 sm:flex-wrap"
		>
			{#each ERAS as era (era.label)}
				{@const current = query.era === era.key}
				<a
					href={hrefWith({ era: era.key })}
					aria-current={current ? 'true' : undefined}
					data-sveltekit-reset="false"
					class="inline-flex h-8 shrink-0 items-center rounded-full border px-3 text-[13px] font-semibold whitespace-nowrap {current
						? 'border-ink bg-ink text-bg'
						: 'border-line-2 bg-surface text-ink hover:border-ink'}">{era.label}</a
				>
			{/each}
		</div>
		<label class="inline-flex items-center gap-2 text-[13.5px] text-ink-2 md:ml-auto">
			Sort
			<select
				name="sort"
				onchange={sortBy}
				class="h-9 rounded-[10px] border border-line-2 bg-surface px-2.5 font-semibold text-ink"
			>
				{#each ATHLETE_SORTS as sort (sort.key)}
					<option value={sort.key} selected={sort.key === query.sort}>{sort.label}</option>
				{/each}
			</select>
		</label>
		<noscript>
			<button
				type="submit"
				class="h-9 rounded-[10px] bg-ink px-3.5 text-[13.5px] font-semibold text-bg"
			>
				Apply
			</button>
		</noscript>
	</form>
</section>
