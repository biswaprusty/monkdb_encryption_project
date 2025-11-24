-- COPY OF infra/db/003_create_triggers.sql
-- This file keeps the working version of trigger logic.

-- Function that sets amount_hash using JS-based HMAC UDF
CREATE OR REPLACE FUNCTION orders_set_hash()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- call your JS-based HMAC UDF
  NEW.amount_hash := normalize_and_hmac(NEW.raw_amount);
  RETURN NEW;
END;
$$;

-- Drop trigger if it exists (safe for repeated runs)
DROP TRIGGER IF EXISTS trg_orders_before_insert ON orders;

-- Create trigger to auto-populate hashed values
CREATE TRIGGER trg_orders_before_insert
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION orders_set_hash();
