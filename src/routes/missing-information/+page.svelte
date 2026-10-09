<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ContactForm from '#lib/components/contact/ContactForm.svelte';
	import GapGroupCard from '#lib/components/missing/GapGroupCard.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import SearchIcon from '#lib/components/ui/icons/SearchIcon.svelte';
	import { MISSING_INFORMATION_SUBJECT } from '#lib/domain/contact.js';
	import {
		describeGap,
		filterGaps,
		gapCount,
		MISSING_SECTIONS,
		parseMissingSection,
		type Gap,
		type MissingSection
	} from '#lib/domain/missing.js';
	import { CONTACT_EMAIL, missingInformationUrl, PAGES } from '#lib/routing/urls.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const LABELS: Record<MissingSection, string> = {
		medallists: 'Medallists',
		marks: 'Marks',
		names: 'Names',
		relays: 'Relays'
	};
	const INTROS: Record<MissingSection, string> = {
		medallists:
			'Podium places with no athlete on record. Dashed discs show which medals are missing.',
		marks: 'Medallists we know, but without a winning time, height or distance.',
		names: 'Athletes known only by a surname or an initial.',
		relays: 'Relay teams whose podium or legs are still unknown.'
	};
	const STEPS = ['Find a gap below', 'Send what you know + your source', 'Get credited'];

	const tab = $derived(parseMissingSection(page.url.searchParams.get('tab')));
	const query = $derived(page.url.searchParams.get('q') ?? '');
	const gap = $derived(page.url.searchParams.get('gap'));
	const groups = $derived(filterGaps(data.lists[tab], query));

	const knowHref = (item: Gap, group: string | null) =>
		`${missingInformationUrl({ tab, query, gap: describeGap(item, group) })}#send`;

	function filter(event: Event & { currentTarget: HTMLInputElement }) {
		goto(missingInformationUrl({ tab, query: event.currentTarget.value }), {
			replace: true,
			reset: false
		});
	}
</script>

<SeoHead
	title="Missing information"
	description="The medallists, marks, names and relay members the Athletics Podium archive is still looking for, and how to help."
	path={PAGES.missingInformation}
/>

<section class="bg-night text-night-ink">
	<div class="page-container pt-11">
		<div class="grid grid-cols-1 items-end gap-10 pb-7 md:grid-cols-2">
			<div class="flex flex-col gap-3">
				<a
					href={PAGES.about}
					class="self-start text-[13.5px] text-night-ink-4 hover:text-night-ink"
				>
					← About
				</a>
				<h1 class="font-display text-[56px] leading-[0.88] font-bold sm:text-[96px]">
					Missing <span class="text-brand">information</span>
				</h1>
			</div>
			<div class="flex flex-col gap-3.5">
				<p class="leading-relaxed text-night-ink-3">
					The podiums we still can’t complete. If you know a name, a mark or a relay leg — or where
					to find it — send it in. Every fix is credited on the About page.
				</p>
				<ol class="flex flex-wrap gap-x-[18px] gap-y-1 text-[13.5px] text-night-ink-3">
					{#each STEPS as step, index (step)}
						<li><strong class="text-brand">{index + 1}</strong> {step}</li>
					{/each}
				</ol>
			</div>
		</div>
		<nav aria-label="Lists" class="flex [scrollbar-width:none] gap-1 overflow-x-auto">
			{#each MISSING_SECTIONS as section (section)}
				{@const count = gapCount(data.lists[section])}
				<a
					href={missingInformationUrl({ tab: section })}
					aria-current={section === tab ? 'page' : undefined}
					data-sveltekit-reset="false"
					data-sveltekit-replacestate
					class="flex flex-none items-baseline gap-2.5 rounded-t-[14px] px-5 pt-4 pb-[15px] font-display text-[26px] leading-none font-bold {section ===
					tab
						? 'bg-bg text-ink'
						: 'text-night-ink-3 hover:text-night-ink'}"
				>
					{LABELS[section]}
					<span class="font-data text-sm font-semibold opacity-65">{count || '—'}</span>
				</a>
			{/each}
		</nav>
	</div>
</section>

<section class="page-container pt-7 pb-12">
	<div class="grid grid-cols-1 items-start gap-9 md:grid-cols-[minmax(0,1fr)_320px]">
		<div class="flex min-w-0 flex-col gap-[18px]">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<p class="text-[15px] text-ink-2">{INTROS[tab]}</p>
				{#if data.lists[tab].length}
					<form
						method="get"
						role="search"
						class="flex h-10 w-[min(300px,100%)] items-center gap-2.5 rounded-[10px] border border-line-2 bg-surface px-3.5 text-ink-3 focus-within:border-ink"
					>
						{#if tab !== MISSING_SECTIONS[0]}<input type="hidden" name="tab" value={tab} />{/if}
						<SearchIcon class="size-4 shrink-0" />
						<input
							type="search"
							name="q"
							value={query}
							oninput={filter}
							aria-label="Filter the list"
							placeholder="Filter — year, event, nation"
							class="min-w-0 flex-1 bg-transparent text-[14.5px] text-ink outline-none"
						/>
					</form>
				{/if}
			</div>

			{#each groups as group (group.name ?? '')}
				<GapGroupCard {group} relays={tab === 'relays'} {knowHref} />
			{:else}
				<div
					class="flex flex-col items-center gap-2.5 rounded-[20px] border border-dashed border-line-2 p-11 text-center"
				>
					{#if data.lists[tab].length}
						<strong class="font-display text-[32px] leading-none font-bold">
							No gap matches “{query}”
						</strong>
						<span class="max-w-[460px] text-[14.5px] text-ink-2">
							Try a year, an event code like 4x400 or a nation code like NGR.
						</span>
					{:else}
						<strong class="font-display text-[32px] leading-none font-bold">
							This list is being compiled
						</strong>
						<span class="max-w-[460px] text-[14.5px] text-ink-2">
							Know an athlete recorded only by a surname or an initial? Send it anyway.
						</span>
					{/if}
				</div>
			{/each}
		</div>

		<aside class="flex flex-col gap-4 md:sticky md:top-6">
			<div class="flex flex-col gap-2.5 rounded-[18px] bg-brand p-5 text-ink">
				<h2 class="font-display text-[30px] leading-none font-bold">Know something?</h2>
				<p class="text-sm leading-normal">
					A results book, a club archive, a family photo — anything that fills a gap helps. Tell us
					where it comes from.
				</p>
				<a
					href="#send"
					class="grid h-[42px] place-items-center rounded-[10px] bg-ink text-[14.5px] font-bold text-bg hover:opacity-90"
				>
					Send information
				</a>
				<span class="text-[12.5px]">
					or <a href="mailto:{CONTACT_EMAIL}" class="underline hover:no-underline"
						>{CONTACT_EMAIL}</a
					>
				</span>
			</div>
		</aside>
	</div>
</section>

<section id="send" class="page-container scroll-mt-6 pb-16">
	<div
		class="grid grid-cols-1 items-start gap-8 border-t-[3px] border-ink pt-6 md:grid-cols-[minmax(0,1fr)_minmax(0,560px)]"
	>
		<div class="flex flex-col gap-3">
			<h2 class="font-display text-[34px] leading-[0.94] font-bold sm:text-[44px]">
				Send what you know
			</h2>
			<p class="max-w-[440px] text-[15px] leading-relaxed text-ink-2">
				Name the gap, what you know and where it comes from — a results book, a newspaper, a
				federation site. We add it to the archive and credit you.
			</p>
		</div>
		<ContactForm
			{form}
			fixedSubject={MISSING_INFORMATION_SUBJECT}
			draft={gap ? `${gap}\n\n` : ''}
		/>
	</div>
</section>
