import { describe, expect, it } from 'vitest';
import { linkNames } from './link-names.js';

const MORROW = { name: 'Bobby Morrow', href: '/athlete/18538/bobby-morrow' };
const DOS_SANTOS = { name: 'Alison  Dos Santos', href: '/athlete/1/alison-dos-santos' };

describe('linkNames', () => {
	it('links the first mention of a name and leaves the later ones', () => {
		expect(
			linkNames('<p>Texan <strong>Bobby Morrow</strong> won. Bobby Morrow’s 200m followed.</p>', [
				MORROW
			])
		).toBe(
			'<p>Texan <strong><a href="/athlete/18538/bobby-morrow">Bobby Morrow</a></strong> won. Bobby Morrow’s 200m followed.</p>'
		);
	});

	it('matches whatever the case and the spacing, and keeps the text as written', () => {
		expect(linkNames('<p>Holder Alison dos&nbsp;Santos ran.</p>', [DOS_SANTOS])).toBe(
			'<p>Holder <a href="/athlete/1/alison-dos-santos">Alison dos&nbsp;Santos</a> ran.</p>'
		);
	});

	it('reads no name inside a link, a heading, a caption or a longer word', () => {
		const html =
			'<h2>Bobby Morrow</h2><p><a href="/x">Bobby Morrow</a> and Bobby Morrowson</p>' +
			'<figure><figcaption>Bobby Morrow in 1956</figcaption></figure>';
		expect(linkNames(html, [MORROW])).toBe(html);
	});

	it('gives a mention to the longer of two names that overlap, and skips single words', () => {
		const li = { name: 'Li Na', href: '/athlete/2/li-na' };
		const liNaWei = { name: 'Li Na Wei', href: '/athlete/3/li-na-wei' };
		expect(
			linkNames('<p>Li Na Wei beat Li Na.</p>', [li, liNaWei, { name: 'Wei', href: '/w' }])
		).toBe(
			'<p><a href="/athlete/3/li-na-wei">Li Na Wei</a> beat <a href="/athlete/2/li-na">Li Na</a>.</p>'
		);
	});
});
