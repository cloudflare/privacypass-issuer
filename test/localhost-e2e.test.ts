import { spawn } from 'node:child_process';
import { testE2E } from './e2e/issuer';

const ISSUER_URL = 'localhost:8787';

describe('e2e on localhost', () => {
	let serverPID: number | undefined;

	beforeAll(async () => {
		try {
			// start server as an independant process with npm run dev
			const serverProcess = spawn('npm', ['run', 'dev'], { stdio: 'inherit', detached: true });
			serverPID = serverProcess.pid;
			console.log('Creating server with PID: ', serverPID);

			// check the server is online
			const backoffInMs = 100;
			while (true) {
				try {
					await fetch(`http://${ISSUER_URL}/`);
					console.log('Server is up');
					break;
				} catch (e) {
					await new Promise(resolve => setTimeout(resolve, backoffInMs));
				}
			}
		} catch (err) {
			console.log('Server failure: ', err);
		}
	}, 10 * 1000);

	afterAll(() => {
		process.kill(-serverPID!);
		console.log('Server is down');
	});

	it('should issue a token that is valid', async () => {
		// provision new keys
		const response = await fetch(`http://${ISSUER_URL}/admin/rotate`, {
			method: 'POST',
		});
		expect(response.ok).toBe(true);

		const e2e = await testE2E(ISSUER_URL);
		expect(e2e).toBe(true);
	});
});
