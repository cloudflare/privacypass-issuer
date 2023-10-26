# pp-issuer

Privacy Pass Issuer (Draft 10) within Cloudflare workers. Keys are stored in R2.

Key rotation could be added via a cron job, and has not been to reduce complexity.

## Deploy

```bash
npm run deploy:dev
```

## Token type

Supported:
* Type 2 - RSA-PSS

## Authentication

All endpoints are public by default. Authentication should be a second layer. Internally, Cloudflare uses Access to protect the /admin endpoints and issuance.