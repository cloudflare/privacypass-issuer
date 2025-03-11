// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { jest } from '@jest/globals';
import { RSABSSA } from '@cloudflare/blindrsa-ts';
import { webcrypto } from 'node:crypto';

import { WshimLogger } from '../src/context/logging';

jest.spyOn(WshimLogger.prototype, 'flushLogs').mockImplementation(async () => {
	return Promise.resolve();
});

interface RsaPssParams extends Algorithm {
	saltLength: number;
}

interface EcdsaParams extends Algorithm {
	hash: HashAlgorithmIdentifier;
}

type KeyFormat = 'jwk' | 'pkcs8' | 'raw' | 'spki';

// eslint-disable-next-line @typescript-eslint/unbound-method
const parentSign = webcrypto.subtle.sign;

// RSA-RAW is not supported by WebCrypto, but is available in Workers
// Taken from cloudflare/blindrsa-ts https://github.com/cloudflare/blindrsa-ts/blob/b7a4c669620fba62ce736fe84445635e222d0d11/test/jest.setup-file.ts#L8-L32
// CryptoKey typeo in the current test environment is outdated and not compatible with node so we force the type here
async function mockSign(
	algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams,
	key: webcrypto.CryptoKey,
	data: Uint8Array
): Promise<ArrayBuffer> {
	if (algorithm === 'RSA-RAW' || (typeof algorithm !== 'string' && algorithm.name === 'RSA-RAW')) {
		const algorithmName = key.algorithm.name;
		if (algorithmName !== 'RSA-RAW') {
			throw new Error(`Invalid key algorithm: ${algorithmName}`);
		}
		key.algorithm.name = 'RSA-PSS';
		try {
			return await RSABSSA.SHA384.PSSZero.Deterministic().blindSign(key, data);
		} finally {
			key.algorithm.name = algorithmName;
		}
	}

	// webcrypto calls crypto, which is mocked. We need to restore the original implementation.
	crypto.subtle.sign = parentSign;
	const res = webcrypto.subtle.sign(algorithm, key, data);
	crypto.subtle.sign = mockSign;
	return res;
}

if (typeof crypto === 'undefined') {
	Object.assign(global, { crypto: webcrypto });
}
crypto.subtle.sign = mockSign;

// eslint-disable-next-line @typescript-eslint/unbound-method
const parentImportKey = webcrypto.subtle.importKey;
async function mockImportKey(
	format: KeyFormat,
	keyData: JsonWebKey | BufferSource,
	algorithm: AlgorithmIdentifier,
	extractable: boolean,
	keyUsages: KeyUsage[]
): Promise<CryptoKey> {
	crypto.subtle.importKey = parentImportKey;
	try {
		if (format === 'jwk') {
			return await crypto.subtle.importKey(
				format,
				keyData as JsonWebKey,
				algorithm,
				extractable,
				keyUsages
			);
		}
		const data: BufferSource = keyData as BufferSource;
		if (
			algorithm === 'RSA-RAW' ||
			(!(typeof algorithm === 'string') && algorithm.name === 'RSA-RAW')
		) {
			if (typeof algorithm === 'string') {
				algorithm = { name: 'RSA-PSS' };
			} else {
				algorithm = { ...algorithm, name: 'RSA-PSS' };
			}
			const key = await crypto.subtle.importKey(format, data, algorithm, extractable, keyUsages);
			key.algorithm.name = 'RSA-RAW';
			return key;
		}
		return await crypto.subtle.importKey(format, data, algorithm, extractable, keyUsages);
	} finally {
		crypto.subtle.importKey = mockImportKey;
	}
}
crypto.subtle.importKey = mockImportKey;
