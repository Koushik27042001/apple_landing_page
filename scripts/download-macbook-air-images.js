const fs = require('node:fs');
const path = require('node:path');
(async () => {
 const directory = path.join(__dirname, '../client/images/products/catalogue');
 fs.mkdirSync(directory, { recursive: true });
 const sourceFile = path.join(directory, 'sources.json');
 let sources = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
 const colorImages = {};
 async function download(file, source, page) {
  const url = new URL(source.replaceAll('&amp;', '&'));
  url.searchParams.delete('.v'); url.searchParams.delete('traceId');
  url.searchParams.set('wid', '2400'); url.searchParams.set('hei', '1538'); url.searchParams.set('fmt', 'jpeg'); url.searchParams.set('qlt', '90');
  const response = await fetch(url);
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error('Image download failed: ' + file);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error('Invalid image: ' + file);
  fs.writeFileSync(path.join(directory, file), bytes);
  sources = sources.filter(s => s.file !== file);
  sources.push({ file, page, url: url.toString(), width: 2400, height: 1538 });
  console.log('Saved ' + file);
  return 'images/products/catalogue/' + file;
 }
 let modelPage;
 let modelHtml;
 for (const [finish, name] of [['silver','Silver'], ['sky-blue','Sky Blue'], ['starlight','Starlight'], ['midnight','Midnight']]) {
  const page = 'https://www.apple.com/shop/buy-mac/macbook-air/13-inch-' + finish + '-m5-chip-10-core-cpu-8-core-gpu-16gb-memory-512gb-storage';
  const html = await (await fetch(page)).text();
  const source = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  if (!source) throw new Error('Missing official image for ' + name);
  colorImages[name] = await download('macbook-air-13-m5-' + finish + '.jpg', source, page);
  if (finish === 'silver') { modelPage = page; modelHtml = html; }
 }
 const gallery = [];
 for (const [asset, caption] of [
  ['macbook-air-size-unselect-202601-gallery-1', '13-inch and 15-inch design'],
  ['macbook-air-size-unselect-202601-gallery-2', 'Slim profile and connections'],
  ['macbook-air-size-unselect-202603-gallery-3', 'MacBook Air in your workspace']
 ]) {
  if (!modelHtml.includes(asset)) throw new Error('Unlisted gallery asset: ' + asset);
  const src = await download('macbook-air-m5-gallery-' + (gallery.length + 1) + '.jpg', 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/' + asset, modelPage);
  gallery.push({ src, alt: 'MacBook Air M5: ' + caption, caption });
 }
 fs.writeFileSync(sourceFile, JSON.stringify(sources,null,2) + '\n');
 const galleryFile = path.join(directory, 'galleries.json');
 const galleries = JSON.parse(fs.readFileSync(galleryFile, 'utf8'));
 galleries['macbook-air-13-m5'] = gallery;
 fs.writeFileSync(galleryFile, JSON.stringify(galleries,null,2) + '\n');
 const catalogueFile = path.join(__dirname, '../client/js/pricing-data.js');
 const { PRICING_CATALOGUE: catalogue } = require(catalogueFile);
 const model = catalogue.find(p => p.id === 'macbook-air-13-m5');
 model.image = colorImages.Silver; model.colorImages = colorImages; model.gallery = gallery;
 fs.writeFileSync(catalogueFile, '/* Store catalogue. Supplier-provided specifications and prices are retained as supplied. */\nvar PRICING_CATALOGUE = ' + JSON.stringify(catalogue,null,2) + ';\n\nif (typeof window !== "undefined") window.PRICING_CATALOGUE = PRICING_CATALOGUE;\nif (typeof module !== "undefined" && module.exports) module.exports = { PRICING_CATALOGUE };\n');
})().catch(error => { console.error(error); process.exitCode = 1; });
