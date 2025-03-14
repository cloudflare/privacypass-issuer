import { Bindings } from '../src/bindings';

declare module 'cloudflare:test' {
	// maybe I can add WSHIM here?: https://developers.cloudflare.com/workers/testing/vitest-integration/test-apis/
	interface ProvidedEnv extends Bindings {}
}
