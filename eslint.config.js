import prettier from 'eslint-config-prettier';
import path from 'node:path';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

const BACKEND_INTERNALS = {
	group: ['**/server/backend/client*', '**/server/backend/*/dto*', '**/server/backend/*/parse*'],
	message: 'Use a backend resource through #lib/server/backend/index.js.'
};
const SERVER_CODE = {
	group: ['**/server/**', '$app/env/private'],
	message: 'Components receive data as props; they never reach the server.'
};
const IMPURE_CODE = {
	group: ['**/server/**', '**/components/**', '$app/*', '*.svelte'],
	message: 'Core modules stay pure: no shell, view or framework imports.'
};

const restrictImports = (...patterns) => ({
	'no-restricted-imports': ['error', { patterns }]
});

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser
			}
		}
	},
	{
		files: ['src/**'],
		ignores: ['src/lib/server/backend/**'],
		rules: restrictImports(BACKEND_INTERNALS)
	},
	{
		files: ['src/lib/components/**'],
		rules: restrictImports(BACKEND_INTERNALS, SERVER_CODE)
	},
	{
		files: [
			'src/lib/domain/**',
			'src/lib/format/**',
			'src/lib/routing/**',
			'src/lib/seo/**',
			'src/lib/utils/**'
		],
		rules: restrictImports(BACKEND_INTERNALS, IMPURE_CODE)
	}
);
