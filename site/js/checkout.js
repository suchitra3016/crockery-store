/* Demo checkout. No payment is taken and nothing is sent anywhere. */
(function (root) {
  'use strict';

  function validateCheckout(v) {
    const errors = {};
    const t = (k) => (v[k] || '').trim();
    if (t('name').length < 2) errors.name = 'Enter your full name.';
    if (!t('email')) errors.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t('email'))) errors.email = 'Enter a valid email address.';
    if (t('address').length < 5) errors.address = 'Enter your street address.';
    if (t('city').length < 2) errors.city = 'Enter your city.';
    if (!/^[A-Za-z]{2}$/.test(t('state'))) errors.state = 'Use the 2-letter state code, like OR.';
    if (!/^\d{5}(-\d{4})?$/.test(t('zip'))) errors.zip = 'Enter a 5-digit ZIP code.';
    return { valid: Object.keys(errors).length === 0, errors };
  }

  if (typeof module !== 'undefined' && module.exports) { module.exports = { validateCheckout }; return; }

  const { getProduct } = root.TidewellData;
  const { money } = root.Tidewell;
  const cart = root.TidewellCart;
  const $ = (id) => document.getElementById(id);
  const fields = ['name', 'email', 'address', 'city', 'state', 'zip'];
  const values = () => Object.fromEntries(fields.map((f) => [f, $(f).value]));

  function showErrors(errors) {
    fields.forEach((f) => {
      $(f + '-error').textContent = errors[f] || '';
      $(f).setAttribute('aria-invalid', errors[f] ? 'true' : 'false');
    });
  }

  function renderSummary() {
    const items = cart.items();
    if (!items.length) { $('checkout-empty').hidden = false; $('checkout-content').hidden = true; return null; }
    const t = cart.calcTotals(items, getProduct);
    $('mini-lines').innerHTML = items.map((i) => {
      const p = getProduct(i.id);
      return `<div class="mini"><span>${p.name} x ${i.qty}</span><span>${money(p.price * i.qty)}</span></div>`;
    }).join('');
    $('sum-subtotal').textContent = money(t.subtotal);
    $('sum-shipping').textContent = t.shipping === 0 ? 'Free' : money(t.shipping);
    $('sum-tax').textContent = money(t.tax);
    $('sum-total').textContent = money(t.total);
    return { items, t };
  }

  renderSummary();

  $('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const { valid, errors } = validateCheckout(values());
    showErrors(errors);
    if (!valid) { $(fields.find((f) => errors[f])).focus(); return; }
    const order = renderSummary();
    if (!order) return;
    const orderNo = 'TW-' + String(Math.floor(100000 + Math.random() * 900000));
    const v = values();
    $('checkout-content').hidden = true;
    const box = $('confirmation');
    box.innerHTML = `<h1>Thank you, ${v.name.trim().replace(/[<>&"]/g, '')}</h1>
      <p>This was a demo order, so nothing was charged or shipped.</p>
      <p>Order number<br><span class="order-no">${orderNo}</span></p>
      ${order.items.map((i) => { const p = getProduct(i.id); return `<div class="mini"><span>${p.name} x ${i.qty}</span><span>${money(p.price * i.qty)}</span></div>`; }).join('')}
      <div class="sum-row total"><span>Total</span><span>${money(order.t.total)}</span></div>
      <p style="margin-top:1.5rem"><a class="btn" href="shop.html">Continue shopping</a></p>`;
    box.hidden = false;
    box.setAttribute('tabindex', '-1'); box.focus();
    cart.clear();
  });
})(typeof window !== 'undefined' ? window : globalThis);
