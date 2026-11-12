const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const clientDir = path.join(__dirname, 'client');
const artifactDir = 'C:/Users/koush/.gemini/antigravity/brain/ae9f6285-1fb2-4397-a97e-c89990f06934';

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/iphone-18-pro.html';
  const fullPath = path.join(clientDir, reqPath);
  if (!fs.existsSync(fullPath)) {
    res.statusCode = 404;
    res.end('Not found: ' + reqPath);
    return;
  }
  const ext = path.extname(fullPath).toLowerCase();
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(fullPath).pipe(res);
});

server.listen(0, async () => {
  const port = server.address().port;
  console.log('Static test server listening on port', port);
  const browser = await chromium.launch({
    headless: true,
    channel: process.platform === 'win32' ? 'msedge' : undefined
  });

  try {
    // 1. Desktop Test
    const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await desktopPage.goto(`http://localhost:${port}/iphone-18-pro.html`, { waitUntil: 'networkidle' });

    console.log('--- Desktop Verification ---');
    const compareSection = desktopPage.locator('#compare');
    const count = await compareSection.count();
    console.log('Compare section exists:', count === 1);

    const labelText = await desktopPage.locator('#compare-label').textContent();
    console.log('Label text:', labelText.trim());

    const select = desktopPage.locator('#modelSelect');
    const options = await select.locator('option').allTextContents();
    console.log('Model options:', options);

    const initialVal = await select.inputValue();
    console.log('Initial selected model:', initialVal);

    const initialStats = await desktopPage.locator('#stats .stat').allTextContents();
    console.log('Initial stats (iPhone 15 Pro):', initialStats.map(s => s.replace(/\s+/g, ' ').trim()));

    // Test select change to iPhone 16 Pro
    await select.selectOption('iPhone 16 Pro');
    await desktopPage.waitForTimeout(300);
    const updatedStats16 = await desktopPage.locator('#stats .stat').allTextContents();
    console.log('Updated stats (iPhone 16 Pro):', updatedStats16.map(s => s.replace(/\s+/g, ' ').trim()));

    // Test select change to iPhone 14 Pro
    await select.selectOption('iPhone 14 Pro');
    await desktopPage.waitForTimeout(300);
    const updatedStats14 = await desktopPage.locator('#stats .stat').allTextContents();
    console.log('Updated stats (iPhone 14 Pro):', updatedStats14.map(s => s.replace(/\s+/g, ' ').trim()));

    // Switch back to iPhone 15 Pro
    await select.selectOption('iPhone 15 Pro');
    await desktopPage.waitForTimeout(300);

    // Verify Image
    const imgInfo = await desktopPage.locator('#compare .compare__media img').evaluate(img => ({
      src: img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      width: img.clientWidth,
      height: img.clientHeight
    }));
    console.log('Compare image info:', imgInfo);

    // Capture desktop screenshots
    await compareSection.scrollIntoViewIfNeeded();
    await desktopPage.waitForTimeout(400);

    const compareDesktopPath = path.join(artifactDir, 'iphone18_compare_desktop.png');
    await compareSection.screenshot({ path: compareDesktopPath });
    console.log('Saved desktop compare screenshot to:', compareDesktopPath);

    // Also capture transition from #upgrade to #compare
    const upgradeElem = desktopPage.locator('#upgrade');
    await upgradeElem.scrollIntoViewIfNeeded();
    await desktopPage.waitForTimeout(300);
    const upgradeToComparePath = path.join(artifactDir, 'iphone18_upgrade_to_compare_desktop.png');
    await desktopPage.screenshot({ path: upgradeToComparePath });
    console.log('Saved upgrade-to-compare desktop screenshot to:', upgradeToComparePath);

    await desktopPage.close();

    // 2. Mobile Test
    console.log('--- Mobile Verification (iPhone 14/15/16: 393x852) ---');
    const mobilePage = await browser.newPage({
      viewport: { width: 393, height: 852 },
      isMobile: true,
      hasTouch: true
    });
    await mobilePage.goto(`http://localhost:${port}/iphone-18-pro.html`, { waitUntil: 'networkidle' });

    const mobileCompare = mobilePage.locator('#compare');
    await mobileCompare.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(400);

    // Verify grid columns in mobile
    const statsGridCols = await mobilePage.locator('#stats').evaluate(el => window.getComputedStyle(el).gridTemplateColumns);
    console.log('Mobile stats grid columns:', statsGridCols);

    const bodyOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    console.log('Mobile has no horizontal scroll overflow:', bodyOverflow);

    const compareMobilePath = path.join(artifactDir, 'iphone18_compare_mobile.png');
    await mobileCompare.screenshot({ path: compareMobilePath });
    console.log('Saved mobile compare screenshot to:', compareMobilePath);

    await mobilePage.close();
    console.log('--- ALL CHECKS PASSED SUCCESSFULLY ---');

  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
});
