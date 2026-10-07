import { MISSING_SECTIONS, type MissingList, type MissingSection } from '#lib/domain/missing.js';
import { BackendNotFoundError, type BackendClient } from '../client.js';
import { parseMissingList } from './parse.js';

interface PageDto {
	title: string | null;
	content: string | null;
}

export function createPages(client: BackendClient) {
	async function get(slug: string, section?: string) {
		const page = await client.get<PageDto | null>(`/pages/${slug}`, { section });
		if (!page) throw new BackendNotFoundError(`/pages/${slug}`);
		return { title: page.title, content: page.content?.trim() || null };
	}

	async function missingInformation(): Promise<Record<MissingSection, MissingList>> {
		const pages = await Promise.all(
			MISSING_SECTIONS.map((section) => get('missing-information', section))
		);
		return Object.fromEntries(
			MISSING_SECTIONS.map((section, index) => [section, parseMissingList(pages[index].content)])
		) as Record<MissingSection, MissingList>;
	}

	return { get, missingInformation };
}
