const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const {
  apiBase,
  dismissOverlays,
  login,
  openAppPage,
  outDir,
  chromiumExecutablePath
} = require('./vps-doc-helper');

const shots = path.join(outDir, 'screenshots');

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
  await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(shots, name), fullPage });
}

async function fillAutocomplete(page, labelPattern, value) {
  const field = page.locator('.wf-field, .adj-field, .p-field, div').filter({ hasText: labelPattern }).locator('input').first();
  if (await field.count()) {
    await field.fill(value);
    await page.waitForTimeout(700);
    await page.keyboard.press('ArrowDown').catch(() => {});
    await page.keyboard.press('Enter').catch(() => {});
    await page.waitForTimeout(500);
  }
}

async function fillFirstVisibleNumber(page, value, ordinal = 0) {
  const inputs = page.locator('input.p-inputnumber-input:visible, p-inputnumber input:visible');
  if ((await inputs.count()) > ordinal) {
    await inputs.nth(ordinal).fill(String(value));
  }
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
  await context.route('**/challenges.cloudflare.com/**', route => route.abort());
  const page = await context.newPage();
  const authCheck = await login(page);

  const receiveTu3 = await api(page, `${apiBase}/api/v1/inventory/receive/3`, { method: 'POST' });
  const availableInputs = await api(page, `${apiBase}/api/v1/processing-runs/available-inputs`);

  await openAppPage(page, '/inventory/processing', 'Processing');
  await shot(page, 'shipments-30-inventory-processing-runs.png');

  await page.getByRole('button', { name: /New|Processing/i }).first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(1200);
  await fillAutocomplete(page, /Mill|Location/i, 'LL Help Demo - East Sawmill');
  const notes = page.locator('textarea:visible').first();
  if (await notes.count()) {
    await notes.fill('LL Help Demo processing run for screenshot documentation.');
  }
  const nextButton = page.getByRole('button', { name: /Next/i }).last();
  await nextButton.click({ force: true }).catch(() => {});
  await page.waitForTimeout(1200);
  const tuRow = page.locator('.wizard-tu-row').filter({ hasText: /LL Help Demo|Tally|Transport/i }).first();
  if (await tuRow.count()) {
    await tuRow.click({ force: true });
    await page.waitForTimeout(700);
    await nextButton.click({ force: true }).catch(() => {});
    await page.waitForTimeout(1200);
    await fillAutocomplete(page, /Output Product/i, 'LL Help Demo - Sawn Oak Boards');
    await fillAutocomplete(page, /Output Site|Store/i, 'LL Help Demo - Warehouse Stack A');
    await fillFirstVisibleNumber(page, 4.80, 0);
    await fillFirstVisibleNumber(page, 42, 1);
  }
  await shot(page, 'shipments-31-processing-run-wizard.png');

  await openAppPage(page, '/dashboard-v5', 'Dashboard');
  await shot(page, 'dashboard-v5-full-data.png');

  fs.writeFileSync(path.join(outDir, 'processing-dashboard-v5-recapture-summary.txt'), JSON.stringify({
    authCheck,
    receiveTu3,
    availableInputsCount: Array.isArray(availableInputs.body) ? availableInputs.body.length : null,
    lastUrl: page.url()
  }, null, 2));
  await context.close();
  await browser.close();
})().catch(err => {
  fs.writeFileSync(path.join(outDir, 'processing-dashboard-v5-recapture-error.txt'), err.stack || String(err));
  process.exit(1);
});
