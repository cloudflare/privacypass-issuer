// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { WshimLogger } from '../src/context/logging';
import { vi } from 'vitest';

globalThis.RELEASE = 'test';

vi.spyOn(WshimLogger.prototype, 'flushLogs').mockImplementation(async () => {
	return Promise.resolve();
});

vi.mock('cloudflare:workers', () => {
	return {
		WorkerEntrypoint: class WorkerEntrypoint<T = any> {
			constructor(
				public ctx?: any,
				public env?: any
			) {}
		},
	};
});
