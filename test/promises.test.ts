// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { jest } from '@jest/globals';

import { asyncRetries, DEFAULT_RETRIES } from '../src/utils/promises';
import { ExecutionContextMock, getContext, getEnv } from './mocks';

describe('asyncRetries', () => {
	const sampleResolve = 2;
	const sampleReject = 'error';

	function generateRejectsBeforeResolvePromise(
		rejects: number,
		resolvedValue: unknown,
		rejectedValue: unknown
	) {
		let i = 0;
		return () => {
			if (i++ < rejects) {
				return Promise.reject(rejectedValue);
			}
			return Promise.resolve(resolvedValue);
		};
	}

	it('should work for a promise always resolving', async () => {
		const ctx = getContext({ env: getEnv(), ectx: new ExecutionContextMock() });

		const f = jest.fn(() => Promise.resolve(sampleResolve));
		const retriesF = asyncRetries(ctx, f);

		expect(await retriesF()).toBe(sampleResolve);
		expect(f.mock.calls).toHaveLength(1);
	});

	it('should work for a promise failing once', async () => {
		const ctx = getContext({ env: getEnv(), ectx: new ExecutionContextMock() });

		const f = jest.fn(generateRejectsBeforeResolvePromise(1, sampleResolve, sampleReject));
		const retriesF = asyncRetries(ctx, f);

		expect(await retriesF()).toBe(sampleResolve);
		expect(f.mock.calls).toHaveLength(DEFAULT_RETRIES);
	});

	it('should reject for a promise failing twice and retry count at 2', async () => {
		const retryCount = DEFAULT_RETRIES;
		const ctx = getContext({ env: getEnv(), ectx: new ExecutionContextMock() });

		const f = jest.fn(generateRejectsBeforeResolvePromise(retryCount, sampleResolve, sampleReject));
		const retriesF = asyncRetries(ctx, f, retryCount);

		try {
			await retriesF();
		} catch (e) {
			expect(e).toBe(sampleReject);
		}
		expect(f.mock.calls).toHaveLength(retryCount);
	});

	it('should work for a promise failing twice and retry count at 3', async () => {
		const retryCount = 3;
		const ctx = getContext({ env: getEnv(), ectx: new ExecutionContextMock() });

		const f = jest.fn(
			generateRejectsBeforeResolvePromise(retryCount - 1, sampleResolve, sampleReject)
		);
		const retriesF = asyncRetries(ctx, f, retryCount);

		expect(await retriesF()).toBe(sampleResolve);
		expect(f.mock.calls).toHaveLength(retryCount);
	});

	it('should reject a promise always failing', async () => {
		const ctx = getContext({ env: getEnv(), ectx: new ExecutionContextMock() });

		const f = jest.fn(() => Promise.reject(sampleReject));
		const retriesF = asyncRetries(ctx, f);

		try {
			await retriesF();
		} catch (e) {
			expect(e).toBe(sampleReject);
		}
		expect(f.mock.calls).toHaveLength(DEFAULT_RETRIES);
	});
});
