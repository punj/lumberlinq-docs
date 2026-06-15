const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { apiBase, dismissOverlays, login, openAppPage, outDir, chromiumExecutablePath } = require('./vps-doc-helper');

const screenshotsDir = path.join(outDir, 'screenshots');
const videoDir = path.join(outDir, 'video');
fs.mkdirSync(screenshotsDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

async function stable(page) {
  await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
  await dismissOverlays(page);
  await page.waitForTimeout(1200);
  await page.locator('.p-progress-spinner, p-progressspinner, .p-skeleton, p-skeleton').first().waitFor({ state: 'detached', timeout: 12000 }).catch(() => {});
  await page.addStyleTag({ content: `*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; caret-color: transparent !important; } .driver-popover,.driver-overlay,.p-toast,p-toast{display:none!important;}` }).catch(() => {});
}
async function capture(page, name, opts = {}) {
  if (opts.noStable) {
    await page.waitForTimeout(700);
  } else {
    await stable(page);
  }
  if (opts.scrollTop !== false) await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotsDir, name), fullPage: opts.fullPage !== false });
  console.log(`captured ${name}`);
}
async function fillVisibleTextarea(page, value) {
  const ok = await page.evaluate((v) => {
    const areas = Array.from(document.querySelectorAll('textarea'));
    const visible = areas.find(el => {
      const r = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
    });
    if (!visible) return false;
    visible.focus();
    visible.value = v;
    visible.dispatchEvent(new Event('input', { bubbles: true }));
    visible.dispatchEvent(new Event('change', { bubbles: true }));
    visible.dispatchEvent(new Event('blur', { bubbles: true }));
    return true;
  }, value);
  if (!ok) throw new Error('No visible textarea found');
}
async function openFirstDropdown(page, scope = '') {
  const sel = scope ? `${scope} p-dropdown, ${scope} .p-dropdown` : 'p-dropdown, .p-dropdown';
  await page.locator(sel).first().click({ force: true, timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(700);
}

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath: chromiumExecutablePath(), args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  const context = await browser.newContext({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1, recordVideo: { dir: videoDir, size: { width: 1600, height: 1100 } } });
  await context.route('**/challenges.cloudflare.com/**', route => route.abort()).catch(() => {});
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  await login(page);

  await page.evaluate(async ({ apiBase }) => {
    await fetch(`${apiBase}/api/v1/rbac/enable`, { method: 'POST', credentials: 'include' }).catch(() => null);
  }, { apiBase });

  await openAppPage(page, '/manage/user');
  await page.locator('#tms-usr-table, .bp-table-wrap').first().waitFor({ timeout: 25000 }).catch(() => {});
  await capture(page, 'users-01-manage-user-list.png');
  await capture(page, 'users-02-pending-invitations.png');

  await page.getByRole('button', { name: /Invite User/i }).click({ force: true }).catch(async () => {
    await page.locator('button.bp-btn-new').first().click({ force: true });
  });
  await page.locator('.p-dialog, p-dialog, [role="dialog"]').first().waitFor({ state: 'visible', timeout: 12000 }).catch(() => {});
  await capture(page, 'users-03-invite-user-dialog.png', { fullPage: false, noStable: true });
  await fillVisibleTextarea(page, 'not-an-email');
  await page.locator('button:has-text("Send"), button:has(.pi-send)').last().click({ force: true }).catch(() => {});
  await page.waitForTimeout(800);
  await capture(page, 'users-04-invite-validation-error.png', { fullPage: false, noStable: true });
  await fillVisibleTextarea(page, 'll-help-demo-new-yard@lumberlinq.example, ll-help-demo-reporting@lumberlinq.example');
  await openFirstDropdown(page, '.p-dialog');
  await capture(page, 'users-05-role-template-dropdown.png', { fullPage: false, noStable: true });
  await page.keyboard.press('Escape').catch(() => {});
  await page.keyboard.press('Escape').catch(() => {});
  await stable(page);

  const shieldButtons = page.locator('button:has(.pi-shield)');
  const count = await shieldButtons.count().catch(() => 0);
  await shieldButtons.nth(Math.min(1, Math.max(0, count - 1))).click({ force: true }).catch(async () => shieldButtons.first().click({ force: true }));
  await page.locator('.rbac-panel, p-sidebar').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  await capture(page, 'users-06-access-rights-panel.png', { fullPage: false, noStable: true });
  await openFirstDropdown(page, '.rbac-panel');
  await capture(page, 'users-07-access-rights-role-template-dropdown.png', { fullPage: false, noStable: true });
  await page.keyboard.press('Escape').catch(() => {});
  await page.locator('.rbac-panel .p-accordion-header, p-sidebar .p-accordion-header').first().click({ force: true }).catch(() => {});
  await capture(page, 'users-08-access-rights-permission-groups.png', { fullPage: false, noStable: true });
  await page.keyboard.press('Escape').catch(() => {});

  await openAppPage(page, '/settings/rbac');
  await page.locator('.rbac-toggle-card, .rbac-users-card').first().waitFor({ timeout: 25000 }).catch(() => {});
  await capture(page, 'rbac-01-settings-overview.png');
  await page.locator('.rbac-users-card button:has(.pi-shield), button:has-text("Configure")').first().click({ force: true }).catch(() => {});
  await page.locator('.rbac-panel, p-sidebar').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  await capture(page, 'rbac-02-configure-user-sidebar.png', { fullPage: false, noStable: true });
  await page.keyboard.press('Escape').catch(() => {});
  await stable(page);
  await page.locator('button:has-text("Disable"), button:has(.pi-lock-open)').first().click({ force: true }).catch(() => {});
  await page.locator('.p-dialog, p-dialog').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  await capture(page, 'rbac-03-disable-confirmation-dialog.png', { fullPage: false, noStable: true });
  await page.keyboard.press('Escape').catch(() => {});

  await page.setViewportSize({ width: 390, height: 900 });
  await openAppPage(page, '/manage/user');
  await capture(page, 'users-09-mobile-manage-user.png');
  await openAppPage(page, '/reports/financial');
  await page.locator('button:has-text("Generate"), button:has-text("Refresh")').first().click({ force: true }).catch(() => {});
  await stable(page);
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
  fs.writeFileSync(path.join(outDir, 'capture-error-users-rbac.txt'), String(err.stack || err));
  process.exit(1);
});
