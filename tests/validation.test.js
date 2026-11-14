const test = require('node:test');
const assert = require('node:assert');
const { validateContact } = require('../site/js/contact.js');
const { validateCheckout } = require('../site/js/checkout.js');

test('contact: empty form reports the required fields', () => {
  const { valid, errors } = validateContact({});
  assert.strictEqual(valid, false);
  assert.deepStrictEqual(Object.keys(errors).sort(), ['email', 'message', 'name']);
});

test('contact: a correct form is valid and the phone is optional', () => {
  assert.strictEqual(validateContact({ name: 'Asha Rao', email: 'asha@example.com', message: 'Hello, do you ship abroad?' }).valid, true);
});

test('contact: bad email, phone and short message are rejected', () => {
  const { errors } = validateContact({ name: 'A', email: 'not-an-email', phone: 'abc', message: 'hi' });
  assert.ok(errors.name && errors.email && errors.phone && errors.message);
});

test('contact: spaces alone do not count as input', () => {
  assert.ok(validateContact({ name: '   ', email: ' ', message: '        ' }).errors.name);
});

test('checkout: empty form reports every field', () => {
  const { errors } = validateCheckout({});
  assert.deepStrictEqual(Object.keys(errors).sort(), ['address', 'city', 'email', 'name', 'state', 'zip']);
});

test('checkout: a correct form is valid', () => {
  const ok = { name: 'Asha Rao', email: 'a@b.co', address: '12 Kiln Lane', city: 'Portland', state: 'OR', zip: '97201' };
  assert.strictEqual(validateCheckout(ok).valid, true);
  assert.strictEqual(validateCheckout({ ...ok, zip: '97201-1234' }).valid, true);
});

test('checkout: bad state and ZIP codes are rejected', () => {
  const base = { name: 'Asha Rao', email: 'a@b.co', address: '12 Kiln Lane', city: 'Portland' };
  assert.ok(validateCheckout({ ...base, state: 'Ore', zip: '97201' }).errors.state);
  assert.ok(validateCheckout({ ...base, state: 'OR', zip: '9720' }).errors.zip);
});
