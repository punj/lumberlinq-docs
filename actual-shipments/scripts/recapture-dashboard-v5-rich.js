const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { dismissOverlays, login, openAppPage, outDir, chromiumExecutablePath } = require('./vps-doc-helper');

const shots = path.join(outDir, 'screenshots');

function trendPoints() {
  return [
    { date: '2026-06-04', cbm: 42.8, cft: 1511 },
    { date: '2026-06-05', cbm: 57.3, cft: 2024 },
    { date: '2026-06-06', cbm: 49.6, cft: 1752 },
    { date: '2026-06-07', cbm: 68.2, cft: 2408 },
    { date: '2026-06-08', cbm: 74.9, cft: 2645 },
    { date: '2026-06-09', cbm: 63.1, cft: 2228 },
    { date: '2026-06-10', cbm: 81.4, cft: 2875 },
    { date: '2026-06-11', cbm: 95.6, cft: 3376 },
    { date: '2026-06-12', cbm: 88.2, cft: 3115 },
    { date: '2026-06-13', cbm: 104.5, cft: 3690 },
    { date: '2026-06-14', cbm: 112.7, cft: 3979 },
    { date: '2026-06-15', cbm: 119.9, cft: 4234 }
  ];
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromiumExecutablePath(),
    args: ['--no-sandbox', '--disable-gpu']
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1400 },
    ignoreHTTPSErrors: true,
    recordVideo: { dir: path.join(outDir, 'video'), size: { width: 1920, height: 1400 } }
  });
  await context.route('**/challenges.cloudflare.com/**', route => route.abort());
  await context.route('**/api/v1/dashboard-v5/stats**', async route => {
    const response = await route.fetch();
    const json = await response.json();
    json.tally = json.tally || {};
    json.tally.trend = trendPoints();
    await route.fulfill({ response, json });
  });
  const page = await context.newPage();
  const authCheck = await login(page);
  await openAppPage(page, '/dashboard-v5', 'Dashboard');
  await dismissOverlays(page);
  await page.locator('.dv4-body').waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
  await page.waitForFunction(() => document.querySelectorAll('p-skeleton, .p-skeleton').length === 0, null, { timeout: 30000 }).catch(() => {});
  await page.waitForFunction(() => document.querySelectorAll('canvas').length >= 4, null, { timeout: 30000 }).catch(() => {});
  await page.addStyleTag({ content: `
    * { animation-duration: 0s !important; transition-duration: 0s !important; }
    body { background: #f8fafc !important; }
  `});
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= pageHeight; y += 700) {
    await page.evaluate(scrollY => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(450);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1800);
  await page.screenshot({ path: path.join(shots, 'dashboard-v5-full-data.png'), fullPage: true, animations: 'disabled' });
  fs.writeFileSync(path.join(outDir, 'dashboard-v5-rich-recapture-summary.txt'), JSON.stringify({
    authCheck,
    trendInjectedForScreenshotOnly: true,
    lastUrl: page.url()
  }, null, 2));
  await context.close();
  await browser.close();
})().catch(err => {
  fs.writeFileSync(path.join(outDir, 'dashboard-v5-rich-recapture-error.txt'), err.stack || String(err));
  process.exit(1);
});
