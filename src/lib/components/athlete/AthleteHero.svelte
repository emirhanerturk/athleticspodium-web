<script lang="ts">
	import PodiumTally from '#lib/components/medal/PodiumTally.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import { ageOn, fullName, type AthleteProfile } from '#lib/domain/athlete.js';
	import type { CareerSummary, OlympicAppearance } from '#lib/domain/career.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { formatDate } from '#lib/format/date.js';
	import { countryUrl, PAGES } from '#lib/routing/urls.js';

	let {
		athlete,
		career,
		olympics,
		resultCount,
		today
	}: {
		athlete: AthleteProfile;
		career: CareerSummary;
		olympics: OlympicAppearance[];
		resultCount: number;
		today: IsoDate;
	} = $props();

	const name = $derived(fullName(athlete));
	const initials = $derived(`${athlete.firstName[0] ?? ''}${athlete.lastName[0] ?? ''}`);

	const facts = $derived(
		[
			athlete.birthDate && {
				label: 'Born',
				value: formatDate(athlete.birthDate),
				note: athlete.deathDate ? null : String(ageOn(athlete.birthDate, today)),
				data: true
			},
			athlete.deathDate && {
				label: 'Died',
				value: formatDate(athlete.deathDate),
				note: athlete.birthDate ? `aged ${ageOn(athlete.birthDate, athlete.deathDate)}` : null,
				data: true
			},
			athlete.birthPlace && {
				label: 'Birthplace',
				value: athlete.birthPlace,
				note: null,
				data: false
			},
			career.podiumYears && {
				label: 'On the podium',
				value:
					career.podiumYears.first === career.podiumYears.last
						? String(career.podiumYears.first)
						: `${career.podiumYears.first} – ${career.podiumYears.last}`,
				note: null,
				data: true
			},
			olympics.length > 0 && {
				label: 'Olympian',
				value: `${olympics.length}× · ${olympics
					.map(({ games }) => games.city ?? games.year)
					.toReversed()
					.join(', ')}`,
				note: null,
				data: false
			}
		].filter((fact) => !!fact)
	);

	const extras = $derived(
		[
			career.nationalTitles &&
				`${career.nationalTitles} national ${career.nationalTitles === 1 ? 'title' : 'titles'}`,
			career.placings && `${career.placings} ${career.placings === 1 ? 'final' : 'finals'} 4–8`
		].filter(Boolean)
	);
</script>

<section class="page-container pt-6 pb-12">
	<div class="grid gap-11 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
		<figure class="flex flex-col gap-2.5">
			{#if athlete.image}
				<MediaImage
					image={athlete.image}
					alt={name}
					width={480}
					height={600}
					eager
					class="aspect-[4/5] w-full rounded-[22px] bg-surface-2 object-cover object-[50%_25%]"
				/>
				{#if athlete.image.credit}
					<figcaption class="text-xs text-ink-3">{athlete.image.credit}</figcaption>
				{/if}
			{:else}
				<div
					aria-hidden="true"
					class="grid aspect-[4/5] w-full place-items-center rounded-[22px] bg-surface-2 font-display text-[120px] font-bold text-ink-3"
				>
					{initials}
				</div>
			{/if}
		</figure>

		<div class="flex flex-col justify-center gap-6">
			<div class="flex flex-wrap gap-2">
				{#if athlete.country}
					<a
						href={countryUrl(athlete.country.code)}
						class="inline-flex h-[34px] items-center gap-2 rounded-full border border-line bg-surface pr-3 pl-[9px] text-sm font-semibold hover:border-ink"
					>
						<Flag code={athlete.country.code} />
						{athlete.country.name}
					</a>
				{/if}
				{#each athlete.events as event (event)}
					<span
						class="inline-flex h-[34px] items-center rounded-full border border-line bg-surface px-3 text-sm font-semibold"
					>
						{event}
					</span>
				{/each}
				{#if athlete.olympicChampion}
					<span
						class="inline-flex h-[34px] items-center rounded-full bg-brand px-3 text-[13px] font-bold tracking-[0.04em] text-ink"
					>
						OLYMPIC CHAMPION
					</span>
				{/if}
			</div>

			<div class="flex flex-col gap-2.5">
				<h1 class="font-display text-[52px] leading-[0.94] font-bold sm:text-[96px]">{name}</h1>
				{#if athlete.aka.length}
					<span class="text-[15px] text-ink-3">Also known as {athlete.aka.join(', ')}</span>
				{/if}
			</div>

			{#if facts.length}
				<dl class="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] border-y border-line">
					{#each facts as fact (fact.label)}
						<div class="flex flex-col gap-1 py-3.5 pr-4">
							<dt class="text-xs tracking-[0.08em] text-ink-3 uppercase">{fact.label}</dt>
							<dd class="font-semibold">
								<span class={fact.data ? 'font-data text-[15.5px]' : ''}>{fact.value}</span>
								{#if fact.note}<span class="font-normal text-ink-3">· {fact.note}</span>{/if}
							</dd>
						</div>
					{/each}
				</dl>
			{/if}

			<div class="flex flex-wrap items-end gap-7">
				{#if career.international.total}
					<PodiumTally tally={career.international} />
					<div class="flex flex-col gap-1.5 pb-1">
						<span class="font-data text-[31px] font-semibold">{career.international.total}</span>
						<span class="text-sm text-ink-2">
							international {career.international.total === 1 ? 'medal' : 'medals'}
						</span>
						{#if extras.length}
							<span class="text-[13px] text-ink-3">+ {extras.join(' · ')}</span>
						{/if}
					</div>
				{/if}
				<span class="flex-1"></span>
				<div class="flex flex-wrap gap-2.5">
					{#if resultCount}
						<a
							href="#results"
							class="inline-flex h-[46px] items-center rounded-full bg-ink px-5 text-[14.5px] font-bold text-bg hover:opacity-90"
						>
							All {resultCount} results
						</a>
					{/if}
					<a
						href={PAGES.missingInformation}
						class="inline-flex h-[46px] items-center rounded-full border-[1.5px] border-line-2 px-[18px] text-[14.5px] font-semibold hover:border-ink"
					>
						Report missing info
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
