# privacypass-issuer

Privacy Pass Issuer ([Draft 16](https://www.ietf.org/archive/id/draft-ietf-privacypass-protocol-16.html)) within Cloudflare Workers. Keys are stored in [R2](https://developers.cloudflare.com/r2).

Key rotation is manual by calling `POST /admin/rotate`.

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
