const SOCIAL_IMAGE_ALTS = {
	default: 'Athletics Podium: every international athletics medal since 1873',
	championships: 'Athletics Podium: championships, their editions and medallists',
	athletes: 'Athletics Podium: athletes and their medals',
	countries: 'Athletics Podium: the medal record of every nation',
	calendar: 'Athletics Podium: the season calendar',
	tools: 'Athletics Podium: medal search and championship comparison',
	articles: 'Athletics Podium: articles'
} as const;

export type SocialImageName = keyof typeof SOCIAL_IMAGE_ALTS;

export const SOCIAL_IMAGE_NAMES = Object.keys(SOCIAL_IMAGE_ALTS) as SocialImageName[];

export interface OgImage {
	url: string;
	alt?: string;
	width?: number;
	height?: number;
}

export function ogImage(
	siteUrl: string,
	pictureUrl: string | undefined,
	fallback: SocialImageName
): OgImage {
	if (pictureUrl) return { url: pictureUrl };
	return {
		url: `${siteUrl}/og/${fallback}.png`,
		alt: SOCIAL_IMAGE_ALTS[fallback],
		width: 1200,
		height: 630
	};
}
