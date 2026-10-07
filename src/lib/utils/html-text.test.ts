import { describe, expect, it } from 'vitest';
import { htmlToText } from './html-text.js';

describe('htmlToText', () => {
	it('drops tags, decodes entities and collapses spaces', () => {
		expect(htmlToText('<p><strong>African&nbsp;Games</strong></p>')).toBe('African Games');
		expect(htmlToText('1957 Men&#39;s 4x400m &ndash; Lebanon &amp;&#x41;  ')).toBe(
			"1957 Men's 4x400m – Lebanon &A"
		);
		expect(htmlToText('&unknown; stays')).toBe('&unknown; stays');
	});
});
