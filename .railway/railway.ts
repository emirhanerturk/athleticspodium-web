import { defineRailway, github, project, service } from 'railway/iac';

// The partial owns only this service, so an apply can never touch the backend or Postgres.
export const partial = 'athleticspodium-web';

export default defineRailway(() => {
	const web = service('athleticspodium-web', {
		source: github('emirhanerturk/athleticspodium-web', { branch: 'main' }),
		build: 'npm run build',
		start: 'npm start',
		healthcheck: '/robots.txt',
		healthcheckTimeout: 60,
		replicas: { 'europe-west4-drams3a': { numReplicas: 1 } },
		env: {
			BACKEND_URL: 'http://${{athleticspodium-backend.RAILWAY_PRIVATE_DOMAIN}}:8080/1.0',
			PROTOCOL_HEADER: 'x-forwarded-proto',
			PUBLIC_SITE_URL: 'https://athleticspodium.com',
			PUBLIC_SITE_ENV: 'production',
			PUBLIC_GA_MEASUREMENT_ID: 'G-7EDH9146FP'
		}
	});

	return project('athletics-podium', { resources: [web] });
});
