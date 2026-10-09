<script lang="ts">
	import type { IsoDate } from '#lib/domain/date.js';
	import {
		GENDER_LABELS,
		podiumLines,
		type EditionEvent,
		type Gender
	} from '#lib/domain/edition.js';
	import { DISCIPLINE_LABELS, type Discipline } from '#lib/domain/event.js';
	import EventCard from './EventCard.svelte';

	let { events, today }: { events: EditionEvent[]; today: IsoDate } = $props();

	const GENDERS: Gender[] = ['men', 'women', 'mixed'];

	const boards = $derived(events.map((event) => ({ event, lines: podiumLines(event.entries) })));
	const genders = $derived(
		GENDERS.map((gender) => ({
			gender,
			count: boards.filter(({ event }) => event.gender === gender).length
		})).filter(({ count }) => count > 0)
	);
	let gender = $state<Gender | null>(null);
	let discipline = $state<Discipline | 'all'>('all');

	const activeGender = $derived(gender ?? genders[0]?.gender ?? 'men');
	const genderBoards = $derived(boards.filter(({ event }) => event.gender === activeGender));
	const disciplines = $derived(
		Object.keys(DISCIPLINE_LABELS).filter((key) =>
			genderBoards.some(({ event }) => event.discipline === key)
		) as Discipline[]
	);
	const visible = $derived(
		genderBoards.filter(({ event }) => discipline === 'all' || event.discipline === discipline)
	);

	function pickGender(next: Gender) {
		gender = next;
		discipline = 'all';
	}

	const chip = (active: boolean) =>
		`h-9 rounded-full border px-3.5 text-[13.5px] font-semibold ${
			active
				? 'border-brand bg-brand text-ink'
				: 'border-line-2 bg-surface text-ink-2 hover:border-ink'
		}`;
</script>

<section id="results" class="page-container scroll-mt-4 pt-2 pb-14">
	<div class="mb-[18px] flex flex-wrap items-center justify-between gap-4">
		<h2 class="font-display text-[36px] leading-[0.94] font-bold sm:text-[44px]">Podiums</h2>
		{#if genders.length > 1}
			<div role="group" aria-label="Gender" class="inline-flex gap-1 rounded-full bg-surface-2 p-1">
				{#each genders as option (option.gender)}
					<button
						type="button"
						aria-pressed={option.gender === activeGender}
						onclick={() => pickGender(option.gender)}
						class="inline-flex h-10 items-center gap-2 rounded-full px-[18px] text-[14.5px] font-semibold {option.gender ===
						activeGender
							? 'bg-ink text-bg'
							: 'text-ink-2'}"
					>
						{GENDER_LABELS[option.gender]}
						<span class="font-data text-xs opacity-85">{option.count}</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>

	{#if disciplines.length > 1}
		<div class="mb-[22px] flex flex-wrap items-center gap-2">
			<button
				type="button"
				aria-pressed={discipline === 'all'}
				class={chip(discipline === 'all')}
				onclick={() => (discipline = 'all')}
			>
				All events
			</button>
			{#each disciplines as key (key)}
				<button
					type="button"
					aria-pressed={discipline === key}
					class={chip(discipline === key)}
					onclick={() => (discipline = key)}
				>
					{DISCIPLINE_LABELS[key]}
				</button>
			{/each}
		</div>
	{/if}

	<div class="grid grid-cols-[repeat(auto-fill,minmax(min(360px,100%),1fr))] gap-4">
		{#each visible as board (board.event.id)}
			<EventCard event={board.event} lines={board.lines} {today} />
		{/each}
	</div>
</section>
