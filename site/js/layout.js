/* Shared header, footer, mobile menu, cart badge and product card. */
(function () {
  'use strict';
  const CART_KEY = 'tidewell_cart';
  const money = (n) => '$' + Number(n).toFixed(2);

  function cartCount() {
    try {
      const items = JSON.parse(localStorage.getItem(CART_KEY)) || [];
      return items.reduce((s, i) => s + i.qty, 0);
    } catch (e) { return 0; }
  }

  function updateCartCount() {
    const n = cartCount();
    document.querySelectorAll('.cart-count').forEach((el) => {
      el.textContent = n > 0 ? n : '';
      el.dataset.n = n;
    });
  }

  function productCard(p) {
    const badges = [];
    if (p.stock === 0) badges.push('<span class="badge badge--out">Sold out</span>');
    else if (p.stock <= 5) badges.push('<span class="badge">Low stock</span>');
    if (p.isNew) badges.push('<span class="badge badge--new">New</span>');
    if (p.bestseller) badges.push('<span class="badge badge--best">Bestseller</span>');
    return `<a class="card" href="product.html?id=${p.id}">
      <div class="card-media"><img src="${p.images[0]}" alt="${p.name}" loading="lazy">
      <div class="badges">${badges.join('')}</div></div>
      <div class="card-body"><h3 class="card-title">${p.name}</h3>
      <p class="card-meta">${p.category}</p><span class="price">${money(p.price)}</span></div></a>`;
  }

  function renderHeader() {
    const page = location.pathname.split('/').pop() || 'index.html';
    const links = [['index.html', 'Home'], ['shop.html', 'Shop'], ['about.html', 'About'], ['contact.html', 'Contact']];
    const nav = links.map(([href, label]) =>
      `<a href="${href}"${page === href || (page === 'product.html' && href === 'shop.html') ? ' aria-current="page"' : ''}>${label}</a>`).join('');
    document.getElementById('site-header').outerHTML = `
      <a class="skip-link" href="#main">Skip to content</a>
      <header class="site-header"><div class="container header-inner">
        <a class="brand" href="index.html" aria-label="Tidewell Ceramics home">
          <svg width="34" height="34" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#2F5D7C"/><path d="M8 26c4-6 8-6 12 0s8 6 12 0 6-4 8-2" fill="none" stroke="#F6F7F4" stroke-width="2.5" stroke-linecap="round"/><path d="M10 34c4-4 7-4 11 0s7 4 11 0" fill="none" stroke="#9DB8A6" stroke-width="2" stroke-linecap="round"/></svg>
          Tidewell</a>
        <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav">Menu</button>
        <nav class="nav" id="main-nav" aria-label="Main">${nav}
          <a class="cart-link" href="cart.html">Cart <span class="cart-count" aria-label="items in cart"></span></a></nav>
      </div></header>`;
    const btn = document.querySelector('.menu-toggle'), navEl = document.getElementById('main-nav');
    btn.addEventListener('click', () => {
      const open = navEl.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  }

  function renderFooter() {
    document.getElementById('site-footer').outerHTML = `
      <footer class="site-footer"><div class="container">
        <div class="footer-grid">
          <div><h4>Tidewell Ceramics</h4><p>Everyday stoneware, glazed and fired in small batches. This is a demo store: nothing here is for sale.</p></div>
          <div><h4>Shop</h4><ul><li><a href="shop.html">All products</a></li><li><a href="shop.html?category=Plates">Plates</a></li><li><a href="shop.html?category=Bowls">Bowls</a></li><li><a href="shop.html?category=Mugs">Mugs</a></li><li><a href="shop.html?category=Serveware">Serveware</a></li></ul></div>
          <div><h4>Help</h4><ul><li><a href="faq.html">FAQ</a></li><li><a href="contact.html">Contact</a></li><li><a href="privacy.html">Privacy policy</a></li><li><a href="terms.html">Terms</a></li></ul></div>
          <div><h4>Visit</h4><ul><li>12 Kiln Lane, Portland, OR 97201</li><li><a href="mailto:hello@tidewell.example">hello@tidewell.example</a></li><li>(555) 013-4477</li>
            <li><a href="#" aria-label="Instagram">Instagram</a> / <a href="#" aria-label="Pinterest">Pinterest</a> / <a href="#" aria-label="Facebook">Facebook</a></li></ul></div>
        </div>
        <div class="footer-bottom">&copy; ${new Date().getFullYear()} Tidewell Ceramics. A fictional brand built for a demo project.</div>
      </div></footer>`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderHeader(); renderFooter(); updateCartCount();
  });
  window.addEventListener('storage', updateCartCount);

  window.Tidewell = { CART_KEY, money, cartCount, updateCartCount, productCard };
})();
