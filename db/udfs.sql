-- (same content as infra/db/002_create_udfs.sql)
-- JavaScript UDF that normalizes numeric-like text and returns SHA-256 hex
CREATE OR REPLACE FUNCTION normalize_and_sha256(input TEXT)
RETURNS TEXT
LANGUAGE javascript
AS $$
  var s = input;
  if (s === null || s === undefined) return null;
  s = String(s).trim();
  if (s === "" || s.toUpperCase() === "N/A") return null;

  if (s.indexOf(',') !== -1 && s.indexOf('.') !== -1) {
    if (s.indexOf(',') < s.indexOf('.')) {
      s = s.replace(/,/g, '');
    } else {
      s = s.replace(/\./g, '').replace(/,/g, '.');
    }
  } else {
    s = s.replace(/\s+/g, '');
    if (s.indexOf(',') !== -1 && /,(\d{3})/.test(s)) s = s.replace(/,/g, '');
  }
  s = s.replace(/[^0-9\.\-]/g, '');
  var parts = s.split('.');
  if (parts.length > 2) s = parts.slice(0, parts.length-1).join('') + '.' + parts[parts.length-1];
  if (s === '') return null;

  var crypto = require('crypto');
  return crypto.createHash('sha256').update(s, 'utf8').digest('hex');
$$;

-- JavaScript UDF for HMAC-SHA256 (keyed). Uses process.env.HMAC_KEY_SECRET
CREATE OR REPLACE FUNCTION normalize_and_hmac(input TEXT)
RETURNS TEXT
LANGUAGE javascript
AS $$
  var s = input;
  if (s === null || s === undefined) return null;
  s = String(s).trim();
  if (s === "" || s.toUpperCase() === "N/A") return null;

  if (s.indexOf(',') !== -1 && s.indexOf('.') !== -1) {
    if (s.indexOf(',') < s.indexOf('.')) {
      s = s.replace(/,/g, '');
    } else {
      s = s.replace(/\./g, '').replace(/,/g, '.');
    }
  } else {
    s = s.replace(/\s+/g, '');
    if (s.indexOf(',') !== -1 && /,(\d{3})/.test(s)) s = s.replace(/,/g, '');
  }
  s = s.replace(/[^0-9\.\-]/g, '');
  var parts = s.split('.');
  if (parts.length > 2) s = parts.slice(0, parts.length-1).join('') + '.' + parts[parts.length-1];
  if (s === '') return null;

  var crypto = require('crypto');
  var secret = process.env.HMAC_KEY_SECRET || 'local-dev-key';
  return crypto.createHmac('sha256', secret).update(s, 'utf8').digest('hex');
$$;
