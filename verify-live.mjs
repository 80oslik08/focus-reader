import { chromium } from 'playwright';
import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = 'https://80oslik08.github.io/focus-reader/';
const report = { base: BASE, ok: false, steps: {} };

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const consoleErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', (e) => consoleErrors.push(String(e)));

const resp = await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
report.steps.status = resp.status();
await page.waitForTimeout(800);

report.steps.manifest = await page.evaluate(async () => {
  const link = document.querySelector('link[rel="manifest"]');
  if (!link) return { ok: false, reason: 'no link' };
  const r = await fetch(link.href);
  const j = await r.json();
  return { ok: r.ok && j.name === 'Focus Reader' && j.display === 'standalone', href: link.href, name: j.name };
});

report.steps.syncNotConfigured = await page.evaluate(() => {
  const el = document.getElementById('syncStatusLine');
  const panel = document.getElementById('panelSync');
  if (panel) panel.open = true;
  return {
    text: el ? el.textContent : '',
    ok: !!(el && /not configured/i.test(el.textContent))
  };
});

// SW register
await page.waitForTimeout(1500);
report.steps.swRegistered = await page.evaluate(async () => {
  if (!('serviceWorker' in navigator)) return { ok: false };
  const regs = await navigator.serviceWorker.getRegistrations();
  return { ok: regs.length > 0, count: regs.length };
});

// Reload to let SW control
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
report.steps.swControlling = await page.evaluate(() => ({
  ok: !!(navigator.serviceWorker && navigator.serviceWorker.controller),
  scriptURL: navigator.serviceWorker.controller && navigator.serviceWorker.controller.scriptURL
}));

await page.screenshot({ path: join(__dirname, 'live-desktop.png'), fullPage: false });

// Offline mode
await context.setOffline(true);
await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch((e) => e);
await page.waitForTimeout(1000);
report.steps.offline = await page.evaluate(() => ({
  title: document.title,
  hasORP: typeof ORP !== 'undefined',
  hasHook: typeof __FOCUS_READER__ !== 'undefined'
}));
await page.click('#btnLoadSample');
await page.waitForTimeout(300);
await page.click('#btnPlay');
await page.waitForTimeout(600);
report.steps.offlinePlay = await page.evaluate(() => __FOCUS_READER__.getState());

// Mini PDF import offline
const pdfBytes = (() => {
  // minimal PDF
  const text = 'Hello world this is a PDF test';
  const stream = `BT /F1 12 Tf 50 700 Td (${text}) Tj ET`;
  // too heavy to rebuild — skip if no file; create via evaluate ArrayBuffer empty fail
  return null;
})();

await page.click('#btnPlay'); // pause
report.steps.consoleErrorsOnlineThenOffline = consoleErrors.slice();

await context.setOffline(false);

// Mobile screenshot
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true
});
const mp = await mobile.newPage();
await mp.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
await mp.waitForTimeout(800);
await mp.screenshot({ path: join(__dirname, 'live-phone.png'), fullPage: false });
await mobile.close();

report.ok =
  report.steps.status === 200 &&
  report.steps.manifest.ok &&
  report.steps.syncNotConfigured.ok &&
  report.steps.swRegistered.ok &&
  report.steps.swControlling.ok &&
  report.steps.offline.hasORP &&
  report.steps.offlinePlay.playing === true &&
  report.steps.offlinePlay.total > 0;

writeFileSync(join(__dirname, 'verify-live-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
console.log('OK=', report.ok);
await browser.close();
process.exit(report.ok ? 0 : 1);
