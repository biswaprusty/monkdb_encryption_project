const { createClient } = require('../../src/app/db-client');
const { normalizeNumberText, hmacSha256Hex } = require('../../src/app/encryptor');
require('dotenv').config();

jest.setTimeout(20000);

test('DB normalize_and_hmac should match app hmac', async () => {
  const client = createClient();
  await client.connect();
  try {
    const id = 'test_integration_1';
    await client.query(`INSERT INTO orders (order_id, raw_amount) VALUES ($1,$2) ON CONFLICT (order_id) DO UPDATE SET raw_amount = EXCLUDED.raw_amount`, [id, '1,234.5 USD']);
    const res = await client.query(`SELECT raw_amount, normalize_and_hmac(raw_amount) as dbhmac FROM orders WHERE order_id=$1`, [id]);
    const raw = res.rows[0].raw_amount;
    const dbhmac = res.rows[0].dbhmac;
    const normalized = normalizeNumberText(raw);
    const expected = hmacSha256Hex(normalized, process.env.HMAC_KEY_SECRET || 'local-dev-hmac-key');
    expect(dbhmac).toBe(expected);
  } finally {
    await client.end();
  }
});
