// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { program } from 'commander';
import { MTLSConfiguration, testE2E, rotateKey } from './issuer.js';

async function testCommand(issuerName: string, mTLS?: MTLSConfiguration) {
	console.log('Testing with issuer', issuerName);
	const validIssuer = await testE2E(issuerName, mTLS);

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
		.option('--rotate', 'Rotate the key for the given issuer') // Leave
		.argument('<issuer-name>', 'Name of the issuer. e.g. demo-pat.issuer.cloudflare.com')
		.action(async (issuerName, options) => {
			try {
				if (options.cert && options.key) {
					const mTLS = { certPath: options.cert, keyPath: options.key };
					if (options.rotate) {
						await rotateCommand(issuerName, mTLS);
					} else {
						await testCommand(issuerName, { certPath: options.cert, keyPath: options.key });
					}
				} else if (options.cert || options.key) {
					console.error('You must specify both --cert and --key');
				} else {
					if (options.rotate) {
						await rotateCommand(issuerName);
					} else {
						await testCommand(issuerName);
					}
				}
			} catch (e) {
				console.error(e);
			}
		});

	program.parse();
}

main();
