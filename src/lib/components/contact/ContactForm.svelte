<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		CONTACT_TOPICS,
		topicBySubject,
		type ContactFormResult,
		type ContactMessage,
		type ContactTopic
	} from '#lib/domain/contact.js';

	let {
		form,
		title,
		topic = CONTACT_TOPICS[0],
		fixedSubject,
		draft = ''
	}: {
		form: ContactFormResult | null;
		title?: string;
		topic?: ContactTopic;
		fixedSubject?: number;
		draft?: string;
	} = $props();

	const EMAIL = 'athleticspodium@gmail.com';

	let sending = $state(false);
	let subject = $derived(form?.values?.subject ?? topic.subject);

	const errors = $derived(form?.errors ?? {});
	const chosen = $derived(topicBySubject(subject));
	const messageLabel = $derived(fixedSubject === undefined ? chosen.field : 'Message');
	const LABEL = 'flex flex-col gap-1.5 text-[13px] font-semibold text-ink-2';
	const FIELD = 'w-full rounded-[10px] border bg-bg px-3 text-[15px] font-normal text-ink';
	const border = (key: keyof ContactMessage) => (errors[key] ? 'border-dq' : 'border-line-2');
</script>

{#if form?.sent}
	<div
		role="status"
		class="flex flex-col gap-2 rounded-[22px] border border-line bg-surface p-6 text-center"
	>
		<span
			aria-hidden="true"
			class="mx-auto grid size-12 place-items-center rounded-full bg-brand text-2xl font-bold"
			>✓</span
		>
		<strong class="font-display text-[28px] leading-none font-bold">Thank you!</strong>
		<span class="text-[15px] text-ink-2">Your message has been sent.</span>
	</div>
{:else}
	<form
		method="post"
		novalidate
		use:enhance={() => {
			sending = true;
			return async ({ update }) => {
				await update({ reset: false });
				sending = false;
			};
		}}
		class="flex flex-col gap-3.5 rounded-[22px] border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(18,19,22,.05),0_8px_24px_rgba(18,19,22,.06)] sm:p-[26px]"
	>
		{#if title}
			<h2 class="font-display text-[32px] leading-none font-bold">{title}</h2>
		{/if}
		{#if fixedSubject === undefined}
			<fieldset class="flex flex-wrap gap-1.5">
				<legend class="sr-only">Topic</legend>
				{#each CONTACT_TOPICS as item (item.key)}
					<label
						class="inline-flex h-8 cursor-pointer items-center rounded-full border border-line-2 px-3 text-[13.5px] font-semibold hover:border-ink has-checked:border-ink has-checked:bg-ink has-checked:text-bg has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink"
					>
						<input
							type="radio"
							name="subject"
							value={item.subject}
							bind:group={subject}
							class="sr-only"
						/>
						{item.label}
					</label>
				{/each}
			</fieldset>
		{/if}
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
			<label class={LABEL}>
				Name
				<input
					name="name"
					required
					maxlength="100"
					autocomplete="name"
					value={form?.values?.name ?? ''}
					aria-invalid={!!errors.name}
					class="h-11 {FIELD} {border('name')}"
				/>
				{#if errors.name}<span class="font-normal text-dq">{errors.name}</span>{/if}
			</label>
			<label class={LABEL}>
				Email
				<input
					name="email"
					type="email"
					required
					maxlength="100"
					autocomplete="email"
					value={form?.values?.email ?? ''}
					aria-invalid={!!errors.email}
					class="h-11 {FIELD} {border('email')}"
				/>
				{#if errors.email}<span class="font-normal text-dq">{errors.email}</span>{/if}
			</label>
		</div>
		<label class={LABEL}>
			{messageLabel}
			<textarea
				name="message"
				required
				maxlength="1000"
				rows="6"
				placeholder={fixedSubject === undefined ? chosen.hint : ''}
				aria-invalid={!!errors.message}
				class="{FIELD} {border('message')} resize-y py-3 leading-normal"
				>{form?.values?.message ?? draft}</textarea
			>
			{#if errors.message}<span class="font-normal text-dq">{errors.message}</span>{/if}
		</label>
		{#if errors.subject}<span class="text-[13px] text-dq">{errors.subject}</span>{/if}
		<label class="sr-only" aria-hidden="true">
			Leave this empty
			<input name="website" tabindex="-1" autocomplete="off" />
		</label>
		{#if form?.failed}
			<p role="alert" class="text-sm font-semibold text-dq">
				The message could not be sent. Please try again later.
			</p>
		{/if}
		<button
			type="submit"
			disabled={sending}
			class="h-12 rounded-xl bg-brand text-base font-bold text-ink hover:bg-brand-hover disabled:opacity-50"
		>
			{sending ? 'Sending…' : 'Send'}
		</button>
		<span class="text-[12.5px] text-ink-3">
			Or write to <a href="mailto:{EMAIL}" class="underline hover:text-ink">{EMAIL}</a>
		</span>
	</form>
{/if}
