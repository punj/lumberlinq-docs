const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const {
  apiBase,
  dismissOverlays,
  login,
  openAppPage,
  outDir,
  chromiumExecutablePath,
  clickTextIfVisible
} = require('./vps-doc-helper');

const shots = path.join(outDir, 'screenshots');
const seed = JSON.parse(fs.readFileSync(path.join(outDir, 'seed-result.json'), 'utf8'));
const encodedId = seed.shipment?.encodedId;
const demoBl = seed.shipment?.blNumber || 'LL-DEMO-SHP-SEA-001';
const demoTuIds = [1, 2];

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

async function shot(page, name, fullPage = true) {
  await dismissOverlays(page);
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(shots, name), fullPage });
}

async function clickTab(page, label) {
  const pattern = new RegExp(label, 'i');
  const roleTab = page.getByRole('tab', { name: pattern }).first();
  if (await roleTab.count()) await roleTab.click({ force: true, timeout: 5000 }).catch(() => {});
  else {
    const textTab = page.locator('.p-tabview-nav li, [role="tab"]').filter({ hasText: pattern }).first();
    if (await textTab.count()) await textTab.click({ force: true, timeout: 5000 }).catch(() => {});
  }
  await page.waitForTimeout(1500);
  await dismissOverlays(page);
}

async function fillSearch(page, text) {
  const search = page.locator('input[formcontrolname="search"], input[placeholder*="Search" i]').first();
  if (await search.count()) {
    await search.fill(text);
    await page.keyboard.press('Enter').catch(() => {});
    await page.getByRole('button', { name: /Filter/i }).first().click({ force: true }).catch(() => {});
    await page.waitForTimeout(1500);
  }
}

async function prepareDemoInventory(page) {
  const results = [];
  for (const tuId of demoTuIds) {
    const receive = await api(page, `${apiBase}/api/v1/inventory/receive/${tuId}`, { method: 'POST' });
    const link = await api(page, `${apiBase}/api/v1/shipments/${encodedId}/transport-units/${tuId}/reference`, { method: 'POST' });
    results.push({ tuId, receive: { status: receive.status, body: receive.body || receive.text }, link: { status: link.status, body: link.body || link.text } });
  }
  fs.writeFileSync(path.join(outDir, 'missing-capture-seed-result.json'), JSON.stringify(results, null, 2));
}

async function captureShipmentDetails(page) {
  await openAppPage(page, `/shipments/${encodedId}`, 'Create');
  await clickTab(page, 'Consignment');
  await shot(page, 'shipments-20-party-consignment-details.png');
  await clickTab(page, 'Transport Units');
  await shot(page, 'shipments-21-transport-units-linked.png');
  await clickTab(page, 'Financials');
  await shot(page, 'shipments-22-payments-summary-detailed.png');
  await page.getByRole('button', { name: /Record Payment/i }).click({ force: true }).catch(() => {});
  await page.waitForTimeout(800);
  await shot(page, 'shipments-23-payments-record-form-detailed.png');
  await page.getByRole('button', { name: /^Export$/i }).click({ force: true }).catch(() => {});
  await page.waitForTimeout(1500);
  await shot(page, 'shipments-24-export-with-transport-units.png');
  await clickTextIfVisible(page, 'Cancel', 800);
}

async function captureShipmentView(page) {
  await openAppPage(page, `/shipments/shipment-view/${encodedId}`, 'Shipment');
  await shot(page, 'shipments-25-shipment-view-with-transport-units.png');
  await page.locator('.p-tabview-nav li').nth(1).click({ force: true, timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(1600);
  await shot(page, 'shipments-26-shipment-view-second-transport-unit.png');
}

async function captureInventoryAndReconciliation(page) {
  await openAppPage(page, '/inventory/overview', 'Inventory');
  await shot(page, 'shipments-27-inventory-overview.png');
  await openAppPage(page, '/inventory/in-out', 'Inventory');
  await shot(page, 'shipments-28-inventory-in-out-ledger.png');
  await page.getByRole('button', { name: /Adjustment|Add/i }).first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(1000);
  await shot(page, 'shipments-29-inventory-adjustment-dialog.png');
  await clickTextIfVisible(page, 'Cancel', 800);
  await openAppPage(page, '/inventory/processing', 'Processing');
  await shot(page, 'shipments-30-inventory-processing-runs.png');
  await page.getByRole('button', { name: /New|Processing/i }).first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(1000);
  await shot(page, 'shipments-31-processing-run-wizard.png');
  await clickTextIfVisible(page, 'Cancel', 800);
  await openAppPage(page, '/reports/reconciliation', 'Reconciliation');
  await shot(page, 'shipments-32-reconciliation-report.png');
  await openAppPage(page, '/reports/inventory', 'Inventory');
  await shot(page, 'shipments-33-inventory-report.png');
}

async function captureListAfterLink(page) {
  await openAppPage(page, '/shipments/list', 'Shipments');
  await fillSearch(page, demoBl);
  await shot(page, 'shipments-34-list-with-linked-tu-count.png');
}

(async () => {
  if (!encodedId) throw new Error('Missing seed shipment encodedId');
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
  await prepareDemoInventory(page);
  await captureShipmentDetails(page);
  await captureShipmentView(page);
  await captureInventoryAndReconciliation(page);
  await captureListAfterLink(page);
  fs.writeFileSync(path.join(outDir, 'missing-capture-summary.txt'), `authCheck=${JSON.stringify(authCheck)}\nencodedId=${encodedId}\nlastUrl=${page.url()}\n`);
  await context.close();
  await browser.close();
})().catch((err) => {
  fs.writeFileSync(path.join(outDir, 'missing-capture-error.txt'), err.stack || String(err));
  process.exit(1);
});
