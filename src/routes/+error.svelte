<script lang="ts">
	import { page } from '$app/state';
	import SearchIcon from '#lib/components/ui/icons/SearchIcon.svelte';
	import { contactUrl, PAGES } from '#lib/routing/urls.js';

	const notFound = $derived(page.status === 404);
	const unavailable = $derived(page.status === 503);

	const SHORTCUTS = [
		{ label: 'Home', href: PAGES.home },
		{ label: 'Championships', href: PAGES.champs },
		{ label: 'Athletes', href: PAGES.athletes },
		{ label: 'Calendar', href: PAGES.calendar },
		{ label: 'Medal search', href: PAGES.medalSearch }
	];

	const SHEET = [
		{ place: 1, disc: 'bg-gold', name: 'Home page', note: 'Always there', href: PAGES.home },
		{
			place: 2,
			disc: 'bg-silver',
			name: 'Search',
			note: 'Finds most moved pages',
			href: PAGES.search
		},
		{
			place: 3,
			disc: 'bg-bronze',
			name: 'Medal search',
			note: 'If you were after a result',
			href: PAGES.medalSearch
		}
	];
</script>

<svelte:head>
	<title>{notFound ? 'Page not found' : 'Something went wrong'} | Athletics Podium</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="page-container pt-16 pb-20">
	<div class="grid grid-cols-1 items-center gap-14 md:grid-cols-2">
		<div class="flex flex-col gap-[18px]">
			<span
				class="inline-flex h-[30px] items-center gap-2 self-start rounded-full bg-night pr-3 pl-1 font-data text-[13px] font-bold tracking-[0.06em] text-night-ink"
			>
				{#if notFound}
					<span
						class="grid size-[22px] place-items-center rounded-full bg-brand text-[10px] text-ink"
						>404</span
					>
				{:else}
					<span
						class="grid size-[22px] place-items-center rounded-full bg-dq text-[10px] text-surface"
						>DQ</span
					>
				{/if}
				Error {page.status}
			</span>

			{#if notFound}
				<h1 class="font-display text-[80px] leading-[0.86] font-bold sm:text-[112px]">
					DNF. <span class="sr-only">Page not found</span>
				</h1>
				<p class="max-w-[520px] text-xl leading-normal text-ink-2">
					This page did not finish. The link may be old, or the page moved when an edition or
					athlete was renamed.
				</p>
				<form
					action={PAGES.search}
					method="get"
					role="search"
					class="flex h-14 max-w-[520px] items-center gap-3 rounded-[14px] border-2 border-ink bg-surface pr-2 pl-[18px]"
				>
					<SearchIcon class="size-5 shrink-0" />
					<input
						type="search"
						name="q"
						aria-label="Search"
						placeholder="Search for what you were looking for"
						class="min-w-0 flex-1 bg-transparent outline-none"
					/>
					<button
						type="submit"
						class="h-10 rounded-[10px] bg-brand px-4 font-bold text-ink hover:bg-brand-hover"
					>
						Search
					</button>
				</form>
				<nav aria-label="Shortcuts" class="flex flex-wrap gap-2">
					{#each SHORTCUTS as shortcut (shortcut.href)}
						<a
							href={shortcut.href}
							class="inline-flex h-9 items-center rounded-full border border-line-2 px-3.5 text-sm font-semibold hover:border-ink"
						>
							{shortcut.label}
						</a>
					{/each}
				</nav>
			{:else}
				<h1 class="font-display text-[56px] leading-[0.9] font-bold sm:text-[80px]">
					{unavailable ? 'The archive didn’t answer.' : 'Something went wrong.'}
				</h1>
				<p class="max-w-[520px] text-xl leading-normal text-ink-2">
					{unavailable
						? 'Nothing is wrong with the link — try again in a moment.'
						: 'Try again in a moment. If it keeps happening, tell us.'}
				</p>
				<div class="flex flex-wrap gap-2">
					<a
						href={page.url.pathname + page.url.search}
						data-sveltekit-reload
						class="inline-flex h-10 items-center rounded-[10px] bg-ink px-[18px] font-bold text-bg hover:opacity-90"
					>
						Try again
					</a>
					<a
						href={contactUrl('other')}
						class="inline-flex h-10 items-center rounded-[10px] border border-line-2 px-4 font-semibold hover:border-ink"
					>
						Report problem
					</a>
				</div>
			{/if}
		</div>

		{#if notFound}
			<div
				class="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_1px_2px_rgba(18,19,22,.05),0_8px_24px_rgba(18,19,22,.06)]"
			>
				<div class="flex items-center justify-between bg-night px-5 py-3.5 text-night-ink">
					<strong class="font-display text-2xl font-bold">Your request · final</strong>
					<span class="font-data text-[13px] text-brand">wind 0.0</span>
				</div>
				<ol>
					{#each SHEET as row (row.href)}
						<li class="border-t border-line">
							<a
								href={row.href}
								class="grid grid-cols-[40px_minmax(0,1fr)_90px] items-center gap-3.5 px-5 py-3.5 hover:bg-surface-2"
							>
								<span
									class="grid size-[30px] place-items-center rounded-full {row.disc} font-data text-xs font-bold text-ink"
									>{row.place}</span
								>
								<span class="flex flex-col gap-0.5">
									<strong class="text-[15px]">{row.name}</strong>
									<span class="text-[12.5px] text-ink-3">{row.note}</span>
								</span>
								<strong class="text-right font-data text-lg">OK</strong>
							</a>
						</li>
					{/each}
					<li
						class="grid grid-cols-[40px_minmax(0,1fr)_90px] items-center gap-3.5 border-t border-line bg-dq/5 px-5 py-3.5"
					>
						<span
							class="grid size-[30px] place-items-center rounded-full bg-surface-2 font-data text-xs font-bold text-ink-3"
							>—</span
						>
						<span class="flex flex-col gap-0.5">
							<strong class="text-[15px]">The page you asked for</strong>
							<span class="text-[12.5px] text-ink-3">Did not reach the finish line</span>
						</span>
						<strong class="text-right font-data text-lg text-dq">DNF</strong>
					</li>
				</ol>
			</div>
		{/if}
	</div>
</section>
