const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { dismissOverlays, login, openAppPage, outDir, clickTextIfVisible, chromiumExecutablePath } = require('./vps-doc-helper');

const shots = path.join(outDir, 'screenshots');

async function shot(page, name) {
  await dismissOverlays(page);
  await page.screenshot({ path: path.join(shots, name), fullPage: true });
}

async function fillSearch(page, text) {
  const search = page.locator('input[placeholder*="Search" i], input[formcontrolname="search"], input[type="search"], input:near(:text("Search"))').first();
  if (await search.count()) {
    await search.fill(text);
    await page.keyboard.press('Enter').catch(() => {});
    await page.waitForTimeout(2000);
  }
}

async function openDeleteDialogFromList(page, rowText) {
  const row = page.locator('tr, .p-datatable-tbody > tr, .product-card, .site-card').filter({ hasText: rowText }).first();
  if (!(await row.count())) return false;
  const button = row.locator('button:has-text("Delete"), button[icon*="trash"], .pi-trash').first();
  if (!(await button.count())) return false;
  await button.click({ force: true });
  await page.waitForTimeout(1200);
  return true;
}

async function openFirstEdit(page, rowText, routePrefix) {
  const row = page.locator('tr, .p-datatable-tbody > tr, .product-card, .site-card').filter({ hasText: rowText }).first();
  if (await row.count()) {
    await row.click({ force: true }).catch(() => {});
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(4000);
  }
  if (!page.url().includes(routePrefix)) {
    const body = await page.locator('body').innerText().catch(() => '');
    fs.appendFileSync(path.join(outDir, 'capture-warnings.txt'), `Could not open edit route ${routePrefix}; url=${page.url()}\n${body.slice(0, 1000)}\n`);
  }
}

async function captureProducts(page) {
  await openAppPage(page, '/products', 'All Products');
  await shot(page, 'products-01-list-page.png');
  await fillSearch(page, 'LL Help Demo');
  await shot(page, 'products-02-search-filter-demo.png');
  const dialogOpened = await openDeleteDialogFromList(page, 'LL Help Demo');
  if (dialogOpened) {
    await shot(page, 'products-03-delete-confirmation.png');
    await clickTextIfVisible(page, 'No', 1000);
    await clickTextIfVisible(page, 'Cancel', 1000);
  }
  await openAppPage(page, '/add/product', 'Create Product');
  await shot(page, 'products-04-create-form.png');
  await page.getByRole('button', { name: /Save/i }).first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(1000);
  await shot(page, 'products-05-validation-state.png');
  await openAppPage(page, '/products', 'All Products');
  await fillSearch(page, 'LL Help Demo');
  await openFirstEdit(page, 'LL Help Demo', '/edit/product');
  await shot(page, 'products-06-edit-form.png');
}

async function captureLoadingSites(page) {
  await openAppPage(page, '/loading-sites', 'All Loading Sites');
  await shot(page, 'loading-sites-01-list-page.png');
  await fillSearch(page, 'LL Help Demo');
  await shot(page, 'loading-sites-02-search-filter-demo.png');
  const dialogOpened = await openDeleteDialogFromList(page, 'LL Help Demo');
  if (dialogOpened) {
    await shot(page, 'loading-sites-03-delete-confirmation.png');
    await clickTextIfVisible(page, 'No', 1000);
    await clickTextIfVisible(page, 'Cancel', 1000);
  }
  await openAppPage(page, '/add/loading-sites', 'Create Loading Site');
  await shot(page, 'loading-sites-04-create-form.png');
  await page.getByRole('button', { name: /Save/i }).first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(1000);
  await shot(page, 'loading-sites-05-validation-state.png');
  await openAppPage(page, '/loading-sites', 'All Loading Sites');
  await fillSearch(page, 'LL Help Demo');
  await openFirstEdit(page, 'LL Help Demo', '/edit/loading-sites');
  await shot(page, 'loading-sites-06-edit-form.png');
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromiumExecutablePath(),
    args: ['--no-sandbox', '--disable-gpu']
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    ignoreHTTPSErrors: true,
    recordVideo: { dir: path.join(outDir, 'video'), size: { width: 1440, height: 1000 } }
  });
  await context.route('**/challenges.cloudflare.com/**', (route) => route.abort());
  const page = await context.newPage();
  const authCheck = await login(page);
  await captureProducts(page);
  await captureLoadingSites(page);
  await openAppPage(page, '/products', 'All Products');
  await page.waitForTimeout(2500);
  const body = await page.locator('body').innerText().catch(() => '');
  fs.writeFileSync(path.join(outDir, 'capture-summary.txt'), `authCheck=${JSON.stringify(authCheck)}\nlastUrl=${page.url()}\n\n${body.slice(0, 3000)}`);
  await context.close();
  await browser.close();
})().catch((err) => {
  fs.writeFileSync(path.join(outDir, 'capture-error.txt'), err.stack || String(err));
  process.exit(1);
});
