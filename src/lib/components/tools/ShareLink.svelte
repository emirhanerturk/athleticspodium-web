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

{#snippet address()}
	<code class="font-data text-[13px] break-all text-ink-2">
		{url.host}{url.pathname}{url.search}
	</code>
{/snippet}

{#if canCopy}
	<button
		type="button"
		onclick={copy}
		title="Copy link"
		class="group inline-flex max-w-full items-center gap-1 rounded-md bg-surface-2 py-[3px] pr-1 pl-2 text-left hover:bg-line {className}"
	>
		<span class="sr-only">Copy link:</span>
		{@render address()}
		<span class="grid size-6 shrink-0 place-items-center text-ink-3 group-hover:text-ink">
			{#if copied}
				<CheckIcon class="size-3.5 text-brand-ink" />
			{:else}
				<CopyIcon class="size-3.5" />
			{/if}
		</span>
	</button>
	<span role="status" class="sr-only">{copied ? 'Link copied' : ''}</span>
{:else}
	<span class="inline-flex max-w-full rounded-md bg-surface-2 px-2 py-[3px] {className}">
		{@render address()}
	</span>
{/if}
