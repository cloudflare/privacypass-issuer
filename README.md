# privacypass-issuer

Privacy Pass Issuer ([Draft 16](https://www.ietf.org/archive/id/draft-ietf-privacypass-protocol-16.html)) within Cloudflare Workers. Keys are stored in [R2](https://developers.cloudflare.com/r2).

## Deploy

```bash
npm run deploy:production
```

## Token type

Support:
* Public-Verifiable tokens (Blind-RSA)

## Authentication

All endpoints are public by default. Authentication should be a second layer. Internally, Cloudflare uses [Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) to protect `/admin` and `/token-request` endpoints.

## Test token issuance

One can test token issuance locally using `npm run test:e2e -- <issuer-name>` target. If the issuer uses mTLS (Mutual TLS), you can use `npm run test:e2e -- --cert <path> --key <path> <issuer-name>`.

## Key Rotation

Key rotation can be either manual, by calling `POST /admin/rotate` or automated
by defining the `ROTATION_CRON_STRING` variable with a valid cron string and
adding that same cronstring value to the `triggers.crons` list.

Rotation of keys works by generating a new pair of private/public keys until it
can find one whose token id doesn't conflict with a key pair already stored in
the keys R2 Bucket. When it succeeds in generating that, it stores the new key
pair in R2.

## License

The project is licensed under the [Apache-2.0 License](./LICENSE.txt).
