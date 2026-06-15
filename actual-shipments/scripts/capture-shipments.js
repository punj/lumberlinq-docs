const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const {
  apiBase,
  baseUrl,
  clickTextIfVisible,
  dismissOverlays,
  login,
  openAppPage,
  outDir,
  chromiumExecutablePath
} = require('./vps-doc-helper');

const shots = path.join(outDir, 'screenshots');
const demoBl = 'LL-DEMO-SHP-SEA-001';
const demoSearch = 'LL Help Demo Shipment';

function writeJson(name, data) {
  fs.writeFileSync(path.join(outDir, name), JSON.stringify(data, null, 2));
}

async function shot(page, name, fullPage = true) {
  await dismissOverlays(page);
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(shots, name), fullPage });
}

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

function firstContent(pageResult) {
  if (Array.isArray(pageResult)) return pageResult[0];
  if (pageResult && Array.isArray(pageResult.content)) return pageResult.content[0];
  return null;
}

async function ensureDemoShipment(page) {
  const existing = await api(page, `${apiBase}/api/v1/shipments/list?page=0&size=10&sort=shipmentDate,desc&search=${encodeURIComponent(demoBl)}`);
  const found = firstContent(existing.body);
  if (found?.encodedId) {
    return { action: 'reused-existing', shipment: found, listResponse: existing };
  }

  const owner = await api(page, `${apiBase}/api/v1/business-partners/findOwner`);
  const bpSearch = await api(page, `${apiBase}/api/v1/business-partners/search-with-owner?q=${encodeURIComponent('LL Help Demo')}`);
  const partners = Array.isArray(bpSearch.body) ? bpSearch.body : [];
  const consignee = partners.find((p) => /Harborline|Blue Oak|Imports|Distribution/i.test(p.name || '')) || partners[0];
  const shipper = owner.body?.id ? owner.body : (partners.find((p) => /Greenfield|North Ridge|Sawmills/i.test(p.name || '')) || partners[0]);
  const pol = await api(page, `${apiBase}/api/v1/sea-ports/search-query1?query=${encodeURIComponent('Mundra')}`);
  const pod = await api(page, `${apiBase}/api/v1/sea-ports/search-query1?query=${encodeURIComponent('Jebel Ali')}`);
  const portLoading = Array.isArray(pol.body) ? pol.body[0] : null;
  const portDischarge = Array.isArray(pod.body) ? pod.body[0] : null;

  if (!shipper?.id || !consignee?.id) {
    throw new Error(`Cannot create shipment: missing BP ids shipper=${JSON.stringify(shipper)} consignee=${JSON.stringify(consignee)}`);
  }

  const payload = {
    tradeType: 'EXPORT',
    shipmentDate: '2026-06-15',
    modeOfTransport: 'SEA',
    shipperId: shipper.id,
    consigneeId: consignee.id,
    portOfLoadingId: portLoading?.id || null,
    portOfDischargeId: portDischarge?.id || null,
    finalDestination: { name: 'United Arab Emirates', iso2: 'AE', flagUrl: '' },
    countryOfOrigin: { name: 'India', iso2: 'IN', flagUrl: '' },
    countryOfDestination: { name: 'United Arab Emirates', iso2: 'AE', flagUrl: '' },
    vesselOrFlight: 'MV LL Demo Timber Star',
    voyageOrFlightNo: 'LLV-2606',
    incoterms: 'CIF',
    exporterRefNo: 'LL-EXP-DEMO-2026-001',
    buyerOrderNo: 'LL-PO-DEMO-2026-044',
    blNumber: demoBl,
    blType: 'Original',
    packingListNo: 'LL-PL-DEMO-001',
    commercialInvoiceNo: 'LL-CI-DEMO-001',
    currency: 'USD',
    freightTerms: 'Prepaid',
    insuranceValue: 12500,
    totalInvoiceAmount: 184750,
    status: 'DRAFT',
    remarks: 'LL Help Demo Shipment for Shipments help center screenshots.',
    estimatedDeparture: '2026-06-18T09:00:00',
    estimatedArrival: '2026-06-28T16:00:00',
    documentIds: []
  };

  const created = await api(page, `${apiBase}/api/v1/shipments`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  if (!created.ok) throw new Error(`Shipment create failed ${created.status}: ${created.text}`);
  const encodedId = created.body.encodedId;

  const references = [];
  for (const tuId of [1, 2]) {
    const res = await api(page, `${apiBase}/api/v1/shipments/${encodedId}/transport-units/${tuId}/reference`, { method: 'POST' });
    references.push({ tuId, status: res.status, body: res.body || res.text });
  }

  return { action: 'created', shipment: { ...created.body, blNumber: demoBl, encodedId }, payload, references };
}

async function fillGlobalSearch(page, text) {
  const search = page.locator('form#tms-st-filter input[formcontrolname="search"], input[placeholder*="Search" i]').first();
  await search.fill(text);
  await page.keyboard.press('Enter').catch(() => {});
  await page.getByRole('button', { name: /Filter/i }).first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(1800);
}

async function clickTab(page, label) {
  const pattern = new RegExp(label, 'i');
  const roleTab = page.getByRole('tab', { name: pattern }).first();
  if (await roleTab.count()) {
    await roleTab.click({ force: true, timeout: 5000 }).catch(() => {});
  } else {
    const textTab = page.locator('.p-tabview-nav li, [role="tab"]').filter({ hasText: pattern }).first();
    if (await textTab.count()) {
      await textTab.click({ force: true, timeout: 5000 }).catch(() => {});
    }
  }
  await page.waitForTimeout(1200);
  await dismissOverlays(page);
}

async function openRowAction(page, rowText, iconClass) {
  const row = page.locator('tr').filter({ hasText: rowText }).first();
  if (!(await row.count())) return false;
  const btn = row.locator(`button:has(.${iconClass}), .${iconClass}`).first();
  if (!(await btn.count())) return false;
  await btn.click({ force: true });
  await page.waitForTimeout(1200);
  return true;
}

async function captureListFeatures(page) {
  await openAppPage(page, '/shipments/list', 'Shipments');
  await shot(page, 'shipments-01-list-page.png');

  await fillGlobalSearch(page, demoBl);
  await shot(page, 'shipments-02-search-filter.png');

  const blFilter = page.locator('input[placeholder*="BL" i]').first();
  if (await blFilter.count()) {
    await blFilter.fill('LL-DEMO');
    await page.waitForTimeout(1200);
    await shot(page, 'shipments-03-column-filter.png');
  }

  await openRowAction(page, demoBl, 'pi-share-alt');
  await shot(page, 'shipments-04-share-menu.png');
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(500);

  await openRowAction(page, demoBl, 'pi-download');
  await shot(page, 'shipments-05-download-export-menu.png');
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(500);

  await openRowAction(page, demoBl, 'pi-dollar');
  await shot(page, 'shipments-06-quick-payment-panel.png');
  await page.keyboard.press('Escape').catch(() => {});
}

async function captureCreateValidation(page) {
  await openAppPage(page, '/shipments/new', 'Create');
  await shot(page, 'shipments-07-create-details-tab.png');
  await page.getByRole('button', { name: /Save/i }).last().click({ force: true }).catch(() => {});
  await page.waitForTimeout(1200);
  await shot(page, 'shipments-08-validation-required-fields.png');
}

async function captureEditFeatures(page, encodedId) {
  await openAppPage(page, `/shipments/${encodedId}`, 'Create');
  await shot(page, 'shipments-09-edit-details-tab.png');

  await clickTab(page, 'Consignment');
  await shot(page, 'shipments-10-consignment-tab.png');

  await clickTab(page, 'Transport Units');
  await shot(page, 'shipments-11-transport-units-tab.png');

  await clickTab(page, 'Documents');
  await shot(page, 'shipments-12-documents-tab.png');

  await clickTab(page, 'Financials');
  await shot(page, 'shipments-13-financials-payments-tab.png');

  await page.getByRole('button', { name: /Record Payment/i }).click({ force: true }).catch(() => {});
  await page.waitForTimeout(700);
  await shot(page, 'shipments-14-record-payment-form.png');

  await clickTab(page, 'Audit|Local');
  await shot(page, 'shipments-15-local-goods-audit-tab.png');

  await page.getByRole('button', { name: /^Export$/i }).click({ force: true }).catch(() => {});
  await page.waitForTimeout(1600);
  await shot(page, 'shipments-16-export-dialog.png');
  await clickTextIfVisible(page, 'Cancel', 800);

  await page.getByRole('button', { name: /Lock/i }).click({ force: true }).catch(() => {});
  await page.waitForTimeout(1000);
  await shot(page, 'shipments-17-lock-confirmation-dialog.png');
  await clickTextIfVisible(page, 'Cancel', 800);
}

async function captureViewAndMobile(page, encodedId, context) {
  await openAppPage(page, `/shipments/shipment-view/${encodedId}`, 'Shipment');
  await shot(page, 'shipments-18-read-only-view.png');

  await page.setViewportSize({ width: 390, height: 900 });
  await openAppPage(page, '/shipments/list', 'Shipments');
  await fillGlobalSearch(page, demoBl);
  await shot(page, 'shipments-19-mobile-list-view.png', true);
  await page.setViewportSize({ width: 1440, height: 1000 });
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
  const seed = await ensureDemoShipment(page);
  writeJson('seed-result.json', { authCheck, ...seed });
  const encodedId = seed.shipment.encodedId;
  await captureListFeatures(page);
  await captureCreateValidation(page);
  await captureEditFeatures(page, encodedId);
  await captureViewAndMobile(page, encodedId, context);
  const body = await page.locator('body').innerText().catch(() => '');
  fs.writeFileSync(path.join(outDir, 'capture-summary.txt'), `authCheck=${JSON.stringify(authCheck)}\nseedAction=${seed.action}\nencodedId=${encodedId}\nlastUrl=${page.url()}\n\n${body.slice(0, 3000)}`);
  await context.close();
  await browser.close();
})().catch((err) => {
  fs.writeFileSync(path.join(outDir, 'capture-error.txt'), err.stack || String(err));
  process.exit(1);
});
