<script lang="ts">
	import logo from '#lib/assets/logo.svg';
	import SearchIcon from '#lib/components/ui/icons/SearchIcon.svelte';
	import type { BirthdaysToday } from '#lib/domain/athlete.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import type { MeetingSummary } from '#lib/domain/meeting.js';
	import { PAGES } from '#lib/routing/urls.js';
	import MainNav from './MainNav.svelte';
	import Ticker from './Ticker.svelte';

	let {
		today,
		nextMeeting,
		birthdays,
		onSearch
	}: {
		today: IsoDate;
		nextMeeting: MeetingSummary | null;
		birthdays: BirthdaysToday | null;
		onSearch: () => void;
	} = $props();
</script>

<header>
	<Ticker {today} {nextMeeting} {birthdays} />

	<div class="bg-surface">
		<div class="page-container flex h-[84px] items-center gap-8">
			<a href={PAGES.home} aria-label="Athletics Podium home" class="flex shrink-0">
				<img src={logo} alt="Athletics Podium" width="172" height="60" />
			</a>

			<button
				type="button"
				onclick={onSearch}
				class="hidden h-[50px] max-w-[640px] flex-1 items-center gap-3 rounded-xl border-[1.5px] border-transparent bg-surface-2 pr-2 pl-[18px] text-[15px] text-ink-3 hover:border-line-2 md:flex"
			>
				<SearchIcon class="size-5 shrink-0" />
				<span class="flex-1 truncate text-left"
					>Search athletes, championships, countries, articles</span
				>
				<kbd
					class="rounded-md border border-line bg-surface px-[7px] py-[3px] font-data text-[11px]"
					>⌘K</kbd
				>
			</button>

			<span class="flex-1"></span>

			<a
				href={PAGES.medalSearch}
				class="hidden h-11 shrink-0 items-center rounded-[10px] bg-brand px-[18px] text-sm font-bold whitespace-nowrap text-ink hover:bg-brand-hover md:inline-flex"
			>
				Medal search
			</a>
			<button
				type="button"
				onclick={onSearch}
				aria-label="Search"
				class="grid size-11 shrink-0 place-items-center rounded-[10px] bg-surface-2 md:hidden"
			>
				<SearchIcon />
			</button>
		</div>
	</div>

	<MainNav />
</header>
