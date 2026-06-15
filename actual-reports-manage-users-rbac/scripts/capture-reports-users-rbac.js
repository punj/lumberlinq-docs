const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const {
  baseUrl,
  dismissOverlays,
  login,
  openAppPage,
  outDir,
  chromiumExecutablePath,
} = require('./vps-doc-helper');

const screenshotsDir = path.join(outDir, 'screenshots');
const videoDir = path.join(outDir, 'video');
fs.mkdirSync(screenshotsDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

async function stable(page) {
  await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
  await dismissOverlays(page);
  await page.waitForTimeout(1800);
  await page.locator('.p-progress-spinner, p-progressspinner, .p-skeleton, p-skeleton').first().waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
  await page.addStyleTag({ content: `
    *, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; caret-color: transparent !important; }
    .driver-popover, .driver-overlay, .p-toast, p-toast { display: none !important; }
  `}).catch(() => {});
  await page.waitForTimeout(800);
}

async function capture(page, name, opts = {}) {
  await stable(page);
  if (opts.scrollTop !== false) await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  await page.waitForTimeout(500);
  const file = path.join(screenshotsDir, name);
  await page.screenshot({ path: file, fullPage: opts.fullPage !== false });
  console.log(`captured ${name}`);
}

async function generateReport(page) {
  await stable(page);
  const gen = page.locator('button:has-text("Generate"), button:has-text("Refresh")').first();
  if (await gen.isVisible().catch(() => false)) {
    await gen.click({ force: true }).catch(() => {});
    await stable(page);
  }
  await page.locator('p-table, .p-datatable, canvas, .rpt-kpi-grid, .ir-kpi-grid, .ur-stats-row').first().waitFor({ timeout: 25000 }).catch(() => {});
  await stable(page);
}

async function openReport(page, route) {
  await openAppPage(page, `/reports/${route}`);
  await generateReport(page);
}

async function clickTab(page, label) {
  const tab = page.getByText(label, { exact: true }).first();
  await tab.click({ force: true, timeout: 8000 }).catch(async () => {
    await page.locator(`button:has-text("${label}"), .p-tabview-nav li:has-text("${label}")`).first().click({ force: true, timeout: 8000 }).catch(() => {});
  });
  await stable(page);
}

async function openDropdown(page, selectorOrLocator) {
  const loc = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator).first() : selectorOrLocator;
  await loc.click({ force: true, timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(700);
}

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromiumExecutablePath(),
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1100 },
    deviceScaleFactor: 1,
    recordVideo: { dir: videoDir, size: { width: 1600, height: 1100 } },
  });
  await context.route('**/challenges.cloudflare.com/**', route => route.abort()).catch(() => {});
  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  await login(page);

  const reportScreens = [
    ['business-partner', 'reports-01-business-partner-report.png'],
    ['product', 'reports-02-product-report.png'],
    ['loading-site', 'reports-03-loading-site-report.png'],
    ['transport-unit', 'reports-04-transport-unit-report.png'],
    ['tally', 'reports-05-tally-report.png'],
    ['reconciliation', 'reports-06-reconciliation-report.png'],
    ['app-usage', 'reports-07-app-usage-report.png'],
    ['users', 'reports-08-users-report.png'],
  ];
  for (const [route, file] of reportScreens) {
    await openReport(page, route);
    await capture(page, file);
  }

  await openReport(page, 'shipment');
  await capture(page, 'reports-09-shipment-overview.png');
  await clickTab(page, 'Transactions');
  await capture(page, 'reports-10-shipment-transactions-tab.png');
  await clickTab(page, 'Financial');
  await capture(page, 'reports-11-shipment-financial-tab.png');
  await openDropdown(page, '#tms-rpt-export button, .rpt-export-bar button');
  await capture(page, 'reports-12-shipment-export-buttons.png', { fullPage: false });

  await openReport(page, 'financial');
  await capture(page, 'reports-13-financial-overview.png');
  await clickTab(page, 'By Currency');
  await capture(page, 'reports-14-financial-by-currency-tab.png');
  await clickTab(page, 'Partners');
  await capture(page, 'reports-15-financial-partners-tab.png');
  await clickTab(page, 'Trend');
  await capture(page, 'reports-16-financial-trend-tab.png');
  await clickTab(page, 'Transactions');
  await capture(page, 'reports-17-financial-transactions-tab.png');

  await openReport(page, 'inventory');
  await capture(page, 'reports-18-inventory-overview.png');
  await page.getByText('Adjustments', { exact: false }).first().click({ force: true }).catch(() => {});
  await capture(page, 'reports-19-inventory-adjustments-tab.png');
  await page.getByText('Processing Runs', { exact: false }).first().click({ force: true }).catch(() => {});
  await capture(page, 'reports-20-inventory-processing-runs-tab.png');

  await openAppPage(page, '/manage/user');
  await page.locator('#tms-usr-table, .bp-table-wrap').first().waitFor({ timeout: 25000 }).catch(() => {});
  await capture(page, 'users-01-manage-user-list.png');
  await capture(page, 'users-02-pending-invitations.png');

  const invite = page.locator('button:has-text("Invite"), button:has(.pi-user-plus)').first();
  await invite.click({ force: true }).catch(() => {});
  await page.locator('.usr-invite-dialog, p-dialog').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  await capture(page, 'users-03-invite-user-dialog.png', { fullPage: false });
  const textarea = page.locator('textarea[formcontrolname="emailAddresses"], textarea').first();
  await textarea.fill('not-an-email');
  await page.locator('button:has-text("Send"), button:has(.pi-send)').last().click({ force: true }).catch(() => {});
  await page.waitForTimeout(600);
  await capture(page, 'users-04-invite-validation-error.png', { fullPage: false });
  await textarea.fill('new-yard@lumberlinq.example, reporting@lumberlinq.example');
  await openDropdown(page, '.usr-invite-dialog p-dropdown, p-dialog p-dropdown');
  await capture(page, 'users-05-role-template-dropdown.png', { fullPage: false });
  await page.keyboard.press('Escape').catch(() => {});
  await page.keyboard.press('Escape').catch(() => {});
  await stable(page);

  await page.locator('button:has(.pi-shield)').nth(1).click({ force: true }).catch(async () => {
    await page.locator('button:has(.pi-shield)').first().click({ force: true });
  });
  await page.locator('.rbac-panel, p-sidebar').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  await capture(page, 'users-06-access-rights-panel.png', { fullPage: false });
  await openDropdown(page, '.rbac-panel p-dropdown, p-sidebar p-dropdown');
  await capture(page, 'users-07-access-rights-role-template-dropdown.png', { fullPage: false });
  await page.keyboard.press('Escape').catch(() => {});
  await page.locator('.rbac-panel .p-accordion-tab, p-sidebar .p-accordion-tab').first().click({ force: true }).catch(() => {});
  await capture(page, 'users-08-access-rights-permission-groups.png', { fullPage: false });
  await page.keyboard.press('Escape').catch(() => {});
  await stable(page);

  await openAppPage(page, '/settings/rbac');
  await page.locator('.rbac-toggle-card, .rbac-users-card').first().waitFor({ timeout: 25000 }).catch(() => {});
  await capture(page, 'rbac-01-settings-overview.png');
  await page.locator('.rbac-users-card button:has(.pi-shield), button:has-text("Configure")').first().click({ force: true }).catch(() => {});
  await page.locator('.rbac-panel, p-sidebar').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  await capture(page, 'rbac-02-configure-user-sidebar.png', { fullPage: false });
  await page.keyboard.press('Escape').catch(() => {});
  await stable(page);
  await page.locator('button:has-text("Disable"), button:has(.pi-lock-open)').first().click({ force: true }).catch(() => {});
  await page.locator('p-dialog, .p-dialog').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  await capture(page, 'rbac-03-disable-confirmation-dialog.png', { fullPage: false });
  await page.keyboard.press('Escape').catch(() => {});

  await page.setViewportSize({ width: 390, height: 900 });
  await openAppPage(page, '/manage/user');
  await capture(page, 'users-09-mobile-manage-user.png');
  await openAppPage(page, '/reports/financial');
  await generateReport(page);
  await capture(page, 'reports-21-mobile-financial-report.png');

  await page.waitForTimeout(2500);
  await context.close();
  await browser.close();

  const files = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png')).sort();
  fs.writeFileSync(path.join(outDir, 'capture-summary.txt'), files.join('\n') + '\n');
  console.log(`done ${files.length} screenshots`);
}

run().catch(err => {
  console.error(err);
  fs.writeFileSync(path.join(outDir, 'capture-error.txt'), String(err.stack || err));
  process.exit(1);
});
