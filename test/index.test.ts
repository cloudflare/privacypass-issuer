import { Context } from '../src/context';
import { handleTokenRequest, default as workerObject } from '../src/index';
import { b64ToB64URL, u8ToB64 } from '../src/utils/base64';
import { ExecutionContextMock, getContext, getEnv } from './mocks';
import * as blindrsa from '@cloudflare/blindrsa-ts';
import { TokenRequest, util } from '@cloudflare/privacypass-ts';

const sampleURL = 'http://localhost';

describe('challenge handlers', () => {
	const suite = blindrsa.SUITES.SHA384.PSS.Deterministic();

	const tokenRequestURL = `${sampleURL}/token-request`;
	const mockPrivateKey = async (ctx: Context): Promise<CryptoKeyPair> => {
		const keypair = await suite.generateKey(
			{
				publicExponent: Uint8Array.from([1, 0, 1]),
				modulusLength: 2048,
			},
			true,
			['sign', 'verify']
		);
		const publicKey = new Uint8Array(
			(await crypto.subtle.exportKey('spki', keypair.publicKey)) as ArrayBuffer
		);
		const publicKeyEnc = b64ToB64URL(u8ToB64(util.convertEncToRSASSAPSS(publicKey)));
		await ctx.env.ISSUANCE_KEYS.put(
			'latest',
			(await crypto.subtle.exportKey('pkcs8', keypair.privateKey)) as ArrayBuffer,
			{ customMetadata: { publicKey: publicKeyEnc } }
		);
		return keypair;
	};

	it('should return a Privacy Pass token response when provided with a valid Privacy Pass token request', async () => {
		const ctx = getContext({ env: getEnv(), ectx: new ExecutionContextMock() });

		const msgString = 'Hello World!';
		const message = new TextEncoder().encode(msgString);
		const preparedMsg = suite.prepare(message);
		const { publicKey } = await mockPrivateKey(ctx);
		const { blindedMsg, inv } = await suite.blind(publicKey, preparedMsg);
		const publicKeyExport = new Uint8Array(
			(await crypto.subtle.exportKey('spki', publicKey)) as ArrayBuffer
		);
		const publicKeyU8 = util.convertEncToRSASSAPSS(publicKeyExport);
		const publicKeyEnc = b64ToB64URL(u8ToB64(publicKeyU8));
		const keyId = new Uint8Array(
			await crypto.subtle.digest('SHA-256', new TextEncoder().encode(publicKeyEnc))
		);
		const tokenKeyId = keyId[keyId.length - 1];

		// note that blindedMsg should be the payload and not the message directly
		const tokenRequest = new TokenRequest(tokenKeyId, blindedMsg);

		const request = new Request(tokenRequestURL, {
			method: 'POST',
			headers: { 'content-type': 'application/private-token-request' },
			body: tokenRequest.serialize(),
		});

		const response = await handleTokenRequest(ctx, request);

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('application/private-token-response');

		const blindSignature = new Uint8Array(await response.arrayBuffer());
		const signature = await suite.finalize(publicKey, preparedMsg, blindSignature, inv);
		const isValid = await suite.verify(publicKey, signature, preparedMsg);
		expect(isValid).toBe(true);
	});
});

describe('non existing handler', () => {
	const nonExistingURL = `${sampleURL}/non-existing`;

	it('should return 404 when a non GET existing endpoint is requested', async () => {
		const request = new Request(nonExistingURL);
		const response = await workerObject.fetch(request, getEnv(), new ExecutionContextMock());

		expect(response.status).toBe(404);
	});

	it('should return 404 when a non POST existing endpoint is requested', async () => {
		const request = new Request(nonExistingURL, { method: 'POST' });
		const response = await workerObject.fetch(request, getEnv(), new ExecutionContextMock());

		expect(response.status).toBe(404);
	});
});
