<script lang="ts">
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import AthletePortrait from '#lib/components/athlete/AthletePortrait.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import SearchIcon from '#lib/components/ui/icons/SearchIcon.svelte';
	import { fullName } from '#lib/domain/athlete.js';
	import { areaName } from '#lib/domain/championship.js';
	import {
		MIN_QUERY_LENGTH,
		type SearchAthlete,
		type SearchChamp,
		type SearchCountry
	} from '#lib/domain/search.js';
	import { athleteUrl, champUrl, countryUrl, searchUrl } from '#lib/routing/urls.js';
	import Highlighted from './Highlighted.svelte';

	let {
		variant = 'overlay',
		placeholder = 'Search athletes, championships, countries…',
		label = 'Search the archive',
		idle,
		trailing,
		onnavigate
	}: {
		variant?: 'overlay' | 'hero';
		placeholder?: string;
		label?: string;
		idle?: Snippet;
		trailing?: Snippet;
		onnavigate?: (query: string) => void;
	} = $props();

	const DEBOUNCE_MS = 150;

	interface QuickResults {
		athletes: SearchAthlete[];
		champs: SearchChamp[];
		countries: SearchCountry[];
		total: number;
	}

	let query = $state('');
	let results = $state<QuickResults | null>(null);
	let selected = $state(0);
	let timer: ReturnType<typeof setTimeout> | undefined;
	let latest = 0;

	const items = $derived(
		results
			? [
					...results.athletes.map((athlete) => ({ href: athleteUrl(athlete), group: 'Athletes' })),
					...results.champs.map((champ) => ({
						href: champUrl(champ.slug),
						group: 'Championships'
					})),
					...results.countries.map((country) => ({
						href: countryUrl(country.code),
						group: 'Countries'
					}))
				]
			: []
	);
	const active = $derived(query.trim().length >= MIN_QUERY_LENGTH);
	const listId = $props.id();

	function onInput() {
		clearTimeout(timer);
		if (!active) {
			results = null;
			return;
		}
		timer = setTimeout(load, DEBOUNCE_MS);
	}

	async function load() {
		const request = ++latest;
		try {
			const response = await fetch(`/internal/search?q=${encodeURIComponent(query.trim())}`);
			const body: QuickResults = await response.json();
			if (request !== latest) return;
			results = body;
			selected = 0;
		} catch {
			if (request === latest) results = null;
		}
	}

	function onKeydown(event: KeyboardEvent) {
		if (!items.length) return;
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			const step = event.key === 'ArrowDown' ? 1 : -1;
			selected = (selected + step + items.length) % items.length;
		}
		if (event.key === 'Enter' && !event.shiftKey && items[selected]) {
			event.preventDefault();
			open(items[selected].href);
		}
	}

	function open(href: string) {
		onnavigate?.(query.trim());
		void goto(href);
	}

	const indexOf = (offset: number, index: number) => offset + index;
	const SHELL = {
		overlay: 'flex h-[68px] items-center gap-3.5 border-b border-line px-5',
		hero: 'flex h-[68px] items-center gap-3.5 rounded-[18px] border-2 border-ink bg-bg px-5 text-ink-3'
	};
</script>

<form
	method="get"
	action="/search"
	role="search"
	onsubmit={() => onnavigate?.(query.trim())}
	class={variant === 'hero' ? 'relative w-full max-w-[760px] text-left' : ''}
>
	<label class={SHELL[variant]}>
		<SearchIcon class="size-[22px] shrink-0" />
		<span class="sr-only">{label}</span>
		<input
			name="q"
			type="search"
			minlength={MIN_QUERY_LENGTH}
			required
			autocomplete="off"
			role="combobox"
			aria-expanded={active && !!results}
			aria-controls={listId}
			aria-activedescendant={items.length ? `${listId}-${selected}` : undefined}
			{placeholder}
			bind:value={query}
			oninput={onInput}
			onkeydown={onKeydown}
			class="min-w-0 flex-1 bg-transparent font-medium text-ink outline-none placeholder:text-ink-3 {variant ===
			'hero'
				? 'text-[22px]'
				: 'text-[19px]'}"
		/>
		{@render trailing?.()}
	</label>

	<div
		id={listId}
		role="listbox"
		aria-label="Suggestions"
		class={variant === 'hero' && active && results
			? 'absolute inset-x-0 top-full z-10 -mt-0.5 overflow-hidden rounded-b-[18px] border-2 border-t-0 border-ink bg-surface shadow-[0_24px_60px_rgba(18,19,22,.18)]'
			: ''}
	>
		{#if active && results}
			{#if results.athletes.length}
				<div class="px-2.5 pt-3 pb-1.5">
					<span
						class="block px-2.5 pb-1.5 font-data text-[11.5px] tracking-[0.14em] text-ink-3 uppercase"
						>Athletes</span
					>
					{#each results.athletes as athlete, index (athlete.id)}
						{@const position = indexOf(0, index)}
						<a
							id="{listId}-{position}"
							role="option"
							aria-selected={selected === position}
							href={athleteUrl(athlete)}
							onclick={() => onnavigate?.(query.trim())}
							class="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-2.5 py-2 hover:bg-surface-2 {selected ===
							position
								? 'bg-brand-soft shadow-[inset_0_0_0_1.5px_var(--color-brand)]'
								: ''}"
						>
							<AthletePortrait
								image={athlete.image}
								firstName={athlete.firstName}
								lastName={athlete.lastName}
								class="size-9 text-xs"
							/>
							<span class="flex min-w-0 flex-col gap-0.5">
								<strong class="truncate text-[15px] font-semibold text-ink"
									><Highlighted text={fullName(athlete)} {query} /></strong
								>
								<span class="truncate text-[12.5px] text-ink-3">
									{[
										athlete.countryCode,
										athlete.birthDate && `born ${athlete.birthDate.slice(0, 4)}`,
										athlete.olympian && 'Olympian'
									]
										.filter(Boolean)
										.join(' · ')}
								</span>
							</span>
							<span class="font-data text-[13.5px] whitespace-nowrap text-ink-2">
								{athlete.medals.gold} · {athlete.medals.silver} · {athlete.medals.bronze}
							</span>
						</a>
					{/each}
				</div>
			{/if}
			{#if results.champs.length}
				<div class="px-2.5 pt-3 pb-1.5">
					<span
						class="block px-2.5 pb-1.5 font-data text-[11.5px] tracking-[0.14em] text-ink-3 uppercase"
						>Championships</span
					>
					{#each results.champs as champ, index (champ.id)}
						{@const position = indexOf(results.athletes.length, index)}
						<a
							id="{listId}-{position}"
							role="option"
							aria-selected={selected === position}
							href={champUrl(champ.slug)}
							onclick={() => onnavigate?.(query.trim())}
							class="flex flex-col gap-0.5 rounded-xl px-2.5 py-2 hover:bg-surface-2 {selected ===
							position
								? 'bg-brand-soft shadow-[inset_0_0_0_1.5px_var(--color-brand)]'
								: ''}"
						>
							<strong class="truncate text-[15px] font-semibold text-ink"
								><Highlighted text={champ.name} {query} /></strong
							>
							<span class="text-[12.5px] text-ink-3">{areaName(champ.category)}</span>
						</a>
					{/each}
				</div>
			{/if}
			{#if results.countries.length}
				<div class="px-2.5 pt-3 pb-1.5">
					<span
						class="block px-2.5 pb-1.5 font-data text-[11.5px] tracking-[0.14em] text-ink-3 uppercase"
						>Countries</span
					>
					{#each results.countries as country, index (country.code)}
						{@const position = indexOf(results.athletes.length + results.champs.length, index)}
						<a
							id="{listId}-{position}"
							role="option"
							aria-selected={selected === position}
							href={countryUrl(country.code)}
							onclick={() => onnavigate?.(query.trim())}
							class="flex items-center gap-3 rounded-xl px-2.5 py-2 hover:bg-surface-2 {selected ===
							position
								? 'bg-brand-soft shadow-[inset_0_0_0_1.5px_var(--color-brand)]'
								: ''}"
						>
							<Flag code={country.code} class="h-[18px] w-6" />
							<strong class="truncate text-[15px] font-semibold text-ink"
								><Highlighted text={country.name} {query} /></strong
							>
							<span class="font-data text-xs text-ink-3">{country.code}</span>
						</a>
					{/each}
				</div>
			{/if}
			{#if !items.length}
				<p class="px-5 py-4 text-sm text-ink-3">
					No quick match for “{query.trim()}”. Press enter to search everything.
				</p>
			{/if}
			<a
				href={searchUrl({ query: query.trim() })}
				onclick={() => onnavigate?.(query.trim())}
				class="mx-2.5 mt-1.5 mb-2.5 flex items-center justify-between rounded-xl bg-ink px-3.5 py-3 text-[14.5px] font-bold text-bg"
			>
				See all {results.total ? `${results.total} ` : ''}results for “{query.trim()}”
				<span class="font-data text-[13px] opacity-85">⇧ ↵</span>
			</a>
		{:else if !active}
			{@render idle?.()}
		{/if}
	</div>
</form>
