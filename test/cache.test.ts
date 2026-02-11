// Copyright (c) 2024 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { PRIVATE_TOKEN_ISSUER_DIRECTORY } from '@cloudflare/privacypass-ts';
import { getDirectoryCache, shouldRevalidate, STALE_WHILE_REVALIDATE_IN_MS } from '../src/cache';
import { MockCache } from './mocks';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { env, createExecutionContext } from 'cloudflare:test';
import worker from '../src/index';

const sampleURL = 'http://localhost';
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('cache revalidation', () => {
	const rotateURL = `${sampleURL}/admin/rotate`;

	const initializeKeys = async (numberOfKeys = 1): Promise<void> => {
		const rotateRequest = new IncomingRequest(rotateURL, { method: 'POST' });
		const ctx = new createExecutionContext();

		for (let i = 0; i < numberOfKeys; i += 1) {
			await worker.fetch(rotateRequest, env, ctx);
		}
	};

	beforeEach(async () => {
		await initializeKeys();
	});

	afterEach(async () => {
		vi.clearAllMocks();
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
		const spy = vi.spyOn(caches, 'open').mockImplementation(async (name: string) => {
			if (!mockCaches.has(name)) {
				mockCaches.set(name, new MockCache());
			}
			return mockCaches.get(name) as unknown as Cache;
		});

		const domainARequest = new IncomingRequest(`${sampleURL}${PRIVATE_TOKEN_ISSUER_DIRECTORY}`);
		const ctx = new createExecutionContext();

		const domainBRequest = new IncomingRequest(
			`http://cache2.test${PRIVATE_TOKEN_ISSUER_DIRECTORY}`
		);
		const ctx2 = new createExecutionContext();

		const mockCache = (await getDirectoryCache()) as unknown as MockCache;

		// request for the first domain populates the cache and uses one entry
		const response = await worker.fetch(domainARequest, env, ctx);
		expect(response.ok).toBe(true);
		expect(Object.entries(mockCache.cache)).toHaveLength(1);

		// request for the second domain populates the cache and uses a new entry
		const resposne2 = await worker.fetch(domainBRequest, env, ctx2);
		expect(resposne2.ok).toBe(true);
		expect(Object.entries(mockCache.cache)).toHaveLength(2);
	});
});
