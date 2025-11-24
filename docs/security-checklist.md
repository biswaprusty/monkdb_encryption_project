# Security checklist (short)

- Do not commit .env or secret keys.
- Use KMS for HMAC keys in production.
- Protect DB credentials; use least-privileged user for migrations if possible.
- Plan key rotation (version keys or re-hash rows after rotation).
- Audit UDFs and ensure only authorized users can create/replace functions.
