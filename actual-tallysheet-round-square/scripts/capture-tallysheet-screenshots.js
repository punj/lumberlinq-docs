const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');
const {
  apiBase,
  baseUrl,
  chromiumExecutablePath,
  clickTextIfVisible,
  dismissOverlays,
  login,
} = require('./vps-doc-helper');

const outDir = path.resolve(__dirname, '..');
const screenshotDir = path.join(outDir, 'screenshots');

function round3(n) {
  return Number(n.toFixed(3));
}

function roundRow(masterId, index) {
  const length = 245 + (index % 18) * 5;
  const girth = 55 + (index % 11) * 5;
  const netLength = Math.max(length - 5, 0);
  const netGirth = Math.max(girth - 2, 0);
  const grossCbm = (length * girth * girth) / 16000000;
  const netCbm = (netLength * netGirth * netGirth) / 16000000;
  return {
    id: { tallyMasterId: masterId, orderKey: String(index).padStart(6, '0') },
    length,
    girth,
    grossCbm: round3(grossCbm),
    netCbm: round3(netCbm),
    grossCft: round3(grossCbm * 35.3146667),
    netCft: round3(netCbm * 35.3146667),
    netLengthCm: netLength,
    netGirthCm: netGirth,
  };
}

function squareRow(masterId, index) {
  const width = [6, 7, 8, 9, 10][index % 5];
  const thick = [1.5, 2, 2.5, 3][index % 4];
  const length = [8, 10, 12, 14, 16][index % 5];
  const pieces = index <= 10 ? 65 : 55; // 10*65 + 10*55 = 1200 pieces
  const netWidth = Math.max(width - 0.25, 0);
  const netThick = Math.max(thick - 0.125, 0);
  const netLength = Math.max(length - 0.5, 0);
  const grossCft = (width * thick * length * pieces) / 144;
  const netCft = (netWidth * netThick * netLength * pieces) / 144;
  return {
    id: { tallyMasterId: masterId, orderKey: String(index).padStart(6, '0') },
    length,
    width,
    thick,
    pieces,
    netWidthIn: netWidth,
    netThickIn: netThick,
    netLengthFt: netLength,
    grossCft: round3(grossCft),
    netCft: round3(netCft),
    grossCbm: round3(grossCft / 35.3146667),
    netCbm: round3(netCft / 35.3146667),
  };
}

async function api(page, pathName, options = {}) {
  return page.evaluate(async ({ apiBase, pathName, options }) => {
    const res = await fetch(`${apiBase}${pathName}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    const text = await res.text();
    let body;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }
    if (!res.ok) {
      throw new Error(`${options.method || 'GET'} ${pathName} failed ${res.status}: ${typeof body === 'string' ? body : JSON.stringify(body)}`);
    }
    return body;
  }, { apiBase, pathName, options });
}

async function findUnit(page, transportId) {
  const encoded = encodeURIComponent(transportId);
  const res = await api(page, `/api/v1/transportunits/paginated?page=0&size=10&sortBy=createdDate&sortDir=desc&globalFilter=${encoded}`);
  return (res.content || []).find((u) => u.transportId === transportId) || null;
}

async function createUnit(page, { transportId, productId, loadingSiteId, modeId, driver, route, weight }) {
  const payload = {
    transportId,
    transportMode: { id: modeId },
    product: { productId },
    loadingSite: { loadingSiteId },
    unitNumber: transportId.replace(/\s+/g, '-').slice(0, 28),
    sealNumber: `SEAL-${transportId.slice(-6).replace(/\W/g, '')}`,
    driver,
    route,
    contactPerson: driver,
    expectedDelivery: '2026-06-30',
    weight,
    privacyType: 'PRIVATE',
  };
  return api(page, '/api/v1/transportunits', { method: 'POST', body: JSON.stringify(payload) });
}

async function ensureRows(page, masterId, targetCount, kind) {
  const existing = await api(page, `/api/v1/tally/details/${masterId}?page=0&size=5000`);
  if ((existing || []).length >= targetCount) return existing;
  const rows = Array.from({ length: targetCount }, (_, i) =>
    kind === 'square' ? squareRow(masterId, i + 1) : roundRow(masterId, i + 1)
  );
  await api(page, '/api/v1/tally/detail/batch', { method: 'POST', body: JSON.stringify(rows) });
  return api(page, `/api/v1/tally/details/${masterId}?page=0&size=5000`);
}

async function ensureDemoData(page) {
  const products = await api(page, '/api/v1/products/filter?size=20&page=0&globalFilter=LL%20Help%20Demo');
  const loadingSites = await api(page, '/api/v1/list-loading-sites?size=20&page=0&globalFilter=LL%20Help%20Demo');
  const roundProduct = products.content.find((p) => p.types === 'ROUND') || products.content[0];
  const squareProduct = products.content.find((p) => p.types === 'SQUARE') || products.content[0];
  const loadingSite = loadingSites.content.find((s) => s.name.includes('North Yard')) || loadingSites.content[0];

  const specs = {
    round: {
      transportId: 'LL Help Demo Round Tally 115 Logs',
      productId: roundProduct.productId,
      loadingSiteId: loadingSite.loadingSiteId,
      modeId: 15,
      driver: 'Ramesh Timber Yard',
      route: 'North Yard to export staging',
      weight: 28500,
      count: 115,
      kind: 'round',
    },
    square: {
      transportId: 'LL Help Demo Square Tally 1200 Pieces',
      productId: squareProduct.productId,
      loadingSiteId: loadingSite.loadingSiteId,
      modeId: 16,
      driver: 'Mahesh Sawn Timber',
      route: 'Sawmill to warehouse stack',
      weight: 31200,
      count: 20,
      kind: 'square',
    },
    empty: {
      transportId: 'LL Help Demo Empty Tally Sheet',
      productId: roundProduct.productId,
      loadingSiteId: loadingSite.loadingSiteId,
      modeId: 15,
      driver: 'Empty Sheet Demo',
      route: 'Pending loading plan',
      weight: 0,
      count: 0,
      kind: 'round',
    },
  };

  const result = {};
  for (const [key, spec] of Object.entries(specs)) {
    let unit = await findUnit(page, spec.transportId);
    if (!unit) {
      await createUnit(page, spec);
      unit = await findUnit(page, spec.transportId);
    }
    const full = await api(page, `/api/v1/transportunits/by-encoded/${unit.encodedId}`);
    const masterId = full.tallyMaster?.id || full.tallyMasterId;
    if (spec.count > 0) await ensureRows(page, masterId, spec.count, spec.kind);
    result[key] = {
      id: full.id,
      encodedId: full.encodedId || unit.encodedId,
      transportId: spec.transportId,
      tallyMasterId: masterId,
    };
  }
  fs.writeFileSync(path.join(outDir, 'seed-result.json'), JSON.stringify(result, null, 2));
  return result;
}

async function waitClean(page) {
  await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await dismissOverlays(page);
  await page.locator('.p-progress-spinner, .p-skeleton, .tally-skeleton, .tu-stat-loading').first().waitFor({ state: 'hidden', timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(1000);
}

async function openRoute(page, route) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitClean(page);
}

async function shot(page, name, locator = null, options = {}) {
  await dismissOverlays(page);
  await page.waitForTimeout(600);
  const file = path.join(screenshotDir, name);
  if (locator) {
    const loc = page.locator(locator).first();
    await loc.waitFor({ state: 'visible', timeout: 20000 });
    await loc.screenshot({ path: file, animations: 'disabled', ...options });
  } else {
    await page.screenshot({ path: file, fullPage: true, animations: 'disabled', ...options });
  }
  console.log(file);
}

async function filterList(page, text) {
  const input = page.locator('input[type="search"], .tu-search-input').first();
  await input.waitFor({ state: 'visible', timeout: 12000 });
  await input.fill(text);
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1800);
  await dismissOverlays(page);
}

async function openTally(page, encodedId) {
  await openRoute(page, `/new-tallysheet?transportId=${encodeURIComponent(encodedId)}&source=navigated`);
  await page.locator('app-transport-unit').first().waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('app-tallysheet-list-round, app-tallysheet-list-square').first().waitFor({ state: 'visible', timeout: 45000 });
  await waitClean(page);
}

async function goToGridRow(page, rowIndex) {
  await page.locator('.ag-body-viewport').first().evaluate((el, rowIndex) => {
    el.scrollTop = Math.max(0, rowIndex * 42);
  }, rowIndex);
  await page.waitForTimeout(1200);
}

async function clickSummaryTab(page) {
  await page.getByRole('tab', { name: /Summary/i }).click({ force: true }).catch(async () => {
    await page.getByText('Summary', { exact: true }).last().click({ force: true });
  });
  await waitClean(page);
}

async function showSaveStatus(page) {
  const save = page.locator('.grid-toolbar .toolbar-group--primary button:visible, app-tallysheet-list-round button:has-text("Save"):visible, app-tallysheet-list-square button:has-text("Save"):visible').first();
  await save.waitFor({ state: 'visible', timeout: 10000 });
  await save.click({ force: true });
  await page.waitForTimeout(1800);
}

async function showCreateValidation(page) {
  await page.locator('button[type="submit"]').first().click({ force: true });
  await page.waitForTimeout(1200);
}

async function main() {
  fs.mkdirSync(screenshotDir, { recursive: true });
  const executablePath = chromiumExecutablePath();
  if (!executablePath) throw new Error('Chromium executable not found');
  const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    ignoreHTTPSErrors: true,
  });
  await context.route('**/challenges.cloudflare.com/**', (route) => route.abort());
  const page = await context.newPage();

  await login(page);
  const data = await ensureDemoData(page);

  await openRoute(page, '/new-tallysheet/view-trans');
  await shot(page, 'round-list-page.png');
  await filterList(page, 'LL Help Demo Round');
  await shot(page, 'round-search-filter.png', '.tu-table-wrap');

  await openRoute(page, '/new-tallysheet');
  await shot(page, 'round-create.png');
  await showCreateValidation(page);
  await shot(page, 'round-validation-error.png', 'app-transport-unit');

  await openTally(page, data.round.encodedId);
  await shot(page, 'round-edit.png');
  await shot(page, 'round-entry-grid.png', 'app-tallysheet-list-round');
  await shot(page, 'round-first-10-records.png', '.ag-root-wrapper');
  await goToGridRow(page, 50);
  await shot(page, 'round-middle-records-row-50.png', '.ag-root-wrapper');
  await goToGridRow(page, 104);
  await shot(page, 'round-large-dataset-100-plus.png', '.ag-root-wrapper');
  await goToGridRow(page, 0);
  await shot(page, 'round-volume-calculation.png', '.ag-root-wrapper');
  await clickSummaryTab(page);
  await shot(page, 'round-summary.png');
  await page.getByRole('tab', { name: /Tallysheet/i }).first().click({ force: true }).catch(() => {});
  await waitClean(page);
  await showSaveStatus(page);
  await shot(page, 'round-save-confirmation.png', 'app-tallysheet-list-round');

  await openTally(page, data.empty.encodedId);
  await shot(page, 'round-empty-tally-sheet.png', 'app-tallysheet-list-round');

  await page.setViewportSize({ width: 390, height: 844 });
  await openRoute(page, '/new-tallysheet/view-trans');
  await filterList(page, 'LL Help Demo Round');
  await shot(page, 'round-mobile-responsive.png');
  await page.setViewportSize({ width: 1440, height: 1000 });

  await openRoute(page, '/new-tallysheet/view-trans');
  await filterList(page, 'LL Help Demo Square');
  await shot(page, 'square-list-page.png');
  await shot(page, 'square-search-filter.png', '.tu-table-wrap');

  await openRoute(page, '/new-tallysheet');
  await shot(page, 'square-create.png');

  await openTally(page, data.square.encodedId);
  await shot(page, 'square-edit.png');
  await shot(page, 'square-entry-grid.png', 'app-tallysheet-list-square');
  await shot(page, 'square-width-thickness-length-pieces-entry.png', '.ag-root-wrapper');
  await shot(page, 'square-large-piece-counts.png', '.ag-root-wrapper');
  await shot(page, 'square-volume-calculation.png', '.ag-root-wrapper');
  await clickSummaryTab(page);
  await shot(page, 'square-summary.png');
  await page.getByRole('tab', { name: /Tallysheet/i }).first().click({ force: true }).catch(() => {});
  await waitClean(page);
  await showSaveStatus(page);
  await shot(page, 'square-save-confirmation.png', 'app-tallysheet-list-square');

  await openRoute(page, '/new-tallysheet');
  await showCreateValidation(page);
  await shot(page, 'square-validation-example.png', 'app-transport-unit');

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
