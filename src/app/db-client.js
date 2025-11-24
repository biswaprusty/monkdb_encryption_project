// wrapper using node-postgres 'pg' to run SQL files and queries
const { Client } = require('pg');
require('dotenv').config();

function createClient() {
  return new Client({
    host: process.env.MONKDB_HOST || '127.0.0.1',
    port: parseInt(process.env.MONKDB_PORT || '5432', 10),
    user: process.env.MONKDB_USER || 'admin',
    password: process.env.MONKDB_PASSWORD || '162498',
    database: process.env.MONKDB_DATABASE || 'monkdb'
  });
}

module.exports = { createClient };
