export type PopoverAlign = 'start' | 'end';

export function popoverAlign(
	anchor: { left: number; right: number },
	width: number,
	viewportWidth: number
): PopoverAlign {
	const fitsAtStart = anchor.left + width <= viewportWidth;
	const fitsAtEnd = anchor.right - width >= 0;
	return fitsAtStart || !fitsAtEnd ? 'start' : 'end';
}
