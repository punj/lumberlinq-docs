const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const baseUrl = process.env.LL_DOC_BASE_URL || 'https://app-vps.rikexim.com';
const outDir = path.resolve(__dirname, '..');

async function clickTextIfVisible(page, text, timeout = 3000) {
  const loc = page.getByText(text, { exact: true }).last();
  try {
    await loc.waitFor({ state: 'visible', timeout });
    await loc.click();
    await page.waitForTimeout(1500);
    return true;
  } catch (_) {
    return false;
  }
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || '/snap/bin/chromium',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, ignoreHTTPSErrors: true });
  const log = [];
  page.on('requestfailed', req => log.push(`FAILED ${req.method()} ${req.url()} ${req.failure()?.errorText}`));
  page.on('response', res => {
    if (res.status() >= 400) log.push(`HTTP ${res.status()} ${res.url()}`);
  });
  await page.goto(`${baseUrl}/login?forceLogin=true`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await clickTextIfVisible(page, 'Accept All', 1000);
  await clickTextIfVisible(page, 'Yes', 3000);
  await page.waitForTimeout(4000);

  const info = await page.evaluate(() => ({
    url: location.href,
    title: document.title,
    localStorage: Object.keys(localStorage).reduce((acc, k) => ({ ...acc, [k]: localStorage.getItem(k) }), {}),
    sessionStorage: Object.keys(sessionStorage).reduce((acc, k) => ({ ...acc, [k]: sessionStorage.getItem(k) }), {}),
    bodyText: document.body.innerText,
    inputs: Array.from(document.querySelectorAll('input, textarea')).map(el => ({
      type: el.getAttribute('type'),
      name: el.getAttribute('name'),
      id: el.getAttribute('id'),
      placeholder: el.getAttribute('placeholder'),
      formcontrolname: el.getAttribute('formcontrolname'),
      classes: el.getAttribute('class'),
      visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    })),
    buttons: Array.from(document.querySelectorAll('button')).map(el => ({
      text: el.innerText,
      type: el.getAttribute('type'),
      classes: el.getAttribute('class'),
      visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    })),
    anchors: Array.from(document.querySelectorAll('a')).map(el => ({
      text: el.innerText,
      href: el.getAttribute('href'),
      classes: el.getAttribute('class'),
      visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    }))
  }));
  fs.writeFileSync(path.join(outDir, 'state-inspect.json'), JSON.stringify({ info, log }, null, 2));
  await page.screenshot({ path: path.join(outDir, 'screenshots', '00-state-inspect.png'), fullPage: true });
  await browser.close();
})();
