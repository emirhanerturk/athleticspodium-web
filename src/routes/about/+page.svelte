<script lang="ts">
	import ArticleBody from '#lib/components/article/ArticleBody.svelte';
	import ContactForm from '#lib/components/contact/ContactForm.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import { PAGES, SOCIAL_LINKS } from '#lib/routing/urls.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const EMAIL = 'athleticspodium@gmail.com';
	const PORTRAITS = ['/about/sfe-profile-1.jpg', '/about/sfe-profile-2.jpg'];
</script>

<SeoHead
	title="About Athletics Podium"
	description="About the Athletics Podium project, the people behind it and how to get in touch."
	path={PAGES.about}
/>

<section class="page-container pt-12 pb-16">
	<h1 class="mb-8 font-display text-[52px] leading-[0.9] font-bold sm:text-[88px]">
		About Athletics Podium
	</h1>
	<div class="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
		<div class="flex flex-col gap-10">
			{#if data.main.content}<ArticleBody html={data.main.content} />{/if}
			{#if data.box.content}
				<div
					class="flex flex-col gap-5 rounded-[20px] border border-line bg-surface p-6 sm:flex-row"
				>
					<div class="flex shrink-0 gap-3">
						{#each PORTRAITS as src (src)}
							<img
								{src}
								alt=""
								width="120"
								height="150"
								loading="lazy"
								class="h-[150px] w-[120px] rounded-xl object-cover"
							/>
						{/each}
					</div>
					<ArticleBody html={data.box.content} />
				</div>
			{/if}
		</div>
		<aside class="flex flex-col gap-6 lg:sticky lg:top-6">
			<div class="flex flex-col gap-3">
				<h2 class="font-display text-[30px] leading-none font-bold">Follow</h2>
				<ul class="flex flex-col gap-1.5 text-[15px] font-semibold">
					<li>
						<a href={SOCIAL_LINKS.bluesky} rel="noopener" class="text-brand-ink hover:underline"
							>Bluesky</a
						>
					</li>
					<li>
						<a href={SOCIAL_LINKS.facebook} rel="noopener" class="text-brand-ink hover:underline"
							>Facebook</a
						>
					</li>
					<li>
						<a href={SOCIAL_LINKS.instagram} rel="noopener" class="text-brand-ink hover:underline"
							>Instagram</a
						>
					</li>
					<li><a href="mailto:{EMAIL}" class="text-brand-ink hover:underline">{EMAIL}</a></li>
				</ul>
			</div>
			<div id="contact" class="flex scroll-mt-6 flex-col gap-3">
				<h2 class="font-display text-[30px] leading-none font-bold">Contact</h2>
				<ContactForm {form} />
			</div>
		</aside>
	</div>
</section>
