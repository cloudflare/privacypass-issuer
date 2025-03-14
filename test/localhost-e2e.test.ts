// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { SELF } from 'cloudflare:test';
import { it, describe, beforeAll, expect } from 'vitest';

import { requestBatchedTokens, requestSingleToken } from './e2e/e2eUtils';

const sampleURL = 'http://localhost-e2e.test';

describe('e2e tests with Vitest', () => {
	beforeAll(async () => {
		const response = await SELF.fetch(`${sampleURL}/admin/rotate`, { method: 'POST' });
		expect(response.ok).toBe(true);
	});

	it('should issue a valid token', async () => {
		const customFetch = (url: string, init?: RequestInit) => SELF.fetch(url, init);
		const isValid = await requestSingleToken(sampleURL, sampleURL, customFetch);
		expect(isValid).toBe(true);
		console.log('Single token request is valid:', isValid);
	});

	it.each([1, 2, 3])('should issue a valid batch of %d token(s)', async nTokens => {
		const customFetch = (url: string, init?: RequestInit) => SELF.fetch(url, init);
		const isValid = await requestBatchedTokens(sampleURL, sampleURL, nTokens, customFetch);
		expect(isValid).toBe(true);
	});
});
