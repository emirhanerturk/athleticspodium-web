<script lang="ts">
	import SearchIcon from '#lib/components/ui/icons/SearchIcon.svelte';
	import {
		MIN_QUERY_LENGTH,
		SEARCH_SCOPES,
		type SearchRequest,
		type SearchScope
	} from '#lib/domain/search.js';
	import { formatCount } from '#lib/format/number.js';
	import { PAGES, searchUrl } from '#lib/routing/urls.js';

	let {
		request,
		counts
	}: { request: SearchRequest; counts: Record<Exclude<SearchScope, 'all'>, number> | null } =
		$props();

	const TRIES = ['Mahuchikh', 'European Championships', 'KEN', 'Kipchoge', 'Göhr'];
	const total = $derived(counts ? Object.values(counts).reduce((sum, count) => sum + count, 0) : 0);
	const countOf = (scope: SearchScope) => (scope === 'all' ? total : (counts?.[scope] ?? 0));
</script>

<section class="border-b border-line bg-surface">
	<div class="page-container pt-10">
		<h1 class="sr-only">Search{request.query ? ` results for “${request.query}”` : ''}</h1>
		<form method="get" action={PAGES.search} role="search">
			<label
				class="flex h-[64px] items-center gap-4 rounded-[20px] border-2 border-ink bg-bg pr-3 pl-6 shadow-[0_0_0_5px_var(--color-brand-soft)] sm:h-[76px]"
			>
				<SearchIcon class="size-6 shrink-0 text-ink-3" />
				<span class="sr-only">Search Athletics Podium</span>
				<input
					type="search"
					name="q"
					value={request.query}
					minlength={MIN_QUERY_LENGTH}
					required
					placeholder="Athletes, championships, countries, stories"
					class="min-w-0 flex-1 bg-transparent font-display text-[26px] font-bold outline-none placeholder:text-ink-3 sm:text-[38px]"
				/>
				{#if request.query}
					<a
						href={PAGES.search}
						class="inline-flex h-10 flex-none items-center rounded-xl border border-line-2 bg-surface px-3.5 text-sm font-semibold text-ink-2 hover:border-ink"
						>Clear</a
					>
				{/if}
			</label>
		</form>
		<div class="mt-3.5 flex flex-wrap items-center gap-2">
			<span class="text-[13px] text-ink-3">Try</span>
			{#each TRIES as query (query)}
				<a
					href={searchUrl({ query })}
					class="inline-flex h-[30px] items-center rounded-full border border-line-2 bg-surface px-3 text-[13.5px] font-semibold hover:border-ink"
					>{query}</a
				>
			{/each}
		</div>
		{#if request.query && counts}
			<nav
				aria-label="Result types"
				class="mt-[22px] flex [scrollbar-width:none] gap-1 overflow-x-auto"
			>
				{#each SEARCH_SCOPES as scope (scope.key)}
					<a
						href={searchUrl({ ...request, scope: scope.key, page: 1 })}
						aria-current={request.scope === scope.key ? 'page' : undefined}
						class="inline-flex flex-none items-baseline gap-2 border-b-[3px] px-3.5 pt-3.5 pb-[13px] text-[15px] font-bold hover:text-ink {request.scope ===
						scope.key
							? 'border-brand text-ink'
							: 'border-transparent text-ink-2'}"
					>
						{scope.label}
						<span class="font-data text-[13.5px] font-semibold text-ink-3"
							>{formatCount(countOf(scope.key))}</span
						>
					</a>
				{/each}
			</nav>
		{:else}
			<div class="h-6"></div>
		{/if}
	</div>
</section>
