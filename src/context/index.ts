// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Bindings } from '../bindings';
import { APICache, CachedR2Bucket, InMemoryCache, CascadingCache } from '../cache';
import { asyncRetries, DEFAULT_RETRIES } from '../utils/promises';
import { Logger, WshimLogger } from './logging';
import { MetricsRegistry } from './metrics';
// import { IContext } from './icontext';

export type WaitUntilFunc = (p: Promise<unknown>) => void;

// export class Context implements IContext {
export class Context {
	public hostname: string;
	public startTime: number;
	private promises: Promise<unknown>[] = [];
	public bucket: { ISSUANCE_KEYS: CachedR2Bucket };
	public performance: Performance;

	constructor(
		request: Request,
		public env: Bindings,
		private _waitUntil: WaitUntilFunc,
		public logger: Logger,
		public metrics: MetricsRegistry,
		public wshimLogger: WshimLogger
	) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const ctx = this;
		const cache = new CascadingCache(new InMemoryCache(ctx), new APICache(ctx, 'r2/issuance_keys'));
		const cachedR2Bucket = new CachedR2Bucket(ctx, env.ISSUANCE_KEYS, cache);

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

	isTest(): boolean {
		return RELEASE === 'test';
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
				this.wshimLogger.error(e.message);
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
