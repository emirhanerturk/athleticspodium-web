export function excerptFromHtml(html: string, maxLength: number): string {
	const text = html
		.replace(/<\/?(p|br|div|li|h[1-6])\b[^>]*>/gi, ' ')
		.replace(/<[^>]*>/g, '')
		.replace(/\s+/g, ' ')
		.trim();
	if (text.length <= maxLength) return text;

	const cut = text.lastIndexOf(' ', maxLength);
	return `${text.slice(0, cut > 0 ? cut : maxLength).replace(/[\s,.;:]+$/, '')}…`;
}

export function possessive(name: string): string {
	return name.endsWith('s') ? `${name}’` : `${name}’s`;
}
