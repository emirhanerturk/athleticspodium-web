import { defineEnvVars } from '@sveltejs/kit/env';

const SITE_ENVS = ['production', 'staging', 'development'] as const;

export type SiteEnv = (typeof SITE_ENVS)[number];

export const variables = defineEnvVars({
	BACKEND_URL: {
		description:
			'athleticspodium-backend base URL with the API version, e.g. https://api.athleticspodium.com/1.0',
		schema: (value) => originWithPath('BACKEND_URL', value)
	},
	PUBLIC_SITE_URL: {
		public: true,
		description: 'Origin of this site, used for canonical URLs and the sitemap',
		schema: (value) => originWithPath('PUBLIC_SITE_URL', value ?? 'https://athleticspodium.com')
	},
	PUBLIC_MEDIA_URL: {
		public: true,
		description: 'Base URL of uploaded images served by the backend',
		schema: (value) =>
			originWithPath('PUBLIC_MEDIA_URL', value ?? 'https://api.athleticspodium.com/media')
	},
	PUBLIC_GA_MEASUREMENT_ID: {
		public: true,
		description:
			'Google Analytics 4 measurement id; analytics loads only in production when it is set',
		schema: (value) => value || undefined
	},
	PUBLIC_SITE_ENV: {
		public: true,
		description: 'production, staging or development; anything but production is sent with noindex',
		schema: (value = 'development') => {
			if (!SITE_ENVS.includes(value as SiteEnv)) {
				throw new Error(`PUBLIC_SITE_ENV must be one of ${SITE_ENVS.join(', ')}`);
			}
			return value as SiteEnv;
		}
	}
});

function originWithPath(name: string, value: string | undefined): string {
	if (!value || !URL.canParse(value)) throw new Error(`${name} must be an absolute URL`);
	return value.replace(/\/+$/, '');
}
