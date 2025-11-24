// small helper to run the same normalization + hashing in Node for tests
const crypto = require('crypto');

function normalizeNumberText(s) {
  if (s === null || s === undefined) return null;
  let st = String(s).trim();
  if (st === "" || st.toUpperCase() === "N/A") return null;

  if (st.includes(',') && st.includes('.')) {
    if (st.indexOf(',') < st.indexOf('.')) {
      st = st.replace(/,/g, '');
    } else {
      st = st.replace(/\./g, '').replace(/,/g, '.');
    }
  } else {
    st = st.replace(/\s+/g, '');
    if (st.includes(',') && /,(\d{3})/.test(st)) st = st.replace(/,/g, '');
  }
  st = st.replace(/[^0-9\.\-]/g, '');
  const parts = st.split('.');
  if (parts.length > 2) st = parts.slice(0, parts.length-1).join('') + '.' + parts[parts.length-1];
  if (st === '') return null;
  return st;
}

function sha256Hex(s) {
  if (s === null) return null;
  return crypto.createHash('sha256').update(s, 'utf8').digest('hex');
}

function hmacSha256Hex(s, key) {
  if (s === null) return null;
  return crypto.createHmac('sha256', key).update(s, 'utf8').digest('hex');
}

module.exports = { normalizeNumberText, sha256Hex, hmacSha256Hex };
