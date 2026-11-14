/* Cart page: list, quantity changes, remove, totals. */
(function () {
  'use strict';
  const { getProduct } = window.TidewellData;
  const { money } = window.Tidewell;
  const cart = window.TidewellCart;
  const $ = (id) => document.getElementById(id);
  const maxFor = (p) => Math.min(10, p.stock);

  function render() {
    // Keep the cart consistent with stock
    cart.items().forEach((i) => {
      const p = getProduct(i.id);
      if (!p || p.stock === 0) cart.remove(i.id);
      else if (i.qty > maxFor(p)) cart.setQty(i.id, maxFor(p));
    });
    const items = cart.items();
    $('empty').hidden = items.length > 0;
    $('cart-content').hidden = items.length === 0;
    if (!items.length) return;

    $('lines').innerHTML = items.map((i) => {
      const p = getProduct(i.id);
      return `<div class="line" data-id="${p.id}">
        <a href="product.html?id=${p.id}"><img src="${p.images[0]}" alt="${p.name}"></a>
        <div>
          <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
          <p class="line-meta">${money(p.price)} each${p.stock <= 5 ? ' &middot; only ' + p.stock + ' left' : ''}</p>
          <div class="stepper" role="group" aria-label="Quantity for ${p.name}">
            <button type="button" data-act="dec" aria-label="Decrease quantity" ${i.qty <= 1 ? 'disabled' : ''}>&minus;</button>
            <input type="number" min="1" max="${maxFor(p)}" value="${i.qty}" data-act="set" aria-label="Quantity">
            <button type="button" data-act="inc" aria-label="Increase quantity" ${i.qty >= maxFor(p) ? 'disabled' : ''}>+</button>
          </div>
          <button type="button" class="link-btn" data-act="remove">Remove</button>
        </div>
        <div class="line-total">${money(p.price * i.qty)}</div></div>`;
    }).join('');

    const t = cart.calcTotals(items, getProduct);
    const left = 100 - t.subtotal;
    $('sum-subtotal').textContent = money(t.subtotal);
    $('sum-shipping').textContent = t.shipping === 0 ? 'Free' : money(t.shipping);
    $('sum-tax').textContent = money(t.tax);
    $('sum-total').textContent = money(t.total);
    $('ship-note').textContent = left > 0 ? `Add ${money(left)} more for free shipping.` : 'You have free shipping.';
  }

  $('lines').addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b || b.tagName === 'INPUT') return;
    const row = b.closest('.line'), id = Number(row.dataset.id);
    const line = cart.items().find((i) => i.id === id);
    if (b.dataset.act === 'inc') cart.setQty(id, line.qty + 1);
    if (b.dataset.act === 'dec') cart.setQty(id, line.qty - 1);
    if (b.dataset.act === 'remove') cart.remove(id);
    render();
  });

  $('lines').addEventListener('change', (e) => {
    if (e.target.dataset.act !== 'set') return;
    const id = Number(e.target.closest('.line').dataset.id);
    const n = parseInt(e.target.value, 10);
    if (!Number.isInteger(n) || n < 1) cart.setQty(id, 1); else cart.setQty(id, n);
    render();
  });

  $('clear').addEventListener('click', () => { cart.clear(); render(); });
  render();
})();
