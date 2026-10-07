<script lang="ts">
	import ChevronDownIcon from '#lib/components/ui/icons/ChevronDownIcon.svelte';
	import { PAGES } from '#lib/routing/urls.js';

	let { itemClass }: { itemClass: string } = $props();

	const tools = [
		{ label: 'Medal search', href: PAGES.medalSearch },
		{ label: 'Medal countdown', href: PAGES.medalCountdown },
		{ label: 'Compare championships', href: PAGES.compare }
	];

	let button: HTMLButtonElement;
	let menu: HTMLElement;
	let position = $state({ top: 0, left: 0 });

	function placeBelowButton(event: ToggleEvent) {
		if (event.newState !== 'open') return;
		const { bottom, left } = button.getBoundingClientRect();
		position = { top: bottom + 4, left };
	}
</script>

<button
	bind:this={button}
	type="button"
	popovertarget="tools-menu"
	class="{itemClass} gap-1.5 font-medium text-ink-2 hover:text-ink"
>
	Tools <ChevronDownIcon />
</button>

<div
	bind:this={menu}
	id="tools-menu"
	popover
	onbeforetoggle={placeBelowButton}
	style:top="{position.top}px"
	style:left="{position.left}px"
	class="fixed inset-auto m-0 min-w-64 rounded-xl border border-line bg-surface p-1.5 shadow-[0_10px_28px_rgba(18,19,22,.16)]"
>
	{#each tools as tool (tool.href)}
		<a
			href={tool.href}
			onclick={() => menu.hidePopover()}
			class="block rounded-lg px-3 py-2.5 text-[15px] text-ink hover:bg-surface-2"
		>
			{tool.label}
		</a>
	{/each}
</div>
