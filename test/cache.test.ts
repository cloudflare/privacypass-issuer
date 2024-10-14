// Copyright (c) 2024 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { jest } from '@jest/globals';

import { PRIVATE_TOKEN_ISSUER_DIRECTORY } from '@cloudflare/privacypass-ts';
import { getDirectoryCache, shouldRevalidate, STALE_WHILE_REVALIDATE_IN_MS } from '../src/cache';
import { default as workerObject } from '../src/index';
import { ExecutionContextMock, getEnv, MockCache } from './mocks';

const sampleURL = 'http://localhost';

describe('cache revalidation', () => {
	const rotateURL = `${sampleURL}/admin/rotate`;

	const initializeKeys = async (numberOfKeys = 1): Promise<void> => {
		const rotateRequest = new Request(rotateURL, { method: 'POST' });

		for (let i = 0; i < numberOfKeys; i += 1) {
			await workerObject.fetch(rotateRequest, getEnv(), new ExecutionContextMock());
		}
	};

	beforeEach(async () => {
		await initializeKeys();
	});

	it('should not revalidate before expiration', () => {
		const expiration = new Date(Date.now());
		expect(shouldRevalidate(expiration)).toBe(false);
	});

	it('should revalidate when after expiration and staleness', () => {
		const expiration = new Date(Date.now() - STALE_WHILE_REVALIDATE_IN_MS);
		expect(shouldRevalidate(expiration)).toBe(true);
	});

	it('should not always revalidate when after expiration but still within staleness interval', () => {
		const expiration = new Date(Date.now() - STALE_WHILE_REVALIDATE_IN_MS / 2);
		let hasSeenFalse = false;
		let hasSeenTrue = false;
		for (let i = 0; i < 1_000_000; i += 1) {
			if (shouldRevalidate(expiration)) {
				hasSeenTrue = true;
			} else {
				hasSeenFalse = true;
			}
		}
		expect(hasSeenFalse).toBe(true);
		expect(hasSeenTrue).toBe(true);
	});

	it('should be split by hostnames', async () => {
		const mockCaches: Map<string, MockCache> = new Map();
		const spy = jest.spyOn(caches, 'open').mockImplementation(async (name: string) => {
			if (!mockCaches.has(name)) {
				mockCaches.set(name, new MockCache());
			}
			return mockCaches.get(name) as unknown as Cache;
		});
		const domainARequest = new Request(`${sampleURL}${PRIVATE_TOKEN_ISSUER_DIRECTORY}`);
		const domainBRequest = new Request(`http://cache2.test${PRIVATE_TOKEN_ISSUER_DIRECTORY}`);
		const mockCache = (await getDirectoryCache()) as unknown as MockCache;

		// request for the first domain populates the cache and uses one entry
		let response = await workerObject.fetch(domainARequest, getEnv(), new ExecutionContextMock());
		expect(response.ok).toBe(true);
		expect(Object.entries(mockCache.cache)).toHaveLength(1);
		response = await workerObject.fetch(domainARequest, getEnv(), new ExecutionContextMock());
		expect(response.ok).toBe(true);
		expect(Object.entries(mockCache.cache)).toHaveLength(1);

		// request for the second domain populates the cache and uses a new entry
		response = await workerObject.fetch(domainBRequest, getEnv(), new ExecutionContextMock());
		expect(response.ok).toBe(true);
		expect(Object.entries(mockCache.cache)).toHaveLength(2);
		response = await workerObject.fetch(domainBRequest, getEnv(), new ExecutionContextMock());
		expect(response.ok).toBe(true);
		expect(Object.entries(mockCache.cache)).toHaveLength(2);

		spy.mockClear();
	});
});
