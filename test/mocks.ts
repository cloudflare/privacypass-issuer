// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Bindings } from '../src/bindings';
import { Context, WaitUntilFunc } from '../src/context';
import { ConsoleLogger, Logger, ESLogger } from '../src/context/logging';
import { MetricsRegistry } from '../src/context/metrics';

export class MockCache implements Cache {
	public cache: Record<string, Response> = {};

	async match(
		info: RequestInfo<unknown, CfProperties<unknown>>,
		options?: CacheQueryOptions
	): Promise<Response | undefined> {
		if (options) {
			throw new Error('CacheQueryOptions not supported');
		}
		const url = new URL(info instanceof Request ? info.url : info).href;
		return this.cache[url];
	}

	async delete(info: RequestInfo, options?: CacheQueryOptions): Promise<boolean> {
		if (options) {
			throw new Error('CacheQueryOptions not supported');
		}
		const url = new URL(info instanceof Request ? info.url : info).href;
		return delete this.cache[url];
	}

	async put(info: RequestInfo, response: Response): Promise<void> {
		const url = new URL(info instanceof Request ? info.url : info).href;
		this.cache[url] = response;
	}
}

export class ExecutionContextMock implements ExecutionContext {
	waitUntils: Promise<any>[] = [];
	passThrough = false;

	waitUntil(promise: Promise<any>): void {
		this.waitUntils.push(promise);
	}
	passThroughOnException(): void {
		this.passThrough = true;
	}
}

export const getEnv = (): Bindings => getMiniflareBindings();

export interface MockContextOptions {
	env: Bindings;
	ectx: ExecutionContext;
	logger?: Logger;
	metrics?: MetricsRegistry;
	eslogger?: ESLogger;
	waitUntilFunc?: WaitUntilFunc;
}

export const getContext = (options: MockContextOptions): Context => {
	const logger = options.logger ?? new ConsoleLogger();
	const metrics = options.metrics ?? new MetricsRegistry(options.env, {});
	const eslogger = options.eslogger ?? new ESLogger(options.env, {});
	const waitUntilFunc = options.waitUntilFunc || options.ectx.waitUntil.bind(options.ectx);
	return new Context(options.env, waitUntilFunc, logger, metrics, eslogger);
};
