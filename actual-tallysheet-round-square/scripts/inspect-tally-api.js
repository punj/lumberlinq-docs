const { chromium } = require('playwright-core');
const {
  apiBase,
  baseUrl,
  chromiumExecutablePath,
  dismissOverlays,
  login,
} = require('./vps-doc-helper');

(async () => {
  const executablePath = chromiumExecutablePath();
  if (!executablePath) throw new Error('Chromium executable not found');
  const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ignoreHTTPSErrors: true });
  await context.route('**/challenges.cloudflare.com/**', (route) => route.abort());
  const page = await context.newPage();
  await login(page);
  await dismissOverlays(page);

  const data = await page.evaluate(async ({ apiBase }) => {
    async function get(path) {
      const res = await fetch(`${apiBase}${path}`, { credentials: 'include' });
      const text = await res.text();
      let body;
      try { body = JSON.parse(text); } catch { body = text.slice(0, 500); }
      return { status: res.status, body };
    }
    return {
      products: await get('/api/v1/products/filter?size=10&page=0&globalFilter=LL%20Help%20Demo'),
      loadingSites: await get('/api/v1/list-loading-sites?size=10&page=0&globalFilter=LL%20Help%20Demo'),
      modes: await get('/api/v1/transport-modes/grouped'),
      units: await get('/api/v1/transportunits/paginated?page=0&size=25&sortBy=createdDate&sortDir=desc&globalFilter=LL%20Help%20Demo'),
    };
  }, { apiBase, baseUrl });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
