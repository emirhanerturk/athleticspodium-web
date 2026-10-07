<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		CONTACT_SUBJECTS,
		type ContactErrors,
		type ContactMessage
	} from '#lib/domain/contact.js';

	let {
		form,
		fixedSubject,
		draft = ''
	}: {
		form: {
			sent?: boolean;
			failed?: boolean;
			values?: ContactMessage;
			errors?: ContactErrors;
		} | null;
		fixedSubject?: number;
		draft?: string;
	} = $props();

	let sending = $state(false);

	const errors = $derived(form?.errors ?? {});
	const LABEL = 'font-data text-xs tracking-[0.12em] text-ink-3 uppercase';
	const FIELD = 'w-full rounded-xl border bg-surface px-3 text-[15px]';
	const border = (key: keyof ContactMessage) => (errors[key] ? 'border-dq' : 'border-line-2');
</script>

{#if form?.sent}
	<div
		role="status"
		class="flex flex-col gap-2 rounded-[20px] border border-line bg-surface p-6 text-center"
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
		class="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-5"
	>
		<label class="flex flex-col gap-1.5">
			<span class={LABEL}>Name</span>
			<input
				name="name"
				required
				maxlength="100"
				autocomplete="name"
				value={form?.values?.name ?? ''}
				aria-invalid={!!errors.name}
				class="h-11 {FIELD} {border('name')}"
			/>
			{#if errors.name}<span class="text-[13px] text-dq">{errors.name}</span>{/if}
		</label>
		<label class="flex flex-col gap-1.5">
			<span class={LABEL}>Email</span>
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
			{#if errors.email}<span class="text-[13px] text-dq">{errors.email}</span>{/if}
		</label>
		{#if fixedSubject === undefined}
			<label class="flex flex-col gap-1.5">
				<span class={LABEL}>Subject</span>
				<select name="subject" class="h-11 {FIELD} {border('subject')} font-semibold">
					{#each CONTACT_SUBJECTS as subject, index (subject)}
						<option value={String(index)} selected={index === (form?.values?.subject ?? 0)}
							>{subject}</option
						>
					{/each}
				</select>
			</label>
		{/if}
		<label class="flex flex-col gap-1.5">
			<span class={LABEL}>Message</span>
			<textarea
				name="message"
				required
				maxlength="1000"
				rows="5"
				aria-invalid={!!errors.message}
				class="{FIELD} {border('message')} py-2.5 leading-normal"
				>{form?.values?.message ?? draft}</textarea
			>
			{#if errors.message}<span class="text-[13px] text-dq">{errors.message}</span>{/if}
		</label>
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
			class="h-11 self-start rounded-full bg-ink px-6 text-[15px] font-bold text-bg hover:opacity-90 disabled:opacity-50"
		>
			{sending ? 'Sending…' : 'Send message'}
		</button>
	</form>
{/if}
