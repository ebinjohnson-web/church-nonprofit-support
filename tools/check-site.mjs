import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve('docs');
const pages = ['index.html', 'about.html', 'services.html', 'contact.html'];
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  for (const tag of ['head', 'body']) {
    assert.equal([...html.matchAll(new RegExp(`<${tag}(?:\\s|>)`, 'g'))].length, 1, `${page}: expected one ${tag}`);
    assert.equal([...html.matchAll(new RegExp(`</${tag}>`, 'g'))].length, 1, `${page}: expected one closing ${tag}`);
  }
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${page}: expected one H1`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${page}: duplicate ID`);
  assert.equal([...html.matchAll(/aria-current="page"/g)].length, 1, `${page}: mark one active navigation item`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const raw = match[1];
    if (/^(?:https?:|mailto:|data:|\/\/)/.test(raw)) continue;
    const url = new URL(raw, `https://example.test/${page}`);
    const file = path.join(root, decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html');
    assert(fs.existsSync(file), `${page}: missing local file ${raw}`);
    if (url.hash && file.endsWith('.html')) {
      const target = fs.readFileSync(file, 'utf8');
      assert(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${page}: missing anchor ${raw}`);
    }
  }
}
console.log('Validated all four pages: document structure, headings, IDs, navigation, schema, local links, and anchors.');
