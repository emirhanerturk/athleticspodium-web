import type { Backend } from '#lib/server/backend/index.js';

declare global {
	interface Window {
		dataLayer: unknown[];
		gtag?: (...args: unknown[]) => void;
	}

	namespace App {
		interface Locals {
			backend: Backend;
		}
	}
}

export {};
