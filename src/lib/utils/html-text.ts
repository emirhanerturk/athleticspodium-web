const NAMED_ENTITIES: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
	nbsp: ' ',
	ndash: '–',
	mdash: '—',
	lsquo: '‘',
	rsquo: '’',
	ldquo: '“',
	rdquo: '”',
	hellip: '…'
};

function decodeEntity(entity: string, name: string): string {
	if (name.startsWith('#x') || name.startsWith('#X'))
		return String.fromCodePoint(parseInt(name.slice(2), 16));
	if (name.startsWith('#')) return String.fromCodePoint(Number(name.slice(1)));
	return NAMED_ENTITIES[name.toLowerCase()] ?? entity;
}

export function htmlToText(html: string): string {
	return html
		.replace(/<[^>]*>/g, '')
		.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, decodeEntity)
		.replace(/\s+/g, ' ')
		.trim();
}
