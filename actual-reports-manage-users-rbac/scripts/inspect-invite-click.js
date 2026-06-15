const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { login, openAppPage, outDir, chromiumExecutablePath, dismissOverlays } = require('./vps-doc-helper');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chromiumExecutablePath(), args:['--no-sandbox','--disable-dev-shm-usage'] });
  const context = await browser.newContext({ viewport:{width:1600,height:1100} });
  await context.route('**/challenges.cloudflare.com/**', r=>r.abort()).catch(()=>{});
  const page = await context.newPage();
  await login(page);
  await openAppPage(page, '/manage/user');
  await dismissOverlays(page);
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: /Invite User/i }).click({ force:true });
  await page.waitForTimeout(3000);
  const data = await page.evaluate(() => ({
    text: document.body.innerText.slice(0,5000),
    dialogs: Array.from(document.querySelectorAll('.p-dialog,[role="dialog"')).map(el => ({txt: el.innerText, html: el.outerHTML.slice(0,1000), rect: (() => { const r=el.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; })()})),
    textareas: Array.from(document.querySelectorAll('textarea')).map(el => ({html: el.outerHTML, rect: (() => { const r=el.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; })(), style: getComputedStyle(el).cssText})),
    buttons: Array.from(document.querySelectorAll('button')).map((b,i)=>({i,text:(b.innerText||b.textContent||'').trim(), cls:b.className, html:b.outerHTML.slice(0,200)}))
  }));
  await page.screenshot({ path: path.join(outDir,'screenshots','debug-invite-click.png'), fullPage:true });
  fs.writeFileSync(path.join(outDir,'invite-click-inspect.json'), JSON.stringify(data,null,2));
  console.log(JSON.stringify({textareas:data.textareas.length, dialogs:data.dialogs.length, body:data.text.slice(0,1000)}, null, 2));
  await browser.close();
})().catch(e=>{console.error(e); process.exit(1);});
