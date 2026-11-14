/* Product detail page. */
(function () {
  'use strict';
  const { getProduct, PRODUCTS } = window.TidewellData;
  const { money, productCard } = window.Tidewell;
  const $ = (id) => document.getElementById(id);
  const id = new URLSearchParams(location.search).get('id');
  const p = /^\d+$/.test(id || '') ? getProduct(id) : null;

  if (!p) {
    $('detail').innerHTML = `<div class="empty"><h2>Product not found</h2>
      <p>We could not find that product. It may have been removed.</p><a class="btn" href="shop.html">Back to the shop</a></div>`;
    $('related-section').hidden = true;
    return;
  }

  document.title = `${p.name} | Tidewell Ceramics`;
  const avail = p.stock === 0 ? ['out', 'Sold out'] : p.stock <= 5 ? ['low', `Only ${p.stock} left`] : ['', 'In stock'];
  const specs = Object.entries(p.specs).map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('');

  $('detail').innerHTML = `
    <div>
      <div class="gallery-main"><img id="main-img" src="${p.images[0]}" alt="${p.name}, view 1"></div>
      <div class="thumbs">${p.images.map((src, i) =>
        `<button class="thumb" type="button" data-i="${i}" aria-pressed="${i === 0}" aria-label="Show view ${i + 1}"><img src="${src}" alt=""></button>`).join('')}</div>
    </div>
    <div>
      <nav class="crumbs" aria-label="Breadcrumb"><a href="shop.html">Shop</a> / <a href="shop.html?category=${p.category}">${p.category}</a></nav>
      <h1 style="font-size:clamp(2rem,4vw,3rem)">${p.name}</h1>
      <p class="p-price">${money(p.price)}</p>
      <span class="availability ${avail[0]}" id="availability">${avail[1]}</span>
      <p>${p.description}</p>
      <div class="buy-row">
        <div class="qty"><label for="qty">Quantity</label><input id="qty" type="number" min="1" max="10" value="1" inputmode="numeric" ${p.stock === 0 ? 'disabled' : ''}></div>
        <button class="btn" id="add" type="button" ${p.stock === 0 ? 'disabled' : ''}>${p.stock === 0 ? 'Sold out' : 'Add to cart'}</button>
      </div>
      <div class="alert notice" id="added" role="status" hidden></div>
      <table class="specs"><caption class="sr-only">Specifications</caption><tbody>${specs}</tbody></table>
    </div>`;

  document.querySelectorAll('.thumb').forEach((b) => b.addEventListener('click', () => {
    const i = Number(b.dataset.i);
    $('main-img').src = p.images[i];
    $('main-img').alt = `${p.name}, view ${i + 1}`;
    document.querySelectorAll('.thumb').forEach((t) => t.setAttribute('aria-pressed', t === b));
  }));

  $('add').addEventListener('click', () => {
    let qty = parseInt($('qty').value, 10);
    if (!Number.isInteger(qty) || qty < 1) qty = 1;
    qty = Math.min(qty, 10);
    $('qty').value = qty;
    window.TidewellCart.add(p.id, qty);
    const box = $('added');
    box.innerHTML = `Added ${qty} x ${p.name} to your cart. <a href="cart.html">View cart</a>`;
    box.hidden = false;
  });

  $('related').innerHTML = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4).map(productCard).join('');
})();
