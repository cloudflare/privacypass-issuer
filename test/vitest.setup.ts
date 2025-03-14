// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { WshimLogger } from '../src/context/logging';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { webcrypto } from 'node:crypto';
import { RSABSSA } from '@cloudflare/blindrsa-ts';

globalThis.RELEASE = 'test';

vi.spyOn(WshimLogger.prototype, 'flushLogs').mockImplementation(async () => {
	return Promise.resolve();
});
