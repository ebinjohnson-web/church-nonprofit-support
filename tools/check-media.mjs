import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const seen = new Map();
let count = 0;
for (const page of ['index.html','about.html','services.html','contact.html']) {
  const html = fs.readFileSync(`docs/${page}`,'utf8').split('<main')[1].split('</main>')[0];
  for (const match of html.matchAll(/<(?:img|source|video)\b[^>]*>/g)) {
    for (const attribute of match[0].matchAll(/(?:src|poster)="([^"]+)"/g)) {
      const file = path.join('docs',decodeURIComponent(attribute[1]));
      const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
      assert(!seen.has(hash), `${page}: repeated content media ${file}; already used by ${seen.get(hash)}`);
      seen.set(hash, `${page}: ${file}`); count++;
    }
  }
}
console.log(`Verified ${count} unique content media placements across all four pages; no repeated photographs, posters, or videos.`);
