import { spawn, ChildProcess } from 'child_process';
import { testE2E } from './e2e/issuer';

const ISSUER_URL = 'localhost:8787';

describe('e2e on localhost', () => {
	let serverProcess: ChildProcess;

	beforeEach(() => {
		// start server as an independant process with npm run dev
		serverProcess = spawn('npm', ['run', 'dev']);
	});

	afterEach(() => {
		serverProcess?.kill();
	});

	it(
		'should issue a token that is valid',
		async () => {
			// check the server is online
			const backoffInMs = 100;
			while (true) {
				try {
					await fetch(`http://${ISSUER_URL}/`);
					break;
				} catch (e) {
					await new Promise(resolve => setTimeout(resolve, backoffInMs));
				}
			}

			// provision new keys
			const response = await fetch(`http://${ISSUER_URL}/admin/rotate`, {
				method: 'POST',
			});
			expect(response.ok).toBe(true);

			const e2e = await testE2E(ISSUER_URL);
			expect(e2e).toBe(true);
		},
		10 * 1000
	);
});
