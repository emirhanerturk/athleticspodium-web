import { describe, expect, it } from 'vitest';
import { popoverAlign } from './popover-align.js';

describe('popoverAlign', () => {
	it('opens from the start of the anchor while it fits', () => {
		expect(popoverAlign({ left: 100, right: 200 }, 256, 1280)).toBe('start');
		expect(popoverAlign({ left: 1024, right: 1100 }, 256, 1280)).toBe('start');
	});

	it('opens from the end when the start would leave the viewport', () => {
		expect(popoverAlign({ left: 1100, right: 1200 }, 256, 1280)).toBe('end');
	});

	it('stays at the start when neither side fits', () => {
		expect(popoverAlign({ left: 72, right: 140 }, 256, 320)).toBe('start');
	});
});
