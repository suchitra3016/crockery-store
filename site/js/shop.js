/* Shop page: search, filter and sort. The pure functions are exported for tests. */
(function (root) {
  'use strict';

  function filterProducts(products, f) {
    f = f || {};
    const q = (f.query || '').trim().toLowerCase();
    return products.filter((p) => {
      if (q && !(p.name + ' ' + p.category + ' ' + p.collection + ' ' + p.description).toLowerCase().includes(q)) return false;
      if (f.category && p.category !== f.category) return false;
      if (f.collection && p.collection !== f.collection) return false;
      if (f.maxPrice && p.price > Number(f.maxPrice)) return false;
      if (f.inStockOnly && p.stock <= 0) return false;
      return true;
    });
  }

  function sortProducts(list, key) {
    const out = list.slice();
    switch (key) {
      case 'price-asc':  return out.sort((a, b) => a.price - b.price || a.id - b.id);
      case 'price-desc': return out.sort((a, b) => b.price - a.price || a.id - b.id);
      case 'name':       return out.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':     return out.sort((a, b) => (b.isNew - a.isNew) || (b.id - a.id));
      default:           return out.sort((a, b) => a.id - b.id);   // featured
    }
  }

  if (typeof module !== 'undefined' && module.exports) { module.exports = { filterProducts, sortProducts }; return; }

  const { PRODUCTS, CATEGORIES, COLLECTIONS } = root.TidewellData;
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);

  $('category').innerHTML = '<option value="">All categories</option>' + CATEGORIES.map((c) => `<option>${c}</option>`).join('');
  $('collection').innerHTML = '<option value="">All collections</option>' + COLLECTIONS.map((c) => `<option>${c.name}</option>`).join('');

  // Start from URL parameters, ignoring values that are not valid options
  const valid = (id, v) => (v && [...$(id).options].some((o) => o.value === v) ? v : '');
  $('q').value = params.get('q') || '';
  $('category').value = valid('category', params.get('category'));
  $('collection').value = valid('collection', params.get('collection'));
  $('maxPrice').value = valid('maxPrice', params.get('maxPrice'));
  $('sort').value = valid('sort', params.get('sort')) || 'featured';
  $('inStock').checked = params.get('inStock') === '1';

  function state() {
    return { query: $('q').value, category: $('category').value, collection: $('collection').value,
      maxPrice: $('maxPrice').value, inStockOnly: $('inStock').checked, sort: $('sort').value };
  }

  function render() {
    const s = state();
    const list = sortProducts(filterProducts(PRODUCTS, s), s.sort);
    $('count').textContent = list.length === PRODUCTS.length ? `Showing all ${list.length} products`
      : `${list.length} of ${PRODUCTS.length} products`;
    $('results').innerHTML = list.map(root.Tidewell.productCard).join('');
    $('empty').hidden = list.length > 0;
    $('results').hidden = list.length === 0;

    const next = new URLSearchParams();
    if (s.query.trim()) next.set('q', s.query.trim());
    ['category', 'collection', 'maxPrice'].forEach((k) => s[k] && next.set(k, s[k]));
    if (s.sort !== 'featured') next.set('sort', s.sort);
    if (s.inStockOnly) next.set('inStock', '1');
    const qs = next.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  ['q', 'category', 'collection', 'maxPrice', 'sort', 'inStock'].forEach((id) =>
    $(id).addEventListener(id === 'q' ? 'input' : 'change', render));
  $('reset').addEventListener('click', () => {
    $('q').value = ''; $('category').value = ''; $('collection').value = '';
    $('maxPrice').value = ''; $('sort').value = 'featured'; $('inStock').checked = false; render();
  });
  render();
})(typeof window !== 'undefined' ? window : globalThis);
