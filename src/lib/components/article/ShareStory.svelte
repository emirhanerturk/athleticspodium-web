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
		'inline-flex h-9 items-center gap-2 rounded-full border border-line-2 bg-surface px-3.5 text-[13.5px] font-semibold hover:border-ink';
</script>

<div class="flex flex-wrap gap-2">
	<button type="button" class={button} onclick={copy}>
		{#if copied}<CheckIcon />Link copied{:else}<LinkIcon />Copy link{/if}
	</button>
	{#if canShare}
		<button type="button" class={button} onclick={share}><ShareIcon />Share</button>
	{/if}
</div>
