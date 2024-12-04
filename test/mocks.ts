// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Bindings } from '../src/bindings';
import { Context, WaitUntilFunc } from '../src/context';
import { ConsoleLogger, Logger, WshimLogger } from '../src/context/logging';
import { MetricsRegistry } from '../src/context/metrics';
import { jest } from '@jest/globals';

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
	request: Request;
	env: Bindings;
	ectx: ExecutionContext;
	logger?: Logger;
	metrics?: MetricsRegistry;
	wshimLogger?: WshimLogger;
	waitUntilFunc?: WaitUntilFunc;
}

export const getContext = (options: MockContextOptions): Context => {
	const logger = options.logger ?? new ConsoleLogger();
	const metrics = options.metrics ?? new MetricsRegistry(options.env);
	const wshimLogger = options.wshimLogger ?? new WshimLogger(options.request, options.env);
	const waitUntilFunc = options.waitUntilFunc || options.ectx.waitUntil.bind(options.ectx);
	return new Context(options.request, options.env, waitUntilFunc, logger, metrics, wshimLogger);
};

const originalDateNow = Date.now;
const originalDateConstructor = Date;

export const mockDateNow = (...fixedTimeArg: ConstructorParameters<typeof Date>): void => {
	const fixedTime = new originalDateConstructor(...fixedTimeArg).getTime();
	global.Date.now = jest.fn(() => fixedTime);
	global.Date = class extends Date {
		constructor(...args: unknown[]) {
			if (args.length === 0) {
				super(fixedTime);
			} else {
				super(...(args as ConstructorParameters<typeof Date>));
			}
		}
	} as typeof Date;
};

export const clearDateMocks = (): void => {
	global.Date.now = originalDateNow;
	global.Date = originalDateConstructor;
};
