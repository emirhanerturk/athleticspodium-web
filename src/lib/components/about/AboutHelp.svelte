<script lang="ts">
	import ContactForm from '#lib/components/contact/ContactForm.svelte';
	import type { ContactFormResult, ContactTopic } from '#lib/domain/contact.js';
	import type { MissingSection } from '#lib/domain/missing.js';
	import { CONTACT_EMAIL, missingInformationUrl, PAGES, SOCIAL_LINKS } from '#lib/routing/urls.js';

	let {
		form,
		topic
	}: {
		form: ContactFormResult | null;
		topic: ContactTopic;
	} = $props();

	const GAPS: { tab: MissingSection; title: string; text: string }[] = [
		{ tab: 'medallists', title: 'Medallists', text: 'Podium places with no athlete name yet' },
		{ tab: 'marks', title: 'Marks', text: 'Medals without a winning time or distance' },
		{ tab: 'names', title: 'Names', text: 'Athletes known by a surname or initial only' },
		{ tab: 'relays', title: 'Relays', text: 'Relay teams with unknown legs' }
	];
	const LINKS = [
		{ label: 'Bluesky', href: SOCIAL_LINKS.bluesky },
		{ label: 'Facebook', href: SOCIAL_LINKS.facebook },
		{ label: 'Instagram', href: SOCIAL_LINKS.instagram },
		{ label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` }
	];
</script>

<section id="help" class="page-container scroll-mt-6 pt-8 pb-9 sm:pt-14 sm:pb-[72px]">
	<div class="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
		<div class="flex flex-col gap-[18px]">
			<span class="font-data text-[12.5px] font-bold tracking-[0.16em] text-brand-ink uppercase">
				Share your knowledge
			</span>
			<h2 class="font-display text-[30px] leading-[0.92] font-bold sm:text-[56px]">
				Help us fill the gaps
			</h2>
			<p class="text-[16.5px] leading-[1.65] text-ink-2">
				Some podiums still have missing names, marks or relay legs. Send what you know — after every
				contribution your name joins the list above.
			</p>
			<ul class="grid grid-cols-2 gap-2.5">
				{#each GAPS as gap (gap.tab)}
					<li>
						<a
							href={missingInformationUrl({ tab: gap.tab })}
							class="flex h-full flex-col gap-1.5 rounded-2xl border border-line bg-surface p-4 hover:border-ink"
						>
							<strong class="font-display text-[26px] leading-none font-bold">{gap.title}</strong>
							<span class="text-[13px] leading-[1.45] text-ink-3">{gap.text}</span>
							<span class="mt-auto text-[13px] font-bold text-brand-ink">See the list →</span>
						</a>
					</li>
				{/each}
			</ul>
			<a
				href={PAGES.databaseNotes}
				class="flex items-center justify-between gap-3 rounded-[14px] bg-surface-2 px-4 py-3.5 text-[14.5px] font-semibold hover:bg-brand-soft"
			>
				<span
					>New here? <strong>How to read the database</strong> — symbols, records, wind codes</span
				>
				<span aria-hidden="true">→</span>
			</a>
			<div class="flex flex-wrap gap-2 pt-2">
				{#each LINKS as link (link.label)}
					<a
						href={link.href}
						rel="noopener"
						class="inline-flex h-[38px] items-center rounded-full border border-line-2 px-3.5 text-sm font-semibold hover:border-ink"
					>
						{link.label}
					</a>
				{/each}
			</div>
		</div>
		<div id="contact" class="scroll-mt-6">
			<ContactForm {form} {topic} title="Contact" />
		</div>
	</div>
</section>
