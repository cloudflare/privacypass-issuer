/// <reference types="@cloudflare/workers-types" />
import type { R2Bucket, Performance } from '@cloudflare/workers-types/2023-07-01';
import { IssuerHandler, IssuerService } from '.';
export interface Bindings {
    DIRECTORY_CACHE_MAX_AGE_SECONDS: string;
    ENVIRONMENT: string;
    SERVICE: string;
    SENTRY_ACCESS_CLIENT_ID: string;
    SENTRY_ACCESS_CLIENT_SECRET: string;
    SENTRY_DSN: string;
    SENTRY_SAMPLE_RATE: string;
    ISSUANCE_KEYS: R2Bucket;
    PERFORMANCE: Performance | undefined;
    VERSION_METADATA: ScriptVersion;
    ROTATION_CRON_STRING?: string;
    KEY_LIFESPAN_IN_MS: string;
    KEY_NOT_BEFORE_DELAY_IN_MS: string;
    MINIMUM_FRESHEST_KEYS: string;
    LOGGING_SHIM_TOKEN: string;
    WSHIM_SOCKET?: Fetcher;
    WSHIM_ENDPOINT: string;
    PRIVACYPASS_ISSUER: Service<IssuerHandler>;
    PRIVACYPASS_SERVICE: Service<IssuerService>;
}
