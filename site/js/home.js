/* Home page: fills sections from the dummy product data. */
(function () {
  'use strict';
  const { PRODUCTS, COLLECTIONS, getProduct } = window.TidewellData;
  const { productCard } = window.Tidewell;
  const $ = (id) => document.getElementById(id);

  // Hero: three Tide pieces
  $('hero-stage').innerHTML = [4, 3, 2].map((id, i) =>
    `<img class="${i === 0 ? 'tall' : ''}" src="${getProduct(id).images[i === 0 ? 2 : 0]}" alt="">`).join('');

  // Featured collections: first plate of each collection
  $('collections').innerHTML = COLLECTIONS.map((c) => {
    const p = PRODUCTS.find((x) => x.collection === c.name && x.category === 'Plates');
    return `<a class="tile tile--collection" style="--c:${c.color}" href="shop.html?collection=${c.name}">
      <img src="${p.images[0]}" alt="${c.name} collection" loading="lazy">
      <div class="tile-body"><h3>${c.name}</h3><p>${c.blurb}</p></div></a>`;
  }).join('');

  // Bestsellers and new arrivals
  $('bestsellers').innerHTML = PRODUCTS.filter((p) => p.bestseller).slice(0, 4).map(productCard).join('');
  $('arrivals').innerHTML = PRODUCTS.filter((p) => p.isNew).slice(0, 4).map(productCard).join('');

  // Category highlights
  const cats = [
    ['Plates', 1, 'Dinner plates for every day'],
    ['Bowls', 8, 'Pasta, soup and salad bowls'],
    ['Mugs', 15, 'Hand-sized, heat-holding mugs'],
    ['Serveware', 22, 'Teapots, jugs and platters']
  ];
  $('categories').innerHTML = cats.map(([name, id, text]) =>
    `<a class="tile" href="shop.html?category=${name}"><img src="${getProduct(id).images[0]}" alt="" loading="lazy">
     <div class="tile-body"><h3>${name}</h3><p>${text}</p></div></a>`).join('');

  // Brand intro image
  $('brand-img').src = getProduct(4).images[2];
})();
