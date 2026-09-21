const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { validateEnvironment } = require('../server/src/lib/environment');

test('production rejects unsafe configuration', () => {
  assert.throws(() => validateEnvironment({ NODE_ENV: 'production' }), /ADMIN_PASSWORD/);
  assert.throws(() => validateEnvironment({ NODE_ENV: 'production', ADMIN_PASSWORD: 'x'.repeat(32) }), /persistent storage/);
  const valid = { NODE_ENV: 'production', ADMIN_PASSWORD: 'x'.repeat(32), DATA_DIR: os.tmpdir(), UPLOAD_DIR: os.tmpdir() };
  assert.doesNotThrow(() => validateEnvironment(valid));
  assert.throws(() => validateEnvironment({ ...valid, CORS_ORIGIN: '*' }), /CORS_ORIGIN/);
  assert.throws(() => validateEnvironment({ ...valid, RAZORPAY_KEY_ID: 'unpaired' }), /both Razorpay/);
});

test('production HTTP service, authentication, checkout and persistence', { timeout: 60000 }, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'iswift-test-'));
  const probe = net.createServer();
  probe.listen(0, '127.0.0.1');
  await once(probe, 'listening');
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  const base = `http://127.0.0.1:${port}`;
  let child;
  let output = '';
  async function start() {
    child = spawn(process.execPath, ['server/server.js'], {
      cwd: path.resolve(__dirname, '..'),
      env: { ...process.env, NODE_ENV: 'production', PORT: String(port), ADMIN_PASSWORD: 'test-only-password-with-32-characters',
        DATA_DIR: path.join(dir, 'store'), UPLOAD_DIR: path.join(dir, 'uploads'), MONGODB_URI: '',
        CORS_ORIGIN: 'https://store.example.com', RAZORPAY_KEY_ID: '', RAZORPAY_KEY_SECRET: '', RAZORPAY_WEBHOOK_SECRET: '' },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.on('data', chunk => { output += chunk; });
    for (let i = 0; i < 100; i++) {
      if (child.exitCode !== null) throw new Error(output);
      try { if ((await fetch(base + '/api/health')).ok) return; } catch (_) {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error('Server did not become ready: ' + output);
  }
  async function stop() {
    if (child && child.exitCode === null) {
      const exited = once(child, 'exit');
      child.kill('SIGTERM');
      await exited;
    }
  }
  const post = (url, body, token) => fetch(base + url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: JSON.stringify(body) });
  try {
    await start();
    const home = await fetch(base + '/');
    assert.equal(home.status, 200);
    assert.match(await home.text(), /Iswift/);
    assert.equal(home.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(home.headers.get('x-powered-by'), null);
    assert.equal((await fetch(base + '/admin/')).status, 200);
    const checkout = await (await fetch(base + '/checkout.html')).text();
    assert.ok(!checkout.includes('demo: true'));
    assert.ok(!checkout.includes('Offline Demo mode'));
    assert.equal((await fetch(base + '/.env')).status, 404);
    assert.equal((await fetch(base + '/api/orders/private')).status, 401);
    assert.equal((await post('/api/payments/verify', {})).status, 400);
    assert.equal((await post('/api/payments/webhook', {})).status, 503);
    const cors = await fetch(base + '/api/health', { headers: { Origin: 'https://evil.example' } });
    assert.equal(cors.headers.get('access-control-allow-origin'), null);
    const malformed = await fetch(base + '/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{bad' });
    assert.equal(malformed.status, 400);
    const login = await post('/api/admin/login', { password: 'test-only-password-with-32-characters' });
    assert.equal(login.status, 200);
    const { token } = await login.json();
    const svg = await post('/api/admin/upload', { image: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=' }, token);
    assert.equal(svg.status, 400);
    const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
    const uploaded = await post('/api/admin/upload', { image: 'data:image/png;base64,' + png, filename: 'smoke' }, token);
    assert.equal(uploaded.status, 200);
    const { url } = await uploaded.json();
    const payload = { items: [{ id: 'macbook-neo-13', qty: 1 }], customer: { name: 'Test Customer', email: 'test@example.com', phone: '9876543210' }, shipping: { address: 'Test address', city: 'Pune', state: 'Maharashtra', pincode: '411001' }, paymentMode: 'cod' };
    const order = await post('/api/orders', payload);
    assert.equal(order.status, 200, await order.clone().text());
    const { orderId } = await order.json();
    assert.ok(orderId);
    payload.items[0].qty = 1.5;
    assert.equal((await post('/api/orders', payload)).status, 400);
    await stop();
    await start();
    const stored = await fetch(base + '/api/orders/' + orderId, { headers: { Authorization: 'Bearer ' + token } });
    assert.equal(stored.status, 200);
    assert.equal((await stored.json()).order.id, orderId);
    assert.equal((await fetch(base + '/' + url)).status, 200);
    for (let i = 0; i < 10; i++) await post('/api/admin/login', { password: 'wrong' });
    assert.equal((await post('/api/admin/login', { password: 'wrong' })).status, 429);
  } finally {
    await stop();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
