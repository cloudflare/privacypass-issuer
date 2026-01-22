// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { build } from 'esbuild';
import git from 'git-rev-sync';
import Sentry from '@sentry/cli';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

export async function buildCmd(opts) {
	let version = git.tag();
	if (git.hasUnstagedChanges() || git.isTagDirty()) {
		version += '.next';
	}
	const release = `privacy-pass-issuer@${version}-${opts.env}+${git.short(__dirname)}`;
	console.log(`Building ${release}`);

	await build({
		bundle: true,
		sourcemap: true,
		format: 'esm',
		target: 'esnext',
		packages: 'external',
		external: ['__STATIC_CONTENT_MANIFEST', 'cloudflare:workers'],
		legalComments: 'external',
		conditions: ['worker', 'browser'],
		entryPoints: [path.join(__dirname, '..', 'src', 'index.ts')],
		outfile: path.join(__dirname, '..', 'dist', 'worker.mjs'),
		outExtension: { '.js': '.mjs' },
		minify: false,
		// handy variables for Sentry reporting
		define: {
			RELEASE: JSON.stringify(release),
			VERSION: JSON.stringify(version),
			COMMITHASH: JSON.stringify(git.long(__dirname)),
			BRANCH: JSON.stringify(git.branch(__dirname)),
		},
	});

	// Sentry release and sourcemap upload
	if (process.env.SENTRY_API_TOKEN) {
		let headers = {};
		if (process.env.SENTRY_ACCESS_CLIENT_ID) {
			headers['Cf-Access-Client-ID'] = process.env.SENTRY_ACCESS_CLIENT_ID;
		}
		if (process.env.SENTRY_ACCESS_CLIENT_SECRET) {
			headers['Cf-Access-Client-Secret'] = process.env.SENTRY_ACCESS_CLIENT_SECRET;
		}
		const cli = new Sentry(undefined, {
			authToken: process.env.SENTRY_API_TOKEN,
			org: process.env.SENTRY_ORG ?? 'cloudflare',
			project: process.env.SENTRY_PROJECT ?? 'privacy-pass-issuer',
			dist: git.short(__dirname),
			url: process.env.SENTRY_URL ?? 'https://sentry.io/',
			headers,
		});

		// these are the API calls if the JS API was to support custom headers
		await cli.releases.new(release);
		await cli.releases.setCommits(release, {
			auto: true,
			ignoreEmpty: true,
		});
		await cli.releases.uploadSourceMaps(release, {
			include: ['./dist'],
			ext: ['map', 'mjs'],
		});
		await cli.releases.finalize(release);
		await cli.releases.newDeploy(release, {
			env: opts.env,
		});
	}
}
