const fs = require('node:fs');
const path = require('node:path');
const { PRICING_CATALOGUE } = require('../client/js/pricing-data');
const source = fs.readFileSync(process.argv[2], 'utf8');
const groups = new Map();
const seen = new Set();
for (const line of source.split(/\r?\n/)) {
 const match = line.trim().match(/^(\S+HN\/A)\s+(.+?)\s+(\d+)$/);
 if (!match || seen.has(match[1])) continue;
 seen.add(match[1]);
 const [, modelNumber, rawSpecs, rawPrice] = match;
 const specs = rawSpecs.replace(/\u2011/g, '-');
 let id, name, image;
 if (/MacBook Pro/i.test(specs)) {
  const size = specs.match(/(14|16)-inch/)[1];
  const generation = /Apple M6 chip/i.test(specs) ? 'm6' : 'm5';
  id = `macbook-pro-${size}-${generation}`;
  name = `MacBook Pro ${size}-inch ${generation.toUpperCase()}${generation === 'm5' ? ' Pro / Max' : ''}`;
  image = `images/products/catalogue/macbook-pro-${size}-space-black.png`;
 } else if (/\bMS M5/i.test(specs)) {
  id = 'mac-studio-m5'; name = 'Mac Studio M5 Max / Ultra'; image = 'images/products/catalogue/mac-studio-m5.png';
 } else if (/\bMM M[56]/i.test(specs)) {
  id = 'mac-mini-m6'; name = 'Mac mini M6 / M5 Pro'; image = 'images/products/catalogue/mac-mini-m6.png';
 } else { throw new Error(`Unrecognized supplier row: ${modelNumber}`); }
 if (!groups.has(id)) groups.set(id, { id, name, image, rows: [] });
 groups.get(id).rows.push({ modelNumber, specs, price: Number(rawPrice), storage: '', color: /- (Space Black|Silver)$/.exec(specs)?.[1] || 'Silver', availability: 'Available to Order', source: 'Supplier product list' });
}
for (const group of groups.values()) {
 let product = PRICING_CATALOGUE.find(p => p.id === group.id);
 if (!product) {
  product = { id: group.id, slug: group.id, category: group.id.startsWith('macbook') ? 'mac' : 'desktop', image: group.image, detailUrl: `product.html?id=${group.id}`, variants: [] };
  PRICING_CATALOGUE.push(product);
 }
 // Supplier rows replace the affected chip families; preserve unrelated base configurations.
 const suppliedChips = new Set(group.rows.map(v => /M\d(?:\s+(?:Pro|Max|Ultra))?/i.exec(v.specs)?.[0].toLowerCase()));
 product.variants = product.variants.filter(v => !seen.has(v.modelNumber) && !suppliedChips.has(/M\d(?:\s+(?:Pro|Max|Ultra))?/i.exec(v.specs)?.[0].toLowerCase())).concat(group.rows);
 product.name = group.name;
 product.image = group.image;
 const galleryFile = path.join(__dirname, '../client/images/products/catalogue/galleries.json');
 if (fs.existsSync(galleryFile)) {
  const galleries = JSON.parse(fs.readFileSync(galleryFile, 'utf8'));
  const family = group.id.startsWith('macbook') ? 'macbook-pro' : group.id.startsWith('mac-studio') ? 'mac-studio' : 'mac-mini';
  product.gallery = galleries[family] || [];
 }
 if (group.id.startsWith('macbook-pro-')) {
  const size = group.id.split('-')[2];
  product.colorImages = { 'Space Black': 'images/products/catalogue/macbook-pro-' + size + '-space-black.png', Silver: 'images/products/catalogue/macbook-pro-' + size + '-silver.png' };
 }
 product.chip = [...new Set(product.variants.map(v => /M\d(?:\s+(?:Pro|Max|Ultra))?/i.exec(v.specs)?.[0]).filter(Boolean))].join(' / ');
 product.startingPrice = Math.min(...product.variants.map(v => v.price).filter(Number.isFinite));
 product.maxPrice = Math.max(...product.variants.map(v => v.price).filter(Number.isFinite));
 product.priceRange = '\u20b9' + product.startingPrice.toLocaleString('en-IN') + ' - \u20b9' + product.maxPrice.toLocaleString('en-IN');
}
for (const p of PRICING_CATALOGUE) {
 for (const v of p.variants || []) {
  if (seen.has(v.modelNumber)) {
   v.displayPrice = '\u20b9' + v.price.toLocaleString('en-IN');
   v.rawPrice = v.displayPrice;
  }
 }
}
fs.writeFileSync(path.join(__dirname, '../client/js/pricing-data.js'), '/* Store catalogue. Supplier-provided specifications and prices are retained as supplied. */\nvar PRICING_CATALOGUE = ' + JSON.stringify(PRICING_CATALOGUE, null, 2) + ';\n\nif (typeof window !== "undefined") window.PRICING_CATALOGUE = PRICING_CATALOGUE;\nif (typeof module !== "undefined" && module.exports) module.exports = { PRICING_CATALOGUE };\n');
console.log(`Imported ${seen.size} unique supplier SKUs into ${groups.size} product models.`);
