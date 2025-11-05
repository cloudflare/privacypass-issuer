import JWT from '@tsndr/cloudflare-worker-jwt';
import { Bindings, UncheckedBindings, checkMandatoryBindings } from './bindings';
import { u8ToB64 } from './utils/base64';
import { R2Bucket } from '@cloudflare/workers-types/2023-07-01';
import { WshimLogger } from './context/logging';
import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
import { Router } from './router';

type ServiceAccountKey = {
	type: string;
	project_id: string;
	private_key_id: string;
	private_key: string;
	client_email: string;
	client_id: string;
	auth_uri: string;
	token_uri: string;
	auth_provider_x509_cert_url: string;
	client_x509_cert_url: string;
	universe_domain: string;
};

const getGoogleAccessToken = async (
	logger: WshimLogger,
	serviceAccountKey: string
): Promise<string> => {
	try {
		const serviceAccount: ServiceAccountKey = JSON.parse(serviceAccountKey);
		const now = Math.floor(Date.now() / 1000);
		const expires = now + 3600; // Token valid for 1 hour (Google's max for JWT)

		// Define the JWT payload
		const payload = {
			iss: serviceAccount.client_email,
			scope: 'https://www.googleapis.com/auth/devstorage.full_control',
			aud: 'https://oauth2.googleapis.com/token',
			exp: expires,
			iat: now,
		};

		const jwt = await JWT.sign(payload, serviceAccount.private_key, { algorithm: 'RS256' });

		const response = await fetch('https://oauth2.googleapis.com/token', {
			redirect: 'manual',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
				assertion: jwt,
			}).toString(),
		});

		if (!response.ok) {
			const errorText = await response.text();
			logger.error('Google OAuth Token Error:', errorText);
			throw new Error(
				`Failed to get Google Access Token: ${response.status} ${response.statusText} - ${errorText}`
			);
		}

		const data: { access_token: string } = await response.json();
		return data.access_token;
	} catch (e) {
		logger.error('Error during Google Access Token generation:', e);
		throw new Error('Authentication failed.');
	}
};

type Key = {
	id: string;
	privateKey: Uint8Array;
	metadata: Record<string, string>;
};

type Required<T> = { [K in keyof T]: NonNullable<T[K]> };

type BackupEnv = Required<Pick<Bindings, 'BACKUPS_SERVICE_ACCOUNT_KEY' | 'BACKUPS_BUCKET_NAME'>>;

const backupKeys = async (
	logger: WshimLogger,
	env: BackupEnv,
	keys: Key[],
	step: WorkflowStep
): Promise<void> => {
	const gcsUploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${env.BACKUPS_BUCKET_NAME}/o?uploadType=multipart`;
	const boundary = 'metadata-boundary';

	const objectNamePrefix = (() => {
		const now = new Date();
		return `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;
	})();

	const accessToken = await step.do(
		'get-google-access-token',
		async () => await getGoogleAccessToken(logger, env.BACKUPS_SERVICE_ACCOUNT_KEY)
	);
	for (const { id, privateKey, metadata } of keys) {
		const objectName = `${objectNamePrefix}-id:${id}`;
		const objMetadata = {
			name: objectName,
			metadata: Object.fromEntries(
				Object.entries(metadata).map(([k, v]) => [`x-goog-meta-${k}`, v])
			),
		};

		const post = {
			redirect: 'manual',
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': `multipart/related; boundary=${boundary}`,
			},
			body: [
				`--${boundary}`,
				'Content-Type: application/json; charset=UTF-8',
				'',
				JSON.stringify(objMetadata),
				'',
				`--${boundary}`,
				'Content-Type: application/octet-stream',
				'Content-Transfer-Encoding: base64',
				'',
				u8ToB64(privateKey),
				`--${boundary}--`,
				'',
			].join('\r\n'),
		};
		await step.do(`backup-${id}`, async () => {
			try {
				const uploadResponse = await fetch(gcsUploadUrl, post);

				if (!uploadResponse.ok) {
					const errorText = await uploadResponse.text();
					throw new Error(`GCS Upload Error: ${errorText}`);
				}
			} catch (e) {
				throw new Error(`Error handling upload: ${e}`);
			}
		});
	}
};

const readKeys = async (logger: WshimLogger, r2: R2Bucket): Promise<Key[]> => {
	const list = await r2.list({ include: ['customMetadata'] });
	const objects = await Promise.all(
		list.objects.map(async object => ({
			object,
			content: await (await r2.get(object.key))?.arrayBuffer(),
		}))
	);
	return objects.filterMap(({ object, content }) => {
		if (object.customMetadata === undefined) {
			logger.error('no metadata found', object.key);
			return null;
		}
		if (content === undefined) {
			logger.error('no private key found', object.key);
			return null;
		}
		return {
			id: object.key,
			privateKey: new Uint8Array(content!),
			metadata: object.customMetadata!,
		};
	});
};

export class KeyBackupWorkflow extends WorkflowEntrypoint<UncheckedBindings> {
	async run(_event: WorkflowEvent<unknown>, step: WorkflowStep) {
		const sampleRequest = new Request(`https://schedule.example.com`);

		const checkedEnv = checkMandatoryBindings(this.env);
		const ctx = Router.buildContext(sampleRequest, checkedEnv, this.ctx);

		// have to put these in variables otherwise typescript can't narrow the type to remove the `|null`
		const { BACKUPS_BUCKET_NAME, BACKUPS_SERVICE_ACCOUNT_KEY } = ctx.env;

		if (BACKUPS_BUCKET_NAME === null || BACKUPS_SERVICE_ACCOUNT_KEY === null) {
			throw new Error('backup variables not configured');
		}

		await backupKeys(
			ctx.wshimLogger,
			{ BACKUPS_SERVICE_ACCOUNT_KEY, BACKUPS_BUCKET_NAME },
			await step.do(
				'read-keys',
				async () => await readKeys(ctx.wshimLogger, ctx.env.ISSUANCE_KEYS)
			),
			step
		);
	}
}
