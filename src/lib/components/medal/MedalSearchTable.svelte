<script lang="ts">
	import AthleteName from '#lib/components/athlete/AthleteName.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import MedalDisc from '#lib/components/ui/MedalDisc.svelte';
	import RecordBadge from '#lib/components/ui/RecordBadge.svelte';
	import { fullName } from '#lib/domain/athlete.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { GENDER_LABELS } from '#lib/domain/edition.js';
	import type { MedalOrder, MedalQuery, MedalRecord } from '#lib/domain/medal-search.js';
	import { champUrl, countryUrl, medalSearchUrl, meetingUrl } from '#lib/routing/urls.js';
	import ResultMark from './ResultMark.svelte';

	let { rows, query, today }: { rows: MedalRecord[]; query: MedalQuery; today: IsoDate } = $props();

	const COLUMNS: { label: string; order?: MedalOrder; className?: string }[] = [
		{ label: 'Year', order: 'year' },
		{ label: 'Championship', order: 'champs' },
		{ label: 'Event', order: 'event' },
		{ label: 'Medal', order: 'medal', className: 'text-center' },
		{ label: 'Athlete', order: 'athlete' },
		{ label: 'Born' },
		{ label: 'Gender', order: 'gender' },
		{ label: 'Country', order: 'country' },
		{ label: 'Mark' },
		{ label: 'Records' }
	];
</script>

<div class="overflow-x-auto rounded-[20px] border border-line bg-surface">
	<table class="w-full min-w-[1040px] border-collapse text-[14px]">
		<thead>
			<tr class="font-data text-[11px] tracking-[0.1em] text-ink-3 uppercase">
				{#each COLUMNS as column, index (column.label)}
					<th
						scope="col"
						class="py-3 text-left font-semibold {index === 0 ? 'pl-5' : 'px-2'} {column.className ??
							''}"
					>
						{#if column.order}
							<a
								href={medalSearchUrl({ ...query, order: column.order, page: 1 })}
								aria-current={query.order === column.order ? 'true' : undefined}
								class="hover:text-ink {query.order === column.order ? 'text-ink' : ''}"
							>
								{column.label}{query.order === column.order ? ' ↓' : ''}
							</a>
						{:else}
							{column.label}
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each rows as row (row.id)}
				<tr class="border-t border-line {row.canceled ? 'text-ink-3' : ''}">
					<td class="py-2.5 pl-5 font-data">
						<a
							href={meetingUrl(row.champ.slug, row.meeting.slug)}
							class="font-semibold hover:text-brand-ink">{row.meeting.year}</a
						>
					</td>
					<td class="px-2 py-2.5">
						<a href={champUrl(row.champ.slug)} class="hover:text-brand-ink">{row.champ.name}</a>
					</td>
					<td class="px-2 py-2.5">{row.event}</td>
					<td class="px-2 py-2.5 text-center"
						><MedalDisc place={row.place} canceled={row.canceled} class="size-6 text-[11px]" /></td
					>
					<td class="px-2 py-2.5">
						{#if row.athlete}
							<span class="inline-flex items-center gap-1.5">
								<AthleteName
									athlete={row.athlete}
									{today}
									class="font-semibold hover:text-brand-ink"
								>
									{row.athleteName ?? fullName(row.athlete)}
								</AthleteName>
								{#if row.athlete.olympicChampion}
									<span
										title="Olympic champion"
										class="rounded bg-brand px-1 font-data text-[10px] font-bold text-ink">OG</span
									>
								{/if}
							</span>
						{:else}
							{row.athleteName ?? '–'}
						{/if}
					</td>
					<td class="px-2 py-2.5 font-data text-ink-2">{row.athlete?.birthYear ?? ''}</td>
					<td class="px-2 py-2.5 text-ink-2">{GENDER_LABELS[row.gender]}</td>
					<td class="px-2 py-2.5">
						{#if row.country}
							<a
								href={countryUrl(row.country.code)}
								title={row.country.name}
								class="inline-flex items-center gap-1.5 font-data font-semibold hover:text-brand-ink"
							>
								<Flag code={row.country.code} />{row.country.code}
							</a>
						{/if}
					</td>
					<td class="px-2 py-2.5"><ResultMark result={row} /></td>
					<td class="px-2 py-2.5 pr-5">
						<span class="flex flex-wrap items-center gap-1">
							{#each row.records as record, index (index)}<RecordBadge {record} />{/each}
							{#if row.notes}<span
									title={row.notes}
									class="cursor-help font-data text-xs text-ink-3">note</span
								>{/if}
						</span>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
