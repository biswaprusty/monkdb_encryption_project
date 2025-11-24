// simple migration runner that reads infra/db/*.sql and executes them
const fs = require('fs');
const path = require('path');
const { createClient } = require('../src/app/db-client');
require('dotenv').config();

async function runFile(client, relpath) {
  const p = path.join(__dirname, '..', relpath);
  console.log('Running', p);
  const sql = fs.readFileSync(p, 'utf8');
  await client.query(sql);
}

(async () => {
  const client = createClient();
  await client.connect();
  try {
    await runFile(client, 'infra/db/001_create_tables.sql');
    await runFile(client, 'infra/db/002_create_udfs.sql');
    await runFile(client, 'infra/db/003_create_triggers.sql');
    console.log('Migrations applied successfully.');
  } catch (err) {
    console.error('Migration error:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
