const test = require('node:test');
const assert = require('node:assert');
const { filterProducts, sortProducts } = require('../site/js/shop.js');
const { PRODUCTS } = require('../site/js/products.js');

test('no filters returns every product', () => {
  assert.strictEqual(filterProducts(PRODUCTS, {}).length, 24);
});

test('search matches names, ignoring case and surrounding spaces', () => {
  const r = filterProducts(PRODUCTS, { query: '  TEAPOT ' });
  assert.strictEqual(r.length, 4);
  assert.ok(r.every((p) => p.name.includes('Teapot')));
});

test('search with no match returns an empty list', () => {
  assert.deepStrictEqual(filterProducts(PRODUCTS, { query: 'zzzz' }), []);
});

test('category and collection filters narrow the list', () => {
  assert.strictEqual(filterProducts(PRODUCTS, { category: 'Plates' }).length, 4);
  assert.strictEqual(filterProducts(PRODUCTS, { collection: 'Fern' }).length, 6);
  assert.strictEqual(filterProducts(PRODUCTS, { category: 'Serveware', collection: 'Tide' }).length, 3);
});

test('price filter keeps only products at or under the limit', () => {
  const r = filterProducts(PRODUCTS, { maxPrice: '25' });
  assert.ok(r.length > 0 && r.every((p) => p.price <= 25));
});

test('in-stock filter removes sold-out products', () => {
  const r = filterProducts(PRODUCTS, { inStockOnly: true });
  assert.strictEqual(r.length, 23);
  assert.ok(r.every((p) => p.stock > 0));
});

test('sorting by price works in both directions', () => {
  const asc = sortProducts(PRODUCTS, 'price-asc').map((p) => p.price);
  const desc = sortProducts(PRODUCTS, 'price-desc').map((p) => p.price);
  assert.deepStrictEqual(asc, asc.slice().sort((a, b) => a - b));
  assert.deepStrictEqual(desc, desc.slice().sort((a, b) => b - a));
});

test('sorting by name is alphabetical and does not change the original list', () => {
  const before = PRODUCTS.map((p) => p.id);
  const names = sortProducts(PRODUCTS, 'name').map((p) => p.name);
  assert.deepStrictEqual(names, names.slice().sort((a, b) => a.localeCompare(b)));
  assert.deepStrictEqual(PRODUCTS.map((p) => p.id), before);
});

test('newest puts new arrivals first', () => {
  const r = sortProducts(PRODUCTS, 'newest');
  assert.ok(r[0].isNew);
});
