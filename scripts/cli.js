#!/usr/bin/env node

// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import sade from 'sade';

import { buildCmd } from './build.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
	path: path.join(__dirname, '..', '.env'),
});

const prog = sade('privacy-pass-issuer');

prog
	.command('build')
	.describe('Build the worker.')
	.option('--env', 'Environment', process.env.ENVIRONMENT ?? 'dev')
	.action(buildCmd);

prog.parse(process.argv);
