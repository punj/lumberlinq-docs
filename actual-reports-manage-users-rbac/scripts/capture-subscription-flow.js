const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
const { login, openAppPage, dismissOverlays, outDir, chromiumExecutablePath } = require('./vps-doc-helper');
const dir=path.join(outDir,'screenshots');
async function quiet(page){await page.waitForLoadState('networkidle',{timeout:45000}).catch(()=>{}); await page.waitForTimeout(1000); await page.locator('.p-progress-spinner,p-progressspinner,.p-skeleton,p-skeleton').first().waitFor({state:'detached',timeout:12000}).catch(()=>{}); await page.addStyleTag({content:'*,*:before,*:after{animation-duration:0s!important;transition-duration:0s!important;caret-color:transparent!important}.p-toast,p-toast,.driver-popover,.driver-overlay{display:none!important}'}).catch(()=>{})}
async function stable(page){await dismissOverlays(page); await quiet(page)}
async function shot(page,name,overlay=false){ if(overlay) await quiet(page); else await stable(page); await page.evaluate(()=>window.scrollTo(0,0)).catch(()=>{}); await page.screenshot({path:path.join(dir,name), fullPage:true}); console.log('captured '+name); }
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:chromiumExecutablePath(),args:['--no-sandbox','--disable-dev-shm-usage']});
 const context=await browser.newContext({viewport:{width:1600,height:1100},recordVideo:{dir:path.join(outDir,'video'),size:{width:1600,height:1100}}}); await context.route('**/challenges.cloudflare.com/**',r=>r.abort()).catch(()=>{});
 const page=await context.newPage(); page.setDefaultTimeout(30000); await login(page); await openAppPage(page,'/subscriptions'); await shot(page,'purchase-flow-01-package-selection.png');
 await page.locator('.plan-card').filter({hasText:/pro|growth|business|starter|free/i}).first().click({force:true}).catch(async()=>page.locator('.plan-card').first().click({force:true})); await shot(page,'purchase-flow-02-package-selected.png');
 await page.getByRole('button',{name:/Next/i}).first().click({force:true}).catch(()=>{}); await quiet(page); await shot(page,'purchase-flow-03-package-details.png');
 await page.locator('p-dropdown').last().click({force:true}).catch(()=>{}); await shot(page,'purchase-flow-04-payment-cycle-dropdown.png',true); await page.keyboard.press('ArrowDown').catch(()=>{}); await page.keyboard.press('Enter').catch(()=>{}); await quiet(page);
 await page.getByRole('button',{name:/Next/i}).first().click({force:true}).catch(()=>{}); await quiet(page); await shot(page,'purchase-flow-05-billing-details.png');
 // Fill visible billing fields where possible without submitting payment.
 await page.locator('input[formcontrolname="companyName"]').fill('Mahadev Export').catch(()=>{});
 await page.locator('input[formcontrolname="phone"]').fill('9876543210').catch(()=>{});
 await page.locator('input[formcontrolname="address"]').fill('LL Help Demo Timber Yard, Mumbai').catch(()=>{});
 await page.locator('input[formcontrolname="pincode"]').fill('400001').catch(()=>{});
 await page.locator('p-checkbox input, .p-checkbox-box').last().click({force:true}).catch(()=>{});
 await shot(page,'purchase-flow-06-billing-details-filled.png');
 await page.getByRole('button',{name:/Next/i}).last().click({force:true}).catch(()=>{}); await quiet(page); await shot(page,'purchase-flow-07-evaluate-order-pay-now.png');
 await context.close(); await browser.close(); const files=fs.readdirSync(dir).filter(f=>f.endsWith('.png')).sort(); fs.writeFileSync(path.join(outDir,'capture-summary.txt'),files.join('\n')+'\n'); console.log(`done ${files.length} screenshots`);
})().catch(e=>{console.error(e);fs.writeFileSync(path.join(outDir,'capture-subscription-flow-error.txt'),String(e.stack||e));process.exit(1)});
