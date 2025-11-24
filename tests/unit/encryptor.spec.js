const { normalizeNumberText, hmacSha256Hex } = require('../../src/app/encryptor');

test('normalizes messy numeric strings correctly', () => {
  expect(normalizeNumberText('1,234.5 USD')).toBe('1234.5');
  expect(normalizeNumberText(' 1 234,50 USD ')).toBe('123450');
  expect(normalizeNumberText('N/A')).toBeNull();
});

test('hmac length is 64 hex chars', () => {
  const normalized = normalizeNumberText('1,234.5 USD');
  const h = hmacSha256Hex(normalized, 'local-test-key');
  expect(h).toHaveLength(64);
});
