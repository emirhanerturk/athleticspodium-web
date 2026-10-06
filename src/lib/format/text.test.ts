import { describe, expect, it } from 'vitest';
import { excerptFromHtml } from './text.js';

describe('excerptFromHtml', () => {
	it('drops tags and extra spaces', () => {
		expect(excerptFromHtml('<p>World <strong>champion</strong>.</p>\n<p>Twice.</p>', 80)).toBe(
			'World champion. Twice.'
		);
	});

	it('cuts at a word boundary and keeps entities whole', () => {
		expect(excerptFromHtml('<p>T&uuml;rkiye sprinter, born in Baku, world champion</p>', 30)).toBe(
			'T&uuml;rkiye sprinter, born in…'
		);
	});
});
