<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Highlighted from '#lib/components/search/Highlighted.svelte';
	import { countPicks, matchPicks, type PickGroup } from '#lib/domain/pick-list.js';
	import { searchWords } from '#lib/utils/fold-text.js';
	import Flag from './Flag.svelte';
	import CheckIcon from './icons/CheckIcon.svelte';
	import ChevronDownIcon from './icons/ChevronDownIcon.svelte';
	import CloseIcon from './icons/CloseIcon.svelte';
	import SearchIcon from './icons/SearchIcon.svelte';

	let {
		label,
		name,
		value,
		text,
		flag,
		groups,
		fallback = groups,
		anyLabel,
		placeholder,
		tabs = [],
		tab,
		ontab,
		disabled = false,
		class: tone = 'border-ink bg-bg hover:bg-brand-soft',
		onchoose
	}: {
		label: string;
		name: string;
		value: string;
		text: string;
		flag?: string;
		groups: PickGroup[];
		fallback?: PickGroup[];
		anyLabel?: string;
		placeholder?: string;
		tabs?: { value: string; label: string }[];
		tab?: string;
		ontab?: (tab: string) => void;
		disabled?: boolean;
		class?: string;
		onchoose: (value: string) => void;
	} = $props();

	const SEARCH_ABOVE = 12;
	const PAGE = 8;
	const WIDTH = 360;
	const TALLEST = 480;
	const EDGE = 8;
	const GAP = 6;
	const ROOM = 320;
	const CHIP =
		'relative inline-flex h-11 max-w-full items-center gap-2 rounded-xl border-2 px-3 text-[20px] sm:h-[50px] sm:text-[26px]';

	const id = $props.id();
	let enhanced = $state(false);
	let rendered = $state(false);
	let open = $state(false);
	let searchable = $state(false);
	let query = $state('');
	let active = $state(0);
	let place = $state<{ top?: number; bottom?: number; left: number } | null>(null);
	let maxHeight = $state<number>();
	let button = $state<HTMLButtonElement>();
	let panel = $state<HTMLElement>();
	let input = $state<HTMLInputElement>();
	let listbox = $state<HTMLElement>();

	const anyGroup = $derived<PickGroup[]>(
		anyLabel
			? [
					{
						label: null,
						options: [{ value: '', label: anyLabel[0].toUpperCase() + anyLabel.slice(1) }]
					}
				]
			: []
	);
	const visible = $derived(query.trim() ? matchPicks(groups, query) : [...anyGroup, ...groups]);
	const offsets = $derived(visible.map((_, index) => countPicks(visible.slice(0, index))));
	const options = $derived(visible.flatMap((group) => group.options));
	const highlight = $derived(searchWords(query)[0] ?? '');
	const optionId = (index: number) => `${id}-option-${index}`;
	const activeId = $derived(options[active] ? optionId(active) : undefined);

	onMount(() => (enhanced = true));

	$effect(() => {
		if (!open) return;
		const follow = (event: Event) => {
			if (event.target instanceof Node && panel?.contains(event.target)) return;
			placePanel();
		};
		window.addEventListener('resize', follow);
		window.addEventListener('scroll', follow, true);
		window.visualViewport?.addEventListener('resize', follow);
		return () => {
			window.removeEventListener('resize', follow);
			window.removeEventListener('scroll', follow, true);
			window.visualViewport?.removeEventListener('resize', follow);
		};
	});

	function placePanel() {
		const viewport = window.visualViewport?.height ?? window.innerHeight;
		if (!button || !window.matchMedia('(min-width: 640px)').matches) {
			place = null;
			maxHeight = viewport - EDGE * 2;
			return;
		}
		const chip = button.getBoundingClientRect();
		const below = viewport - chip.bottom - GAP - EDGE;
		const above = chip.top - GAP - EDGE;
		const left = Math.max(EDGE, Math.min(chip.left, window.innerWidth - WIDTH - EDGE));
		const downwards = below >= ROOM || below >= above;
		place = downwards
			? { top: chip.bottom + GAP, left }
			: { bottom: window.innerHeight - chip.top + GAP, left };
		maxHeight = Math.min(TALLEST, downwards ? below : above);
	}

	function beforeToggle(event: ToggleEvent) {
		if (event.newState !== 'open') return;
		query = '';
		searchable = tabs.length > 1 || countPicks(groups) > SEARCH_ABOVE;
		rendered = true;
		open = true;
		active = Math.max(
			0,
			options.findIndex((option) => option.value === value)
		);
		placePanel();
	}

	async function toggled(event: ToggleEvent) {
		if (event.newState === 'open') {
			await tick();
			(searchable ? input : listbox)?.focus({ preventScroll: true });
			reveal('center');
			return;
		}
		open = false;
		const focused = document.activeElement;
		if (!focused || focused === document.body || panel?.contains(focused)) button?.focus();
	}

	async function reveal(block: ScrollLogicalPosition = 'nearest') {
		await tick();
		document.getElementById(optionId(active))?.scrollIntoView({ block });
	}

	function move(to: number) {
		if (!options.length) return;
		active = (to + options.length) % options.length;
		reveal();
	}

	function choose(next: string) {
		panel?.hidePopover();
		if (next !== value) onchoose(next);
	}

	function chooseTab(next: string) {
		ontab?.(next);
		active = 0;
		(searchable ? input : listbox)?.focus();
	}

	function onkeydown(event: KeyboardEvent) {
		const keys: Record<string, () => void> = {
			ArrowDown: () => move(active + 1),
			ArrowUp: () => move(active - 1),
			PageDown: () => move(Math.min(active + PAGE, options.length - 1)),
			PageUp: () => move(Math.max(active - PAGE, 0)),
			Enter: () => options[active] && choose(options[active].value),
			Escape: () => panel?.hidePopover(),
			...(searchable
				? {}
				: {
						' ': () => options[active] && choose(options[active].value),
						Home: () => move(0),
						End: () => move(options.length - 1)
					})
		};
		const action = keys[event.key];
		if (!action) return;
		event.preventDefault();
		action();
	}

	function onButtonKeydown(event: KeyboardEvent) {
		const typing =
			event.key.length === 1 &&
			event.key !== ' ' &&
			!event.ctrlKey &&
			!event.metaKey &&
			!event.altKey;
		if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && !typing) return;
		event.preventDefault();
		if (!panel?.matches(':popover-open')) panel?.showPopover();
		if (typing && searchable) query = event.key;
	}

	function onFocusOut(event: FocusEvent) {
		const next = event.relatedTarget;
		if (next instanceof Node && !panel?.contains(next) && next !== button) panel?.hidePopover();
	}
</script>

{#snippet face()}
	{#if flag}<Flag code={flag} class="h-[21px] w-7 rounded-[3px] sm:h-6 sm:w-8" />{/if}
	<span class="truncate">{text}</span>
	<ChevronDownIcon
		class="size-3.5 shrink-0 transition-transform duration-200 {open ? 'rotate-180' : ''}"
	/>
{/snippet}

{#snippet nativeOptions(list: PickGroup['options'])}
	{#each list as option (option.value)}
		<option value={option.value} selected={option.value === value}>{option.label}</option>
	{/each}
{/snippet}

{#if enhanced}
	<button
		bind:this={button}
		type="button"
		popovertarget="{id}-panel"
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-label="{label}: {text}"
		{disabled}
		onkeydown={onButtonKeydown}
		class="{CHIP} {tone} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink disabled:opacity-50"
	>
		{@render face()}
	</button>

	<div
		bind:this={panel}
		id="{id}-panel"
		popover
		onbeforetoggle={beforeToggle}
		ontoggle={toggled}
		onfocusout={onFocusOut}
		style:top={place?.top === undefined ? undefined : `${place.top}px`}
		style:bottom={place?.bottom === undefined ? undefined : `${place.bottom}px`}
		style:left={place ? `${place.left}px` : undefined}
		style:max-height={maxHeight ? `${maxHeight}px` : undefined}
		class="m-0 -translate-y-1 flex-col overflow-hidden rounded-2xl border border-line bg-surface p-0 font-text text-[15px] leading-normal font-normal tracking-normal text-ink opacity-0 shadow-[0_18px_44px_rgba(18,19,22,.18)] transition-[opacity,translate,display,overlay] transition-discrete duration-150 ease-out open:flex open:translate-y-0 open:opacity-100 max-sm:inset-x-2 max-sm:top-2 max-sm:bottom-auto max-sm:w-auto max-sm:backdrop:bg-ink/40 sm:inset-auto sm:w-[360px] starting:open:-translate-y-1 starting:open:opacity-0"
	>
		{#if rendered}
			<div
				class="flex shrink-0 items-center justify-between border-b border-line py-1 pr-1 pl-4 sm:hidden"
			>
				<span class="font-data text-xs tracking-[0.14em] text-ink-3 uppercase">{label}</span>
				<button
					type="button"
					aria-label="Close"
					onclick={() => panel?.hidePopover()}
					class="grid size-10 place-items-center rounded-lg text-ink-2 hover:bg-surface-2"
				>
					<CloseIcon />
				</button>
			</div>
			{#if tabs.length > 1}
				<div class="flex shrink-0 gap-1 border-b border-line p-1.5">
					{#each tabs as item (item.value)}
						<button
							type="button"
							aria-pressed={item.value === tab}
							onclick={() => chooseTab(item.value)}
							class="h-8 flex-1 rounded-full text-[13.5px] font-bold {item.value === tab
								? 'bg-ink text-bg'
								: 'text-ink-3 hover:bg-surface-2 hover:text-ink'}"
						>
							{item.label}
						</button>
					{/each}
				</div>
			{/if}
			{#if searchable}
				<label class="flex h-12 shrink-0 items-center gap-2.5 border-b border-line px-4 text-ink-3">
					<SearchIcon class="size-[18px] shrink-0" />
					<input
						bind:this={input}
						bind:value={query}
						type="text"
						role="combobox"
						aria-label="Search {label.toLowerCase()}"
						aria-expanded="true"
						aria-autocomplete="list"
						aria-controls="{id}-list"
						aria-activedescendant={activeId}
						autocomplete="off"
						autocapitalize="off"
						spellcheck="false"
						enterkeyhint="go"
						{placeholder}
						oninput={() => (active = 0)}
						{onkeydown}
						class="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-3"
					/>
				</label>
			{/if}
			<div
				bind:this={listbox}
				id="{id}-list"
				role="listbox"
				aria-label={label}
				tabindex={searchable ? -1 : 0}
				aria-activedescendant={searchable ? undefined : activeId}
				onkeydown={searchable ? undefined : onkeydown}
				class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5 outline-none"
			>
				{#each visible as group, groupIndex (groupIndex)}
					<div role="group" aria-labelledby={group.label ? `${id}-group-${groupIndex}` : undefined}>
						{#if group.label}
							<div
								id="{id}-group-{groupIndex}"
								class="px-2.5 pt-3 pb-1 font-data text-[11px] tracking-[0.14em] text-ink-3 uppercase"
							>
								{group.label}
							</div>
						{/if}
						{#each group.options as option, optionIndex (option.value)}
							{@const index = offsets[groupIndex] + optionIndex}
							{@const selected = option.value === value}
							<div
								id={optionId(index)}
								role="option"
								tabindex="-1"
								aria-selected={selected}
								onpointermove={() => (active = index)}
								onclick={() => choose(option.value)}
								{onkeydown}
								class="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 {index ===
								active
									? 'bg-surface-2'
									: ''} {selected ? 'font-bold' : ''}"
							>
								{#if option.flag}<Flag code={option.flag} />{/if}
								<span class="min-w-0 flex-1 truncate">
									<Highlighted text={option.label} query={highlight} />
								</span>
								{#if option.hint}
									<span class="shrink-0 font-data text-xs text-ink-3">{option.hint}</span>
								{/if}
								<span class="w-4 shrink-0 text-brand-ink">
									{#if selected}<CheckIcon />{/if}
								</span>
							</div>
						{/each}
					</div>
				{/each}
				{#if !options.length}
					<p class="px-3 py-6 text-center text-sm text-ink-3">No match for “{query.trim()}”.</p>
				{/if}
			</div>
		{/if}
	</div>
{:else}
	<label
		class="{CHIP} {tone} focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-ink has-disabled:opacity-50"
	>
		{@render face()}
		<select
			{name}
			aria-label={label}
			{disabled}
			onchange={(event) => onchoose(event.currentTarget.value)}
			class="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-default"
		>
			{#if anyLabel || !value}<option value="">{anyLabel ?? text}</option>{/if}
			{#each fallback as group, index (index)}
				{#if group.label}
					<optgroup label={group.label}>{@render nativeOptions(group.options)}</optgroup>
				{:else}
					{@render nativeOptions(group.options)}
				{/if}
			{/each}
		</select>
	</label>
{/if}
