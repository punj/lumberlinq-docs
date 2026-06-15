const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const baseUrl = process.env.LL_DOC_BASE_URL || 'https://app-vps.rikexim.com';
const email = process.env.LL_DOC_EMAIL;
const password = process.env.LL_DOC_PASSWORD;
const outDir = path.resolve(__dirname, '..');

async function screenshot(page, name) {
  await page.screenshot({ path: path.join(outDir, 'screenshots', name), fullPage: true });
}

async function clickTextIfVisible(page, text, timeout = 3000) {
  const loc = page.getByText(text, { exact: true }).last();
  try {
    await loc.waitFor({ state: 'visible', timeout });
    await loc.click({ force: true });
    await page.waitForTimeout(1000);
    return true;
  } catch (_) {
    return false;
  }
}

async function clickButtonByText(page, text) {
  return page.evaluate((text) => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => (b.innerText || b.textContent || '').trim() === text);
    if (btn) {
      btn.click();
      return true;
    }
    const any = Array.from(document.querySelectorAll('*')).find(el => (el.innerText || '').trim() === text);
    if (any) {
      any.click();
      return true;
    }
    return false;
  }, text);
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
  await clickTextIfVisible(page, 'Yes', 800);
  await screenshot(page, '00-login-page.png');

  await page.locator('input[type="email"]:visible').last().fill(email);
  await page.locator('input[type="password"]:visible').last().fill(password);
  await screenshot(page, '00-login-filled.png');
  await page.getByRole('button', { name: /^Sign In$/ }).last().click();
  await page.waitForTimeout(9000);
  await dismissOverlays(page);
  await screenshot(page, '01-login-result.png');

  if (page.url().includes('confirm-logout-devices') || (await page.locator('body').innerText()).includes('A session is already active')) {
    const clicked = await clickButtonByText(page, 'Yes');
    if (!clicked) throw new Error('Could not click confirm logout Yes');
    await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(10000);
    await dismissOverlays(page);
    await screenshot(page, '02-after-confirm-logout-devices.png');
  }
}

(async () => {
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
  const log = [];
  page.on('console', msg => log.push(`CONSOLE ${msg.type()} ${msg.text()}`));
  page.on('response', res => { if (res.status() >= 400) log.push(`HTTP ${res.status()} ${res.url()}`); });

  await login(page);
  log.push(`postLoginUrl=${page.url()}`);
  log.push(`postLoginBody=${(await page.locator('body').innerText().catch(() => '')).slice(0, 3000)}`);

  await page.goto(`${baseUrl}/business-partners`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(10000);
  await dismissOverlays(page);
  await screenshot(page, '03-business-partners-discovery.png');
  log.push(`bpUrl=${page.url()}`);
  log.push(`bpBody=${(await page.locator('body').innerText().catch(() => '')).slice(0, 6000)}`);
  fs.writeFileSync(path.join(outDir, 'discovery-log.txt'), log.join('\n\n'));
  await context.close();
  await browser.close();
})();
