import type { Gap, GapGroup, MissingList, MissingMedal } from '#lib/domain/missing.js';
import { htmlToText } from '#lib/utils/html-text.js';

const LINE_BREAK = /<\/p>|<br\s*\/?>/i;
const BOLD = /<strong\b[^>]*>[\s\S]*?<\/strong>/gi;
const FOUND = /^(.*?)[\s-]*Found \(Thanks to ([^)]+)\)$/i;
const MEDAL_SUFFIX = /\s+-\s+([GSB](?:\s*\/\s*[GSB])*)$/;

function isHeading(fragment: string): boolean {
	return /<strong\b/i.test(fragment) && htmlToText(fragment.replace(BOLD, '')) === '';
}

function parseGap(line: string): Gap | null {
	const match = line.match(/^(\d{4})\s+(.+)$/);
	if (!match) return null;

	const [, year, rest] = match;
	const suffix = rest.match(MEDAL_SUFFIX);
	const medals = suffix
		? suffix[1].split('/').map((medal) => medal.trim())
		: [...rest.matchAll(/\(([GSB])\)/g)].map((medal) => medal[1]);

	return {
		year: Number(year),
		text: suffix ? rest.slice(0, suffix.index).trim() : rest,
		medals: medals as MissingMedal[]
	};
}

export function parseMissingList(html: string | null): MissingList {
	const groups: GapGroup[] = [];
	const found: MissingList['found'] = [];
	let current: GapGroup | null = null;

	for (const fragment of (html ?? '').split(LINE_BREAK)) {
		const text = htmlToText(fragment);
		if (!text) continue;

		if (isHeading(fragment)) {
			if (/^missing\b/i.test(text)) continue;
			current = { name: text, gaps: [] };
			groups.push(current);
			continue;
		}

		const thanks = text.match(FOUND);
		if (thanks && /^\d{4}\s/.test(text)) {
			found.push({ line: thanks[1].trim(), group: current?.name ?? null, by: thanks[2].trim() });
			continue;
		}

		const gap = parseGap(text);
		if (!gap) continue;
		if (!current) {
			current = { name: null, gaps: [] };
			groups.push(current);
		}
		current.gaps.push(gap);
	}

	return { groups: groups.filter((group) => group.gaps.length), found };
}
