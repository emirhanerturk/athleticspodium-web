import { describe, expect, it } from 'vitest';
import { isDeskByline, readingMinutes, splitByline } from './article.js';

describe('splitByline', () => {
	it('lifts the author out of a first paragraph that only names them', () => {
		expect(
			splitByline(
				'<p><strong><em>By Evren &#214;z&#252;yener</em></strong></p><p>One of the greatest.</p>'
			)
		).toEqual({ byline: 'Evren Özüyener', body: '<p>One of the greatest.</p>' });
		expect(
			splitByline(
				'<p><em><span style="font-size: 12px;"><strong>By Alp ULAGAY - London</strong></span></em></p> <p>Text</p>'
			)
		).toEqual({ byline: 'Alp ULAGAY - London', body: '<p>Text</p>' });
	});

	it('leaves a story that opens with its text as it is', () => {
		const opening = '<p>By the time the final began, the rain had stopped.</p><p>More</p>';
		expect(splitByline(opening)).toEqual({ byline: null, body: opening });
		const sentence =
			'<p><strong>By Athleticspodium.com</strong><br>Amy Hunt was the favourite.</p>';
		expect(splitByline(sentence)).toEqual({ byline: null, body: sentence });
	});
});

describe('readingMinutes', () => {
	it('counts the words of the text at 220 a minute, one minute at least', () => {
		expect(readingMinutes('<p>Short.</p>')).toBe(1);
		expect(readingMinutes(`<p>${'word '.repeat(660)}</p>`)).toBe(3);
	});
});

describe('isDeskByline', () => {
	it('tells the site’s desk from a person', () => {
		expect(isDeskByline('Editorial - Athleticspodium.com')).toBe(true);
		expect(isDeskByline('Athletics Podium crew')).toBe(true);
		expect(isDeskByline('Şevket F. ERBAY - Athleticspodium')).toBe(false);
		expect(isDeskByline('Yavuz YAVUZ')).toBe(false);
	});
});
