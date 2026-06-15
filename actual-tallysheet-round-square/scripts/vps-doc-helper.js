const path = require('path');

const baseUrl = process.env.LL_DOC_BASE_URL || 'https://app-vps.rikexim.com';
const apiBase = process.env.LL_DOC_API_BASE_URL || 'https://api-vps.rikexim.com';
const email = process.env.LL_DOC_EMAIL || 'shiv-vps@mahadev.com';
const password = process.env.LL_DOC_PASSWORD || 'Ganpatiji1';
const outDir = path.resolve(__dirname, '..');

function chromiumExecutablePath() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const candidates = process.platform === 'win32'
    ? [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
    ]
    : ['/snap/bin/chromium', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'];
  const fs = require('fs');
  return candidates.find((candidate) => fs.existsSync(candidate));
}

async function clickTextIfVisible(page, text, timeout = 2000) {
  const loc = page.getByText(text, { exact: true }).last();
  try {
    await loc.waitFor({ state: 'visible', timeout });
    await loc.click({ force: true });
    await page.waitForTimeout(800);
    return true;
  } catch (_) {
    return false;
  }
}

async function dismissOverlays(page) {
  await clickTextIfVisible(page, 'Accept All', 800);
  await page.locator('button:has-text("x"), button:has-text("X"), .driver-popover-close-btn, .p-dialog-header-close').first().click({ force: true, timeout: 1000 }).catch(() => {});
  await page.keyboard.press('Escape').catch(() => {});
}

async function clickButtonByText(page, text) {
  return page.evaluate((buttonText) => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) => (b.innerText || b.textContent || '').trim() === buttonText);
    if (btn) {
      btn.click();
      return true;
    }
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

  const authCheck = await page.evaluate(async ({ apiBase }) => {
    const results = {};
    for (const [key, url] of Object.entries({
      products: `${apiBase}/api/v1/products/filter?size=1&page=0`,
      loadingSites: `${apiBase}/api/v1/list-loading-sites?size=1&page=0`
    })) {
      const res = await fetch(url, { credentials: 'include' });
      results[key] = res.status;
    }
    return results;
  }, { apiBase });

  if (authCheck.products !== 200 || authCheck.loadingSites !== 200) {
    throw new Error(`Authenticated API check failed: ${JSON.stringify(authCheck)}`);
  }
  return authCheck;
}

async function openAppPage(page, route, readyText) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(5000);
  await dismissOverlays(page);
  if (readyText) {
    await page.getByText(readyText).first().waitFor({ timeout: 15000 }).catch(() => {});
  }
}

module.exports = {
  apiBase,
  baseUrl,
  clickButtonByText,
  clickTextIfVisible,
  dismissOverlays,
  login,
  openAppPage,
  outDir,
  chromiumExecutablePath
};
