<script lang="ts">
	import QuickSearchBox from '#lib/components/search/QuickSearchBox.svelte';
	import { readRecentSearches, rememberSearch } from '#lib/components/search/RecentSearches.svelte';
	import type { MeetingSummary } from '#lib/domain/meeting.js';
	import { calendarUrl, meetingUrl, PAGES, searchUrl } from '#lib/routing/urls.js';

	let { year, nextMeeting }: { year: number; nextMeeting: MeetingSummary | null } = $props();

	let dialog: HTMLDialogElement;
	let recent = $state<string[]>([]);

	const jumpLinks = $derived([
		{ label: 'Medal search', note: 'Tools', href: PAGES.medalSearch },
		{ label: `Calendar ${year}`, note: 'Every championship this season', href: calendarUrl(year) },
		...(nextMeeting
			? [
					{
						label: nextMeeting.name,
						note: 'Next championship',
						href: meetingUrl(nextMeeting.champ.slug, nextMeeting.slug)
					}
				]
			: [])
	]);

	export function open() {
		if (dialog.open) return;
		recent = readRecentSearches();
		dialog.showModal();
	}

	function rememberQuery(query: string) {
		rememberSearch(query);
		dialog.close();
	}
</script>

{#snippet group(title: string, items: { label: string; note: string; href: string }[])}
	<div class="px-2.5 pt-3 pb-1.5">
		<span
			class="block px-2.5 pb-1.5 font-data text-[11.5px] tracking-[0.14em] text-ink-3 uppercase"
		>
			{title}
		</span>
		{#each items as item (item.href)}
			<a
				href={item.href}
				onclick={() => dialog.close()}
				class="flex flex-col gap-0.5 rounded-xl px-2.5 py-2 hover:bg-surface-2"
			>
				<strong class="truncate text-[15px] font-semibold">{item.label}</strong>
				<span class="text-[12.5px] text-ink-3">{item.note}</span>
			</a>
		{/each}
	</div>
{/snippet}

<dialog
	bind:this={dialog}
	aria-label="Search"
	class="mx-auto mt-20 w-[calc(100%-32px)] max-w-[640px] overflow-hidden rounded-[22px] bg-surface p-0 text-ink shadow-[0_30px_80px_rgba(0,0,0,.35)] backdrop:bg-ink/55"
>
	<QuickSearchBox onnavigate={rememberQuery}>
		{#snippet trailing()}
			<kbd class="rounded-[7px] border border-line-2 px-2 py-0.5 font-data text-xs text-ink-3"
				>esc</kbd
			>
		{/snippet}
		{#snippet idle()}
			{#if recent.length}
				{@render group(
					'Recent',
					recent.map((query) => ({ label: query, note: 'Search', href: searchUrl({ query }) }))
				)}
			{/if}
			{@render group('Jump to', jumpLinks)}
		{/snippet}
	</QuickSearchBox>

	<div
		class="mt-1.5 flex flex-wrap gap-4 border-t border-line bg-surface-2 px-5 py-3 text-[12.5px] text-ink-3"
	>
		<span><strong class="font-data text-ink-2">↑ ↓</strong> move</span>
		<span><strong class="font-data text-ink-2">↵</strong> open</span>
		<span><strong class="font-data text-ink-2">⇧ ↵</strong> all results</span>
		<span><strong class="font-data text-ink-2">esc</strong> close</span>
		<span><strong class="font-data text-ink-2">/</strong> open search anywhere</span>
	</div>
</dialog>
