const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const baseUrl = process.env.LL_DOC_BASE_URL || 'https://app-vps.rikexim.com';
const outDir = path.resolve(__dirname, '..');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || '/snap/bin/chromium',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, ignoreHTTPSErrors: true });
  await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const info = await page.evaluate(() => {
    const attrs = el => ({
      tag: el.tagName,
      type: el.getAttribute('type'),
      name: el.getAttribute('name'),
      id: el.getAttribute('id'),
      placeholder: el.getAttribute('placeholder'),
      formcontrolname: el.getAttribute('formcontrolname'),
      aria: el.getAttribute('aria-label'),
      text: el.innerText,
      value: el.getAttribute('value'),
      classes: el.getAttribute('class')
    });
    return {
      url: location.href,
      title: document.title,
      bodyText: document.body.innerText,
      inputs: Array.from(document.querySelectorAll('input, textarea')).map(attrs),
      buttons: Array.from(document.querySelectorAll('button')).map(attrs),
      anchors: Array.from(document.querySelectorAll('a')).map(attrs),
      iframes: Array.from(document.querySelectorAll('iframe')).map(attrs),
      htmlStart: document.documentElement.outerHTML.slice(0, 20000)
    };
  });

  fs.writeFileSync(path.join(outDir, 'login-inspect.json'), JSON.stringify(info, null, 2));
  await page.screenshot({ path: path.join(outDir, 'screenshots', '00-login-page-inspect.png'), fullPage: true });
  await browser.close();
})();
