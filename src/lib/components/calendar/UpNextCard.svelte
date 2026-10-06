<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import type { IsoDate } from '#lib/domain/date.js';
	import { meetingTiming, type MeetingSummary } from '#lib/domain/meeting.js';
	import { formatDateRange } from '#lib/format/date.js';
	import { meetingUrl } from '#lib/routing/urls.js';

	let { meetings, today }: { meetings: MeetingSummary[]; today: IsoDate } = $props();

	const [next, ...later] = $derived(meetings);
	const timing = $derived(next ? meetingTiming(next, today) : null);
	const place = (meeting: MeetingSummary) =>
		[meeting.city, meeting.startDate && formatDateRange(meeting.startDate, meeting.endDate)]
			.filter(Boolean)
			.join(' · ');
</script>

{#if next && timing}
	<a
		href={meetingUrl(next.champ.slug, next.slug)}
		class="flex flex-col gap-3 rounded-[20px] bg-ink p-[22px] text-night-ink hover:shadow-[0_0_0_2px_var(--color-brand)]"
	>
		<span class="font-data text-xs tracking-[0.14em] text-night-up uppercase">
			{timing.status === 'live' ? 'Live now' : 'Up next'}
		</span>
		{#if timing.status === 'scheduled'}
			<span class="flex items-baseline gap-2.5">
				<span class="font-display text-[110px] leading-[0.8] font-bold text-brand"
					>{timing.daysToGo}</span
				>
				<span class="text-[17px] font-semibold">{timing.daysToGo === 1 ? 'day' : 'days'}</span>
			</span>
		{/if}
		<strong class="font-display text-[32px] leading-[0.94] font-bold">{next.champ.name}</strong>
		<span class="flex items-center gap-2.5 text-sm text-night-ink-3">
			{#if next.countryCode}<Flag code={next.countryCode} class="h-[16.5px] w-[22px]" />{/if}
			{place(next)}
		</span>
		{#if later.length}
			<span class="border-t border-night-line-2 pt-3 text-[13px] text-night-ink-3">
				Then: {later
					.map((meeting) =>
						[
							meeting.champ.name,
							meeting.startDate && formatDateRange(meeting.startDate, meeting.endDate)
						]
							.filter(Boolean)
							.join(' · ')
					)
					.join(', ')}
			</span>
		{/if}
	</a>
{/if}
