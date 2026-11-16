const fs = require('node:fs');
const path = require('node:path');
const base = 'https://www.apple.com/shop/buy-mac/';
const products = [
 ['macbook-pro-14-space-black', base + 'macbook-pro/14-inch-space-black-standard-display-apple-m6-chip-12-core-cpu-12-core-gpu-16gb-memory-1tb-storage'],
 ['macbook-pro-14-silver', base + 'macbook-pro/14-inch-silver-standard-display-apple-m6-chip-12-core-cpu-12-core-gpu-16gb-memory-1tb-storage'],
 ['macbook-pro-16-space-black', base + 'macbook-pro/16-inch-space-black-standard-display-apple-m5-pro-chip-18-core-cpu-20-core-gpu-24gb-memory-1tb-storage'],
 ['macbook-pro-16-silver', base + 'macbook-pro/16-inch-silver-standard-display-apple-m5-pro-chip-18-core-cpu-20-core-gpu-24gb-memory-1tb-storage'],
 ['mac-studio-m5', base + 'mac-studio'],
 ['mac-mini-m6', base + 'mac-mini']
];
(async () => {
 const dir = path.join(__dirname, '../client/images/products/catalogue');
 fs.mkdirSync(dir, { recursive: true });
 const sources = await Promise.all(products.map(async ([name, page]) => {
  const response = await fetch(page);
  if (!response.ok) throw new Error('Product page failed: ' + page);
  const html = await response.text();
  let source;
  if (name.startsWith('macbook')) source = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1].replaceAll('&amp;', '&');
  else source = html.match(new RegExp('https://store\\.storeimages\\.cdn-apple\\.com/1/as-images\\.apple\\.com/is/' + (name.startsWith('mac-studio') ? 'mac-studio' : 'mac-mini') + '-chip-unselect-202608-gallery-1[^\\s"<>]+'))?.[0];
  if (!source) throw new Error('No product asset: ' + name);
  const url = new URL(source);
  url.searchParams.delete('.v'); url.searchParams.delete('traceId');
  url.searchParams.set('wid', '2400'); url.searchParams.set('hei', '1538'); url.searchParams.set('fmt', 'png'); url.searchParams.set('qlt', '95');
  const image = await fetch(url);
  if (!image.ok || !image.headers.get('content-type')?.startsWith('image/')) throw new Error('Image failed: ' + name);
  const bytes = Buffer.from(await image.arrayBuffer());
  if (bytes.toString('hex', 0, 8) !== '89504e470d0a1a0a') throw new Error('Not PNG: ' + name);
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  if (width < 1600) throw new Error('Image too small: ' + name);
  fs.writeFileSync(path.join(dir, name + '.png'), bytes);
  console.log(name + ': ' + width + 'x' + height + ' (' + Math.round(bytes.length / 1024) + ' KB)');
  return { file: name + '.png', page, url: url.toString(), width, height };
 }));
 const previous = fs.existsSync(path.join(dir, 'sources.json')) ? JSON.parse(fs.readFileSync(path.join(dir, 'sources.json'), 'utf8')) : [];
 fs.writeFileSync(path.join(dir, 'sources.json'), JSON.stringify(previous.filter(p => !sources.some(s => s.file === p.file)).concat(sources), null, 2) + '\n');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
