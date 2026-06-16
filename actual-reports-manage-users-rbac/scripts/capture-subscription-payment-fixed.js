const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const {
  baseUrl,
  login,
  dismissOverlays,
  outDir,
  chromiumExecutablePath,
} = require('./vps-doc-helper');

const dir = path.join(outDir, 'screenshots');

async function quiet(page) {
  await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(1800);
  await page
    .locator('.p-progress-spinner,p-progressspinner,.p-skeleton,p-skeleton')
    .first()
    .waitFor({ state: 'detached', timeout: 15000 })
    .catch(() => {});
  await page
    .addStyleTag({
      content:
        '*,*:before,*:after{animation-duration:0s!important;transition-duration:0s!important;caret-color:transparent!important}.p-toast,p-toast,.driver-popover,.driver-overlay{display:none!important}',
    })
    .catch(() => {});
}

async function shot(page, name, overlay = false) {
  if (!overlay) await dismissOverlays(page);
  await quiet(page);
  await page.screenshot({ path: path.join(dir, name), fullPage: true });
  console.log(`captured ${name} ${page.url()}`);
}

async function selectPaidPlan(page) {
  await page.goto(`${baseUrl}/subscriptions#purchase`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await quiet(page);
  await page
    .locator('app-subscription-package,.sp-wrapper')
    .first()
    .waitFor({ timeout: 25000 });

  const preferred = page.locator('.sp-card').filter({ hasText: /Silver|Gold/i }).first();
  if ((await preferred.count()) > 0) {
    await preferred.click({ force: true });
  } else {
    await page.locator('.sp-card').nth(1).click({ force: true });
  }
  await quiet(page);

  const yearly = page.locator('.sp-tenure-section .p-selectbutton .p-button').last();
  if ((await yearly.count()) > 0) {
    await yearly.click({ force: true }).catch(() => {});
    await quiet(page);
  }
}

async function proceedToPayment(page) {
  if (page.url().includes('/payment')) {
    await page.locator('app-payment,.pay-shell').first().waitFor({ timeout: 25000 });
    return;
  }

  const nextButton = page.getByRole('button', { name: /Next/i }).last();
  await nextButton.click({ force: true }).catch(async () => {
    await page.locator('button:has-text("Next")').last().click({ force: true });
  });

  await page.waitForURL(/\/payment(?:$|\?)/, { timeout: 20000 }).catch(() => {});
  await quiet(page);

  if (!/\/payment(?:$|\?)/.test(page.url())) {
    await page.goto(`${baseUrl}/payment`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await quiet(page);
  }

  await page.locator('app-payment,.pay-shell').first().waitFor({ timeout: 25000 });
}

(async () => {
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
  await login(page);

  await selectPaidPlan(page);
  if (page.url().includes('/payment')) {
    await shot(page, 'subscription-component-07-payment-loaded-from-selected-plan.png');
  } else {
    await shot(page, 'subscription-component-07-plan-ready-for-payment.png');
  }

  await proceedToPayment(page);
  await shot(page, 'subscription-component-08-payment-billing-order-summary.png');

  const termsButton = page.locator('.pay-tnc-link').first();
  if ((await termsButton.count()) > 0) {
    await termsButton.click({ force: true });
    await shot(page, 'subscription-component-09-payment-terms-dialog.png', true);
    await page.keyboard.press('Escape').catch(() => {});
  }

  const termsCheck = page.locator('#paymentTerms').first();
  if ((await termsCheck.count()) > 0) {
    await termsCheck.check({ force: true }).catch(async () => {
      await page.locator('p-checkbox[formcontrolname="termsAccepted"]').click({ force: true });
    });
    await quiet(page);
    await shot(page, 'subscription-component-10-payment-ready-to-proceed.png');
  }

  const files = fs.readdirSync(dir).filter((file) => file.endsWith('.png')).sort();
  fs.writeFileSync(path.join(outDir, 'capture-summary.txt'), `${files.join('\n')}\n`);

  await context.close();
  await browser.close();
  console.log(`done ${files.length} screenshots`);
})().catch((error) => {
  console.error(error);
  fs.writeFileSync(
    path.join(outDir, 'capture-subscription-payment-fixed-error.txt'),
    String(error.stack || error),
  );
  process.exit(1);
});
