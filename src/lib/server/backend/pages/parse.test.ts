import { describe, expect, it } from 'vitest';
import { parseMissingList } from './parse.js';

describe('parseMissingList', () => {
	it('groups the dated lines under the bold championship lines', () => {
		const list = parseMissingList(
			'<p><strong>MISSING MEDALLISTS BY CHAMPIONSHIPS</strong></p><p><em>(G - Gold, S - Silver, B - Bronze)</em></p><p><br></p><p><strong>African U20 Championships</strong></p><p>2019 Men\'s JT - G / S / B</p><p>1988 Women\'s SP, DT, 4x100m - S/ B </p><p><strong style="color: rgb(65, 65, 65);">Balkan&nbsp;Championships</strong></p><p><span>1930 4x100 men: JUG (B)</span></p><p><em>If you have information - please contact:&nbsp;</em><a href="mailto:a@b.c"><strong><em>a@b.c</em></strong></a></p>'
		);

		expect(list.groups).toEqual([
			{
				name: 'African U20 Championships',
				gaps: [
					{ year: 2019, text: "Men's JT", medals: ['G', 'S', 'B'] },
					{ year: 1988, text: "Women's SP, DT, 4x100m", medals: ['S', 'B'] }
				]
			},
			{
				name: 'Balkan Championships',
				gaps: [{ year: 1930, text: '4x100 men: JUG (B)', medals: ['B'] }]
			}
		]);
		expect(list.found).toEqual([]);
	});

	it('keeps lines before any championship together and leaves out the rest', () => {
		const list = parseMissingList(
			'<p><strong>Missing Marks</strong><br>1957 Pan Arab Games Men&#39;s 4x400m silver - Lebanon<br>1975 CAC Championships Men&#39;s 200m bronze - Raymond Heerenveen</p><p><em>If you have information please contact us</em></p>'
		);

		expect(list.groups).toEqual([
			{
				name: null,
				gaps: [
					{ year: 1957, text: "Pan Arab Games Men's 4x400m silver - Lebanon", medals: [] },
					{
						year: 1975,
						text: "CAC Championships Men's 200m bronze - Raymond Heerenveen",
						medals: []
					}
				]
			}
		]);
		expect(
			parseMissingList(
				'<p><strong>Missing</strong> <strong>forenames</strong></p><p>Soon will be updated.</p>'
			).groups
		).toEqual([]);
	});

	it('moves the lines found by readers out of the gaps', () => {
		const list = parseMissingList(
			'<p><strong>Francophonie Games</strong></p><p>1997 4x100 women gold - MAD</p><p><em>1997 4x400 women bronze - MAD - Found (Thanks to Michel Maze)</em></p>'
		);

		expect(list.groups[0].gaps).toHaveLength(1);
		expect(list.found).toEqual([
			{ line: '1997 4x400 women bronze - MAD', group: 'Francophonie Games', by: 'Michel Maze' }
		]);
	});
});
