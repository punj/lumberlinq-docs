const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { chromiumExecutablePath, dismissOverlays, login, openAppPage, outDir } = require('./vps-doc-helper');

(async () => {
  const videoDir = path.join(outDir, 'video');
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromiumExecutablePath(),
    args: ['--no-sandbox', '--disable-gpu']
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    ignoreHTTPSErrors: true,
    recordVideo: { dir: videoDir, size: { width: 1440, height: 1000 } }
  });
  await context.route('**/challenges.cloudflare.com/**', (route) => route.abort());
  const page = await context.newPage();

  const authCheck = await login(page);
  await openAppPage(page, '/products', 'All Products');
  await page.waitForTimeout(1500);
  await openAppPage(page, '/loading-sites', 'All Loading Sites');
  await dismissOverlays(page);
  await page.waitForTimeout(1500);

  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();

  const videoPath = video ? await video.path() : null;
  fs.writeFileSync(path.join(outDir, 'video-summary.txt'), JSON.stringify({ authCheck, videoPath }, null, 2));
})().catch((err) => {
  fs.writeFileSync(path.join(outDir, 'video-error.txt'), err.stack || String(err));
  process.exit(1);
});
