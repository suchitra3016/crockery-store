/* Dummy product data for Tidewell Ceramics. Works in the browser and in Node tests. */
(function (root) {
  'use strict';

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const c = (v) => Math.max(0, Math.min(255, v));
    const r = c((n >> 16) + amt), g = c(((n >> 8) & 255) + amt), b = c((n & 255) + amt);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  const COLLECTIONS = [
    { id: 'tide',   name: 'Tide',   color: '#2F5D7C', blurb: 'Deep sea-blue reactive glaze that pools at the rim.' },
    { id: 'fern',   name: 'Fern',   color: '#9DB8A6', blurb: 'Soft celadon green, inspired by wet moss and river stones.' },
    { id: 'dune',   name: 'Dune',   color: '#CDBFA6', blurb: 'Warm sand with a speckled matte finish.' },
    { id: 'basalt', name: 'Basalt', color: '#3B4248', blurb: 'Charcoal stoneware with a satin, volcanic surface.' }
  ];

  const TYPES = [
    { key: 'plate',   name: 'Dinner Plate',    category: 'Plates',    price: 28, dims: '27 cm diameter',         desc: 'A generous plate with a shallow well, made for everyday meals and Sunday suppers.' },
    { key: 'bowl',    name: 'Pasta Bowl',      category: 'Bowls',     price: 24, dims: '22 cm diameter, 750 ml', desc: 'A deep, wide bowl for pasta, soups and grain salads.' },
    { key: 'mug',     name: 'Mug',             category: 'Mugs',      price: 18, dims: '9 cm tall, 350 ml',      desc: 'A hand-sized mug with a comfortable looped handle and a thick, heat-holding wall.' },
    { key: 'teapot',  name: 'Teapot',          category: 'Serveware', price: 68, dims: '1.1 litre, 18 cm tall',  desc: 'A drip-free teapot with a removable steel infuser and a snug-fitting lid.' },
    { key: 'jug',     name: 'Table Jug',       category: 'Serveware', price: 42, dims: '1 litre, 20 cm tall',    desc: 'A tall jug for water, milk or flowers, with a clean pour lip.' },
    { key: 'platter', name: 'Serving Platter', category: 'Serveware', price: 56, dims: '38 cm x 26 cm',          desc: 'A wide oval platter for sharing food at the centre of the table.' }
  ];

  const BESTSELLERS = [1, 3, 7, 10, 15, 21];
  const NEW_ARRIVALS = [4, 6, 11, 18, 19, 24];
  const LOW_STOCK = [5, 13, 22];
  const OUT_OF_STOCK = [12];

  /* ---------- Generated SVG product images ---------- */
  function shape(type, c) {
    const d = shade(c, -35), l = shade(c, 35);
    switch (type) {
      case 'plate':
        return `<ellipse cx="200" cy="262" rx="165" ry="46" fill="${d}"/><ellipse cx="200" cy="248" rx="165" ry="46" fill="${c}"/><ellipse cx="200" cy="248" rx="115" ry="29" fill="${l}" opacity=".55"/>`;
      case 'bowl':
        return `<path d="M70 170Q70 312 200 312Q330 312 330 170Z" fill="${c}"/><ellipse cx="200" cy="170" rx="130" ry="28" fill="${l}"/><ellipse cx="200" cy="172" rx="112" ry="20" fill="${d}" opacity=".4"/><rect x="160" y="308" width="80" height="12" rx="4" fill="${d}"/>`;
      case 'mug':
        return `<path d="M268 165C335 165 335 255 268 255" fill="none" stroke="${c}" stroke-width="16"/><rect x="120" y="130" width="150" height="175" rx="14" fill="${c}"/><ellipse cx="195" cy="130" rx="75" ry="14" fill="${l}"/><ellipse cx="195" cy="132" rx="64" ry="10" fill="${d}" opacity=".4"/>`;
      case 'teapot':
        return `<path d="M92 190C28 180 28 285 100 264" fill="none" stroke="${c}" stroke-width="16"/><path d="M285 205L342 150L356 162L300 240Z" fill="${c}"/><ellipse cx="190" cy="220" rx="108" ry="86" fill="${c}"/><ellipse cx="190" cy="140" rx="54" ry="14" fill="${l}"/><circle cx="190" cy="122" r="11" fill="${d}"/>`;
      case 'jug':
        return `<path d="M262 150C338 150 338 262 252 262" fill="none" stroke="${c}" stroke-width="16"/><path d="M125 105H275L258 300Q257 316 241 316H159Q143 316 142 300Z" fill="${c}"/><ellipse cx="200" cy="105" rx="75" ry="14" fill="${l}"/><ellipse cx="200" cy="107" rx="62" ry="9" fill="${d}" opacity=".4"/>`;
      default: /* platter */
        return `<ellipse cx="200" cy="260" rx="178" ry="56" fill="${d}"/><ellipse cx="200" cy="246" rx="178" ry="56" fill="${c}"/><ellipse cx="200" cy="246" rx="138" ry="38" fill="${l}" opacity=".5"/>`;
    }
  }

  function makeImage(type, color, view) {
    const bgs = ['#EEF1EE', '#E2E8E4', '#D3DCD7'];
    const tf = ['', 'translate(-100 -90) scale(1.5)', 'translate(40 40) scale(.8)'][view];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="${bgs[view]}"/>` +
      (view === 2 ? `<rect y="320" width="400" height="80" fill="#C4CFC9"/>` : '') +
      `<g transform="${tf}"><ellipse cx="200" cy="330" rx="140" ry="12" fill="#000" opacity=".12"/>${shape(type, color)}</g></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  /* ---------- Build the 24 products (4 collections x 6 types) ---------- */
  const PRODUCTS = [];
  COLLECTIONS.forEach((col, ci) => {
    TYPES.forEach((t, ti) => {
      const id = ci * 6 + ti + 1;
      PRODUCTS.push({
        id,
        name: `${col.name} ${t.name}`,
        collection: col.name,
        category: t.category,
        price: t.price + (ci === 3 ? 2 : 0),
        description: `${t.desc} Finished in our ${col.name} glaze: ${col.blurb.charAt(0).toLowerCase()}${col.blurb.slice(1)}`,
        specs: {
          Material: 'High-fired stoneware',
          Size: t.dims,
          Finish: `${col.name} glaze`,
          Care: 'Dishwasher, microwave and oven safe to 220 C'
        },
        stock: OUT_OF_STOCK.includes(id) ? 0 : LOW_STOCK.includes(id) ? 4 : 25,
        bestseller: BESTSELLERS.includes(id),
        isNew: NEW_ARRIVALS.includes(id),
        images: [0, 1, 2].map((v) => makeImage(t.key, col.color, v))
      });
    });
  });

  const api = { PRODUCTS, COLLECTIONS, CATEGORIES: ['Plates', 'Bowls', 'Mugs', 'Serveware'],
    getProduct: (id) => PRODUCTS.find((p) => p.id === Number(id)) };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TidewellData = api;
})(typeof window !== 'undefined' ? window : globalThis);
