<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import ResultMark from '#lib/components/medal/ResultMark.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import MedalDisc from '#lib/components/ui/MedalDisc.svelte';
	import RecordBadge from '#lib/components/ui/RecordBadge.svelte';
	import { meetingUrl, PAGES } from '#lib/routing/urls.js';

	const SECTIONS = [
		{ id: 'olympic', label: 'Olympic champions' },
		{ id: 'wind', label: 'Wind & information' },
		{ id: 'records', label: 'Records' },
		{ id: 'stripped', label: 'Stripped medals' },
		{ id: 'nations', label: 'Former nations' },
		{ id: 'splits', label: 'Relay splits' },
		{ id: 'adjusted', label: 'Adjusted times' },
		{ id: 'ties', label: 'Ties' },
		{ id: 'yog', label: 'Youth Olympics 2018' }
	];

	const MARK_NOTES = [
		['+1.2', 'Wind reading in metres per second, sprints and horizontal jumps'],
		['w', 'Windy, but no certain measurement available'],
		['w?', 'Possibly not a legal performance — unsure whether windy'],
		['nwi', 'No wind information'],
		['n/a', 'Not available'],
		['i', 'Indoor performance'],
		[',5', 'Additional half-centimetre measurement in jumps and throws (earlier times)'],
		[',000', 'Decathlon points fractions, before 1934'],
		['pts', 'Points in team competitions, mostly cross country or road']
	];

	const RECORDS = [
		['WR', 'World record'],
		['WIR', 'World indoor record'],
		['WB', 'World best'],
		['OR', 'Olympic record'],
		['AR', 'Area (continental) record'],
		['CR', 'Championship record'],
		['NR', 'National record'],
		['WU20R', 'World U20 record'],
		['WU18B', 'World U18 best'],
		['AU23R', 'Area U23 record'],
		['AU20R', 'Area U20 record'],
		['AU18R', 'Area U18 record'],
		['=', 'Equals the existing record'],
		['*', 'Record set in heats or qualifying — see the notes']
	];

	const STRIPPED_EXAMPLE = [
		{ place: 1, canceled: true, name: 'Kelli White', mark: '10.85' },
		{ place: 1, canceled: false, name: 'Torri Edwards', mark: '10.93' },
		{ place: 2, canceled: false, name: 'Chandra Sturrup', mark: '11.02' }
	];

	const SHORT_NOTES = [
		{
			id: 'nations',
			text: 'Some nations that no longer exist are merged under today’s code, and the notes give the flag each medallist competed under.',
			example: 'GER · Notes: competed under flag FRG (1949–89)'
		},
		{
			id: 'splits',
			text: 'When split times are known, every runner’s split is listed in the notes of the relay result.'
		},
		{
			id: 'adjusted',
			text: 'Some marks were measured electronically later and adapted — mostly 1/10 s results converted to 1/100 s in earlier Olympic results.'
		},
		{
			id: 'ties',
			text: 'Tie-break details are in the Notes column: thousandths in sprints, or attempt series in the vertical jumps.',
			example: 'e.g. 10.844 vs 10.846 · or xxo vs xo'
		},
		{
			id: 'yog',
			text: 'Buenos Aires combined two races into one final result. All marks are in the Notes column (total = first + second) instead of the Mark column.'
		}
	];

	const CARD = 'scroll-mt-6 rounded-[20px] border border-line bg-surface';

	let active = $state(SECTIONS[0].id);

	const numberOf = (id: string) =>
		String(SECTIONS.findIndex((section) => section.id === id) + 1).padStart(2, '0');
	const labelOf = (id: string) => SECTIONS.find((section) => section.id === id)?.label ?? '';

	const followScroll: Attachment<HTMLElement> = (content) => {
		const inView: Record<string, boolean> = {};
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) inView[entry.target.id] = entry.isIntersecting;
				active = SECTIONS.find((section) => inView[section.id])?.id ?? active;
			},
			{ rootMargin: '-40px 0px -70% 0px' }
		);
		for (const section of content.querySelectorAll('[id]')) observer.observe(section);
		return () => observer.disconnect();
	};
</script>

{#snippet heading(id: string, text: string, size = 'text-[34px]')}
	<div class="flex flex-col gap-2.5">
		<span class="font-data text-xs font-bold tracking-[0.14em] text-brand-ink">{numberOf(id)}</span>
		<h2 class="font-display {size} leading-none font-bold">{labelOf(id)}</h2>
		<p class="text-[15.5px] leading-relaxed text-ink-2">{text}</p>
	</div>
{/snippet}

<SeoHead
	title="How to read the database"
	description="The symbols, columns and conventions used in every Athletics Podium results table, from wind readings to withdrawn medals."
	path={PAGES.databaseNotes}
/>

<section class="page-container pt-11 pb-7">
	<div class="flex max-w-[820px] flex-col gap-3">
		<a href={PAGES.about} class="self-start text-[13.5px] text-ink-3 hover:text-ink">← About</a>
		<h1 class="font-display text-[56px] leading-[0.88] font-bold sm:text-[96px]">
			How to read the database
		</h1>
		<p class="text-lg leading-relaxed text-ink-2">
			The symbols, columns and conventions used in every results table — from wind readings to
			withdrawn medals.
		</p>
	</div>
</section>

<section class="page-container pt-2 pb-[72px]">
	<div class="grid grid-cols-1 items-start gap-12 md:grid-cols-[250px_minmax(0,1fr)]">
		<nav
			aria-label="On this page"
			class="grid grid-cols-2 gap-0.5 sm:grid-cols-3 md:sticky md:top-6 md:flex md:flex-col"
		>
			{#each SECTIONS as section (section.id)}
				<a
					href="#{section.id}"
					aria-current={active === section.id ? 'location' : undefined}
					onclick={() => (active = section.id)}
					class="flex gap-2.5 border-l-[3px] px-3 py-2 text-sm hover:text-ink {active === section.id
						? 'border-brand font-bold text-ink'
						: 'border-line font-medium text-ink-3'}"
				>
					<span class="font-data font-medium text-ink-3">{numberOf(section.id)}</span>
					{section.label}
				</a>
			{/each}
		</nav>

		<div {@attach followScroll} class="flex min-w-0 flex-col gap-[22px]">
			<article
				id="olympic"
				class="{CARD} grid grid-cols-1 gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_360px]"
			>
				{@render heading(
					'olympic',
					'The OG badge next to a name marks an Olympic gold medallist, wherever that athlete appears in the archive.'
				)}
				<div class="flex flex-col gap-2.5 self-center rounded-[14px] bg-bg p-4">
					<span class="flex items-center gap-2.5 text-[15px] font-semibold">
						<Flag code="LCA" />Julien Alfred
						<span
							title="Olympic champion"
							class="rounded bg-brand px-[5px] py-0.5 font-data text-[10.5px] font-bold text-ink"
							>OG</span
						>
					</span>
					<span class="flex items-center gap-2.5 text-[15px] font-semibold text-ink-2">
						<Flag code="JAM" />Tina Clayton
					</span>
				</div>
			</article>

			<article id="wind" class="{CARD} flex flex-col gap-4 p-6">
				<div class="max-w-[720px]">
					{@render heading(
						'wind',
						'Shown in small type after a mark: the wind reading in sprints and horizontal jumps where it is known, otherwise one of these technical notes.'
					)}
				</div>
				<dl class="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-x-7">
					{#each MARK_NOTES as [key, meaning] (key)}
						<div
							class="grid grid-cols-[76px_minmax(0,1fr)] items-baseline gap-3.5 border-t border-line py-2.5"
						>
							<dt class="font-data text-base font-bold">{key}</dt>
							<dd class="text-sm leading-snug text-ink-2">{meaning}</dd>
						</div>
					{/each}
				</dl>
			</article>

			<article id="records" class="{CARD} flex flex-col gap-4 p-6">
				<div class="max-w-[720px]">
					{@render heading(
						'records',
						'The Record column shows records set with the medal. It is not yet complete.'
					)}
				</div>
				<dl class="grid grid-cols-[repeat(auto-fill,minmax(min(250px,100%),1fr))] gap-x-6">
					{#each RECORDS as [code, meaning] (code)}
						<div class="flex items-center gap-3 border-t border-line py-[9px]">
							<dt class="flex w-[58px] shrink-0 justify-center"><RecordBadge record={code} /></dt>
							<dd class="text-sm text-ink-2">{meaning}</dd>
						</div>
					{/each}
				</dl>
			</article>

			<article
				id="stripped"
				class="{CARD} grid grid-cols-1 gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_360px]"
			>
				{@render heading(
					'stripped',
					'Medals withdrawn after disciplinary sanctions — mostly doping — are marked DQ and struck through in red. The result keeps its place and mark on record, and the Notes column explains what happened.'
				)}
				<figure class="self-center overflow-hidden rounded-[14px] bg-bg">
					<ol>
						{#each STRIPPED_EXAMPLE as row (row.name)}
							<li
								class="grid grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-line px-3.5 py-2.5 {row.canceled
									? 'bg-dq/5'
									: ''}"
							>
								<MedalDisc
									place={row.place}
									canceled={row.canceled}
									class="size-[26px] text-[11px]"
								/>
								<span
									class="text-sm font-semibold {row.canceled
										? 'text-ink-3 line-through decoration-dq'
										: ''}">{row.name}</span
								>
								<ResultMark
									result={{ mark: row.mark, markNote: null, wind: null, canceled: row.canceled }}
								/>
							</li>
						{/each}
					</ol>
					<figcaption class="px-3.5 py-2 text-xs text-ink-3">
						<a href={meetingUrl('world-champs', '2003-world-champs')} class="hover:text-ink">
							2003 World Championships · women’s 100m
						</a>
					</figcaption>
				</figure>
			</article>

			<div class="grid grid-cols-[repeat(auto-fill,minmax(min(340px,100%),1fr))] gap-4">
				{#each SHORT_NOTES as note (note.id)}
					<article id={note.id} class="{CARD} flex flex-col gap-2.5 p-[22px]">
						{@render heading(note.id, note.text, 'text-[28px]')}
						{#if note.example}
							<span
								class="mt-1 rounded-[10px] bg-bg px-3 py-2.5 font-data text-[13.5px] text-ink-2"
							>
								{note.example}
							</span>
						{/if}
					</article>
				{/each}
			</div>
		</div>
	</div>
</section>
