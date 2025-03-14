// import { defineWorkersConfig, defineWorkspace, defineWorkersProject } from "@cloudflare/vitest-pool-workers/config";

import { defineWorkspace, defineProject } from "vitest/config";
import { defineWorkersProject, defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

import path from 'path';

export default defineWorkspace([
	defineWorkersConfig({
		test: {
			name: "tests",
			include: [path.join(__dirname, "**/*test.ts")],
			setupFiles: [path.join(__dirname, "test/vitest.setup.ts")],
			poolOptions: {
				workers: {
					isolatedStorage: true,
					singleWorker: true,
					wrangler: {
						configPath: "./wrangler.toml"
					},
					miniflare: {
						r2Persist: true,
						compatibilityDate: "2025-03-10",
						compatibilityFlags: ["nodejs_compat"],
						r2Buckets: ["ISSUANCE_KEYS"],
						bindings: {
							LOGGING_SHIM_TOKEN: "",
							WSHIM_ENDPOINT: "https://example.com",
							VERSION_METADATA: "",
							RELEASE: "",
							MINIMUM_FRESHEST_KEYS: 1,
						},
					},
				},
				coverage: {
					enabled: true,
					reporter: ["json", "html", "lcov", "text"],
				},
			},
		}
	}),
	{
		extends: "./vitest.config.ts",
	}
]);


