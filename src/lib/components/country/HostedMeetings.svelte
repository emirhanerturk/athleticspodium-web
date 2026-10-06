<script lang="ts">
	import type { HostedMeeting } from '#lib/domain/country.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { meetingTiming } from '#lib/domain/meeting.js';
	import { formatDateRange, formatDaysToGo } from '#lib/format/date.js';
	import { meetingUrl } from '#lib/routing/urls.js';

	let {
		meetings,
		countryName,
		today
	}: { meetings: HostedMeeting[]; countryName: string; today: IsoDate } = $props();

	function tagOf(meeting: HostedMeeting): { text: string; upcoming: boolean } {
		const timing = meetingTiming(meeting, today);
		if (timing.status === 'scheduled')
			return { text: formatDaysToGo(timing.daysToGo), upcoming: true };
		if (timing.status === 'live') return { text: 'live now', upcoming: true };
		return { text: meeting.hasResults ? 'Results' : 'No results yet', upcoming: false };
	}
</script>

<div class="flex flex-col">
	<h2 class="border-b-2 border-ink pb-2.5 font-display text-[30px] leading-none font-bold">
		Hosted in {countryName}
	</h2>
	{#each meetings as meeting (meeting.slug)}
		{@const tag = tagOf(meeting)}
		<a
			href={meetingUrl(meeting.champ.slug, meeting.slug)}
			class="grid grid-cols-[64px_minmax(0,1fr)] gap-3 border-b border-line py-3 hover:text-brand-ink"
		>
			<span class="flex flex-col gap-0.5">
				<strong class="font-data text-[15.5px]">{meeting.year}</strong>
				<span class="font-data text-xs {tag.upcoming ? 'text-up' : 'text-ink-3'}">{tag.text}</span>
			</span>
			<span class="flex min-w-0 flex-col gap-[3px]">
				<strong class="text-[14.5px] leading-tight font-semibold">{meeting.champ.name}</strong>
				<span class="text-[12.5px] text-ink-3">
					{[meeting.city, meeting.startDate && formatDateRange(meeting.startDate, meeting.endDate)]
						.filter(Boolean)
						.join(' · ')}
				</span>
			</span>
		</a>
	{/each}
</div>
