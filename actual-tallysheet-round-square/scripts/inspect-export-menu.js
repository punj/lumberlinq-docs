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
  await page.locator('app-tallysheet-list-round .p-splitbutton-menubutton:visible').first().click({ force: true });
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('body *'))
      .filter(el => {
        const txt = (el.innerText || el.textContent || '').trim();
        return txt && /Excel|PDF|Bundle|Advanced|Export|xlsx|zip|pdf/i.test(txt);
      })
      .slice(-60)
      .map(el => ({ tag: el.tagName, cls: el.className, text: (el.innerText || el.textContent || '').trim().slice(0, 300) }));
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
