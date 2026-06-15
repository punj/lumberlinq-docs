const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { apiBase, login, openAppPage, outDir, chromiumExecutablePath, dismissOverlays } = require('./vps-doc-helper');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chromiumExecutablePath(), args: ['--no-sandbox','--disable-dev-shm-usage'] });
  const context = await browser.newContext({ viewport: { width: 1600, height: 1100 } });
  await context.route('**/challenges.cloudflare.com/**', r => r.abort()).catch(()=>{});
  const page = await context.newPage();
  await login(page);
  const perms = await page.evaluate(async ({apiBase}) => (await fetch(`${apiBase}/api/v1/users/me/permissions`, {credentials:'include'})).json(), {apiBase});
  await openAppPage(page, '/manage/user');
  await dismissOverlays(page);
  await page.waitForTimeout(3000);
  const data = await page.evaluate(() => ({
    url: location.href,
    text: document.body.innerText.slice(0, 3000),
    buttons: Array.from(document.querySelectorAll('button')).map((b, i) => ({
      i,
      text: (b.innerText || b.textContent || '').trim(),
      title: b.getAttribute('title'),
      aria: b.getAttribute('aria-label'),
      cls: b.className,
      html: b.outerHTML.slice(0, 300)
    })),
    textareas: Array.from(document.querySelectorAll('textarea')).length,
    dialogs: Array.from(document.querySelectorAll('.p-dialog,[role="dialog"')).length
  }));
  fs.writeFileSync(path.join(outDir, 'manage-users-inspect.json'), JSON.stringify({perms, data}, null, 2));
  console.log(JSON.stringify({permCount: perms.permissions?.length, buttons: data.buttons, textareas: data.textareas}, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
