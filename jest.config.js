export default {
	projects: [
		{
			preset: 'ts-jest/presets/default-esm',
			globals: {
				RELEASE: 'test',
			},
			moduleNameMapper: {
				'^@/(.*)$': '<rootDir>/src/$1',
				'^(\\.{1,2}/.*)\\.js$': '$1',
			},
			// it was harder than expected to setup
			// more documentation on https://miniflare.dev/testing/jest
			testEnvironment: 'miniflare',
			// Configuration is automatically loaded from `.env`, `package.json` and
			// `wrangler.toml` files by default, but you can pass any additional Miniflare
			// API options here:
			testEnvironmentOptions: {
				bindings: {
					LOGGING_SHIM_TOKEN: '',
					RESEARCH_ISSUER_REQUEST_URL: '',
					TURNSTILE_PUBLIC_KEY: '1x00000000000000000000AA', // always passes. taken from Turnstile documentation https://developers.cloudflare.com/turnstile/reference/testing/
					TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA', // always passes. taken from Turnstile documentation https://developers.cloudflare.com/turnstile/reference/testing/
					TURNSTILE_VERIFICATION_URL: 'https://challenges.cloudflare.com/turnstile/v0/siteverify', // taken from Turnstile documentation https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
				},
				wranglerConfigEnv: 'dev',
			},
			testMatch: ['<rootDir>/**/*.test.ts'],
			transform: {
				'^.+\\.tsx?$': [
					'ts-jest',
					{
						tsconfig: 'test/tsconfig.json',
						useESM: true,
					},
				],
			},
		},
		{
			runner: 'jest-runner-eslint',
			displayName: 'lint',
			testMatch: ['<rootDir>/src/**/*.ts', '<rootDir>/__tests__/**/*.ts'],
		},
	],
	collectCoverage: true,
	coverageReporters: ['json', 'html', 'lcov', 'text'],
};
