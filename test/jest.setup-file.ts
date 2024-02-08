import { RSABSSA } from '@cloudflare/blindrsa-ts';

interface RsaPssParams extends Algorithm {
	saltLength: number;
}

interface EcdsaParams extends Algorithm {
	hash: HashAlgorithmIdentifier;
}

const parentSign = crypto.subtle.sign;

// RSA-RAW is not supported by WebCrypto, but is available in Workers
// Taken from cloudflare/blindrsa-ts https://github.com/cloudflare/blindrsa-ts/blob/b7a4c669620fba62ce736fe84445635e222d0d11/test/jest.setup-file.ts#L8-L32
async function mockSign(
	algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams,
	key: CryptoKey,
	data: Uint8Array
): Promise<ArrayBuffer> {
	if (algorithm === 'RSA-RAW' || (typeof algorithm !== 'string' && algorithm?.name === 'RSA-RAW')) {
		const algorithmName = key.algorithm.name;
		if (algorithmName !== 'RSA-RAW') {
			throw new Error(`Invalid key algorithm: ${algorithmName}`);
		}
		key.algorithm.name = 'RSA-PSS';
		try {
			// await is needed here because if the promised is returned, the algorithmName could be restored before the key is used, causing an error
			return await RSABSSA.SHA384.PSSZero.Deterministic().blindSign(key, data);
		} finally {
			key.algorithm.name = algorithmName;
		}
	}

	console.log('somehow mock', algorithm);
	// webcrypto calls crypto, which is mocked. We need to restore the original implementation.
	crypto.subtle.sign = parentSign;
	const res = crypto.subtle.sign(algorithm, key, data);
	crypto.subtle.sign = mockSign;
	return res;
}

crypto.subtle.sign = mockSign;
