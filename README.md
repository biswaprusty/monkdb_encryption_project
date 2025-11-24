# MonkDB Encryption Project (Beginner)

This small project demonstrates JS-based UDF-style hashing/HMAC for MonkDB,
migrations, and example tests using Node.

Quick steps:
1. Install dependencies: `npm install`
2. Copy `.env.example` → `.env` and fill connection values.
3. Run migrations: `npm run migrate`
4. Check a query: `npm run check`
5. Run tests: `npm test`

Notes:
- The migration script connects with `pg` (psql client). If your MonkDB client/port differs adapt `.env`.
- DO NOT commit `.env`.
- For production store HMAC key in KMS.
