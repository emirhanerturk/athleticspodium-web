<script lang="ts">
	import { onMount } from 'svelte';
	import CheckIcon from '#lib/components/ui/icons/CheckIcon.svelte';
	import LinkIcon from '#lib/components/ui/icons/LinkIcon.svelte';
	import ShareIcon from '#lib/components/ui/icons/ShareIcon.svelte';

	let { url, title }: { url: string; title: string } = $props();

	const COPIED_MS = 2000;

	let copied = $state(false);
	let canShare = $state(false);

	onMount(() => {
		canShare = typeof navigator.share === 'function';
	});

	async function copy() {
		await navigator.clipboard.writeText(url);
		copied = true;
		setTimeout(() => (copied = false), COPIED_MS);
	}

	function share() {
		// The visitor closing the share sheet rejects the promise
		navigator.share({ title, url }).catch(() => {});
	}

	const button =
		'grid size-9 place-items-center rounded-full border border-line-2 text-ink-2 hover:border-brand hover:bg-brand hover:text-ink';
</script>

<div class="flex items-center gap-2">
	<span class="font-data text-xs text-ink-3" aria-live="polite">{copied ? 'Link copied' : ''}</span>
	<button
		type="button"
		class="{button} {copied ? 'border-brand bg-brand text-ink' : ''}"
		aria-label="Copy link"
		title="Copy link"
		onclick={copy}
	>
		{#if copied}<CheckIcon />{:else}<LinkIcon />{/if}
	</button>
	{#if canShare}
		<button type="button" class={button} aria-label="Share" title="Share" onclick={share}>
			<ShareIcon />
		</button>
	{/if}
</div>
