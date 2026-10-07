export interface Image {
	path: string;
	credit: string | null;
	caption: string | null;
}

export function imageNote(image: Image): string {
	return [image.caption, image.credit].filter(Boolean).join(' · ');
}
