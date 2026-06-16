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
}

async function shot(page, name) {
  await dismissOverlays(page);
  await quiet(page);
  await page.screenshot({ path: path.join(shotDir, name), fullPage: true });
  console.log(`captured ${name} ${page.url()}`);
}

async function open(page, route, readySelector) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await quiet(page);
  if (readySelector) {
    await page.locator(readySelector).first().waitFor({ timeout: 20000 }).catch(() => {});
  }
}

async function clickTextIfVisible(page, text, timeout = 2000) {
  const loc = page.getByText(text, { exact: true }).last();
  try {
    await loc.waitFor({ state: "visible", timeout });
    await loc.click({ force: true });
    await page.waitForTimeout(800);
    return true;
  } catch (_) {
    return false;
  }
}

async function clickButtonByText(page, text) {
  return page.evaluate((buttonText) => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) => (b.innerText || b.textContent || "").trim() === buttonText);
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  }, text);
}

async function apiLogin(page) {
  const deviceId = "ll-help-docs-utilities-storage";
  const loginResponse = await page.context().request.post(apiBase + "/api/v1/login", {
    headers: { "Content-Type": "application/json", deviceId },
    data: { email, password, deviceId, turnstileToken: null },
  });
  const loginBody = await loginResponse.json().catch(() => ({}));
  if (loginResponse.ok() === false) {
    throw new Error("API login failed: " + loginResponse.status() + " " + JSON.stringify(loginBody));
  }
  if (String(loginBody.redirectUrl || "").includes("confirm-logout-devices")) {
    const confirmResponse = await page.context().request.post(apiBase + "/api/v1/login/confirm-logout-other-devices", {
      headers: { deviceId },
      data: {},
    });
    if (confirmResponse.ok() === false) {
      const confirmText = await confirmResponse.text().catch(() => "");
      throw new Error("Confirm logout devices failed: " + confirmResponse.status() + " " + confirmText);
    }
  }
  await page.goto(baseUrl + "/dashboard-new", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(5000);
  await dismissOverlays(page);
  if (page.url().includes("/login")) {
    throw new Error("API login did not authenticate browser context");
  }
}

async function directLogin(page) {
  await page.goto(baseUrl + "/login?forceLogin=true", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await dismissOverlays(page);
  await clickTextIfVisible(page, "Yes", 1200);
  await dismissOverlays(page);
  await page.locator("input[type=\"email\"]:visible").last().fill(email);
  await page.locator("input[type=\"password\"]:visible").last().fill(password);
  await page.getByRole("button", { name: "Sign In" }).last().click({ force: true });
  await page.waitForTimeout(9000);
  await dismissOverlays(page);
  const body = await page.locator("body").innerText().catch(() => "");
  if (page.url().includes("confirm-logout-devices") || body.includes("A session is already active")) {
    await clickButtonByText(page, "Yes");
    await page.waitForLoadState("networkidle", { timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(10000);
    await dismissOverlays(page);
  }
  if (page.url().includes("/login")) {
    throw new Error("Login did not leave the login page");
  }
}

async function fillFirstVisible(page, selector, value) {
  const loc = page.locator(selector).first();
  if ((await loc.count()) > 0) {
    await loc.fill(String(value)).catch(async () => {
      await loc.click({ force: true }).catch(() => {});
      await page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A').catch(() => {});
      await page.keyboard.type(String(value)).catch(() => {});
    });
  }
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

  await open(page, '/utility/unit-conversion', '.bpf-card');
  await fillFirstVisible(page, '#decimalPlaces', '3');
  await fillFirstVisible(page, 'input#false, input[aria-valuenow], input.p-inputnumber-input', '12');
  await page.getByRole('button', { name: /Add/i }).last().click({ force: true }).catch(() => {});
  await quiet(page);
  await shot(page, 'utilities-01-unit-conversion.png');

  await open(page, '/utility/volume-estimates', '.bpf-card');
  const numberInputs = page.locator('input.p-inputnumber-input');
  const values = ['10', '2', '8', '950', '25'];
  const count = Math.min(await numberInputs.count(), values.length);
  for (let i = 0; i < count; i += 1) {
    await numberInputs.nth(i).fill(values[i]).catch(() => {});
  }
  await quiet(page);
  await shot(page, 'utilities-02-volume-estimates.png');

  await page.locator('p-checkbox').first().click({ force: true }).catch(() => {});
  await quiet(page);
  await shot(page, 'utilities-03-volume-common-units-toggle.png');

  await open(page, '/utility/slab-generator', '.bpf-card');
  const slabInputs = page.locator('input.p-inputnumber-input');
  const slabValues = ['1200', '0.25', '25', '0.25', '8', '8'];
  const slabCount = Math.min(await slabInputs.count(), slabValues.length);
  for (let i = 0; i < slabCount; i += 1) {
    await slabInputs.nth(i).fill(slabValues[i]).catch(() => {});
  }
  await page.getByRole('button', { name: /Calculate/i }).last().click({ force: true }).catch(() => {});
  await quiet(page);
  await shot(page, 'utilities-04-slab-generator-inputs.png');
  await page.getByText(/Slab Price/i).last().click({ force: true }).catch(() => {});
  await quiet(page);
  await shot(page, 'utilities-05-slab-generator-results.png');

  await open(page, '/storage', '.stor-shell');
  await shot(page, 'storage-01-usage-and-files.png');
  await page.getByRole('button').filter({ has: page.locator('.pi-refresh') }).first().click({ force: true }).catch(() => {});
  await quiet(page);
  await shot(page, 'storage-02-refreshed-usage.png');

  const files = fs.readdirSync(shotDir).filter((file) => file.endsWith('.png')).sort();
  fs.writeFileSync(path.join(outDir, 'screenshot-inventory.txt'), `${files.join('\n')}\n`);
  await context.close();
  await browser.close();
  console.log(`done ${files.length} screenshots`);
})().catch((error) => {
  console.error(error);
  fs.writeFileSync(path.join(outDir, 'capture-error.txt'), String(error.stack || error));
  process.exit(1);
});
