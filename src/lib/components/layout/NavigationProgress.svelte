<script lang="ts">
	import { untrack } from 'svelte';
	import { navigating } from '$app/state';

	const SHOW_DELAY_MS = 150;
	const FINISH_MS = 400;

	let phase = $state<'idle' | 'loading' | 'finishing'>('idle');
	let run = $state(0);
	let finishing: ReturnType<typeof setTimeout> | undefined;

	$effect(() => {
		if (navigating.to) {
			const showing = setTimeout(start, SHOW_DELAY_MS);
			return () => clearTimeout(showing);
		}
		untrack(finish);
	});

	function start() {
		if (phase === 'loading') return;
		clearTimeout(finishing);
		run += 1;
		phase = 'loading';
	}

	function finish() {
		if (phase !== 'loading') return;
		phase = 'finishing';
		finishing = setTimeout(() => (phase = 'idle'), FINISH_MS);
	}
</script>

{#if phase !== 'idle'}
	{#key run}
		<div
			role="progressbar"
			aria-label="Loading page"
			class="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]"
		>
			<div
				class="h-full origin-left bg-brand motion-reduce:transition-none {phase === 'loading'
					? 'scale-x-90 transition-[scale] duration-[8s] ease-[cubic-bezier(.1,.7,.3,1)] starting:scale-x-0'
					: 'scale-x-100 opacity-0 [transition:scale_200ms_ease-out,opacity_200ms_ease-out_200ms]'}"
			></div>
		</div>
	{/key}
{/if}
