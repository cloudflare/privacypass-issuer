export interface Bindings {
	// variables and secrets
	ENVIRONMENT: string;
	LOGGING_SHIM_TOKEN: string;
	SENTRY_ACCESS_CLIENT_ID: string;
	SENTRY_ACCESS_CLIENT_SECRET: string;
	SENTRY_DSN: string;
	SENTRY_SAMPLE_RATE: string;

	// R2 buckets
	ISSUANCE_KEYS: R2Bucket;
}
