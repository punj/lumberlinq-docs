const path = require('path');
const fs = require('fs');
const { chromium } = require('/home/punj/projects/lumberlinq-help-preview/actual-reports-manage-users-rbac/node_modules/playwright-core');
const {
  apiBase,
  baseUrl,
  dismissOverlays,
  chromiumExecutablePath,
} = require('/home/punj/projects/lumberlinq-help-preview/actual-reports-manage-users-rbac/scripts/vps-doc-helper');

const outDir = path.resolve(__dirname, '..');
const shotDir = path.join(outDir, 'screenshots');
const email = process.env.LL_DOC_EMAIL || 'shiv-vps@mahadev.com';
const password = process.env.LL_DOC_PASSWORD || 'Ganpatiji1';

async function quiet(page) {
  await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(1800);
  await page
    .locator('.p-progress-spinner,p-progressspinner,.p-skeleton,p-skeleton')
    .first()
    .waitFor({ state: 'detached', timeout: 12000 })
    .catch(() => {});
  await page.addStyleTag({
    content:
      '*,*:before,*:after{animation-duration:0s!important;transition-duration:0s!important;caret-color:transparent!important}.p-toast,p-toast,.driver-popover,.driver-overlay{display:none!important}',
  }).catch(() => {});
  await dismissOverlays(page);
}

async function shot(page, name) {
  await quiet(page);
  await page.screenshot({ path: path.join(shotDir, name), fullPage: true });
  console.log(`captured ${name} ${page.url()}`);
}

async function apiLogin(page) {
  const deviceId = 'll-help-docs-profile-account';
  const loginResponse = await page.context().request.post(apiBase + '/api/v1/login', {
    headers: { 'Content-Type': 'application/json', deviceId },
    data: { email, password, deviceId, turnstileToken: null },
  });
  const loginBody = await loginResponse.json().catch(() => ({}));
  if (loginResponse.ok() === false) {
    throw new Error('API login failed: ' + loginResponse.status() + ' ' + JSON.stringify(loginBody));
  }
  if (String(loginBody.redirectUrl || '').includes('confirm-logout-devices')) {
    const confirmResponse = await page.context().request.post(apiBase + '/api/v1/login/confirm-logout-other-devices', {
      headers: { deviceId },
      data: {},
    });
    if (confirmResponse.ok() === false) {
      const confirmText = await confirmResponse.text().catch(() => '');
      throw new Error('Confirm logout devices failed: ' + confirmResponse.status() + ' ' + confirmText);
    }
  }
  await page.goto(baseUrl + '/dashboard-new', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await quiet(page);
  if (page.url().includes('/login')) {
    throw new Error('API login did not authenticate browser context');
  }
}

async function openProfile(page) {
  await page.goto(baseUrl + '/edit/account-details', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await quiet(page);
  if (page.url().includes('/login')) {
    throw new Error('Profile route redirected to login');
  }
  await page.locator('body').waitFor({ state: 'visible', timeout: 20000 });
}

async function clickFirstVisible(page, selectors) {
  for (const selector of selectors) {
    const loc = page.locator(selector).first();
    if ((await loc.count()) > 0) {
      await loc.click({ force: true, timeout: 4000 }).catch(() => {});
      return true;
    }
  }
  return false;
}

(async () => {
  fs.mkdirSync(shotDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromiumExecutablePath(),
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1100 },
    recordVideo: { dir: path.join(outDir, 'video'), size: { width: 1600, height: 1100 } },
  });
  await context.route('**/challenges.cloudflare.com/**', (route) => route.abort()).catch(() => {});
  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  await apiLogin(page);
  await openProfile(page);
  await shot(page, 'profile-01-account-details.png');

  await page.getByText(/Timezone|Your Timezone/i).first().scrollIntoViewIfNeeded({ timeout: 6000 }).catch(() => {});
  await shot(page, 'profile-02-timezone-section.png');

  await openProfile(page);
  await clickFirstVisible(page, [
    'button:has-text("Change Password")',
    'button:has-text("changePassword")',
    'p-button:has-text("Change Password") button',
  ]);
  await page.locator('p-dialog,.p-dialog').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  await shot(page, 'profile-03-change-password-dialog.png');

  const files = fs.readdirSync(shotDir).filter((file) => file.endsWith('.png')).sort();
  fs.writeFileSync(path.join(outDir, 'screenshot-inventory.txt'), `${files.join('\n')}\n`);
  await context.close();
  await browser.close();
  console.log(`done ${files.length} screenshots`);
})().catch((error) => {
  console.error(error);
  fs.writeFileSync(path.join(outDir, 'profile-capture-error.txt'), String(error.stack || error));
  process.exit(1);
});
