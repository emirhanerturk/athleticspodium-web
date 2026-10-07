<script lang="ts">
	import { ageOn, fullName, type BirthdaysToday } from '#lib/domain/athlete.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { dayOfDate } from '#lib/domain/day.js';
	import { meetingTiming, type MeetingSummary } from '#lib/domain/meeting.js';
	import { formatDateRange, formatDaysToGo } from '#lib/format/date.js';
	import { meetingUrl, onThisDayUrl, PAGES } from '#lib/routing/urls.js';
	import SocialLinks from './SocialLinks.svelte';

	let {
		today,
		nextMeeting,
		birthdays
	}: { today: IsoDate; nextMeeting: MeetingSummary | null; birthdays: BirthdaysToday | null } =
		$props();

	const timing = $derived(nextMeeting && meetingTiming(nextMeeting, today));
	const birthdayAthlete = $derived(birthdays?.featured);
</script>

<div class="bg-ink text-[13px] text-night-ink-2">
	<div
		class="page-container flex h-[38px] items-center gap-[22px] overflow-hidden whitespace-nowrap"
	>
		{#if nextMeeting && timing}
			<a
				href={meetingUrl(nextMeeting.champ.slug, nextMeeting.slug)}
				class="flex min-w-0 items-center gap-2.5 hover:text-night-ink"
			>
				<span
					class="rounded-[4px] bg-brand px-[7px] py-0.5 font-data text-[11px] font-bold tracking-[0.1em] text-ink"
				>
					{timing.status === 'live' ? 'LIVE NOW' : 'UP NEXT'}
				</span>
				<span class="truncate">
					<strong class="font-semibold text-night-ink">{nextMeeting.name}</strong>
					{#if nextMeeting.city}· {nextMeeting.city}{/if}
					{#if nextMeeting.startDate}· {formatDateRange(
							nextMeeting.startDate,
							nextMeeting.endDate
						)}{/if}
				</span>
				{#if timing.status === 'scheduled'}
					<span class="font-data text-night-up">{formatDaysToGo(timing.daysToGo)}</span>
				{/if}
			</a>
		{/if}

		{#if birthdays && birthdayAthlete?.birthDate}
			<span aria-hidden="true" class="hidden h-4 w-px bg-night-line-2 md:block"></span>
			<a
				href={onThisDayUrl(dayOfDate(today))}
				class="hidden items-center gap-2.5 hover:text-night-ink md:flex"
			>
				<span class="font-data text-[11px] font-bold tracking-[0.1em] text-brand">BORN TODAY</span>
				<span>
					<strong class="font-semibold text-night-ink">{fullName(birthdayAthlete)}</strong>
					{#if birthdayAthlete.countryCode}({birthdayAthlete.countryCode}){/if}
					turns {ageOn(birthdayAthlete.birthDate, today)}
					{#if birthdays.count > 1}· +{birthdays.count - 1} more{/if}
				</span>
			</a>
		{/if}

		<span class="flex-1"></span>

		<nav aria-label="Social" class="hidden items-center gap-1 md:flex">
			<SocialLinks
				linkClass="grid size-[30px] place-items-center rounded-md hover:bg-night-surface"
			/>
		</nav>
		<a href={PAGES.about} class="hidden text-night-ink-3 hover:text-night-ink md:inline">About</a>
	</div>
</div>
