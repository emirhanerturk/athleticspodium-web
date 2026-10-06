<script lang="ts">
	import ArticleBody from '#lib/components/article/ArticleBody.svelte';
	import ContactForm from '#lib/components/contact/ContactForm.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import { MISSING_INFORMATION_SUBJECT } from '#lib/domain/contact.js';
	import { PAGES } from '#lib/routing/urls.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const tabHref = (tab: string) =>
		tab === data.tabs[0] ? PAGES.missingInformation : `${PAGES.missingInformation}?tab=${tab}`;
</script>

<SeoHead
	title="Missing information"
	description="The medallists, marks, names and relay members the Athletics Podium archive is still looking for, and how to help."
	path={PAGES.missingInformation}
/>

<section class="page-container pt-12 pb-16">
	<h1 class="mb-6 font-display text-[52px] leading-[0.9] font-bold sm:text-[88px]">
		Missing information
	</h1>
	<nav
		aria-label="Sections"
		class="mb-8 flex [scrollbar-width:none] gap-1 overflow-x-auto border-b border-line"
	>
		{#each data.tabs as tab (tab)}
			<a
				href={tabHref(tab)}
				aria-current={tab === data.tab ? 'page' : undefined}
				data-sveltekit-noscroll
				class="flex-none border-b-[3px] px-3.5 pt-3 pb-3 text-[15px] font-bold capitalize hover:text-ink {tab ===
				data.tab
					? 'border-brand text-ink'
					: 'border-transparent text-ink-2'}">{tab}</a
			>
		{/each}
	</nav>
	<div class="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
		<div>
			{#if data.page.content}<ArticleBody html={data.page.content} />{/if}
		</div>
		<aside class="flex flex-col gap-3 lg:sticky lg:top-6">
			<h2 class="font-display text-[30px] leading-none font-bold">Be a collaborator</h2>
			<p class="text-[15px] leading-normal text-ink-2">
				Know a missing medallist, mark or name? Send it with the source and it goes into the
				archive.
			</p>
			<ContactForm {form} fixedSubject={MISSING_INFORMATION_SUBJECT} />
		</aside>
	</div>
</section>
