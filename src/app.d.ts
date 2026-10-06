import type { Backend } from '#lib/server/backend/index.js';

declare global {
	namespace App {
		interface Locals {
			backend: Backend;
		}
	}
}

export {};
