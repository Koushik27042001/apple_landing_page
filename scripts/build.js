// No bundler is needed: Express serves the existing HTML/CSS/JS directly.
// Validate server scripts and browser scripts (including inline checkout code).
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
let count = 0;
function check(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'data', 'images'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) check(file);
    else if (file.endsWith('.js')) {
      execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
      count++;
    } else if (file.endsWith('.html')) {
      const html = fs.readFileSync(file, 'utf8');
      for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
        if (/\bsrc\s*=|application\/ld\+json/i.test(match[1]) || !match[2].trim()) continue;
        new vm.Script(match[2], { filename: file });
        count++;
      }
    }
  }
}
check(path.join(root, 'client'));
check(path.join(root, 'server'));
console.log(`Build verified: ${count} JavaScript sources. Frontend ready in client/.`);
