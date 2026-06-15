const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');
const {
  baseUrl,
  chromiumExecutablePath,
  dismissOverlays,
  login,
} = require('./vps-doc-helper');

const outDir = path.resolve(__dirname, '..');
const screenshotDir = path.join(outDir, 'screenshots');
const seed = require('../seed-result.json');

async function waitClean(page) {
  await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await dismissOverlays(page);
  await page.locator('.p-progress-spinner, .p-skeleton, .tally-skeleton, .tu-stat-loading').first().waitFor({ state: 'hidden', timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(800);
}

async function openRoute(page, route) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitClean(page);
}

async function openTally(page, encodedId) {
  await openRoute(page, `/new-tallysheet?transportId=${encodeURIComponent(encodedId)}&source=navigated`);
  await page.locator('app-transport-unit').first().waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('app-tallysheet-list-round, app-tallysheet-list-square').first().waitFor({ state: 'visible', timeout: 45000 });
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

async function clickVisible(page, selectorOrText, isText = false) {
  const loc = isText ? page.getByText(selectorOrText, { exact: true }).first() : page.locator(selectorOrText).first();
  await loc.waitFor({ state: 'visible', timeout: 15000 });
  await loc.click({ force: true });
  await page.waitForTimeout(1000);
  await dismissOverlays(page);
}

async function openSettings(page, moduleSelector) {
  const panel = page.locator(`${moduleSelector} p-panel`).first();
  await panel.waitFor({ state: 'visible', timeout: 15000 });
  const bodyVisible = await panel.locator('.p-toggleable-content').first().isVisible().catch(() => false);
  if (!bodyVisible) {
    await panel.locator('.p-panel-header').first().click({ force: true });
    await page.waitForTimeout(900);
  }
}

async function openExportMenu(page, moduleSelector) {
  const menuButton = page.locator(`${moduleSelector} .p-splitbutton-menubutton:visible`).first();
  await menuButton.waitFor({ state: 'visible', timeout: 15000 });
  await menuButton.click({ force: true });
  await page.locator('.p-menu, .p-tieredmenu, .p-contextmenu').last().waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(500);
}

async function callComponentMethod(page, moduleSelector, methodName) {
  await page.evaluate(({ moduleSelector, methodName }) => {
    const roots = Array.from(document.querySelectorAll(moduleSelector));
    const all = roots.length ? roots : Array.from(document.querySelectorAll("*"));
    const seen = new Set();
    function scan(value, depth = 0) {
      if (!value || depth > 5 || seen.has(value)) return null;
      if (typeof value === "object" || typeof value === "function") seen.add(value);
      if (value && typeof value[methodName] === "function") return value;
      if (Array.isArray(value)) {
        for (const item of value) { const found = scan(item, depth + 1); if (found) return found; }
      } else if (typeof value === "object") {
        for (const key of Object.keys(value).slice(0, 120)) { const found = scan(value[key], depth + 1); if (found) return found; }
      }
      return null;
    }
    for (const el of all) {
      const found = scan(el.__ngContext__);
      if (found) { found[methodName](); return; }
    }
    throw new Error(`Unable to locate component method `);
  }, { moduleSelector, methodName });
}

async function openAdvancedExportDialog(page, moduleSelector) {
  await page.evaluate((moduleSelector) => {
    const host = document.querySelector(moduleSelector);
    const seen = new Set();
    function scan(value, depth = 0) {
      if (!value || depth > 3 || seen.has(value)) return null;
      if (typeof value === 'object' || typeof value === 'function') seen.add(value);
      if (value && typeof value.openExportDialog === 'function') return value;
      if (Array.isArray(value)) {
        for (const item of value) { const found = scan(item, depth + 1); if (found) return found; }
      } else if (typeof value === 'object') {
        for (const key of Object.keys(value).slice(0, 80)) { const found = scan(value[key], depth + 1); if (found) return found; }
      }
      return null;
    }
    const component = scan(host && host.__ngContext__);
    if (!component) throw new Error('Unable to locate tallysheet component instance');
    component.openExportDialog();
  }, moduleSelector);
  await page.locator('.p-dialog:visible').last().waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForTimeout(1000);
}

async function openImportDialog(page, moduleSelector) {
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(300);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll("app-tallysheet-list-round .grid-toolbar button, app-tallysheet-list-square .grid-toolbar button")).find(x => (x.innerText || x.textContent || "").trim() === "Import"); if (!b) throw new Error("Import button not found"); const r = b.getBoundingClientRect(); window.__llClickPoint = { x: r.x + r.width/2, y: r.y + r.height/2 }; });
  const importPoint = await page.evaluate(() => window.__llClickPoint);
  await page.mouse.click(importPoint.x, importPoint.y);
  await page.locator('.p-dialog:visible').last().waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForTimeout(1000);
}

async function openAiImportDialog(page, moduleSelector) {
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(300);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll("app-tallysheet-list-round .grid-toolbar button, app-tallysheet-list-square .grid-toolbar button")).find(x => (x.innerText || x.textContent || "").trim() === "AI Import"); if (!b) throw new Error("AI Import button not found"); const r = b.getBoundingClientRect(); window.__llClickPoint = { x: r.x + r.width/2, y: r.y + r.height/2 }; });
  const aiPoint = await page.evaluate(() => window.__llClickPoint);
  await page.mouse.click(aiPoint.x, aiPoint.y);
  await page.locator('.p-dialog:visible').last().waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForTimeout(1200);
}

async function closeDialog(page) {
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(700);
  await page.locator('.p-dialog:visible .p-dialog-header-close').last().click({ force: true, timeout: 1000 }).catch(() => {});
  await page.waitForTimeout(700);
}

async function fitSquareGrid(page) {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.addStyleTag({
    content: `
      app-tallysheet-list-square .ag-root-wrapper { transform: scale(.88); transform-origin: top left; width: 113.5% !important; }
      app-tallysheet-list-square .tally-grid { min-height: 590px; }
      app-tallysheet-list-square .ag-header-cell-text,
      app-tallysheet-list-square .ag-cell { font-size: 12px !important; }
      app-tallysheet-list-square .grid-toolbar-row { flex-wrap: nowrap !important; }
    `,
  });
  await page.waitForTimeout(800);
}

async function showActionTooltip(page, moduleSelector) {
  const actionButton = page.locator(` .acr-add:visible`).first();
  await actionButton.hover({ force: true, timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(900);
}

async function createUnsavedStatus(page) {
  const firstEditable = page.locator('.ag-center-cols-container .ag-cell[col-id="length_cm"], .ag-center-cols-container .ag-cell[col-id="length_display"]').first();
  await firstEditable.dblclick({ force: true });
  await page.keyboard.press('ArrowUp').catch(() => {});
  await page.waitForTimeout(1000);
}

async function main() {
  fs.mkdirSync(screenshotDir, { recursive: true });
  const executablePath = chromiumExecutablePath();
  if (!executablePath) throw new Error('Chromium executable not found');
  const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ignoreHTTPSErrors: true });
  await context.route('**/challenges.cloudflare.com/**', (route) => route.abort());
  const page = await context.newPage();

  await login(page);

  await openTally(page, seed.round.encodedId);
  await openSettings(page, 'app-tallysheet-list-round');
  await shot(page, 'round-settings-validation-rules.png', 'app-tallysheet-list-round .settings-panel');
  await page.getByText('Configuration Settings', { exact: true }).first().click({ force: true });
  await page.waitForTimeout(800);
  await shot(page, 'round-settings-configuration.png', 'app-tallysheet-list-round .settings-panel');
  await page.getByText('Validation Rules', { exact: true }).first().click({ force: true }).catch(() => {});
  await showActionTooltip(page, 'app-tallysheet-list-round');
  await shot(page, 'round-row-actions-add-delete.png', 'app-tallysheet-list-round .ag-root-wrapper');
  await openExportMenu(page, 'app-tallysheet-list-round');
  await shot(page, 'round-export-menu.png');
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(500);
  await createUnsavedStatus(page);
  await shot(page, 'round-statusbar-unsaved.png', 'app-tally-status-bar');
  await page.locator('app-tallysheet-list-round button:has-text("Save"):visible').first().click({ force: true });
  await page.waitForTimeout(1600);
  await shot(page, 'round-statusbar-saved.png', 'app-tally-status-bar');

  await openTally(page, seed.square.encodedId);
  await fitSquareGrid(page);
  await shot(page, 'square-entry-grid-fit-all-columns.png', 'app-tallysheet-list-square');
  await shot(page, 'square-width-thickness-length-pieces-entry-fit.png', '.ag-root-wrapper');
  await shot(page, 'square-volume-calculation-fit.png', '.ag-root-wrapper');
  await openSettings(page, 'app-tallysheet-list-square');
  await shot(page, 'square-settings-configuration.png', 'app-tallysheet-list-square .settings-panel');
  await showActionTooltip(page, 'app-tallysheet-list-square');
  await shot(page, 'square-row-actions-add-delete.png', 'app-tallysheet-list-square .ag-root-wrapper');
  await openExportMenu(page, 'app-tallysheet-list-square');
  await shot(page, 'square-export-menu.png');
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(500);
  await createUnsavedStatus(page);
  await shot(page, 'square-statusbar-unsaved.png', 'app-tally-status-bar');
  await page.locator('app-tallysheet-list-square button:has-text("Save"):visible').first().click({ force: true });
  await page.waitForTimeout(1600);
  await shot(page, 'square-statusbar-saved.png', 'app-tally-status-bar');

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
