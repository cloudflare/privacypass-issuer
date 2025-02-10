// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Issuer } from '@cloudflare/privacypass-ts/lib/src/priv_verif_token';
import type { R2Bucket, Performance } from '@cloudflare/workers-types/2023-07-01';
import { ServiceBindingQueueMessage } from '@cloudflare/workers-types/experimental';
import { IssuerHandler } from '.';
import { SumService } from '.';

export interface Bindings {
	// variables and secrets
	DIRECTORY_CACHE_MAX_AGE_SECONDS: string;
	ENVIRONMENT: string;
	SERVICE: string;
	SENTRY_ACCESS_CLIENT_ID: string;
	SENTRY_ACCESS_CLIENT_SECRET: string;
	SENTRY_DSN: string;
	SENTRY_SAMPLE_RATE: string;

	// R2 buckets
	ISSUANCE_KEYS: R2Bucket;

	// Performance Timer
	PERFORMANCE: Performance | undefined;

	// Worker version metadata
	VERSION_METADATA: ScriptVersion;

	// Key rotation schedule
	ROTATION_CRON_STRING?: string;
	KEY_LIFESPAN_IN_MS: string;
	KEY_NOT_BEFORE_DELAY_IN_MS: string;
	MINIMUM_FRESHEST_KEYS: string;

	// Telemetry
	LOGGING_SHIM_TOKEN: string;
	WSHIM_SOCKET?: Fetcher;
	WSHIM_ENDPOINT: string;

	// Service Bindings 
	PRIVACYPASS_ISSUER: Service<IssuerHandler>
	PRIVACYPASS_SUM: Service<SumService>

}
