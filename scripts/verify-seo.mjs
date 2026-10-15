import assert from 'node:assert/strict';

const base = process.env.SEO_BASE_URL ?? 'http://localhost:3003';
const get = async (path) => {
  const response = await fetch(`${base}${path}`);
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
  return response.text();
};
const [home, first, second, sitemap, robots] = await Promise.all([
  get('/'), get('/pecas'), get('/pecas?pagina=2'), get('/sitemap.xml'), get('/robots.txt'),
]);
assert.match(home, /Sua autopeças em Jacupiranga/);
assert.match(home, /href="\/pecas"/);
assert.match(first, /href="\/pecas\?pagina=2"/);
assert.match(second, /rel="canonical" href="https:\/\/www.apmartins.com.br\/pecas\?pagina=2"/);
const productLinks = html => new Set([...html.matchAll(/href="(\/produto\/[^"?]+)"/g)].map(match => match[1]));
const firstProducts = productLinks(first);
const secondProducts = productLinks(second);
assert.equal(firstProducts.size, 24);
assert.equal(secondProducts.size, 24);
assert.equal([...secondProducts].filter(link => firstProducts.has(link)).length, 0);
assert.match(sitemap, /<loc>https:\/\/www.apmartins.com.br\/pecas<\/loc>/);
assert.ok((sitemap.match(/<loc>/g) ?? []).length >= 600);
assert.match(robots, /Sitemap: https:\/\/www.apmartins.com.br\/sitemap.xml/);
for (const html of [home, first, second]) {
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(match[1]);
}
console.log(JSON.stringify({ base, firstPageProducts: firstProducts.size, secondPageProducts: secondProducts.size, sitemapUrls: (sitemap.match(/<loc>/g) ?? []).length, result: 'passed' }));
