<script lang="ts">
	import AthleteName from '#lib/components/athlete/AthleteName.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import MedalDisc from '#lib/components/ui/MedalDisc.svelte';
	import RecordBadge from '#lib/components/ui/RecordBadge.svelte';
	import { fullName } from '#lib/domain/athlete.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { GENDER_LABELS } from '#lib/domain/edition.js';
	import type { EditionMedals } from '#lib/domain/medal-search.js';
	import { formatWind } from '#lib/format/mark.js';
	import { meetingUrl } from '#lib/routing/urls.js';
	import ResultMark from './ResultMark.svelte';

	let {
		edition,
		showChamp,
		showCountry,
		today
	}: { edition: EditionMedals; showChamp: boolean; showCountry: boolean; today: IsoDate } =
		$props();

	const TALLY = [
		{ key: 'gold', dot: 'bg-gold', label: 'gold' },
		{ key: 'silver', dot: 'bg-silver', label: 'silver' },
		{ key: 'bronze', dot: 'bg-bronze', label: 'bronze' }
	] as const;
</script>

<section class="rounded-[18px] border border-line bg-surface">
	<a
		href={meetingUrl(edition.champ.slug, edition.meeting.slug)}
		class="flex flex-wrap items-center justify-between gap-3 rounded-t-[17px] bg-surface-2 px-[18px] py-3 hover:bg-surface-3"
	>
		<h2 class="flex items-baseline gap-3">
			<span class="font-display text-[30px] leading-none font-bold">{edition.meeting.year}</span>
			<span class="text-[14.5px] text-ink-2">
				{[showChamp ? edition.champ.name : null, edition.meeting.city].filter(Boolean).join(' · ')}
			</span>
		</h2>
		<span class="flex items-center gap-2.5 font-data text-sm font-semibold">
			{#each TALLY as medal (medal.key)}
				<span class="inline-flex items-center gap-1">
					<span aria-hidden="true" class="size-2.5 rounded-full {medal.dot}"></span>
					{edition.tally[medal.key]}<span class="sr-only"> {medal.label}</span>
				</span>
			{/each}
			{#if edition.tally.withdrawn}
				<span
					class="inline-flex h-5 items-center rounded-full bg-dq px-[7px] text-[11px] font-bold text-surface"
				>
					{edition.tally.withdrawn} DQ
				</span>
			{/if}
		</span>
	</a>
	<ul>
		{#each edition.entries as { record, team } (record.id)}
			<li
				class="grid grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-x-3.5 gap-y-1 border-t border-line px-[18px] py-[11px] sm:grid-cols-[34px_120px_minmax(0,1fr)_96px_64px] {record.canceled
					? 'bg-dq/5'
					: ''}"
			>
				<MedalDisc
					place={record.place}
					canceled={record.canceled}
					class="size-[30px] text-[13px] max-sm:row-span-2"
				/>
				<span class="flex flex-col gap-0.5">
					<strong class="text-[14.5px] font-semibold">{record.event}</strong>
					<span class="text-xs text-ink-3">{GENDER_LABELS[record.gender]}</span>
				</span>
				<span class="flex min-w-0 flex-col gap-0.5 max-sm:col-start-2 max-sm:row-start-2">
					<span
						class="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[14.5px] font-semibold {record.canceled
							? 'text-ink-3 line-through decoration-dq'
							: ''}"
					>
						{#if showCountry && record.country}
							<Flag code={record.country.code} />
							<span class="font-data text-[13px] text-ink-2">{record.country.code}</span>
						{/if}
						{#each team as member, index (member.id)}
							{#if index}<span aria-hidden="true" class="text-ink-3">·</span>{/if}
							{#if member.athlete}
								<AthleteName athlete={member.athlete} {today} class="hover:text-brand-ink">
									{member.athleteName ?? fullName(member.athlete)}
								</AthleteName>
							{:else}
								<span>{member.athleteName ?? member.country?.name ?? '–'}</span>
							{/if}
						{/each}
						{#if team.length === 1 && record.athlete?.olympicChampion}
							<span
								title="Olympic champion"
								class="rounded bg-brand px-1 font-data text-[10px] font-bold text-ink no-underline"
								>OG</span
							>
						{/if}
					</span>
					{#if record.canceled}
						<span class="text-xs text-ink-3">Disqualified · medal withdrawn</span>
					{:else if team.length > 1}
						<span class="text-xs text-ink-3">Relay team</span>
					{/if}
				</span>
				<span
					class="flex flex-col items-end gap-0.5 max-sm:col-start-3 max-sm:row-span-2 max-sm:row-start-1"
				>
					<span class="text-[17px]"><ResultMark result={record} showWind={false} /></span>
					{#if record.wind !== null}
						<span class="font-data text-xs text-ink-3">w {formatWind(record.wind)}</span>
					{/if}
				</span>
				<span class="flex flex-wrap justify-end gap-1 max-sm:hidden">
					{#each record.records as code, index (index)}<RecordBadge record={code} />{/each}
					{#if record.notes}
						<span title={record.notes} class="cursor-help font-data text-xs text-ink-3">note</span>
					{/if}
				</span>
			</li>
		{/each}
	</ul>
</section>
