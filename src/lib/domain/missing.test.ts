import { describe, expect, it } from 'vitest';
import {
	describeGap,
	filterGaps,
	gapCount,
	parseMissingSection,
	type GapGroup
} from './missing.js';

const GROUPS: GapGroup[] = [
	{
		name: 'Pan Arab Games',
		gaps: [
			{ year: 1961, text: "Men's 20kmW", medals: ['S', 'B'] },
			{ year: 1999, text: "Men's 20kmW", medals: ['S', 'B'] }
		]
	},
	{ name: 'Gymnasiade', gaps: [{ year: 1974, text: 'All events', medals: ['S', 'B'] }] }
];

describe('parseMissingSection', () => {
	it('falls back to medallists', () => {
		expect(parseMissingSection('relays')).toBe('relays');
		expect(parseMissingSection('other')).toBe('medallists');
		expect(parseMissingSection(null)).toBe('medallists');
	});
});

describe('filterGaps', () => {
	it('matches the year, the text and the championship, ignoring accents and case', () => {
		expect(gapCount(filterGaps(GROUPS, '1999'))).toBe(1);
		expect(filterGaps(GROUPS, 'gymnasiade').map((group) => group.name)).toEqual(['Gymnasiade']);
		expect(gapCount(filterGaps(GROUPS, 'PÄN arab'))).toBe(2);
		expect(filterGaps(GROUPS, '  ')).toBe(GROUPS);
		expect(filterGaps(GROUPS, 'NGR')).toEqual([]);
	});
});

describe('describeGap', () => {
	it('writes the gap the way the list writes it', () => {
		expect(describeGap(GROUPS[0].gaps[0], 'Pan Arab Games')).toBe(
			"Pan Arab Games · 1961 Men's 20kmW - S / B"
		);
		expect(describeGap({ year: 1957, text: 'Lebanon', medals: [] }, null)).toBe('1957 Lebanon');
	});
});
