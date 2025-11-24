-- create a simple orders table to experiment
CREATE TABLE IF NOT EXISTS orders (
  order_id TEXT PRIMARY KEY,
  raw_amount TEXT,
  -- optional column to store a computed hash (if you prefer trigger/populate)
  amount_hash TEXT
);
