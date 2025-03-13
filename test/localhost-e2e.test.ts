// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { type SpawndChildProcess } from 'spawnd';
import fetch from 'node-fetch';
import { setup, teardown } from 'jest-dev-server';
import { testE2E } from './e2e/issuer';

const ISSUER_HOST = 'localhost';
const ISSUER_PORT = 8787;
const ISSUER_URL = ISSUER_HOST + ':' + ISSUER_PORT;
const Timeout = 30 * 1000; // Increase timeout to 30 seconds

describe('e2e on localhost', () => {
	let serverProcess: SpawndChildProcess[];

	beforeAll(async () => {
		try {
			// Start server as an independent process with npm run dev
			serverProcess = await setup({
				command: `npm run dev --  \
					--host ${ISSUER_HOST} \
					--port ${ISSUER_PORT} \
					--show-interactive-dev-session false`,
				debug: true,
				host: ISSUER_HOST,
				port: ISSUER_PORT,
				options: { detached: true },
				waitOnScheme: { timeout: Timeout },
			});
			console.log('Creating server with PID:', serverProcess[0].pid);

			// Clear any existing keys
			const clearResponse = await fetch(`http://${ISSUER_URL}/admin/clear`, {
				method: 'POST',
			});
			if (!clearResponse.ok) {
				throw new Error('Failed to clear ISSUANCE_KEYS');
			}
		} catch (err) {
			console.log('Server failure:', err);
		}
	}, Timeout);

	afterAll(async () => await teardown(serverProcess));

	it('should issue a token that is valid', async () => {
		// Provision new keys
		const response = await fetch(`http://${ISSUER_URL}/admin/rotate`, {
			method: 'POST',
		});
		expect(response.ok).toBe(true);

		const e2e = await testE2E(ISSUER_URL, 1, 'single');
		expect(e2e).toBe(true);
	});

	// Todo: confirm what should happen if the request has 0 tokens, update test
	it.each([1, 2])('should issue batched tokens for %d tokens', async nTokens => {
		const response = await fetch(`http://${ISSUER_URL}/admin/rotate`, {
			method: 'POST',
		});
		expect(response.ok).toBe(true);

		const e2e = await testE2E(ISSUER_URL, nTokens, 'batched');
		expect(e2e).toBe(true);
	});
});
