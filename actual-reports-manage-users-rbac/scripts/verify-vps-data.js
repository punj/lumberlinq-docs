const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { apiBase, login, outDir, chromiumExecutablePath } = require('./vps-doc-helper');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chromiumExecutablePath(), args: ['--no-sandbox','--disable-dev-shm-usage'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route('**/challenges.cloudflare.com/**', r => r.abort()).catch(()=>{});
  const page = await context.newPage();
  await login(page);
  const data = await page.evaluate(async ({apiBase}) => {
    async function get(url) { const r = await fetch(url, {credentials:'include'}); return {status:r.status, json: await r.json().catch(()=>null)}; }
    const from='2025-12-16', to='2026-06-16';
    const bpSearch = await get(`${apiBase}/api/v1/business-partners/search?q=LL`);
    const bpAny = await get(`${apiBase}/api/v1/business-partners/search?q=Mahadev`);
    const bp = (bpSearch.json?.[0] || bpAny.json?.[0]);
    return {
      product: await get(`${apiBase}/api/v1/reports/product?from=${from}&to=${to}`),
      loadingSite: await get(`${apiBase}/api/v1/reports/loading-site?from=${from}&to=${to}`),
      tally: await get(`${apiBase}/api/v1/reports/tally?from=${from}&to=${to}`),
      financial: await get(`${apiBase}/api/v1/reports/financial?from=${from}&to=${to}`),
      inventorySummary: await get(`${apiBase}/api/v1/inventory/summary`),
      inventoryMovements: await get(`${apiBase}/api/v1/inventory/movements?page=0&size=20`),
      processingRuns: await get(`${apiBase}/api/v1/processing-runs?page=0&size=20`),
      support: await get(`${apiBase}/api/v1/support/tickets`),
      bpSearch, bpAny,
      bpReport: bp?.encodedId ? await get(`${apiBase}/api/v1/reports/business-partner/${bp.encodedId}?from=${from}&to=${to}`) : null,
    };
  }, {apiBase});
  const summary = {
    productMonthly: data.product.json?.monthlyTrend?.length,
    productRows: data.product.json?.products?.length,
    loadingMonthly: data.loadingSite.json?.monthlyTrend?.length,
    loadingRows: data.loadingSite.json?.sites?.length,
    tallyMonthly: data.tally.json?.monthlyTrend?.length,
    tallyRows: data.tally.json?.tallies?.length,
    financialMonthly: data.financial.json?.monthlyTrend?.length,
    financialShipments: data.financial.json?.totalShipments,
    inventorySites: data.inventorySummary.json?.bySite?.length,
    inventoryMovements: data.inventoryMovements.json?.totalElements ?? data.inventoryMovements.json?.totalRecords,
    processingRuns: data.processingRuns.json?.totalElements ?? data.processingRuns.json?.totalRecords,
    supportTickets: Array.isArray(data.support.json) ? data.support.json.length : data.support.json?.totalElements,
    bpSearchCount: data.bpSearch.json?.length,
    bpAnyCount: data.bpAny.json?.length,
    bpReportShipments: data.bpReport?.json?.totalShipments,
    bpReportMonthly: data.bpReport?.json?.monthlyVolume?.length,
  };
  fs.writeFileSync(path.join(outDir, 'vps-data-verify.json'), JSON.stringify({summary, data}, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
