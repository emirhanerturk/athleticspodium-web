<script lang="ts">
	import { goto } from '$app/navigation';
	import type { EditionRef } from '#lib/domain/championship.js';
	import { champUrl, meetingUrl } from '#lib/routing/urls.js';

	let {
		champSlug,
		editions,
		current
	}: { champSlug: string; editions: EditionRef[]; current: string } = $props();

	const index = $derived(editions.findIndex((edition) => edition.slug === current));
	const newer = $derived(index > 0 ? editions[index - 1] : null);
	const older = $derived(index >= 0 ? (editions[index + 1] ?? null) : null);

	const label = (edition: EditionRef) => [edition.year, edition.city].filter(Boolean).join(' ');
	const LINK =
		'inline-flex h-10 items-center gap-2 rounded-full border border-line-2 text-sm font-semibold hover:bg-surface';
</script>

<div class="flex flex-wrap items-center gap-2">
	{#if older}
		<a href={meetingUrl(champSlug, older.slug)} class="{LINK} pr-3.5 pl-2.5" rel="prev">
			<svg
				class="size-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"><path d="M15 6l-6 6 6 6"></path></svg
			>
			{label(older)}
		</a>
	{/if}
	<label class="relative inline-flex items-center">
		<span class="sr-only">Edition</span>
		<select
			value={current}
			onchange={(event) => goto(meetingUrl(champSlug, event.currentTarget.value))}
			class="h-10 appearance-none rounded-full border border-line-2 bg-surface pr-9 pl-3.5 font-data text-[14.5px] font-semibold"
		>
			{#each editions as edition (edition.slug)}
				<option value={edition.slug}>{edition.year} · {edition.city ?? edition.name}</option>
			{/each}
		</select>
		<svg
			class="pointer-events-none absolute right-3.5 size-3.5"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.4"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg
		>
	</label>
	{#if newer}
		<a href={meetingUrl(champSlug, newer.slug)} class="{LINK} pr-2.5 pl-3.5" rel="next">
			{label(newer)}
			<svg
				class="size-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"><path d="M9 6l6 6-6 6"></path></svg
			>
		</a>
	{/if}
	<a href={champUrl(champSlug)} class="ml-1 text-sm font-semibold text-brand-ink hover:underline">
		All {editions.length} editions
	</a>
</div>
