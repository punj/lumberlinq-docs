const { chromium } = require('playwright-core');
const { baseUrl, chromiumExecutablePath, dismissOverlays, login } = require('./vps-doc-helper');
const seed = require('../seed-result.json');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chromiumExecutablePath(), args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ignoreHTTPSErrors: true });
  await context.route('**/challenges.cloudflare.com/**', route => route.abort());
  const page = await context.newPage();
  await login(page);
  await page.goto(`${baseUrl}/new-tallysheet?transportId=${encodeURIComponent(seed.round.encodedId)}&source=navigated`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(5000);
  await dismissOverlays(page);
  const buttons = await page.evaluate(() => Array.from(document.querySelectorAll('app-tallysheet-list-round .grid-toolbar button')).map((b, i) => ({
    i,
    text: (b.innerText || b.textContent || '').trim(),
    cls: b.className,
    disabled: b.disabled,
    rect: (() => { const r = b.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })(),
    html: b.outerHTML.slice(0, 400),
  })));
  console.log(JSON.stringify(buttons, null, 2));
  await browser.close();
})();
