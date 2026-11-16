const fs = require('node:fs');
const path = require('node:path');
const captions = {
 'macbook-pro': ['14-inch and 16-inch lineup', 'Space Black and Silver profile', 'A creative workspace'],
 'mac-studio': ['Front connections', 'Rear connections', 'Compact aluminium design', 'Ventilation and base', 'A complete desktop setup', 'A creative studio setup', 'A video editing workspace'],
 'mac-mini': ['Front connections', 'Rear connections', 'Compact aluminium design', 'A video editing setup', 'An everyday workspace']
};
const families = [
 { slug: 'macbook-pro', pattern: 'mac-macbook-pro-size-unselect-202610-gallery-', count: 3 },
 { slug: 'mac-studio', pattern: 'mac-studio-chip-unselect-202608-gallery-', count: 7 },
 { slug: 'mac-mini', pattern: 'mac-mini-chip-unselect-202608-gallery-', count: 5 }
];
(async () => {
 const directory = path.join(__dirname, '../client/images/products/catalogue');
 const sourceFile = path.join(directory, 'sources.json');
 const sources = JSON.parse(fs.readFileSync(sourceFile, 'utf8')).filter(source => !/-gallery-\d+\.png$/.test(source.file));
 const gallery = fs.existsSync(path.join(directory, 'galleries.json')) ? JSON.parse(fs.readFileSync(path.join(directory, 'galleries.json'), 'utf8')) : {};
 for (const family of families) {
  const page = 'https://www.apple.com/shop/buy-mac/' + family.slug;
  const response = await fetch(page);
  if (!response.ok) throw new Error('Cannot read ' + page);
  const html = await response.text();
  gallery[family.slug] = [];
  for (let i = 1; i <= family.count; i++) {
   const asset = family.pattern + i;
   if (!html.includes(asset)) throw new Error('Unlisted image ' + asset);
   let file = family.slug + '-gallery-' + i + '.jpg';
   if (i === 1 && family.slug !== 'macbook-pro') file = family.slug + (family.slug === 'mac-studio' ? '-m5.png' : '-m6.png');
   const url = 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/' + asset + '?wid=2400&hei=1538&fmt=' + (file.endsWith('.png') ? 'png' : 'jpeg') + '&qlt=90';
   if (!fs.existsSync(path.join(directory, file))) {
    const result = await fetch(url);
    if (!result.ok || !result.headers.get('content-type')?.startsWith('image/')) throw new Error('Image failed: ' + file);
    const buffer = Buffer.from(await result.arrayBuffer());
    if (buffer[0] !== 0xff || buffer[1] !== 0xd8) throw new Error('Not JPEG: ' + file);
    fs.writeFileSync(path.join(directory, file), buffer);
    console.log('Saved ' + file);
   }
   if (!sources.some(source => source.file === file)) sources.push({ file, page, url, width: 2400, height: 1538 });
   gallery[family.slug].push({ src: 'images/products/catalogue/' + file, alt: family.slug.replaceAll('-', ' ') + ': ' + captions[family.slug][i - 1], caption: captions[family.slug][i - 1] });
  }
 }
 fs.writeFileSync(sourceFile, JSON.stringify(sources, null, 2) + '\n');
 fs.writeFileSync(path.join(directory, 'galleries.json'), JSON.stringify(gallery, null, 2) + '\n');
 console.log('Downloaded galleries for all three product families.');
})().catch(error => { console.error(error); process.exitCode = 1; });
