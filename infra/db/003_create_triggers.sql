-- Example trigger to auto-populate amount_hash using normalize_and_hmac on insert/update
-- Note: If your DB cannot use triggers this file is optional.

CREATE OR REPLACE FUNCTION orders_set_hash()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.amount_hash := normalize_and_hmac(NEW.raw_amount);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_orders_before_insert ON orders;

CREATE TRIGGER trg_orders_before_insert
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION orders_set_hash();