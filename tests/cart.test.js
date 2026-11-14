const test = require('node:test');
const assert = require('node:assert');
const { createCart, calcTotals, MAX_QTY } = require('../site/js/cart.js');
const { getProduct } = require('../site/js/products.js');

function memoryStorage() {
  const data = {};
  return { getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = v; } };
}

test('add puts a new item in the cart', () => {
  const cart = createCart(memoryStorage());
  cart.add(1);
  assert.deepStrictEqual(cart.items(), [{ id: 1, qty: 1 }]);
});

test('adding the same product again increases its quantity', () => {
  const cart = createCart(memoryStorage());
  cart.add(1, 2);
  cart.add(1, 1);
  assert.deepStrictEqual(cart.items(), [{ id: 1, qty: 3 }]);
  assert.strictEqual(cart.count(), 3);
});

test('quantity never goes above the maximum', () => {
  const cart = createCart(memoryStorage());
  cart.add(1, 50);
  assert.strictEqual(cart.items()[0].qty, MAX_QTY);
  cart.setQty(1, 99);
  assert.strictEqual(cart.items()[0].qty, MAX_QTY);
});

test('setQty changes a quantity and zero removes the line', () => {
  const cart = createCart(memoryStorage());
  cart.add(1, 2);
  cart.setQty(1, 5);
  assert.strictEqual(cart.items()[0].qty, 5);
  cart.setQty(1, 0);
  assert.deepStrictEqual(cart.items(), []);
});

test('remove deletes only the chosen product', () => {
  const cart = createCart(memoryStorage());
  cart.add(1); cart.add(2);
  cart.remove(1);
  assert.deepStrictEqual(cart.items(), [{ id: 2, qty: 1 }]);
});

test('clear empties the cart', () => {
  const cart = createCart(memoryStorage());
  cart.add(1); cart.add(2);
  cart.clear();
  assert.strictEqual(cart.count(), 0);
});

test('corrupt stored data is ignored instead of crashing', () => {
  const storage = { getItem: () => '{not json', setItem: () => {} };
  assert.deepStrictEqual(createCart(storage).items(), []);
  const bad = { getItem: () => JSON.stringify([{ id: 'x', qty: 2 }, { id: 1, qty: -1 }, null]), setItem: () => {} };
  assert.deepStrictEqual(createCart(bad).items(), []);
});

test('the cart is saved between instances that share storage', () => {
  const storage = memoryStorage();
  createCart(storage).add(3, 2);
  assert.strictEqual(createCart(storage).count(), 2);
});

test('totals: an empty cart costs nothing, including shipping', () => {
  assert.deepStrictEqual(calcTotals([], getProduct), { subtotal: 0, shipping: 0, tax: 0, total: 0 });
});

test('totals: orders under $100 pay $8 shipping and 8% tax', () => {
  const t = calcTotals([{ id: 1, qty: 2 }], getProduct);   // 2 x $28
  assert.deepStrictEqual(t, { subtotal: 56, shipping: 8, tax: 4.48, total: 68.48 });
});

test('totals: orders of $100 or more ship free', () => {
  const t = calcTotals([{ id: 4, qty: 1 }, { id: 5, qty: 1 }], getProduct);  // $68 + $42 = $110
  assert.strictEqual(t.subtotal, 110);
  assert.strictEqual(t.shipping, 0);
  assert.strictEqual(t.total, 118.8);
});

test('totals: items that no longer exist are skipped', () => {
  const t = calcTotals([{ id: 999, qty: 3 }], getProduct);
  assert.strictEqual(t.subtotal, 0);
});
