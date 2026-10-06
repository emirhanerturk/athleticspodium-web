import { BackendNotFoundError, type BackendClient } from '../client.js';

interface PageDto {
	title: string | null;
	content: string | null;
}

export function createPages(client: BackendClient) {
	return {
		async get(slug: string, section?: string) {
			const page = await client.get<PageDto | null>(`/pages/${slug}`, { section });
			if (!page) throw new BackendNotFoundError(`/pages/${slug}`);
			return { title: page.title, content: page.content?.trim() || null };
		}
	};
}
