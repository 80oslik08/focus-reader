/**
 * Layout / sentence-strip E2E across viewports.
 * Usage: node e2e-layout.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { writeFileSync, readFileSync, existsSync, statSync } from 'fs';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_ARG = process.argv[2];
const PORT = 8771;
let server = null;
let BASE = BASE_ARG || `http://127.0.0.1:${PORT}/`;
const LIVE = !!BASE_ARG;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.txt': 'text/plain', '.md': 'text/plain'
};

function startServer() {
  return new Promise((r) => {
    server = createServer((req, res) => {
      let url = decodeURIComponent((req.url || '/').split('?')[0]);
      if (url === '/') url = '/index.html';
      const file = join(__dirname, url.replace(/^\//, ''));
      if (!file.startsWith(__dirname) || !existsSync(file) || statSync(file).isDirectory()) {
        res.writeHead(404); res.end('nf'); return;
      }
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
      res.end(readFileSync(file));
    });
    server.listen(PORT, '127.0.0.1', r);
  });
}

function assert(cond, msg, report) {
  if (!cond) { report.failed.push(msg); console.log('FAIL:', msg); }
  else { report.passed.push(msg); console.log('PASS:', msg); }
}

async function waitReady(page) {
  await page.waitForFunction(() => window.__FOCUS_READER__ && window.SentenceStrip && document.getElementById('sentenceStrip'), { timeout: 20000 });
}

async function loadBook(page, text, name) {
  await page.evaluate(({ text, name }) => {
    return window.__FOCUS_READER__.applyText(text, { toast: false, persist: true, name, type: 'txt' });
  }, { text, name });
  await page.waitForFunction(() => {
    const s = window.__FOCUS_READER__.getState();
    return s.positionRestored && s.total > 20;
  }, { timeout: 60000 });
}

async function measureOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return {
      clientWidth: doc.clientWidth,
      scrollWidth: doc.scrollWidth,
      overflow: doc.scrollWidth > doc.clientWidth + 1
    };
  });
}

async function measureColumns(page) {
  return page.evaluate(() => {
    const nav = document.getElementById('playerColNav').getBoundingClientRect();
    const center = document.getElementById('playerColCenter').getBoundingClientRect();
    const controls = document.getElementById('playerColControls').getBoundingClientRect();
    return {
      nav: { x: nav.x, y: nav.y, w: nav.width },
      center: { x: center.x, y: center.y, w: center.width },
      controls: { x: controls.x, y: controls.y, w: controls.width }
    };
  });
}

async function measureAlign(page) {
  await page.evaluate(() => {
    window.__FOCUS_READER__.updateSentenceStrip({ forceInstant: true, sync: true });
  });
  await page.waitForTimeout(50);
  return page.evaluate(() => {
    // force sync render path
    const big = document.getElementById('wordOrp');
    const strip = document.querySelector('#sentenceStripTrack .strip-word.is-current .strip-orp');
    if (!big || !strip) return { ok: false, reason: 'missing els' };
    // re-render sync
    const words = window.__FOCUS_READER__.getState();
    window.__FOCUS_READER__.updateSentenceStrip({ forceInstant: true, sync: true });
    const strip2 = document.querySelector('#sentenceStripTrack .strip-word.is-current .strip-orp');
    const a = big.getBoundingClientRect();
    const b = strip2.getBoundingClientRect();
    const ax = (a.left + a.right) / 2;
    const bx = (b.left + b.right) / 2;
    return { ok: true, delta: Math.abs(ax - bx), ax, bx };
  });
}

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'phone', width: 390, height: 844 },
  { name: 'landscape', width: 844, height: 390 },
  { name: 'narrow', width: 360, height: 740 }
];

const book = Array.from({ length: 500 }, (_, i) => (i % 17 === 16 ? 'word' + i + '.' : 'word' + i)).join(' ');

async function run() {
  const report = { base: BASE, passed: [], failed: [], consoleErrors: [], aligns: [] };
  if (!BASE_ARG) await startServer();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.getVoices = () => [{ name: 'M', lang: 'en-US', localService: true, voiceURI: 'm', default: true }];
    synth.cancel = function () { this._mockSpeaking = false; };
    synth.speak = function (utt) {
      this._lastText = utt.text;
      this._mockSpeaking = true;
      const words = String(utt.text || '').split(/\s+/).filter(Boolean);
      let ci = 0;
      setTimeout(() => {
        words.forEach((w) => {
          if (utt.onboundary) utt.onboundary({ name: 'word', charIndex: ci });
          ci += w.length + 1;
        });
        this._mockSpeaking = false;
        if (utt.onend) utt.onend();
      }, 40);
    };
  });

  const page = await context.newPage();
  page.on('console', (m) => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => report.consoleErrors.push(String(e)));

  const resp = await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
  assert(resp && resp.ok(), 'page HTTP ok', report);
  await waitReady(page);
  await page.evaluate(async () => { if (window.RecentStore) await RecentStore.clearAll(); });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitReady(page);
  await loadBook(page, book, 'Layout Test Book');
  await page.evaluate(() => window.__FOCUS_READER__.setIndex(120));
  await page.waitForTimeout(200);

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(150);
    await page.evaluate(() => window.__FOCUS_READER__.updateSentenceStrip({ forceInstant: true, sync: true }));
    await page.waitForTimeout(80);
    const ov = await measureOverflow(page);
    assert(!ov.overflow, `${vp.name}: no horizontal overflow (${ov.scrollWidth}/${ov.clientWidth})`, report);

    if (vp.name === 'desktop') {
      const cols = await measureColumns(page);
      assert(cols.nav.x < cols.center.x && cols.center.x < cols.controls.x,
        'desktop: column order left-nav, center, right-controls', report);
      assert(cols.center.w > cols.nav.w && cols.center.w > cols.controls.w,
        'desktop: center column widest', report);
    }
  }

  // Alignment checks at desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(100);
  for (const idx of [120, 121, 122, 130]) {
    await page.evaluate((i) => window.__FOCUS_READER__.setIndex(i), idx);
    await page.waitForTimeout(60);
    const al = await measureAlign(page);
    report.aligns.push({ idx, ...al });
    assert(al.ok && al.delta <= 2, `align @${idx}: delta=${al.delta && al.delta.toFixed(2)}px`, report);
  }

  // After jump
  await page.evaluate(() => window.__FOCUS_READER__.jumpBySeconds(10));
  await page.waitForTimeout(100);
  let al = await measureAlign(page);
  report.aligns.push({ idx: 'after-jump', ...al });
  assert(al.ok && al.delta <= 2, `align after jump: delta=${al.delta && al.delta.toFixed(2)}px`, report);

  // Listen mock
  await page.evaluate(() => {
    if (!window.__FOCUS_READER__.getState().listenMode) document.getElementById('btnListen').click();
  });
  await page.click('#btnPlay');
  await page.waitForTimeout(250);
  await page.evaluate(() => {
    if (window.__FOCUS_READER__.getState().playing) document.getElementById('btnPlay').click();
  });
  al = await measureAlign(page);
  report.aligns.push({ idx: 'after-listen', ...al });
  assert(al.ok && al.delta <= 2, `align after listen: delta=${al.delta && al.delta.toFixed(2)}px`, report);

  // Toggle strip
  await page.click('#btnSentenceStrip');
  await page.waitForTimeout(50);
  let hidden = await page.evaluate(() => document.body.classList.contains('sentence-strip-off'));
  assert(hidden, 'strip toggle hides', report);
  await page.click('#btnSentenceStrip');
  hidden = await page.evaluate(() => document.body.classList.contains('sentence-strip-off'));
  assert(!hidden, 'strip toggle shows', report);
  // persist
  const pref = await page.evaluate(() => localStorage.getItem('focusReader.sentenceStrip'));
  assert(pref === '1', 'strip pref persisted on', report);
  await page.click('#btnSentenceStrip');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitReady(page);
  await page.waitForTimeout(400);
  hidden = await page.evaluate(() => document.body.classList.contains('sentence-strip-off'));
  assert(hidden, 'strip pref persists across reload (off)', report);
  // restore on for screenshots
  await page.evaluate(() => window.__FOCUS_READER__.setSentenceStripOn(true));

  const errs = report.consoleErrors.filter((e) =>
    !/Failed to load resource|gsi|accounts\.google|favicon|SpeechSynthesis/i.test(e)
  );
  assert(errs.length === 0, '0 console errors', report);
  if (errs.length) console.log(errs);

  writeFileSync(join(__dirname, 'e2e-layout-report.json'), JSON.stringify(report, null, 2));
  await browser.close();
  if (server) server.close();
  console.log('\n=== Summary ===');
  console.log('passed', report.passed.length, 'failed', report.failed.length);
  if (report.failed.length) process.exit(1);
}

await run();
