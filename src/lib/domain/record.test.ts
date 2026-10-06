import { describe, expect, it } from 'vitest';
import { recordTier } from './record.js';

describe('recordTier', () => {
	it('separates world, major and other records, ignoring = and * marks', () => {
		expect(recordTier('WR')).toBe('world');
		expect(recordTier('WR=')).toBe('world');
		expect(recordTier('CR*')).toBe('major');
		expect(recordTier('AR')).toBe('major');
		expect(recordTier('NR')).toBe('other');
		expect(recordTier('WU20R')).toBe('other');
	});
});
