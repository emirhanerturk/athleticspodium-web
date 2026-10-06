<script lang="ts" module>
	const RECENT_KEY = 'athleticspodium:recent-searches';
	const RECENT_LIMIT = 5;

	export function readRecentSearches(): string[] {
		try {
			const stored = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
			return Array.isArray(stored) ? stored.filter((item) => typeof item === 'string') : [];
		} catch {
			return [];
		}
	}

	export function rememberSearch(query: string) {
		if (!query) return;
		const recent = [query, ...readRecentSearches().filter((item) => item !== query)];
		try {
			localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, RECENT_LIMIT)));
		} catch {
			return;
		}
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { searchUrl } from '#lib/routing/urls.js';

	let { current }: { current: string } = $props();

	let recent = $state<string[]>([]);

	onMount(() => {
		recent = readRecentSearches().filter((item) => item !== current);
		rememberSearch(current);
	});
</script>

{#if recent.length}
	<div class="flex flex-col gap-2.5 rounded-[20px] bg-surface-2 px-5 py-[18px]">
		<h2 class="text-sm font-bold">Recent searches</h2>
		<ul class="flex flex-col">
			{#each recent as query (query)}
				<li>
					<a
						href={searchUrl({ query })}
						class="flex items-center gap-2.5 py-1 text-sm text-ink-2 hover:text-ink"
					>
						<span aria-hidden="true" class="text-ink-3">↺</span>{query}
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}
