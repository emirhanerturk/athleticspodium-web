<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import ChevronDownIcon from '#lib/components/ui/icons/ChevronDownIcon.svelte';
	import { TOOLS } from '#lib/domain/tools.js';

	let { itemClass, label }: { itemClass: string; label: Snippet<[string]> } = $props();

	const PANEL_WIDTH = 340;
	const EDGE = 8;
	const CLOSE_DELAY = 150;

	let button: HTMLButtonElement;
	let menu: HTMLElement;
	let position = $state({ top: 0, left: 0 });
	let open = $state(false);
	let openedByHover = false;
	let closing: ReturnType<typeof setTimeout> | undefined;

	function placeBelowButton(event: ToggleEvent) {
		if (event.newState !== 'open') return;
		const { bottom, left } = button.getBoundingClientRect();
		const right = window.innerWidth - PANEL_WIDTH - EDGE;
		position = { top: bottom + 4, left: Math.max(EDGE, Math.min(left, right)) };
	}

	function track(event: ToggleEvent) {
		open = event.newState === 'open';
		if (!open) openedByHover = false;
	}

	function hoverIn(event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		clearTimeout(closing);
		if (open) return;
		openedByHover = true;
		menu.showPopover();
	}

	function hoverOut(event: PointerEvent) {
		if (event.pointerType !== 'mouse' || !openedByHover) return;
		clearTimeout(closing);
		closing = setTimeout(() => menu.hidePopover(), CLOSE_DELAY);
	}

	function keepHoverOpen(event: MouseEvent) {
		if (openedByHover) event.preventDefault();
	}
</script>

<button
	bind:this={button}
	type="button"
	popovertarget="tools-menu"
	onclick={keepHoverOpen}
	onpointerenter={hoverIn}
	onpointerleave={hoverOut}
	class="{itemClass} gap-1.5"
>
	{@render label('Tools')}
	<ChevronDownIcon class="size-3.5 transition-transform duration-200 {open ? 'rotate-180' : ''}" />
</button>

<nav
	bind:this={menu}
	id="tools-menu"
	aria-label="Tools menu"
	popover
	onbeforetoggle={placeBelowButton}
	ontoggle={track}
	onpointerenter={hoverIn}
	onpointerleave={hoverOut}
	style:top="{position.top}px"
	style:left="{position.left}px"
	style:width="{PANEL_WIDTH}px"
	class="fixed inset-auto m-0 max-w-[calc(100vw-16px)] -translate-y-1 rounded-2xl border border-line bg-surface p-1.5 opacity-0 shadow-[0_14px_36px_rgba(18,19,22,.16)] transition-[opacity,translate,display,overlay] transition-discrete duration-150 ease-out open:translate-y-0 open:opacity-100 starting:open:-translate-y-1 starting:open:opacity-0"
>
	<ul class="divide-y divide-line">
		{#each TOOLS as tool (tool.key)}
			{@const current = page.url.pathname === tool.href}
			<li>
				<a
					href={tool.href}
					aria-current={current ? 'page' : undefined}
					onclick={() => menu.hidePopover()}
					class="my-0.5 flex flex-col gap-0.5 rounded-xl px-3.5 py-3 {current
						? 'bg-brand-soft'
						: 'hover:bg-surface-2'}"
				>
					<strong class="text-[15px] font-bold text-ink">{tool.title}</strong>
					<span class="text-[13px] leading-snug text-ink-3">{tool.text}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
