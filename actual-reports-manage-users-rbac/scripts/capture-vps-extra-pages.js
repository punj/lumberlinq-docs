const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { baseUrl, apiBase, login, openAppPage, dismissOverlays, outDir, chromiumExecutablePath } = require('./vps-doc-helper');
const screenshotsDir = path.join(outDir, 'screenshots');
const videoDir = path.join(outDir, 'video');
fs.mkdirSync(screenshotsDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

async function quiet(page) {
  await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(()=>{});
  await page.waitForTimeout(1500);
  await page.locator('.p-progress-spinner,p-progressspinner,.p-skeleton,p-skeleton').first().waitFor({state:'detached', timeout:12000}).catch(()=>{});
  await page.addStyleTag({content:`*,*:before,*:after{animation-duration:0s!important;transition-duration:0s!important;caret-color:transparent!important}.driver-popover,.driver-overlay,.p-toast,p-toast{display:none!important}`}).catch(()=>{});
}
async function stable(page) { await dismissOverlays(page); await quiet(page); }
async function shot(page, name, opts={}) {
  if (opts.keepOverlay) await quiet(page); else await stable(page);
  if (opts.scrollTop !== false) await page.evaluate(()=>window.scrollTo(0,0)).catch(()=>{});
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, name), fullPage: opts.fullPage !== false });
  console.log('captured '+name);
}
async function openAndShot(page, route, file, ready) {
  await openAppPage(page, route, ready);
  await shot(page, file);
}
async function generateReport(page) {
  await stable(page);
  await page.locator('button:has-text("Generate"),button:has-text("Refresh")').first().click({force:true}).catch(()=>{});
  await quiet(page);
  await page.locator('canvas,.p-datatable,.rpt-kpi-grid,.ir-kpi-grid').first().waitFor({timeout:20000}).catch(()=>{});
}
async function clickText(page, text) {
  await page.getByText(text, { exact: false }).first().click({ force: true, timeout: 8000 }).catch(()=>{});
  await quiet(page);
}
async function clickButton(page, re) {
  await page.getByRole('button', { name: re }).click({ force: true, timeout: 8000 }).catch(async()=>{
    await page.locator(`button:has-text("${String(re).replace(/\//g,'').replace(/i$/,'')}")`).first().click({force:true,timeout:4000}).catch(()=>{});
  });
  await page.waitForTimeout(800);
}
async function captureBpReport(page) {
  await openAppPage(page, '/reports/business-partner');
  await stable(page);
  const input = page.locator('.rpt-autocomplete input, p-autocomplete input, input[role="combobox"]').first();
  await input.fill('Harborline');
  await page.waitForTimeout(1200);
  await page.keyboard.press('ArrowDown').catch(()=>{});
  await page.keyboard.press('Enter').catch(()=>{});
  await page.waitForTimeout(800);
  await page.locator('button:has-text("Generate"), button:has(.pi-chart-bar)').first().click({force:true}).catch(()=>{});
  await quiet(page);
  await page.locator('.rpt-profile-card,.rpt-kpi-grid').first().waitFor({timeout:25000}).catch(()=>{});
  await shot(page, 'reports-01-business-partner-report.png');
}
async function captureReports(page) {
  await captureBpReport(page);
  await openAppPage(page, '/reports/product'); await generateReport(page); await shot(page, 'reports-02-product-report.png');
  await openAppPage(page, '/reports/loading-site'); await generateReport(page); await shot(page, 'reports-03-loading-site-report.png');
  await openAppPage(page, '/reports/tally'); await generateReport(page); await shot(page, 'reports-05-tally-report.png');
  await openAppPage(page, '/reports/financial'); await generateReport(page); await clickText(page, 'Trend'); await shot(page, 'reports-16-financial-trend-tab.png');
}
async function captureInventory(page) {
  await openAndShot(page, '/inventory/overview', 'inventory-01-overview-rich.png', 'Inventory');
  await page.locator('.inv-site-header').first().click({force:true}).catch(()=>{}); await shot(page, 'inventory-02-overview-expanded-site.png');
  await openAndShot(page, '/inventory/in-out', 'inventory-03-in-out-ledger.png');
  await page.getByText('Adjustment', {exact:false}).first().click({force:true}).catch(async()=>{ await page.locator('button:has(.pi-sliders-h)').first().click({force:true}).catch(()=>{}); });
  await page.locator('.adj-dialog,.p-dialog').first().waitFor({state:'visible',timeout:10000}).catch(()=>{}); await shot(page, 'inventory-04-adjustment-dialog.png', {keepOverlay:true, fullPage:false});
  await page.keyboard.press('Escape').catch(()=>{});
  await openAndShot(page, '/inventory/processing', 'inventory-05-processing-runs.png');
  await page.locator('button:has(.pi-plus), button:has-text("New")').first().click({force:true}).catch(()=>{});
  await page.locator('.inv-wizard-dialog,.p-dialog').first().waitFor({state:'visible',timeout:10000}).catch(()=>{}); await shot(page, 'inventory-06-processing-wizard-step-1.png', {keepOverlay:true, fullPage:false});
  await page.locator('.p-dialog button:has-text("Next"), .p-dialog button:has(.pi-angle-right)').first().click({force:true}).catch(()=>{}); await page.waitForTimeout(800); await shot(page, 'inventory-07-processing-wizard-input-tus.png', {keepOverlay:true, fullPage:false});
  await page.keyboard.press('Escape').catch(()=>{});
}
async function captureCompanyAndSettings(page) {
  await openAndShot(page, '/company', 'company-01-details-identity-company-id.png');
  await clickText(page, 'Location'); await shot(page, 'company-02-details-location-tab.png');
  await clickText(page, 'Profile'); await shot(page, 'company-03-details-profile-tab.png');
  await openAndShot(page, '/company/branding', 'company-04-branding-logo.png');
  await openAndShot(page, '/subscriptions', 'subscriptions-01-plan-selection.png');
  await page.locator('.plan-card').first().click({force:true}).catch(()=>{}); await shot(page, 'subscriptions-02-plan-selected.png');
  await openAndShot(page, '/settings/rbac', 'rbac-01-settings-overview.png');
  await page.locator('button:has-text("Configure"), .rbac-users-card button:has(.pi-shield)').first().click({force:true}).catch(()=>{});
  await page.locator('.rbac-panel,p-sidebar').first().waitFor({state:'visible',timeout:10000}).catch(()=>{}); await shot(page, 'rbac-02-configure-user-sidebar.png', {keepOverlay:true, fullPage:false});
  await page.keyboard.press('Escape').catch(()=>{});
  await openAndShot(page, '/fields-access', 'fields-access-01-shipment-fields.png');
  await openAndShot(page, '/tallysheet-fields-access', 'fields-access-02-tallysheet-fields.png');
  await openAndShot(page, '/new-tallysheet/view-trans', 'tallysheet-transport-01-view-trans.png');
}
async function captureSupport(page) {
  await openAndShot(page, '/support/tickets', 'support-01-ticket-list-rich.png');
  await page.locator('.tkt-card').first().click({force:true}).catch(()=>{}); await quiet(page); await shot(page, 'support-02-ticket-detail.png');
  await openAndShot(page, '/support/tickets/new', 'support-03-new-ticket-form.png');
  await page.locator('input[formcontrolname="title"], input').last().fill('Demo support request for documentation').catch(()=>{});
  await page.locator('textarea[formcontrolname="description"], textarea').first().fill('This screenshot shows the support ticket form with category, priority, description, and attachments.').catch(()=>{});
  await page.locator('p-dropdown').first().click({force:true}).catch(()=>{}); await shot(page, 'support-04-new-ticket-category-dropdown.png', {keepOverlay:true, fullPage:false});
  await page.keyboard.press('Escape').catch(()=>{});
}
async function captureHeaderI18n(page) {
  await openAppPage(page, '/dashboard-v5'); await stable(page); await shot(page, 'global-01-header-company-id-help-font-theme.png', {fullPage:false});
  await page.locator('p-dropdown, .p-dropdown').first().click({force:true}).catch(()=>{}); await shot(page, 'global-02-language-dropdown.png', {keepOverlay:true, fullPage:false}); await page.keyboard.press('Escape').catch(()=>{});
  await page.locator('#tms-tour-darkmode, button:has(.pi-moon), button:has(.pi-sun)').first().click({force:true}).catch(()=>{}); await page.waitForTimeout(1000); await shot(page, 'global-03-night-view.png', {fullPage:false});
  await page.locator('#tms-tour-help, button:has(.pi-question-circle)').first().click({force:true}).catch(()=>{}); await page.waitForTimeout(1000); await shot(page, 'global-04-help-button-tour.png', {keepOverlay:true, fullPage:false});
}
async function captureSignup(page) {
  await page.goto(`${baseUrl}/login`, {waitUntil:'domcontentloaded', timeout:60000}); await page.waitForTimeout(3000); await dismissOverlays(page);
  await shot(page, 'signup-01-login-language-entry.png');
  await page.getByText(/Sign Up|sign up|Create/i).last().click({force:true}).catch(async()=>{ await page.locator('a,button').filter({hasText:/sign up/i}).last().click({force:true}).catch(()=>{}); });
  await page.waitForTimeout(1200); await shot(page, 'signup-02-new-user-sign-up-form.png');
}
async function run() {
  const browser = await chromium.launch({ headless:true, executablePath:chromiumExecutablePath(), args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'] });
  const context = await browser.newContext({ viewport:{width:1600,height:1100}, deviceScaleFactor:1, recordVideo:{dir:videoDir,size:{width:1600,height:1100}} });
  await context.route('**/challenges.cloudflare.com/**', r=>r.abort()).catch(()=>{});
  const page = await context.newPage(); page.setDefaultTimeout(30000);
  await login(page);
  await captureReports(page);
  await captureInventory(page);
  await captureCompanyAndSettings(page);
  await captureSupport(page);
  await captureHeaderI18n(page);
  await captureSignup(page);
  await context.close(); await browser.close();
  const files = fs.readdirSync(screenshotsDir).filter(f=>f.endsWith('.png')).sort();
  fs.writeFileSync(path.join(outDir,'capture-summary.txt'), files.join('\n')+'\n');
  console.log(`done ${files.length} screenshots`);
}
run().catch(e=>{ console.error(e); fs.writeFileSync(path.join(outDir,'capture-extra-error.txt'), String(e.stack||e)); process.exit(1); });
