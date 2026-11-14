/* Cart logic. Storage is injected so the same code runs in the browser and in Node tests. */
(function (root) {
  'use strict';
  const MAX_QTY = 10;
  const FREE_SHIPPING_OVER = 100;   // dollars
  const SHIPPING_FLAT = 8;          // dollars
  const TAX_RATE = 0.08;

  function createCart(storage, key) {
    key = key || 'tidewell_cart';
    function read() {
      try {
        const a = JSON.parse(storage.getItem(key));
        return Array.isArray(a) ? a.filter((i) => i && Number.isInteger(i.id) && i.qty > 0) : [];
      } catch (e) { return []; }
    }
    function write(items) { try { storage.setItem(key, JSON.stringify(items)); } catch (e) { /* ignore */ } return items; }
    return {
      items: read,
      add(id, qty) {
        qty = qty === undefined ? 1 : qty;
        const items = read(), line = items.find((i) => i.id === id);
        if (line) line.qty = Math.min(MAX_QTY, line.qty + qty);
        else items.push({ id, qty: Math.min(MAX_QTY, qty) });
        return write(items);
      },
      setQty(id, qty) {
        let items = read();
        items = qty <= 0 ? items.filter((i) => i.id !== id)
          : items.map((i) => (i.id === id ? { id, qty: Math.min(MAX_QTY, qty) } : i));
        return write(items);
      },
      remove(id) { return write(read().filter((i) => i.id !== id)); },
      clear() { return write([]); },
      count() { return read().reduce((s, i) => s + i.qty, 0); }
    };
  }

  /* Money is calculated in cents to avoid floating-point errors. */
  function calcTotals(items, getProduct) {
    let cents = 0;
    items.forEach((i) => { const p = getProduct(i.id); if (p) cents += Math.round(p.price * 100) * i.qty; });
    const shipping = cents === 0 || cents >= FREE_SHIPPING_OVER * 100 ? 0 : SHIPPING_FLAT * 100;
    const tax = Math.round(cents * TAX_RATE);
    return { subtotal: cents / 100, shipping: shipping / 100, tax: tax / 100, total: (cents + shipping + tax) / 100 };
  }

  const api = { createCart, calcTotals, MAX_QTY, FREE_SHIPPING_OVER, SHIPPING_FLAT, TAX_RATE };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; return; }

  /* Browser: use localStorage, fall back to memory if it is blocked. */
  let storage;
  try { localStorage.setItem('_t', '1'); localStorage.removeItem('_t'); storage = localStorage; }
  catch (e) { const m = {}; storage = { getItem: (k) => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = v; } }; }
  const cart = createCart(storage, window.Tidewell && window.Tidewell.CART_KEY);
  ['add', 'setQty', 'remove', 'clear'].forEach((fn) => {
    const orig = cart[fn];
    cart[fn] = function () { const r = orig.apply(cart, arguments); window.Tidewell && window.Tidewell.updateCartCount(); return r; };
  });
  root.TidewellCart = Object.assign(cart, { calcTotals });
})(typeof window !== 'undefined' ? window : globalThis);
