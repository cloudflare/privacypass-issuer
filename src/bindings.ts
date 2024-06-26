import type { R2Bucket, Performance } from '@cloudflare/workers-types/2023-07-01';

export interface Bindings {
	// variables and secrets
	DIRECTORY_CACHE_MAX_AGE_SECONDS: string;
	ENVIRONMENT: string;
	SERVICE: string;
	LOGGING_SHIM_TOKEN: string;
	SENTRY_ACCESS_CLIENT_ID: string;
	SENTRY_ACCESS_CLIENT_SECRET: string;
	SENTRY_DSN: string;
	SENTRY_SAMPLE_RATE: string;

	// R2 buckets
	ISSUANCE_KEYS: R2Bucket;

	// Performance Timer
	PERFORMANCE: Performance | undefined;
}
