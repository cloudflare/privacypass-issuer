import { Bindings } from './bindings';
import { Context } from './context';
import { Router } from './router';
import { HeaderNotDefinedError } from './errors';
import { IssuerConfigurationResponse, TokenType } from './types';
import { b64ToB64URL, b64Tou8, b64URLtoB64, u8ToB64 } from './utils/base64';
import { Issuer, TOKEN_TYPES, TokenRequest, util } from '@cloudflare/privacypass-ts';

export const handleTokenRequest = async (ctx: Context, request: Request) => {
	const contentType = request.headers.get('content-type');
	if (!contentType || contentType !== 'application/private-token-request') {
		throw new HeaderNotDefinedError('"Content-Type" must be "application/private-token-request"');
	}

	const buffer = await request.arrayBuffer();
	const tokenRequest = TokenRequest.deserialize(new Uint8Array(buffer));

	if (tokenRequest.tokenType !== TOKEN_TYPES.BLIND_RSA.value) {
		throw new Error('Invalid token type');
	}

	const latest = await ctx.env.ISSUANCE_KEYS.get('latest');

	if (latest === null) {
		throw new Error('Issuer not initialised');
	}

	const sk = await crypto.subtle.importKey(
		'pkcs8',
		await latest.arrayBuffer(),
		{
			name: 'RSA-PSS',
			hash: 'SHA-384',
			length: 2048,
		},
		true,
		['sign']
	);
	const pkEnc = latest?.customMetadata?.publicKey;
	if (!pkEnc) {
		throw new Error('Issuer not initialised');
	}
	const pk = await crypto.subtle.importKey(
		'spki',
		util.convertRSASSAPSSToEnc(b64Tou8(b64URLtoB64(pkEnc))),
		{ name: 'RSA-PSS', hash: 'SHA-384' },
		true,
		['verify']
	);
	const domain = new URL(request.url).host;
	const issuer = new Issuer(domain, sk, pk);
	const signedToken = await issuer.issue(tokenRequest);

	return new Response(signedToken.serialize(), {
		headers: { 'content-type': 'application/private-token-response' },
	});
};

export const handleTokenDirectory = async (ctx: Context, request: Request) => {
	const latest = await ctx.env.ISSUANCE_KEYS.head('latest');
	const publicKey = latest?.customMetadata?.publicKey;

	if (!publicKey) {
		throw new Error('Issuer not initialised');
	}

	const directory: IssuerConfigurationResponse = {
		'issuer-request-uri': '/token-request',
		'token-keys': [
			{
				'token-type': TokenType.BlindRSA,
				'token-key': publicKey,
				'not-before': latest.uploaded.getTime(),
			},
		],
	};

	return new Response(JSON.stringify(directory), {
		headers: {
			'content-type': 'application/private-token-issuer-directory',
			'cache-control': 'public, max-age=86400',
		},
	});
};

export const handleRotateKey = async (ctx: Context, request: Request) => {
	// Generate a new type 2 Issuer key
	const keypair = (await crypto.subtle.generateKey(
		{
			name: 'RSA-PSS',
			modulusLength: 2048,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: { name: 'SHA-384' },
		},
		true,
		['sign', 'verify']
	)) as CryptoKeyPair;
	const publicKey = new Uint8Array(
		(await crypto.subtle.exportKey('spki', keypair.publicKey)) as ArrayBuffer
	);
	const publicKeyEnc = b64ToB64URL(u8ToB64(util.convertEncToRSASSAPSS(publicKey)));
	const privateKey = (await crypto.subtle.exportKey('pkcs8', keypair.privateKey)) as ArrayBuffer;

	// check if it's the initialisation phase
	const latest = await ctx.env.ISSUANCE_KEYS.head('latest');
	const version = latest?.customMetadata?.version ?? '0';
	const next = Number.parseInt(version) + 1;

	await ctx.env.ISSUANCE_KEYS.put(next.toString(), privateKey);
	await ctx.env.ISSUANCE_KEYS.put('latest', privateKey, {
		customMetadata: { version: next.toString(), publicKey: publicKeyEnc },
	});

	return new Response(`New key ${publicKeyEnc}`, { status: 201 });
};

export default {
	async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {
		// router defines all API endpoints
		// this ease testing, as test can be performed on specific handler methods, not necessardily e2e
		const router = new Router();

		router
			.get('/.well-known/private-token-issuer-directory', handleTokenDirectory)
			.post('/token-request', handleTokenRequest)
			.post('/admin/rotate', handleRotateKey);

		return router.handle(
			request as Request<Bindings, IncomingRequestCfProperties<unknown>>,
			env,
			ctx
		);
	},
};
