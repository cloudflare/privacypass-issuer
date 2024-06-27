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
			const backoffInMs = 100;
			const maxRetries = 200; // 20 seconds total with 100ms backoff
			let retries = 0;
			while (retries < maxRetries) {
				try {
					await fetch(`http://${ISSUER_URL}/`);
					console.log('Server is up');
					break;
				} catch (e) {
					retries++;
					await new Promise(resolve => setTimeout(resolve, backoffInMs));
				}
			}
			if (retries === maxRetries) {
				throw new Error('Server did not start within the expected time');
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

		const e2e = await testE2E(ISSUER_URL);
		expect(e2e).toBe(true);
	});
});
