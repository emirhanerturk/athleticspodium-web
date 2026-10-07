<script lang="ts">
	import { PUBLIC_MEDIA_URL } from '$app/env/public';
	import { imageNote, type Image } from '#lib/domain/image.js';

	let { photos, alt }: { photos: Image[]; alt: string } = $props();

	let dialog: HTMLDialogElement;
	let track: HTMLDivElement;
	let current = $state(0);

	export function open(index: number) {
		dialog.showModal();
		track.scrollTo({ left: index * track.clientWidth, behavior: 'instant' });
		current = index;
	}

	function go(index: number) {
		const target = Math.min(Math.max(index, 0), photos.length - 1);
		track.scrollTo({ left: target * track.clientWidth });
	}

	function onkeydown(event: KeyboardEvent) {
		const step = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
		if (!step) return;
		event.preventDefault();
		go(current + step);
	}

	function closeOutsidePhoto(event: MouseEvent) {
		if (!(event.target as Element).closest('img, button, figcaption')) dialog.close();
	}

	const control =
		'grid size-11 place-items-center rounded-full bg-night-surface text-xl text-night-ink hover:bg-night-line-2 aria-disabled:opacity-30';
</script>

<dialog
	bind:this={dialog}
	aria-label="Photos of {alt}"
	{onkeydown}
	onclick={closeOutsidePhoto}
	class="m-0 h-dvh max-h-none w-full max-w-none bg-night p-0 text-night-ink backdrop:bg-transparent"
>
	<button
		type="button"
		aria-label="Close"
		onclick={() => dialog.close()}
		class="absolute top-4 right-4 z-10 {control}">×</button
	>

	{#if photos.length > 1}
		<button
			type="button"
			aria-label="Previous photo"
			aria-disabled={current === 0}
			onclick={() => go(current - 1)}
			class="absolute top-1/2 left-4 z-10 -translate-y-1/2 max-sm:hidden {control}">←</button
		>
		<button
			type="button"
			aria-label="Next photo"
			aria-disabled={current === photos.length - 1}
			onclick={() => go(current + 1)}
			class="absolute top-1/2 right-4 z-10 -translate-y-1/2 max-sm:hidden {control}">→</button
		>
	{/if}

	<div
		bind:this={track}
		onscroll={() => (current = Math.round(track.scrollLeft / track.clientWidth))}
		class="flex h-full snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain scroll-smooth motion-reduce:scroll-auto"
	>
		{#each photos as photo, index (photo.path)}
			<figure
				class="flex h-full w-full shrink-0 snap-center flex-col items-center justify-center gap-3 px-4 sm:px-20"
			>
				<img
					src="{PUBLIC_MEDIA_URL}/{photo.path}"
					alt={photos.length > 1 ? `${alt}, photo ${index + 1} of ${photos.length}` : alt}
					loading="lazy"
					class="max-h-[calc(100dvh-10rem)] max-w-full rounded-xl object-contain"
				/>
				<figcaption class="flex max-w-[640px] flex-wrap justify-center gap-x-3 text-sm">
					<span class="text-night-ink-2">{imageNote(photo)}</span>
					{#if photos.length > 1}
						<span class="font-data text-night-ink-4">{index + 1} / {photos.length}</span>
					{/if}
				</figcaption>
			</figure>
		{/each}
	</div>
</dialog>
