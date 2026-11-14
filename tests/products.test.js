const test = require('node:test');
const assert = require('node:assert');
const { PRODUCTS, CATEGORIES, COLLECTIONS, getProduct } = require('../site/js/products.js');

test('there are 24 products with unique ids', () => {
  assert.strictEqual(PRODUCTS.length, 24);
  assert.strictEqual(new Set(PRODUCTS.map((p) => p.id)).size, 24);
});

test('every product has the fields the pages rely on', () => {
  for (const p of PRODUCTS) {
    assert.ok(p.name && p.description, `product ${p.id} needs a name and description`);
    assert.ok(p.price > 0, `product ${p.id} needs a positive price`);
    assert.ok(CATEGORIES.includes(p.category), `product ${p.id} has an unknown category`);
    assert.ok(COLLECTIONS.some((c) => c.name === p.collection), `product ${p.id} has an unknown collection`);
    assert.strictEqual(p.images.length, 3, `product ${p.id} needs 3 images`);
    assert.ok(p.stock >= 0);
    assert.ok(Object.keys(p.specs).length >= 3);
  }
});

test('getProduct finds products by number or numeric string, and returns undefined otherwise', () => {
  assert.strictEqual(getProduct(1).name, 'Tide Dinner Plate');
  assert.strictEqual(getProduct('24').name, 'Basalt Serving Platter');
  assert.strictEqual(getProduct(999), undefined);
});

test('the home page has enough bestsellers, new arrivals and one sold-out item to show', () => {
  assert.ok(PRODUCTS.filter((p) => p.bestseller).length >= 4);
  assert.ok(PRODUCTS.filter((p) => p.isNew).length >= 4);
  assert.strictEqual(PRODUCTS.filter((p) => p.stock === 0).length, 1);
});
