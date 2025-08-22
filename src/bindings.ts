// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { R2Bucket, Performance } from '@cloudflare/workers-types/2023-07-01';

export interface Bindings {
	// variables and secrets
	DIRECTORY_CACHE_MAX_AGE_SECONDS: string;
	ENVIRONMENT: string;
	SERVICE: string;
	SENTRY_ACCESS_CLIENT_ID: string | null;
	SENTRY_ACCESS_CLIENT_SECRET: string | null;
	SENTRY_DSN: string | null;
	SENTRY_SAMPLE_RATE: string | null;

	// R2 buckets
	ISSUANCE_KEYS: R2Bucket;

	// Performance Timer
	PERFORMANCE: Performance | null;

	// Worker version metadata
	VERSION_METADATA: ScriptVersion;

	// Key rotation schedule
	ROTATION_CRON_STRING: string | null;
	KEY_LIFESPAN_IN_MS: string;
	KEY_NOT_BEFORE_DELAY_IN_MS: string;
	MINIMUM_FRESHEST_KEYS: string | null;

	// telemetry
	LOGGING_SHIM_TOKEN: string | null;
	WSHIM_SOCKET: Fetcher | null;
	WSHIM_ENDPOINT: string | null;

	// backups
	BACKUPS_CRON_STRING: string | null;
	BACKUPS_SERVICE_ACCOUNT_KEY: string | null;
	BACKUPS_BUCKET_NAME: string | null;
}

export const DEFAULT_MINIMUM_FRESHEST_KEYS = '2';

type NonNullableFields<T> = {
	[P in keyof T]: T[P] extends infer U | null ? U : T[P];
};

export type UncheckedBindings = Partial<NonNullableFields<Bindings>>;

// To make sure that all bindings are present we need to define two types.
//
// First there's the `Bindings` type defined above. This is the type want to get
// to. The one that expresses our intent. Obligatory fields are marked non-null
// and optional fields are marked as null.
//
// The second type is `UncheckedBindings`, which is `Bindings` but every
// field is never null but possibly undefined. `NonNullableFields` removes
// `| null` from all members and `Partial` makes all fields optional. This
// represents what the runtime gives us in the top level handlers.
//
// Why use null instead of undefined/? in `Bindings`?
//
// Using `null` makes the compiler stricter when type checking the
// checkMandatoryBindings function. We must initialize all fields when
// returning.
export function checkMandatoryBindings(env: UncheckedBindings): Bindings {
	if (env.ENVIRONMENT === undefined) throw new Error('ENVIRONMENT is undefined');
	if (env.SERVICE === undefined) throw new Error('SERVICE is undefined');
	if (env.DIRECTORY_CACHE_MAX_AGE_SECONDS === undefined)
		throw new Error('DIRECTORY_CACHE_MAX_AGE_SECONDS is undefined');
	if (env.ISSUANCE_KEYS === undefined) throw new Error('ISSUANCE_KEYS is undefined');
	if (env.VERSION_METADATA === undefined) throw new Error('VERSION_METADATA is undefined');
	if (env.KEY_LIFESPAN_IN_MS === undefined) throw new Error('KEY_LIFESPAN_IN_MS is undefined');
	if (env.KEY_NOT_BEFORE_DELAY_IN_MS === undefined)
		throw new Error('KEY_NOT_BEFORE_DELAY_IN_MS is undefined');

	return {
		DIRECTORY_CACHE_MAX_AGE_SECONDS: env.DIRECTORY_CACHE_MAX_AGE_SECONDS,
		ENVIRONMENT: env.ENVIRONMENT,
		SERVICE: env.SERVICE,
		SENTRY_ACCESS_CLIENT_ID: env.SENTRY_ACCESS_CLIENT_ID ?? null,
		SENTRY_ACCESS_CLIENT_SECRET: env.SENTRY_ACCESS_CLIENT_SECRET ?? null,
		SENTRY_DSN: env.SENTRY_DSN ?? null,
		SENTRY_SAMPLE_RATE: env.SENTRY_SAMPLE_RATE ?? null,
		ISSUANCE_KEYS: env.ISSUANCE_KEYS,
		PERFORMANCE: env.PERFORMANCE ?? null,
		VERSION_METADATA: env.VERSION_METADATA,
		ROTATION_CRON_STRING: env.ROTATION_CRON_STRING ?? null,
		KEY_LIFESPAN_IN_MS: env.KEY_LIFESPAN_IN_MS,
		KEY_NOT_BEFORE_DELAY_IN_MS: env.KEY_NOT_BEFORE_DELAY_IN_MS,
		MINIMUM_FRESHEST_KEYS: env.MINIMUM_FRESHEST_KEYS ?? null,
		LOGGING_SHIM_TOKEN: env.LOGGING_SHIM_TOKEN ?? null,
		WSHIM_SOCKET: env.WSHIM_SOCKET ?? null,
		WSHIM_ENDPOINT: env.WSHIM_ENDPOINT ?? null,
		BACKUPS_CRON_STRING: env.BACKUPS_CRON_STRING ?? null,
		BACKUPS_SERVICE_ACCOUNT_KEY: env.BACKUPS_SERVICE_ACCOUNT_KEY ?? null,
		BACKUPS_BUCKET_NAME: env.BACKUPS_BUCKET_NAME ?? null,
	};
}
