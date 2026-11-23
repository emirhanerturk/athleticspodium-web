export interface NameLink {
	name: string;
	href: string;
}

interface Piece {
	html: string;
	linkable: boolean;
}

const TAG = /(<[^>]+>)/;
const UNLINKABLE = /^<(\/?)(a|h[1-6]|figcaption)\b/i;

/**
 * The HTML with the first mention of each name linked. Only text outside links, headings and captions is read, a
 * name is matched whole whatever its case or spacing, and longer names go first so one name inside another stays
 * with the longer.
 */
export function linkNames(html: string, links: NameLink[]): string {
	let pieces = textPieces(html);
	const longestFirst = [...links].sort((a, b) => b.name.length - a.name.length);
	for (const link of longestFirst) {
		const pattern = patternOf(link.name);
		if (!pattern) continue;
		const at = pieces.findIndex((piece) => piece.linkable && pattern.test(piece.html));
		if (at === -1) continue;
		const { html: text } = pieces[at];
		const match = pattern.exec(text);
		if (!match) continue;
		pieces = [
			...pieces.slice(0, at),
			{ html: text.slice(0, match.index), linkable: true },
			{ html: `<a href="${link.href}">${match[0]}</a>`, linkable: false },
			{ html: text.slice(match.index + match[0].length), linkable: true },
			...pieces.slice(at + 1)
		];
	}
	return pieces.map((piece) => piece.html).join('');
}

function textPieces(html: string): Piece[] {
	let unlinkableDepth = 0;
	return html.split(TAG).map((part) => {
		const isTag = part.startsWith('<');
		const boundary = isTag ? UNLINKABLE.exec(part) : null;
		if (boundary) unlinkableDepth = Math.max(0, unlinkableDepth + (boundary[1] ? -1 : 1));
		return { html: part, linkable: !isTag && unlinkableDepth === 0 };
	});
}

function patternOf(name: string): RegExp | null {
	const words = name.trim().split(/\s+/).filter(Boolean);
	if (words.length < 2) return null;
	const escaped = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
	return new RegExp(
		`(?<![\\p{L}\\p{N}])${escaped.join('(?:\\s|&nbsp;)+')}(?![\\p{L}\\p{N}])`,
		'iu'
	);
}
