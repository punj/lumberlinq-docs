const path = require('path');
const { chromium } = require('playwright-core');
const { baseUrl, chromiumExecutablePath, dismissOverlays, login } = require('./vps-doc-helper');
const seed = require('../seed-result.json');

const screenshotDir = path.resolve(__dirname, '..', 'screenshots');

async function waitClean(page) {
  await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(3500);
  await dismissOverlays(page);
  await page.locator('.p-progress-spinner, .p-skeleton, .tally-skeleton').first().waitFor({ state: 'hidden', timeout: 12000 }).catch(() => {});
}

async function openTally(page, encodedId) {
  await page.goto(`${baseUrl}/new-tallysheet?transportId=${encodeURIComponent(encodedId)}&source=navigated`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitClean(page);
  await page.locator('app-tallysheet-list-round, app-tallysheet-list-square').first().waitFor({ state: 'visible', timeout: 45000 });
}

async function expandSettings(page, moduleSelector) {
  const panel = page.locator(`${moduleSelector} .settings-panel`).first();
  await panel.waitFor({ state: 'visible', timeout: 15000 });
  const contentVisible = await panel.locator('.p-toggleable-content').first().isVisible().catch(() => false);
  if (!contentVisible) {
    await panel.locator('.p-panel-header').first().click({ force: true });
    await page.waitForTimeout(1200);
  }
  return panel;
}

async function shot(page, name, locator) {
  await locator.screenshot({ path: path.join(screenshotDir, name), animations: 'disabled' });
  console.log(path.join(screenshotDir, name));
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chromiumExecutablePath(), args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1200 }, ignoreHTTPSErrors: true });
  await context.route('**/challenges.cloudflare.com/**', route => route.abort());
  const page = await context.newPage();
  await login(page);

  await openTally(page, seed.round.encodedId);
  const roundPanel = await expandSettings(page, 'app-tallysheet-list-round');
  await page.getByText('Validation Rules', { exact: true }).first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(800);
  await shot(page, 'round-settings-validation-rules.png', page.locator('app-tallysheet-list-round').first());
  await page.getByText('Configuration Settings', { exact: true }).first().click({ force: true });
  await page.waitForTimeout(800);
  await shot(page, 'round-settings-configuration.png', page.locator('app-tallysheet-list-round').first());

  await openTally(page, seed.square.encodedId);
  const squarePanel = await expandSettings(page, 'app-tallysheet-list-square');
  await page.getByText('Configuration Settings', { exact: true }).first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(800);
  await shot(page, 'square-settings-configuration.png', page.locator('app-tallysheet-list-square').first());

  await browser.close();
})();
