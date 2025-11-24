// quick check: insert sample and run SELECT to show hashed output
const { createClient } = require('../src/app/db-client');
require('dotenv').config();

(async () => {
  const client = createClient();
  await client.connect();
  try {
    console.log('Inserting sample...');
    await client.query(`INSERT INTO orders (order_id, raw_amount) VALUES ('o_demo_1', '1,234.5 USD')
      ON CONFLICT (order_id) DO NOTHING;`);
    const res = await client.query(`SELECT order_id, raw_amount, normalize_and_sha256(raw_amount) as sha, normalize_and_hmac(raw_amount) as hmac, amount_hash FROM orders WHERE order_id='o_demo_1'`);
    console.log(res.rows);
  } catch (err) {
    console.error('Check error:', err);
  } finally {
    await client.end();
  }
})();
