<script lang="ts">
	import SearchIcon from '#lib/components/ui/icons/SearchIcon.svelte';
	import type { MeetingSummary } from '#lib/domain/meeting.js';
	import { calendarUrl, meetingUrl, PAGES } from '#lib/routing/urls.js';

	let { year, nextMeeting }: { year: number; nextMeeting: MeetingSummary | null } = $props();

	const RECENT_KEY = 'athleticspodium:recent-searches';
	const RECENT_LIMIT = 5;

	let dialog: HTMLDialogElement;
	let recent = $state<string[]>([]);

	const jumpLinks = $derived([
		{ label: 'Medal Tracker', note: 'Tools', href: PAGES.medalSearch },
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
		recent = readRecent();
		dialog.showModal();
	}

	function rememberQuery(event: SubmitEvent) {
		const query = new FormData(event.currentTarget as HTMLFormElement).get('q')?.toString().trim();
		if (!query) return;
		writeRecent([query, ...recent.filter((item) => item !== query)].slice(0, RECENT_LIMIT));
		dialog.close();
	}

	function readRecent(): string[] {
		try {
			return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
		} catch {
			return [];
		}
	}

	function writeRecent(items: string[]) {
		try {
			localStorage.setItem(RECENT_KEY, JSON.stringify(items));
		} catch {
			return;
		}
	}

	const searchUrl = (query: string) => `${PAGES.search}?q=${encodeURIComponent(query)}`;
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
	<form method="get" action={PAGES.search} role="search" onsubmit={rememberQuery}>
		<label class="flex h-[68px] items-center gap-3.5 border-b border-line px-5">
			<SearchIcon class="size-[22px] shrink-0" />
			<span class="sr-only">Search the archive</span>
			<input
				name="q"
				type="search"
				minlength="2"
				required
				autocomplete="off"
				placeholder="Search athletes, championships, countries…"
				class="min-w-0 flex-1 bg-transparent text-[19px] font-medium outline-none placeholder:text-ink-3"
			/>
			<kbd class="rounded-[7px] border border-line-2 px-2 py-0.5 font-data text-xs text-ink-3"
				>esc</kbd
			>
		</label>
	</form>

	{#if recent.length}
		{@render group(
			'Recent',
			recent.map((query) => ({ label: query, note: 'Search', href: searchUrl(query) }))
		)}
	{/if}
	{@render group('Jump to', jumpLinks)}

	<div
		class="mt-1.5 flex flex-wrap gap-4 border-t border-line bg-surface-2 px-5 py-3 text-[12.5px] text-ink-3"
	>
		<span><strong class="font-data text-ink-2">↵</strong> search</span>
		<span><strong class="font-data text-ink-2">esc</strong> close</span>
		<span><strong class="font-data text-ink-2">/</strong> open search anywhere</span>
	</div>
</dialog>
