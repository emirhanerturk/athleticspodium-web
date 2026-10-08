<script lang="ts">
	import { todayFor } from '#lib/components/layout/visitor-today.svelte.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import type { SiteStats } from '#lib/domain/stats.js';
	import { formatLongDate } from '#lib/format/date.js';
	import { formatCount } from '#lib/format/number.js';

	let { today, year, stats }: { today: IsoDate; year: number; stats: SiteStats | null } = $props();
</script>

<div class="page-container pt-[18px]">
	<div
		class="flex flex-wrap justify-between gap-x-6 gap-y-2 border-b-[3px] border-ink pb-3 font-data text-[13px] tracking-[0.08em] text-ink-2 uppercase"
	>
		<span>{formatLongDate(todayFor(today))}</span>
		{#if stats}
			<span class="hidden sm:inline">
				{formatCount(stats.medals + stats.placings)} medals & places · {formatCount(stats.athletes)} athletes
				· {formatCount(stats.championships)} championships
			</span>
			<span>Season {year} · {formatCount(stats.seasonMeetings)} meetings</span>
		{/if}
	</div>
</div>
