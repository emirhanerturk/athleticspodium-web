<script lang="ts">
	import { onMount } from 'svelte';
	import CheckIcon from '#lib/components/ui/icons/CheckIcon.svelte';
	import CopyIcon from '#lib/components/ui/icons/CopyIcon.svelte';

	let { url, class: className = '' }: { url: URL; class?: string } = $props();

	const COPIED_FOR_MS = 2000;

	let canCopy = $state(false);
	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	onMount(() => (canCopy = !!navigator.clipboard));

	async function copy() {
		try {
			await navigator.clipboard.writeText(url.href);
		} catch {
			return;
		}
		copied = true;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), COPIED_FOR_MS);
	}
</script>

<span
	class="inline-flex max-w-full items-center gap-1 rounded-md bg-surface-2 py-[3px] pl-2 {canCopy
		? 'pr-1'
		: 'pr-2'} {className}"
>
	<code class="font-data text-[13px] break-all text-ink-2">
		{url.host}{url.pathname}{url.search}
	</code>
	{#if canCopy}
		<button
			type="button"
			onclick={copy}
			aria-label="Copy link"
			title="Copy link"
			class="grid size-6 shrink-0 place-items-center rounded text-ink-3 hover:bg-line hover:text-ink"
		>
			{#if copied}
				<CheckIcon class="size-3.5 text-brand-ink" />
			{:else}
				<CopyIcon class="size-3.5" />
			{/if}
		</button>
		<span role="status" class="sr-only">{copied ? 'Link copied' : ''}</span>
	{/if}
</span>
