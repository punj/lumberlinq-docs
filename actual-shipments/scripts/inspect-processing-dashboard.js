const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { apiBase, login, outDir, chromiumExecutablePath } = require('./vps-doc-helper');

async function api(page, url, options = {}) {
  return page.evaluate(async ({ url, options }) => {
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
    const text = await res.text();
    let body = text;
    try { body = text ? JSON.parse(text) : null; } catch (_) {}
    return { status: res.status, ok: res.ok, body, text };
  }, { url, options });
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromiumExecutablePath(),
    args: ['--no-sandbox', '--disable-gpu']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ignoreHTTPSErrors: true });
  await context.route('**/challenges.cloudflare.com/**', route => route.abort());
  const page = await context.newPage();
  const authCheck = await login(page);
  const result = {
    authCheck,
    availableInputs: await api(page, `${apiBase}/api/v1/processing-runs/available-inputs`),
    runs: await api(page, `${apiBase}/api/v1/processing-runs?page=0&size=20`),
    dashboard: await api(page, `${apiBase}/api/v1/dashboard-v5/stats`),
    inventory: await api(page, `${apiBase}/api/v1/inventory/summary`)
  };
  fs.writeFileSync(path.join(outDir, 'processing-dashboard-inspect.json'), JSON.stringify(result, null, 2));
  await context.close();
  await browser.close();
})().catch(err => {
  fs.writeFileSync(path.join(outDir, 'processing-dashboard-inspect-error.txt'), err.stack || String(err));
  process.exit(1);
});
