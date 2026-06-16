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
    .waitFor({ state: 'detached', timeout: 12000 })
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

async function goto(page, route) {
  await page.goto(`${baseUrl}${route}`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await quiet(page);
}

async function selectPaidPlanIfNeeded(page) {
  await goto(page, '/subscriptions#purchase');
  await page.locator('app-subscription-package,.sp-wrapper').first().waitFor({ timeout: 25000 });
  const paidPlan = page.locator('.sp-card').filter({ hasText: /Silver|Gold/i }).first();
  if ((await paidPlan.count()) > 0) {
    await paidPlan.click({ force: true });
  } else {
    await page.locator('.sp-card').nth(1).click({ force: true });
  }
  await quiet(page);
  const yearly = page.locator('.sp-tenure-section .p-selectbutton .p-button').last();
  if ((await yearly.count()) > 0) {
    await yearly.click({ force: true }).catch(() => {});
    await quiet(page);
  }
  if (!page.url().includes('/payment')) {
    await page.getByRole('button', { name: /Next/i }).last().click({ force: true }).catch(async () => {
      await page.locator('button:has-text("Next")').last().click({ force: true });
    });
    await page.waitForURL(/\/payment(?:$|\?)/, { timeout: 25000 }).catch(() => {});
    await quiet(page);
  }
}

function encodedPaymentData(status) {
  return encodeURIComponent(
    JSON.stringify({
      subscriptionPeriod: '1 Year',
      subscriptionStart: '2026-06-12T11:00:00',
      subscriptionEnd: '2027-06-12T11:00:00',
      grandTotal: status === 'FAILED' ? 17110 : 28320,
      currency: 'INR',
      subscriptionPackage: status === 'FAILED' ? 'Silver' : 'Gold',
      companyId: '82O0VUZSI',
      invoiceNo: status === 'FAILED' ? 'LL-INV-FAILED-DEMO' : 'LL-INV-SUCCESS-DEMO',
      transactionId: status === 'FAILED' ? 'LLHELP-CFPAY-FAILED-2026' : 'LLHELP-CFPAY-CAPTURED-2026',
      paymentGateway: 'Cashfree',
      subscriptionOrderId: -1,
      invoiceDownloadAvailable: false,
    }),
  );
}

async function routeWithState(page, route, state) {
  await goto(page, '/dashboard-new');
  await page.evaluate(
    ({ route, state }) => {
      history.pushState(state, '', route);
      window.dispatchEvent(new PopStateEvent('popstate', { state }));
    },
    { route, state },
  );
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
  await quiet(page);
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

  await selectPaidPlanIfNeeded(page);
  await page.locator('app-payment,.pay-shell').first().waitFor({ timeout: 25000 });
  await shot(page, 'payment-status-01-checkout-review-ready.png');

  await page.getByRole('button', { name: /Proceed to Payment/i }).click({ force: true }).catch(() => {});
  await quiet(page);
  await shot(page, 'payment-status-02-checkout-validation-required.png', true);

  const terms = page.locator('#paymentTerms').first();
  if ((await terms.count()) > 0) {
    await terms.check({ force: true }).catch(async () => {
      await page.locator('p-checkbox[formcontrolname="termsAccepted"]').click({ force: true });
    });
    await quiet(page);
    await shot(page, 'payment-status-03-checkout-terms-accepted.png');
  }

  await goto(page, `/payment/success?data=${encodedPaymentData('SUCCESS')}`);
  await page.locator('.payment-result').first().waitFor({ timeout: 15000 });
  await shot(page, 'payment-status-04-success-details.png');

  await goto(page, '/payment-confirmation?sec_id=LLHELP-SUCCESS');
  await shot(page, 'payment-status-05-success-simple-confirmation.png');

  await routeWithState(page, '/payment/pending', { cfOrderId: 'LLHELP-CF-PENDING-2026' });
  await page.locator('.payment-result--pending,.payment-result').first().waitFor({ timeout: 15000 });
  await shot(page, 'payment-status-06-pending-processing.png');

  await goto(page, `/payment/failure?data=${encodedPaymentData('FAILED')}`);
  await page.locator('.payment-result--failure,.payment-result').first().waitFor({ timeout: 15000 });
  await shot(page, 'payment-status-07-failure-details.png');

  await routeWithState(page, '/payment/failure', {
    isCashfreeFailure: true,
    errorMessage: 'Payment was cancelled or failed at the gateway.',
  });
  await page.locator('.payment-result--failure,.payment-result').first().waitFor({ timeout: 15000 });
  await shot(page, 'payment-status-08-cashfree-failure-message.png');

  await goto(page, '/account-setup/payment-error');
  await shot(page, 'payment-status-09-account-setup-payment-error.png');

  await goto(page, '/subscriptions#transactions');
  await page.locator('app-transaction-history,.th-wrap').first().waitFor({ timeout: 25000 });
  await page.locator('.th-status-badge').first().waitFor({ timeout: 20000 }).catch(() => {});
  await shot(page, 'payment-status-10-transaction-history-all-statuses.png');

  const statusText = await page.locator('.th-status-badge').allTextContents().catch(() => []);
  fs.writeFileSync(
    path.join(outDir, 'payment-status-capture-summary.txt'),
    `${statusText.map((text) => text.trim()).filter(Boolean).join('\n')}\n`,
  );

  const files = fs.readdirSync(dir).filter((file) => file.endsWith('.png')).sort();
  fs.writeFileSync(path.join(outDir, 'capture-summary.txt'), `${files.join('\n')}\n`);

  await context.close();
  await browser.close();
  console.log(`done ${files.length} screenshots`);
})().catch((error) => {
  console.error(error);
  fs.writeFileSync(path.join(outDir, 'capture-payment-statuses-error.txt'), String(error.stack || error));
  process.exit(1);
});
