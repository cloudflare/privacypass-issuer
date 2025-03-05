// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { program } from 'commander';
import { MTLSConfiguration, testE2E, rotateKey } from './issuer.js';

async function testCommand(issuerName: string, numOfTokens: number, mTLS?: MTLSConfiguration) {
	console.log(`Testing with issuer ${issuerName} requesting ${numOfTokens} token(s)`);
	const validIssuer = await testE2E(issuerName, numOfTokens, mTLS);
	if (validIssuer) {
		console.log('Issuer tokens are valid');
	} else {
		console.error('Issuer tokens are not valid');
	}
}

async function rotateCommand(issuerName: string, mTLS?: MTLSConfiguration, cronString?: string) {
	console.log('Rotating key for issuer', issuerName);
	try {
		const cronString = '* * * * *';
		process.env.ROTATION_CRON_STRING = cronString;
		await rotateKey(issuerName, mTLS);
		console.log('Key rotation successful');
	} catch (e) {
		console.error('Key rotation failed', e);
	}
}

async function main() {
	program
		.option('--cert <path>', 'Path to client certificate. e.g. ./client.crt')
		.option('--key <path>', 'Path to client key. e.g. ./client.key')
		.option('--rotate', 'Rotate the key for the given issuer')
		.option('--tokens <number>', 'Number of tokens to use', (val) => parseInt(val, 10), 1)
		.argument('<issuer-name>', 'Name of the issuer. e.g. demo-pat.issuer.cloudflare.com')
		.action(async (issuerName, options) => {
			try {
				const numOfTokens = options.tokens;
				if (options.cert && options.key) {
					console.log("passed a cert and key");
					const mTLS = { certPath: options.cert, keyPath: options.key };
					if (options.rotate) {
						await rotateCommand(issuerName, mTLS);
					} else {
						await testCommand(issuerName, numOfTokens, { certPath: options.cert, keyPath: options.key });
					}
				} else if (options.cert || options.key) {
					console.error('You must specify both --cert and --key');
				} else {
					if (options.rotate) {
						await rotateCommand(issuerName);
					} else {
						await testCommand(issuerName, numOfTokens);
					}
				}
			} catch (e) {
				console.error(e);
			}
		});

	program.parse();
}

main();
