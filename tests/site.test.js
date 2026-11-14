const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const siteDir = path.join(__dirname, '..', 'site');
const pages = fs.readdirSync(siteDir).filter((f) => f.endsWith('.html'));

test('all ten pages exist', () => {
  const expected = ['index', 'shop', 'product', 'about', 'contact', 'cart', 'checkout', 'faq', 'privacy', 'terms'];
  for (const name of expected) assert.ok(pages.includes(name + '.html'), `${name}.html is missing`);
});

test('every local link, script, stylesheet and image in every page points to a file that exists', () => {
  const missing = [];
  for (const page of pages) {
    const raw = fs.readFileSync(path.join(siteDir, page), 'utf8');
    const html = raw.replace(/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/g, '');   // ignore inline script code
    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const target = m[1];
      if (/^(https?:|mailto:|data:|#)/.test(target)) continue;
      const file = target.split('#')[0].split('?')[0];
      if (file && !fs.existsSync(path.join(siteDir, file))) missing.push(`${page} -> ${target}`);
    }
  }
  assert.deepStrictEqual(missing, []);
});

test('every page has a title, a language and the shared header and footer mount points', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(siteDir, page), 'utf8');
    assert.match(html, /<title>[^<]+<\/title>/, `${page} needs a title`);
    assert.match(html, /<html lang="en">/, `${page} needs lang`);
    assert.ok(html.includes('id="site-header"') && html.includes('id="site-footer"'), `${page} needs header and footer mounts`);
  }
});
