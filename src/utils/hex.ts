// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

export const hexDecode = (s: string) => {
	const bytes = s.match(/.{1,2}/g);
	if (!bytes) {
		return new Uint8Array(0);
	}
	return Uint8Array.from(bytes.map(b => parseInt(b, 16)));
};

export const hexEncode = (u: Uint8Array) =>
	Array.from(u)
		.map(b => b.toString(16).padStart(2, '0'))
		.join('');
