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
				},
				wranglerConfigEnv: 'production',
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
