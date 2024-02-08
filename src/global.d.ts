declare global {
	// RELEASE is statically replaced at compile time by esbuild.
	// See scripts/build.js for more information.
	const RELEASE: string;

	// blindrsa requires these interface to be in scope
	// while they are available in
	interface RsaHashedKeyGenParams {
		hash: string | object;
		modulusLength: number;
		name: string;
		publicExponent: Uint8Array;
	}

	type KeyUsage =
		| 'encrypt'
		| 'decrypt'
		| 'sign'
		| 'verify'
		| 'deriveKey'
		| 'deriveBits'
		| 'wrapKey'
		| 'unwrapKey';

	// privacypass requires these interface to be in scope
	interface Algorithm {
		name: string;
	}

	type AlgorithmIdentifier = Algorithm | string;

	type HashAlgorithmIdentifier = AlgorithmIdentifier;

	interface RsaHashedImportParams extends Algorithm {
		hash: HashAlgorithmIdentifier;
	}
}

export {};
