import { defineConfig } from "vitest/config";

// Some configuration options are global, so we can define them here and projects extend them.
// https://vitest.dev/guide/workspace.html#configuration
export default defineConfig({
	test: {
		globals: true,
	},
});