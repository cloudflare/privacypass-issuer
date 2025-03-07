// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { spawn } from 'node:child_process';
import fetch from 'node-fetch';
import { testE2E } from './e2e/issuer';

const ISSUER_URL = 'localhost:8787';

describe('e2e on localhost', () => {
	let serverProcess: ReturnType<typeof spawn> | undefined;

	beforeAll(async () => {
		try {
			// Start server as an independent process with npm run dev
			serverProcess = spawn('npm', ['run', 'dev'], { stdio: 'inherit', detached: true });
			console.log('Creating server with PID:', serverProcess.pid);

			// Check the server is online
			let retries = 0;
			const baseDelay = 100; // Initial delay in ms
			const maxRetries = 10; // Maximum attempts

			for (let i = 0; i < maxRetries; i++) {
				try {
					await fetch(`http://${ISSUER_URL}/`);
					console.log('Server is up!');
					break;
				} catch (e) {
					// Use exponential backoff with jitter to avoid overwhelming the server with requests.
					// Exponential growth (baseDelay * 2^i) ensures progressively longer wait times,
					// while random jitter (+ Math.random() * 100) prevents retries from clustering at the same intervals.
					const delay = baseDelay * 2 ** i + Math.random() * 100;
					await new Promise(resolve => setTimeout(resolve, delay));
				}
			}
			if (retries === maxRetries) {
				throw new Error('Server did not start within the expected time');
			}

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
	}, 30 * 1000); // Increase timeout to 30 seconds

	afterAll(() => {
		if (serverProcess && serverProcess.pid) {
			try {
				process.kill(-serverProcess.pid);
				console.log('Server is down');
			} catch (error) {
				console.error(`Failed to kill server process: ${error}`);
			}
		} else {
			console.log('Server process was not started or already terminated');
		}
	});

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
