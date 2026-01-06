// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Bindings } from '../bindings';
import { APICache, CachedR2Bucket, InMemoryCache, CascadingCache } from '../cache';
import { asyncRetries, DEFAULT_RETRIES } from '../utils/promises';
import { Logger, WshimLogger } from './logging';
import { MetricsRegistry } from './metrics';
import { ServiceInfo } from '../types';

export class WshimOptions {
	public static init(
		env: Bindings,
		endpoint: 'log' | 'prometheus',
		logger: Logger
	): WshimOptions | undefined {
		if (env.LOGGING_SHIM_TOKEN && env.WSHIM_SOCKET) {
			return new WshimOptions(
				env.LOGGING_SHIM_TOKEN,
				env.WSHIM_SOCKET,
				`https://workers-logging.cfdata.org/${endpoint}`
			);
		} else {
			if (env.LOGGING_SHIM_TOKEN === null && env.ENVIRONMENT !== 'dev') {
				logger.captureException(new Error('LOGGING_SHIM_TOKEN is undefined'));
			}
			if (env.WSHIM_SOCKET === null && env.ENVIRONMENT !== 'dev') {
				logger.captureException(new Error('WSHIM_SOCKET is undefined'));
			}
			if (env.WSHIM_ENDPOINT === null && env.ENVIRONMENT !== 'dev') {
				logger.captureException(new Error('WSHIM_ENDPOINT is undefined'));
			}
		}
		return undefined;
	}

	private constructor(
		public readonly token: string,
		public readonly socket: Fetcher,
		public readonly endpoint: string
	) {}

	public async flush(body: BodyInit) {
		try {
			const response = await this.socket.fetch(this.endpoint, {
				method: 'POST',
				headers: { Authorization: `Bearer ${this.token}` },
				body,
			});
			if (!response.ok) {
				console.error(
					`Failed to flush to ${this.endpoint}: ${response.status} ${response.statusText}`
				);
			}
		} catch (error) {
			console.error(`Failed to flush to ${this.endpoint}:`, error);
		}
	}
}

const DEFAULT_DIRECTORY_CACHE_MAX_AGE_SECONDS = 5 * 60;

type ContextBindings = Pick<
	Bindings,
	| 'DIRECTORY_CACHE_MAX_AGE_SECONDS'
	| 'USE_CACHE_API'
	| 'ISSUANCE_KEYS'
	| 'PERFORMANCE'
	| 'KEY_NOT_BEFORE_DELAY_IN_MS'
	| 'MINIMUM_FRESHEST_KEYS'
	| 'KEY_LIFESPAN_IN_MS'
	| 'BACKUPS_SERVICE_ACCOUNT_KEY'
	| 'BACKUPS_BUCKET_NAME'
>;

export type WaitUntilFunc = (p: Promise<unknown>) => void;
export class Context {
	public hostname: string;
	public startTime: number;
	private promises: Promise<unknown>[] = [];
	public bucket: { ISSUANCE_KEYS: CachedR2Bucket };
	public performance: Performance;
	public serviceInfo?: ServiceInfo;
	public key_id?: number; // Used for downstream logging
	public cacheSettings: {
		enabled: boolean;
		maxAgeSeconds: number;
	};

	constructor(
		request: Request,
		public readonly env: ContextBindings,
		private readonly _waitUntil: WaitUntilFunc,
		public readonly logger: Logger,
		public readonly metrics: MetricsRegistry,
		public readonly wshimLogger: WshimLogger,
		public readonly prefix?: string
	) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const ctx = this;

		const parseCacheMaxAge = () => {
			return env.DIRECTORY_CACHE_MAX_AGE_SECONDS === null
				? DEFAULT_DIRECTORY_CACHE_MAX_AGE_SECONDS
				: Number.parseInt(env.DIRECTORY_CACHE_MAX_AGE_SECONDS);
		};
		this.cacheSettings = {
			enabled: env.USE_CACHE_API === 'true',
			maxAgeSeconds: parseCacheMaxAge(),
		};
		const cache = this.cacheSettings.enabled
			? new CascadingCache(new InMemoryCache(ctx), new APICache(ctx, 'r2/issuance_keys'))
			: new InMemoryCache(ctx);
		const cachedR2Bucket = new CachedR2Bucket(ctx, env.ISSUANCE_KEYS, cache, prefix);

		const cachedR2BucketWithRetries = new Proxy(cachedR2Bucket, {
			get: (target, prop, receiver) => {
				const method = Reflect.get(target, prop, receiver);
				if (typeof method !== 'function') {
					return method;
				}

				const operation = typeof prop === 'string' ? prop : prop.toString();
				const asyncMethod = asyncRetries(ctx, method.bind(target), DEFAULT_RETRIES, { operation });
				return asyncMethod;
			},
		});

		this.hostname = new URL(request.url).hostname;
		this.bucket = {
			ISSUANCE_KEYS: cachedR2BucketWithRetries,
		};

		this.performance = env.PERFORMANCE ?? self.performance;
		this.startTime = this.performance.now();
	}
	/**
	 *
	 * Flush out any pending metrics/logs that were scheduled via waitUntil.
	 */
	public async postProcessing(): Promise<void> {
		await Promise.all([
			this.waitForPromises(),
			this.metrics.publish(),
			this.wshimLogger.flushLogs(),
		]);
	}

	isTest(): boolean {
		return this.hostname.includes('localhost-e2e');
	}

	/**
	 * Registers async tasks with the runtime, tracks them internally and adds error reporting for uncaught exceptions
	 * @param p - Promise for the async task to track
	 */
	waitUntil(p: Promise<unknown>): void {
		// inform runtime of async task
		this._waitUntil(p);
		this.promises.push(
			p.catch((e: Error) => {
				this.wshimLogger.error(e);
			})
		);
	}

	/**
	 * Waits for promises to complete in the order that they were registered.
	 *
	 * @remark
	 * It is important to wait for the promises in the array to complete sequentially since new promises created by async tasks may be added to the end of the array while this function runs.
	 */
	async waitForPromises(): Promise<void> {
		for (let i = 0; i < this.promises.length; i++) {
			try {
				await this.promises[i];
			} catch (e) {
				this.wshimLogger.error(e);
			}
		}
	}
}
