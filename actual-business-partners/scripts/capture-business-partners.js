const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const baseUrl = process.env.LL_DOC_BASE_URL || 'https://app-vps.rikexim.com';
const email = process.env.LL_DOC_EMAIL;
const password = process.env.LL_DOC_PASSWORD;
const outDir = path.resolve(__dirname, '..');
const shots = path.join(outDir, 'screenshots');

async function shot(page, name) {
  await page.screenshot({ path: path.join(shots, name), fullPage: true });
}

async function clickTextIfVisible(page, text, timeout = 2000) {
  const loc = page.getByText(text, { exact: true }).last();
  try {
    await loc.waitFor({ state: 'visible', timeout });
    await loc.click({ force: true });
    await page.waitForTimeout(800);
    return true;
  } catch (_) { return false; }
}

async function dismissOverlays(page) {
  await clickTextIfVisible(page, 'Accept All', 800);
  await page.locator('button:has-text("×"), .driver-popover-close-btn').first().click({ force: true, timeout: 1000 }).catch(() => {});
}

async function clickButtonByText(page, text) {
  return page.evaluate((text) => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => (b.innerText || b.textContent || '').trim() === text);
    if (btn) { btn.click(); return true; }
    return false;
  }, text);
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
  await page.getByRole('button', { name: /^Sign In$/ }).last().click({ force: true });
  await page.waitForTimeout(9000);
  await dismissOverlays(page);
  const body = await page.locator('body').innerText().catch(() => '');
  if (page.url().includes('confirm-logout-devices') || body.includes('A session is already active')) {
    await clickButtonByText(page, 'Yes');
    await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(10000);
    await dismissOverlays(page);
  }
}

async function openBusinessPartners(page) {
  await page.goto(`${baseUrl}/business-partners`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(7000);
  await dismissOverlays(page);
  await page.locator('#tms-bp-table, text=Business Partners').first().waitFor({ timeout: 15000 }).catch(() => {});
}

async function clickTab(page, text) {
  await page.getByText(text, { exact: true }).first().click({ force: true });
  await page.waitForTimeout(1500);
  await dismissOverlays(page);
}

(async () => {
  const seed = JSON.parse(fs.readFileSync(path.join(outDir, 'seed-result.json'), 'utf8'));
  const greenfield = JSON.parse(seed.find(r => r.name.includes('Greenfield'))?.text || '{}');
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || '/snap/bin/chromium',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    ignoreHTTPSErrors: true,
    recordVideo: { dir: path.join(outDir, 'video'), size: { width: 1440, height: 1000 } }
  });
  await context.route('**/challenges.cloudflare.com/**', route => route.abort());
  const page = await context.newPage();

  await login(page);

  await openBusinessPartners(page);
  await shot(page, 'actual-01-business-partners-list.png');

  const search = page.locator('input[formcontrolname="search"], .bp-search-input, input[placeholder*="Search" i]').first();
  if (await search.count()) {
    await search.fill('LL Help Demo');
    await page.waitForTimeout(1500);
    await shot(page, 'actual-02-search-demo-partners.png');
  }

  const row = page.locator('tr', { hasText: 'Greenfield Timber Exports' }).first();
  if (await row.count()) {
    await row.locator('button').nth(1).click({ force: true }).catch(() => {});
    await page.waitForTimeout(1200);
    await shot(page, 'actual-03-deactivate-confirmation.png');
    await clickTextIfVisible(page, 'No', 1000);
    await clickTextIfVisible(page, 'Cancel', 1000);
  }

  await page.goto(`${baseUrl}/business-partners/new`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(5000);
  await dismissOverlays(page);
  await shot(page, 'actual-04-create-identity-tab.png');
  await clickTab(page, 'Contact & Location');
  await shot(page, 'actual-05-create-contact-location-tab.png');
  await clickTab(page, 'Operations');
  await shot(page, 'actual-06-create-operations-tab.png');
  await clickTab(page, 'Attachments');
  await shot(page, 'actual-07-create-attachments-tab.png');
  await clickTab(page, 'Bank Accounts');
  await shot(page, 'actual-08-create-bank-accounts-tab.png');

  if (greenfield.encodedId) {
    await page.goto(`${baseUrl}/business-partners/${greenfield.encodedId}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(6000);
    await dismissOverlays(page);
    await shot(page, 'actual-09-edit-identity-tab.png');
    await clickTab(page, 'Attachments');
    await shot(page, 'actual-10-edit-attachments-tab.png');
    await clickTab(page, 'Bank Accounts');
    await shot(page, 'actual-11-edit-bank-accounts-tab.png');
  }

  const body = await page.locator('body').innerText().catch(() => '');
  fs.writeFileSync(path.join(outDir, 'capture-summary.txt'), `lastUrl=${page.url()}\n\n${body.slice(0, 3000)}`);
  await context.close();
  await browser.close();
})();
