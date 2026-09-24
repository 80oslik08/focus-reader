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
  { name: 'landscapeShort', width: 740, height: 360 },
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
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitReady(page);
  await page.waitForTimeout(300);
  await loadBook(page, book, 'Layout Test Book');
  await page.evaluate(() => window.__FOCUS_READER__.setIndex(120));
  await page.waitForTimeout(200);

  async function visualChecks(vpName) {
    return page.evaluate((vpName) => {
      const vw = window.innerWidth;
      const card = document.getElementById('stageWrap');
      const strip = document.getElementById('sentenceStripWrap');
      const prog = document.getElementById('progressLabel');
      const status = document.getElementById('statusLabel');
      const cr = card.getBoundingClientRect();
      const sr = strip && !strip.classList.contains('is-hidden') ? strip.getBoundingClientRect() : null;
      const pr = prog.getBoundingClientRect();
      const st = status.getBoundingClientRect();
      const interactive = Array.from(document.querySelectorAll(
        'button:not([hidden]), input[type="range"], input[type="number"], select'
      )).filter((el) => {
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || r.width < 1 || r.height < 1) return false;
        // skip off-screen accordion content roughly
        if (r.bottom < 0 || r.top > window.innerHeight + 20) return false;
        return true;
      });
      const clipped2 = [];
      interactive.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.left < -1 || r.right > vw + 1) {
          clipped2.push({ id: el.id || String(el.className).slice(0, 40), left: Math.round(r.left), right: Math.round(r.right) });
        }
      });
      const overlap = !(pr.right <= st.left - 2 || st.right <= pr.left - 2) &&
        Math.abs(pr.top - st.top) < 20 &&
        (pr.right > st.left && pr.left < st.right);
      // better overlap: boxes intersect
      const boxesOverlap = !(pr.right <= st.left || st.right <= pr.left || pr.bottom <= st.top || st.bottom <= pr.top);
      const stripInside = !sr || (
        sr.left >= cr.left - 1 && sr.right <= cr.right + 1 &&
        sr.top >= cr.top - 1 && sr.bottom <= cr.bottom + 2
      );
      // Elements must fit inside nearest .player-col / .stage-wrap / .jump-panel card
      const containerClipped = [];
      interactive.forEach((el) => {
        const card = el.closest('.player-col, .stage-wrap');
        if (!card) return;
        const cr2 = card.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        // allow 1px subpixel slack
        if (r.left < cr2.left - 1.5 || r.right > cr2.right + 1.5 ||
            r.top < cr2.top - 1.5 || r.bottom > cr2.bottom + 1.5) {
          containerClipped.push({
            id: el.id || String(el.className).slice(0, 40),
            elL: Math.round(r.left), elR: Math.round(r.right),
            cL: Math.round(cr2.left), cR: Math.round(cr2.right)
          });
        }
      });
      // Also check jump slider specifically
      const slider = document.getElementById('jumpSlider');
      if (slider) {
        const card = slider.closest('.player-col-nav, .player-col');
        if (card) {
          const cr2 = card.getBoundingClientRect();
          const r = slider.getBoundingClientRect();
          if (r.left < cr2.left - 1.5 || r.right > cr2.right + 1.5) {
            containerClipped.push({ id: 'jumpSlider', elL: Math.round(r.left), elR: Math.round(r.right), cL: Math.round(cr2.left), cR: Math.round(cr2.right) });
          }
        }
      }
      return {
        vw,
        cardW: cr.width,
        cardRatio: cr.width / vw,
        stripInside,
        progressOverlap: boxesOverlap,
        progressGap: st.left - pr.right,
        clipped: clipped2,
        clippedCount: clipped2.length,
        containerClipped,
        containerClippedCount: containerClipped.length
      };
    }, vpName);
  }

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(180);
    await page.evaluate(() => {
      window.__FOCUS_READER__.setSentenceStripOn(true);
      window.__FOCUS_READER__.updateSentenceStrip({ forceInstant: true, sync: true });
    });
    await page.waitForTimeout(100);
    const ov = await measureOverflow(page);
    assert(!ov.overflow, `${vp.name}: no horizontal overflow (${ov.scrollWidth}/${ov.clientWidth})`, report);

    const vis = await visualChecks(vp.name);
    report.visual = report.visual || {};
    report.visual[vp.name] = vis;
    assert(vis.clippedCount === 0, `${vp.name}: no clipped interactives (${JSON.stringify(vis.clipped.slice(0,3))})`, report);
    assert(vis.containerClippedCount === 0,
      `${vp.name}: no card-clipped interactives (${JSON.stringify(vis.containerClipped.slice(0,4))})`, report);
    assert(vis.stripInside, `${vp.name}: strip viewport inside reader card`, report);
    assert(!vis.progressOverlap && vis.progressGap >= 4,
      `${vp.name}: progress/status not overlapping (gap=${vis.progressGap})`, report);

    if (vp.name === 'desktop') {
      const cols = await measureColumns(page);
      assert(cols.nav.x < cols.center.x && cols.center.x < cols.controls.x,
        'desktop: column order left-nav, center, right-controls', report);
      assert(cols.center.w > cols.nav.w && cols.center.w > cols.controls.w,
        'desktop: center column widest', report);
      assert(vis.cardRatio >= 0.55, `desktop: reader card ≥55% viewport (got ${(vis.cardRatio*100).toFixed(1)}%)`, report);
    }
    if (vp.name === 'phone' || vp.name === 'narrow') {
      assert(vis.cardRatio >= 0.90, `${vp.name}: reader card ≥90% viewport (got ${(vis.cardRatio*100).toFixed(1)}%)`, report);
    }
  }

  // Only CURRENT strip ORP letter is red
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => {
    window.__FOCUS_READER__.setSentenceStripOn(true);
    window.__FOCUS_READER__.setIndex(120);
    window.__FOCUS_READER__.updateSentenceStrip({ forceInstant: true, sync: true });
  });
  await page.waitForTimeout(80);
  const orpColors = await page.evaluate(() => {
    const words = Array.from(document.querySelectorAll('#sentenceStripTrack .strip-word'));
    return words.map((w) => {
      const orp = w.querySelector('.strip-orp');
      const cs = getComputedStyle(orp);
      return { current: w.classList.contains('is-current'), color: cs.color };
    });
  });
  const redish = (c) => {
    const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return false;
    const r = +m[1], g = +m[2], b = +m[3];
    return r > 180 && g < 120 && b < 120;
  };
  const curr = orpColors.filter((x) => x.current);
  const others = orpColors.filter((x) => !x.current);
  assert(curr.length === 1 && redish(curr[0].color), 'current strip ORP is red', report);
  assert(others.every((x) => !redish(x.color)), 'non-current strip ORPs are not red', report);

  // Alignment checks at desktop

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
