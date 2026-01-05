// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Labels } from 'promjs-plus';
import { Context } from '../context';

export const DEFAULT_RETRIES = 2;

export function asyncRetries<A extends unknown[], T>(
	ctx: Context,
	f: (...args: A) => Promise<T>,
	retries = DEFAULT_RETRIES,
	labels: Labels = {}
): (...args: A) => Promise<T> {
	return async function (...args: A): Promise<T> {
		let result: Awaited<T>;
		let error: unknown;
		let i = 0;
		for (i = 0; i < retries; i += 1) {
			try {
				result = await f(...args);
				break;
			} catch (e: unknown) {
				error = e;
			}
		}
		const shouldReturnResult = i < retries;

		ctx.metrics.asyncRetriesTotal.inc({
			retries: i,
			success: shouldReturnResult ? 'true' : 'false',
			...labels,
		});

		if (!shouldReturnResult) {
			throw error;
		}
		return result!;
	};
}
