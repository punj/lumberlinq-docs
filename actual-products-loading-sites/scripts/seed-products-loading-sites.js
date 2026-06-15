const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { apiBase, login, outDir, chromiumExecutablePath } = require('./vps-doc-helper');

const products = [
  { name: 'LL Help Demo - Round Teak Logs', description: 'Demo round log product for help documentation.', hsCode: '4403', formula: 'HOPPUS', species: 'Teak', productCode: 'LL-DEMO-RTL' },
  { name: 'LL Help Demo - Sawn Oak Boards', description: 'Demo sawn board product for help documentation.', hsCode: '4407', formula: 'RECTANGLE_PRISM', species: 'Oak', productCode: 'LL-DEMO-SOB' },
  { name: 'LL Help Demo - Pine Sleepers', description: 'Demo sleeper product for help documentation.', hsCode: '4407', formula: 'RECTANGLE_PRISM', species: 'Pine', productCode: 'LL-DEMO-PSL' },
  { name: 'LL Help Demo - Cedar Utility Poles', description: 'Demo pole product for help documentation.', hsCode: '4403', formula: 'HOPPUS', species: 'Cedar', productCode: 'LL-DEMO-CUP' },
  { name: 'LL Help Demo - Mixed Hardwood Planks', description: 'Demo mixed hardwood product for help documentation.', hsCode: '4407', formula: 'RECTANGLE_PRISM', species: 'Other', productCode: 'LL-DEMO-MHP' }
];

const loadingSites = [
  { name: 'LL Help Demo - North Yard', contactPerson: 'Asha Patel', phone: '+91 98765 41001', countryIso2: 'IN', stateCode: 'GJ', cityName: 'Ahmedabad', address1: 'North timber staging yard', postalCode: '382421', operatingHours: '08:00-18:00', capacity: '1200 CBM', currentVolume: '420 CBM', machinesInstalled: 'Forklift, weighbridge', notes: 'Demo yard record for Loading Sites help documentation.', siteType: 'YARD' },
  { name: 'LL Help Demo - Port Loading Bay', contactPerson: 'Rohan Desai', phone: '+91 98765 41002', countryIso2: 'IN', stateCode: 'GJ', cityName: 'Mundra', address1: 'Timber export bay near port gate 3', postalCode: '370421', operatingHours: '24 hours', capacity: '2500 CBM', currentVolume: '980 CBM', machinesInstalled: 'Cranes, stackers', notes: 'Demo port loading site.', siteType: 'PORT' },
  { name: 'LL Help Demo - East Sawmill', contactPerson: 'Meera Shah', phone: '+91 98765 41003', countryIso2: 'IN', stateCode: 'GJ', cityName: 'Surat', address1: 'Industrial sawmill compound', postalCode: '395003', operatingHours: '09:00-17:30', capacity: '800 CBM', currentVolume: '260 CBM', machinesInstalled: 'Sawmill line, kiln', notes: 'Demo mill loading site.', siteType: 'MILL' },
  { name: 'LL Help Demo - Forest Depot', contactPerson: 'Vikram Rao', phone: '+91 98765 41004', countryIso2: 'IN', stateCode: 'MH', cityName: 'Nagpur', address1: 'Forest collection depot', postalCode: '440001', operatingHours: '07:00-15:00', capacity: '600 CBM', currentVolume: '210 CBM', machinesInstalled: 'Loader', notes: 'Demo forest depot loading site.', siteType: 'FOREST' },
  { name: 'LL Help Demo - Warehouse Stack A', contactPerson: 'Neha Iyer', phone: '+91 98765 41005', countryIso2: 'IN', stateCode: 'MH', cityName: 'Mumbai', address1: 'Warehouse stack area A', postalCode: '400001', operatingHours: '10:00-19:00', capacity: '1500 CBM', currentVolume: '700 CBM', machinesInstalled: 'Pallet jacks, forklift', notes: 'Demo warehouse loading site.', siteType: 'WAREHOUSE' }
];

async function getPageContent(page, url) {
  const res = await page.evaluate(async (url) => {
    const response = await fetch(url, { credentials: 'include' });
    return { status: response.status, text: await response.text() };
  }, url);
  try {
    return { status: res.status, data: JSON.parse(res.text) };
  } catch (_) {
    return { status: res.status, data: res.text };
  }
}

async function createIfMissing(page, type, item) {
  const endpoint = type === 'product' ? 'products' : 'loading-site';
  const checkUrl = type === 'product'
    ? `${apiBase}/api/v1/products/search-query?query=${encodeURIComponent(item.name)}`
    : `${apiBase}/api/v1/loading-sites/search-query?query=${encodeURIComponent(item.name)}`;
  const existing = await getPageContent(page, checkUrl);
  const rows = Array.isArray(existing.data) ? existing.data : existing.data?.content || [];
  const match = rows.find((row) => row.name === item.name);
  if (match) {
    return { type, name: item.name, action: 'skipped-duplicate', id: match.encodedId || match.productId || match.loadingSiteId, record: match };
  }

  const createUrl = type === 'product'
    ? `${apiBase}/api/v1/products`
    : `${apiBase}/api/v1/loading-site`;
  const created = await page.evaluate(async ({ createUrl, item }) => {
    const response = await fetch(createUrl, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return { status: response.status, text: await response.text() };
  }, { createUrl, item });
  let body = created.text;
  try {
    body = JSON.parse(created.text);
  } catch (_) {}
  return { type, name: item.name, action: 'create', status: created.status, record: body };
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromiumExecutablePath(),
    args: ['--no-sandbox', '--disable-gpu']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ignoreHTTPSErrors: true });
  await context.route('**/challenges.cloudflare.com/**', (route) => route.abort());
  const page = await context.newPage();
  const authCheck = await login(page);

  const result = [{ authCheck }];
  for (const product of products) result.push(await createIfMissing(page, 'product', product));
  for (const site of loadingSites) result.push(await createIfMissing(page, 'loading-site', site));

  fs.writeFileSync(path.join(outDir, 'seed-result.json'), JSON.stringify(result, null, 2));
  await browser.close();
})().catch((err) => {
  fs.writeFileSync(path.join(outDir, 'seed-error.txt'), err.stack || String(err));
  process.exit(1);
});
