// Generated by dts-bundle-generator v9.5.1

import { Performance as Performance$1, R2Bucket as R2Bucket$1, R2HTTPMetadata as R2HTTPMetadata$1, R2ListOptions as R2ListOptions$1 } from '@cloudflare/workers-types/2023-07-01';
import { Breadcrumb } from '@sentry/types';
import { WorkerEntrypoint } from 'cloudflare:workers';
import { CounterType, HistogramType, RegistryType } from 'promjs-plus';

// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0
declare global {
	// RELEASE is statically replaced at compile time by esbuild.
	// See scripts/build.js for more information.
	const RELEASE: string;
	// blindrsa requires these interface to be in scope
	// while they are available in
	interface RsaHashedKeyGenParams {
		hash: string | object;
		modulusLength: number;
		name: string;
		publicExponent: Uint8Array;
	}
	type KeyFormat = "jwk" | "pkcs8" | "raw" | "spki";
	type KeyUsage = "encrypt" | "decrypt" | "sign" | "verify" | "deriveKey" | "deriveBits" | "wrapKey" | "unwrapKey";
	// privacypass requires these interface to be in scope
	interface Algorithm {
		name: string;
	}
	type AlgorithmIdentifier = Algorithm | string;
	type HashAlgorithmIdentifier = AlgorithmIdentifier;
	interface RsaHashedImportParams extends Algorithm {
		hash: HashAlgorithmIdentifier;
	}
}
export interface Bindings {
	DIRECTORY_CACHE_MAX_AGE_SECONDS: string;
	ENVIRONMENT: string;
	SERVICE: string;
	SENTRY_ACCESS_CLIENT_ID: string;
	SENTRY_ACCESS_CLIENT_SECRET: string;
	SENTRY_DSN: string;
	SENTRY_SAMPLE_RATE: string;
	ISSUANCE_KEYS: R2Bucket$1;
	PERFORMANCE: Performance$1 | undefined;
	VERSION_METADATA: ScriptVersion;
	ROTATION_CRON_STRING?: string;
	KEY_LIFESPAN_IN_MS: string;
	KEY_NOT_BEFORE_DELAY_IN_MS: string;
	MINIMUM_FRESHEST_KEYS: string;
	LOGGING_SHIM_TOKEN: string;
	WSHIM_SOCKET?: Fetcher;
	WSHIM_ENDPOINT: string;
}
export type CacheElement<T> = {
	value: T;
	expiration: Date;
};
export interface ReadableCache {
	read<T>(key: string, setValFn: (key: string) => Promise<CacheElement<T>>): Promise<T>;
}
declare class CachedR2Object {
	data?: Uint8Array | undefined;
	checksums: R2Checksums;
	customMetadata?: Record<string, string>;
	etag: string;
	httpEtag: string;
	httpMetadata?: R2HTTPMetadata$1;
	key: string;
	size: number;
	uploaded: Date;
	version: string;
	constructor(object: R2Object, data?: Uint8Array | undefined);
}
declare class CachedR2Objects {
	delimitedPrefixes: string[];
	objects: CachedR2Object[];
	truncated: boolean;
	constructor(objects: R2Objects);
}
export interface CachedR2BucketOptions {
	shouldUseCache?: boolean;
}
declare class CachedR2Bucket {
	private ctx;
	private cache;
	private prefix;
	private ttl_in_ms;
	private bucket;
	constructor(ctx: Context, bucket: R2Bucket, cache: ReadableCache, prefix: string, ttl_in_ms?: number);
	private shouldUseCache;
	private addPrefix;
	head(key: string, options?: CachedR2BucketOptions): Promise<CachedR2Object | null>;
	list(options?: R2ListOptions$1 & CachedR2BucketOptions): Promise<CachedR2Objects>;
	get(key: string, options?: R2GetOptions & CachedR2BucketOptions): Promise<CachedR2Object | null>;
	put(...args: Parameters<typeof R2Bucket.prototype.put>): ReturnType<typeof R2Bucket.prototype.put>;
	delete(...args: Parameters<typeof R2Bucket.prototype.delete>): ReturnType<typeof R2Bucket.prototype.delete>;
}
export interface Logger {
	captureException(err: Error): void;
	addBreadcrumb(breadcrumb: Breadcrumb): void;
	setTag(key: string, value: string): void;
	setSampleRate(sampleRate: number): void;
	info(category: string, message: string, data?: {
		[key: string]: any;
	}): void;
}
declare class WshimLogger {
	private request;
	private env;
	private logs;
	private serviceToken;
	private sampleRate;
	private fetcher;
	private loggingEndpoint;
	constructor(request: Request, env: Bindings, sampleRate?: number);
	private shouldLog;
	private defaultFields;
	log(...msg: unknown[]): void;
	error(...msg: unknown[]): void;
	flushLogs(): Promise<void>;
}
export interface RegistryOptions {
	endpoint: string;
	bearerToken: string;
	fetcher: typeof fetch;
}
declare class MetricsRegistry {
	env: Bindings;
	options: RegistryOptions;
	registry: RegistryType;
	asyncRetriesTotal: CounterType;
	directoryCacheMissTotal: CounterType;
	erroredRequestsTotal: CounterType;
	issuanceKeyErrorTotal: CounterType;
	issuanceRequestTotal: CounterType;
	keyRotationTotal: CounterType;
	keyClearTotal: CounterType;
	requestsDurationMs: HistogramType;
	requestsTotal: CounterType;
	r2RequestsDurationMs: HistogramType;
	signedTokenTotal: CounterType;
	constructor(env: Bindings);
	private defaultLabels;
	private createCounter;
	private createHistogram;
	private create;
	/**
	 * Publishes metrics to the workers metrics API
	 * This function is a no-op in test and wrangler environements
	 */
	publish(): Promise<void>;
}
export type WaitUntilFunc = (p: Promise<unknown>) => void;
declare class Context {
	env: Bindings;
	private _waitUntil;
	logger: Logger;
	metrics: MetricsRegistry;
	wshimLogger: WshimLogger;
	prefix: string;
	hostname: string;
	startTime: number;
	private promises;
	bucket: {
		ISSUANCE_KEYS: CachedR2Bucket;
	};
	performance: Performance;
	constructor(request: Request, env: Bindings, _waitUntil: WaitUntilFunc, logger: Logger, metrics: MetricsRegistry, wshimLogger: WshimLogger, prefix?: string);
	isTest(): boolean;
	/**
	 * Registers async tasks with the runtime, tracks them internally and adds error reporting for uncaught exceptions
	 * @param p - Promise for the async task to track
	 */
	waitUntil(p: Promise<unknown>): void;
	/**
	 * Waits for promises to complete in the order that they were registered.
	 *
	 * @remark
	 * It is important to wait for the promises in the array to complete sequentially since new promises created by async tasks may be added to the end of the array while this function runs.
	 */
	waitForPromises(): Promise<void>;
}
export declare const issue: (ctx: Context, buffer: ArrayBuffer, domain: string, contentType?: string) => Promise<{
	serialized: Uint8Array;
	status?: number;
	responseContentType: string;
}>;
export declare const handleTokenRequest: (ctx: Context, request: Request) => Promise<Response>;
export declare const handleSingleTokenRequest: (ctx: Context, buffer: ArrayBuffer, domain: string) => Promise<Uint8Array>;
export declare const handleBatchedTokenRequest: (ctx: Context, buffer: ArrayBuffer, domain: string) => Promise<{
	serialized: Uint8Array;
	status: number;
}>;
export declare const handleHeadTokenDirectory: (ctx: Context, request: Request) => Promise<Response>;
export declare const handleTokenDirectory: (ctx: Context, request: Request) => Promise<Response>;
export declare const handleRotateKey: (ctx: Context, _request: Request) => Promise<Response>;
export declare const handleClearKey: (ctx: Context, _request: Request) => Promise<Response>;
export declare class IssuerHandler extends WorkerEntrypoint<Bindings> {
	private context;
	fetch(request: Request): Promise<Response>;
	tokenDirectory(url: string, prefix: string): Promise<Response>;
	issue(url: string, tokenRequest: ArrayBufferLike, contentType: string | undefined, prefix: string): Promise<{
		serialized: Uint8Array;
		status?: number;
		responseContentType: string;
	}>;
	rotateKey(url: string, prefix: string): Promise<Response>;
	clearKey(url: string, prefix: string): Promise<Response>;
}
declare const _default: {
	fetch(request: Request, env: Bindings, ctx: ExecutionContext): Promise<Response>;
	scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext): Promise<void>;
};

export {
	_default as default,
};

export {};
