const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const baseUrl = process.env.LL_DOC_BASE_URL || 'https://app-vps.rikexim.com';
const apiBase = process.env.LL_DOC_API_BASE_URL || 'https://api-vps.rikexim.com';
const email = process.env.LL_DOC_EMAIL;
const password = process.env.LL_DOC_PASSWORD;
const outDir = path.resolve(__dirname, '..');

async function clickTextIfVisible(page, text, timeout = 3000) {
  const loc = page.getByText(text, { exact: true }).last();
  try {
    await loc.waitFor({ state: 'visible', timeout });
    await loc.click({ force: true });
    await page.waitForTimeout(1000);
    return true;
  } catch (_) { return false; }
}

async function dismissOverlays(page) {
  await clickTextIfVisible(page, 'Accept All', 800);
  await page.locator('button:has-text("×"), .driver-popover-close-btn').first().click({ force: true, timeout: 1000 }).catch(() => {});
}

async function login(page) {
  await page.goto(`${baseUrl}/login?forceLogin=true`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await dismissOverlays(page);
  await clickTextIfVisible(page, 'Yes', 1200);
  await dismissOverlays(page);
  await page.locator('input[type="email"]:visible').last().fill(email);
  await page.locator('input[type="password"]:visible').last().fill(password);
  await page.getByRole('button', { name: /^Sign In$/ }).last().click();
  await page.waitForTimeout(8000);
  await dismissOverlays(page);
  const body = await page.locator('body').innerText().catch(() => '');
  if (page.url().includes('confirm-logout-devices') || body.includes('A session is already active')) {
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => (b.innerText || '').trim() === 'Yes');
      if (btn) btn.click();
    });
    await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(10000);
    await dismissOverlays(page);
  }
}

const partners = [
  {
    name: 'LL Help Demo - Greenfield Timber Exports',
    contactPerson: 'Rahul Mehta',
    partyType: 'BOTH',
    referenceCode: 'LL-DEMO-GF',
    isActive: true,
    taxId: '27ABCDE1234F1Z5',
    registrationType: 'EXPORTER',
    email: 'greenfield.demo@example.com',
    phone1: '(415) 555-0101',
    phone2: '(415) 555-0199',
    website: 'https://example.com/greenfield',
    address1: 'Block C, Timber Export Yard',
    address2: 'Near Inland Container Depot',
    countryIso2: 'IN',
    stateCode: 'GJ',
    cityName: 'Ahmedabad',
    postalCode: '382421',
    notes: 'Demo partner for Business Partner help documentation.',
    linkedUserId: null,
    externalCode: 'ERP-DEMO-GF',
    partyCategory: 'INTERNATIONAL',
    tags: ['SAWMILL', 'EXPORTER', 'TRADER'],
    bankDetails: [{ bankName: 'HDFC Bank', accNo: '998877664821', ifscSwift: 'HDFCINBBXXX', currency: 'USD' }]
  },
  {
    name: 'LL Help Demo - North Ridge Sawmills',
    contactPerson: 'Ava Thompson',
    partyType: 'SELLER',
    referenceCode: 'LL-DEMO-NR',
    isActive: true,
    taxId: 'CA879221',
    registrationType: 'COMPANY',
    email: 'northridge.demo@example.com',
    phone1: '(604) 555-0178',
    website: 'https://example.com/northridge',
    address1: '120 Cedar Mill Road',
    countryIso2: 'CA',
    stateCode: 'BC',
    cityName: 'Vancouver',
    postalCode: 'V6B 1A1',
    notes: 'Supplier demo record.',
    externalCode: 'ERP-DEMO-NR',
    partyCategory: 'INTERNATIONAL',
    tags: ['SAWMILL'],
    bankDetails: []
  },
  {
    name: 'LL Help Demo - Harborline Imports LLC',
    contactPerson: 'Miguel Santos',
    partyType: 'BUYER',
    referenceCode: 'LL-DEMO-HI',
    isActive: true,
    taxId: 'US442109',
    registrationType: 'IMPORTER',
    email: 'harborline.demo@example.com',
    phone1: '(305) 555-0160',
    website: 'https://example.com/harborline',
    address1: '88 Port Avenue',
    countryIso2: 'US',
    stateCode: 'FL',
    cityName: 'Miami',
    postalCode: '33101',
    notes: 'Buyer demo record.',
    externalCode: 'ERP-DEMO-HI',
    partyCategory: 'INTERNATIONAL',
    tags: ['IMPORTER'],
    bankDetails: []
  },
  {
    name: 'LL Help Demo - Evergreen Ply Traders',
    contactPerson: 'Nisha Patel',
    partyType: 'BOTH',
    referenceCode: 'LL-DEMO-EP',
    isActive: false,
    taxId: '24PQRSX4455K1Z2',
    registrationType: 'COMPANY',
    email: 'evergreen.demo@example.com',
    phone1: '(212) 555-0188',
    address1: '7 Warehouse Lane',
    countryIso2: 'IN',
    stateCode: 'GJ',
    cityName: 'Ahmedabad',
    postalCode: '380015',
    notes: 'Inactive demo record for status filtering.',
    externalCode: 'ERP-DEMO-EP',
    partyCategory: 'DOMESTIC',
    tags: ['TRADER'],
    bankDetails: []
  },
  {
    name: 'LL Help Demo - Blue Oak Distribution',
    contactPerson: 'Chen Wei',
    partyType: 'BUYER',
    referenceCode: 'LL-DEMO-BO',
    isActive: true,
    taxId: 'SG556781',
    registrationType: 'COMPANY',
    email: 'blueoak.demo@example.com',
    phone1: '(650) 555-0144',
    address1: '42 Trade Center Road',
    countryIso2: 'SG',
    stateCode: '',
    cityName: 'Singapore',
    postalCode: '048616',
    notes: 'Distribution demo record.',
    externalCode: 'ERP-DEMO-BO',
    partyCategory: 'INTERNATIONAL',
    tags: ['RETAILER', 'IMPORTER'],
    bankDetails: []
  }
];

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || '/snap/bin/chromium',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ignoreHTTPSErrors: true });
  await context.route('**/challenges.cloudflare.com/**', route => route.abort());
  const page = await context.newPage();
  await login(page);

  const result = await page.evaluate(async ({ apiBase, partners }) => {
    const out = [];
    for (const partner of partners) {
      const dup = await fetch(`${apiBase}/api/v1/business-partners/duplicate-warning?name=${encodeURIComponent(partner.name)}&taxId=${encodeURIComponent(partner.taxId)}`, { credentials: 'include' }).then(r => r.json()).catch(e => ({ error: String(e) }));
      if (dup.nameDuplicate || dup.taxIdDuplicate) {
        out.push({ name: partner.name, action: 'skipped-duplicate', dup });
        continue;
      }
      const res = await fetch(`${apiBase}/api/v1/business-partners`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partner)
      });
      out.push({ name: partner.name, action: 'create', status: res.status, text: await res.text() });
    }
    return out;
  }, { apiBase, partners });

  fs.writeFileSync(path.join(outDir, 'seed-result.json'), JSON.stringify(result, null, 2));
  await browser.close();
})();
