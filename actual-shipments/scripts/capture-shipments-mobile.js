const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { dismissOverlays, login, openAppPage, outDir, chromiumExecutablePath } = require('./vps-doc-helper');

const shots = path.join(outDir, 'screenshots');
const seed = JSON.parse(fs.readFileSync(path.join(outDir, 'seed-result.json'), 'utf8'));
const demoBl = seed.shipment?.blNumber || 'LL-DEMO-SHP-SEA-001';

async function fillGlobalSearch(page, text) {
  const search = page.locator('form#tms-st-filter input[formcontrolname="search"], input[placeholder*="Search" i]').first();
  await search.fill(text).catch(() => {});
  await page.keyboard.press('Enter').catch(() => {});
  await page.getByRole('button', { name: /Filter/i }).first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(1800);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromiumExecutablePath(),
    args: ['--no-sandbox', '--disable-gpu']
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 900 },
    ignoreHTTPSErrors: true
  });
  await context.route('**/challenges.cloudflare.com/**', (route) => route.abort());
  const page = await context.newPage();
  const authCheck = await login(page);
  await openAppPage(page, '/shipments/list', 'Shipments');
  await fillGlobalSearch(page, demoBl);
  await dismissOverlays(page);
  await page.screenshot({ path: path.join(shots, 'shipments-19-mobile-list-view.png'), fullPage: true });
  fs.writeFileSync(path.join(outDir, 'capture-summary.txt'), [
    `authCheck=${JSON.stringify(authCheck)}`,
    `seedAction=${seed.action}`,
    `encodedId=${seed.shipment?.encodedId}`,
    `mobileCapture=ok`,
    `lastUrl=${page.url()}`
  ].join('\n'));
  await context.close();
  await browser.close();
})().catch((err) => {
  fs.writeFileSync(path.join(outDir, 'capture-mobile-error.txt'), err.stack || String(err));
  process.exit(1);
});
