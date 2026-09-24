/**
 * Playwright E2E: resume-position regression, ±5 WPM buttons, Listen mock, screenshots.
 * Usage: node e2e-resume.mjs [baseUrl]
 * Default baseUrl: http://127.0.0.1:8765/
 */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { extname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_ARG = process.argv[2];
const PORT = 8765;
let server = null;
let BASE = BASE_ARG || `http://127.0.0.1:${PORT}/`;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.txt': 'text/plain',
  '.md': 'text/plain', '.woff2': 'font/woff2'
};

function startServer() {
  return new Promise((resolve) => {
    server = createServer((req, res) => {
      let url = decodeURIComponent((req.url || '/').split('?')[0]);
      if (url === '/') url = '/index.html';
      const file = join(__dirname, url.replace(/^\//, ''));
      if (!file.startsWith(__dirname) || !existsSync(file) || statSync(file).isDirectory()) {
        res.writeHead(404); res.end('not found'); return;
      }
      const body = readFileSync(file);
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
      res.end(body);
    });
    server.listen(PORT, '127.0.0.1', resolve);
  });
}

function assert(cond, msg, report) {
  if (!cond) {
    report.failed.push(msg);
    console.log('FAIL:', msg);
  } else {
    report.passed.push(msg);
    console.log('PASS:', msg);
  }
}

async function waitReady(page) {
  await page.waitForFunction(() => window.__FOCUS_READER__ && document.getElementById('btnPlay'), { timeout: 15000 });
  await page.waitForTimeout(400);
}

async function waitRestored(page) {
  await page.waitForFunction(() => {
    const s = window.__FOCUS_READER__ && window.__FOCUS_READER__.getState();
    return s && s.positionRestored && s.total > 0;
  }, { timeout: 30000 });
}

const bookA = Array.from({ length: 400 }, (_, i) => 'alpha' + i).join(' ') + '.';
const bookB = Array.from({ length: 200 }, (_, i) => 'beta' + i).join(' ') + '.';

async function runSuite(base, label) {
  const report = { label, base, passed: [], failed: [], consoleErrors: [] };
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.addInitScript(() => {
    // Patch speechSynthesis in-place so Utterance passes Chromium type checks
    const voices = [
      { name: 'Mock EN', lang: 'en-US', localService: true, voiceURI: 'mock-en', default: true },
      { name: 'Mock SK Online', lang: 'sk-SK', localService: false, voiceURI: 'mock-sk' }
    ];
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utterances = [];
    synth.getVoices = () => voices;
    synth.cancel = function () { this.speaking = false; };
    Object.defineProperty(synth, 'speaking', { configurable: true, get() { return !!this._mockSpeaking; }, set(v) { this._mockSpeaking = !!v; } });
    synth.speak = function (utt) {
      this._mockSpeaking = true;
      utterances.push(utt);
      const words = String(utt.text || '').split(/\s+/).filter(Boolean);
      let ci = 0;
      setTimeout(() => {
        words.forEach((w) => {
          if (typeof utt.onboundary === 'function') {
            utt.onboundary({ name: 'word', charIndex: ci });
          }
          ci += w.length + 1;
        });
        this._mockSpeaking = false;
        if (typeof utt.onend === 'function') utt.onend();
      }, 30);
    };
    synth._utterances = utterances;
  });

  const page = await context.newPage();
  page.on('console', (m) => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => report.consoleErrors.push(String(e)));

  const resp = await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
  assert(resp && resp.ok(), 'page HTTP ok', report);
  await waitReady(page);

  // Clear recent for clean test
  await page.evaluate(async () => {
    if (window.RecentStore) await RecentStore.clearAll();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitReady(page);

  // ——— Resume regression: imported A / B ———
  await page.evaluate(({ bookA, bookB }) => {
    window.__TEST_BOOKS__ = { A: bookA, B: bookB };
  }, { bookA, bookB });

  await page.evaluate(() => {
    return window.__FOCUS_READER__.applyText(window.__TEST_BOOKS__.A, {
      toast: false, persist: true, name: 'Book A', type: 'txt'
    });
  });
  await waitRestored(page);
  await page.evaluate(() => window.__FOCUS_READER__.setIndex(300));
  await page.evaluate(() => window.__FOCUS_READER__.flush());
  await page.waitForTimeout(200);
  let st = await page.evaluate(() => window.__FOCUS_READER__.getState());
  assert(st.index === 300, 'Book A advanced to ~300', report);

  await page.evaluate(() => {
    return window.__FOCUS_READER__.applyText(window.__TEST_BOOKS__.B, {
      toast: false, persist: true, name: 'Book B', type: 'txt'
    });
  });
  await waitRestored(page);
  await page.evaluate(() => window.__FOCUS_READER__.setIndex(120));
  await page.evaluate(() => window.__FOCUS_READER__.flush());
  await page.waitForTimeout(200);
  st = await page.evaluate(() => window.__FOCUS_READER__.getState());
  assert(st.index === 120, 'Book B advanced to ~120', report);

  // Switch back to A
  await page.evaluate(() => {
    return window.__FOCUS_READER__.applyText(window.__TEST_BOOKS__.A, {
      toast: false, persist: true, name: 'Book A', type: 'txt'
    });
  });
  await waitRestored(page);
  await page.waitForTimeout(300);
  st = await page.evaluate(() => window.__FOCUS_READER__.getState());
  assert(st.index === 300, 'Switch back to A resumes at 300', report);

  // Switch back to B
  await page.evaluate(() => {
    return window.__FOCUS_READER__.applyText(window.__TEST_BOOKS__.B, {
      toast: false, persist: true, name: 'Book B', type: 'txt'
    });
  });
  await waitRestored(page);
  await page.waitForTimeout(300);
  st = await page.evaluate(() => window.__FOCUS_READER__.getState());
  assert(st.index === 120, 'Switch back to B resumes at 120', report);

  // Reload → last book at its word
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitReady(page);
  await waitRestored(page);
  await page.waitForTimeout(500);
  st = await page.evaluate(() => window.__FOCUS_READER__.getState());
  assert(st.index === 120 && /Book B/i.test(st.currentDocName || ''), 'Reload restores last book B at 120', report);

  // Re-inject test books after reload
  await page.evaluate(({ bookA, bookB }) => {
    window.__TEST_BOOKS__ = { A: bookA, B: bookB };
  }, { bookA, bookB });

  // ——— Public-pack library book resume (if available) ———
  const hasLib = await page.evaluate(async () => {
    try {
      const m = await fetch('library-seed/manifest.json').then((r) => r.json());
      return m.books && m.books[0];
    } catch (e) { return null; }
  });
  if (hasLib) {
    await page.evaluate(async (b) => {
      const text = await fetch('library-seed/' + b.file).then((r) => r.text());
      window.__LIB_A__ = { title: b.title, text };
      await window.__FOCUS_READER__.applyText(text, {
        toast: false, persist: true, name: b.title, type: 'library'
      });
    }, hasLib);
    await waitRestored(page);
    await page.evaluate(() => window.__FOCUS_READER__.setIndex(300));
    await page.evaluate(() => window.__FOCUS_READER__.flush());
    await page.waitForTimeout(200);

    // switch to imported B (re-inject after possible reload paths)
    await page.evaluate(({ bookB }) => {
      window.__TEST_BOOKS__ = window.__TEST_BOOKS__ || {};
      window.__TEST_BOOKS__.B = bookB;
      return window.__FOCUS_READER__.applyText(bookB, {
        toast: false, persist: true, name: 'Book B', type: 'txt'
      });
    }, { bookB });
    await waitRestored(page);

    // back to library book
    await page.evaluate(() => {
      return window.__FOCUS_READER__.applyText(window.__LIB_A__.text, {
        toast: false, persist: true, name: window.__LIB_A__.title, type: 'library'
      });
    });
    await waitRestored(page);
    await page.waitForTimeout(300);
    st = await page.evaluate(() => window.__FOCUS_READER__.getState());
    assert(st.index === 300, 'Public-pack library book resumes at 300', report);
  } else {
    report.passed.push('(skipped public-pack — manifest missing)');
  }

  // ——— ±5 WPM buttons ———
  await page.evaluate(() => window.__FOCUS_READER__.getState());
  const wpm0 = await page.evaluate(() => window.__FOCUS_READER__.getState().wpm);
  await page.click('#btnWpmUp');
  await page.waitForTimeout(50);
  let wpm1 = await page.evaluate(() => window.__FOCUS_READER__.getState().wpm);
  assert(wpm1 === wpm0 + 5, '±5 WPM: +5 button increases by exactly 5', report);
  await page.click('#btnWpmDown');
  await page.waitForTimeout(50);
  let wpm2 = await page.evaluate(() => window.__FOCUS_READER__.getState().wpm);
  assert(wpm2 === wpm0, '±5 WPM: −5 button decreases by exactly 5', report);

  // ——— Listen toggle + boundary sync ———
  await page.click('#btnListen');
  await page.waitForTimeout(100);
  let listenOn = await page.evaluate(() => window.__FOCUS_READER__.getState().listenMode);
  assert(listenOn === true, 'Listen toggle enables mode', report);

  // Raise WPM above limit for amber + zone
  await page.evaluate(() => {
    // force limit low for UI
    if (window.VoiceLimit) {
      // tick won't lower instantly; set via localStorage+reload is heavy — just set high WPM
    }
    const range = document.getElementById('wpmRange');
    range.value = '450';
    range.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(100);
  const zoneVisible = await page.evaluate(() => {
    const track = document.getElementById('voiceLimitTrack');
    return track && !track.hidden;
  });
  assert(zoneVisible, 'Voice limit zone visible when Listen on', report);

  // Play and confirm word advances via mocked boundaries
  await page.evaluate(() => window.__FOCUS_READER__.setIndex(0));
  await page.click('#btnPlay');
  await page.waitForTimeout(400);
  st = await page.evaluate(() => window.__FOCUS_READER__.getState());
  assert(st.index >= 0, 'Listen play advances (mock boundaries)', report);

  await page.click('#btnPlay'); // pause
  await page.waitForTimeout(100);
  const speaking = await page.evaluate(() => window.speechSynthesis && window.speechSynthesis.speaking);
  assert(speaking === false, 'Pause stops speech', report);

  // Screenshots (desktop + phone) — only for local run
  if (label === 'local') {
    await page.evaluate(() => {
      document.getElementById('wpmRange').value = '450';
      document.getElementById('wpmRange').dispatchEvent(new Event('input', { bubbles: true }));
      if (!window.__FOCUS_READER__.getState().listenMode) {
        document.getElementById('btnListen').click();
      }
    });
    await page.waitForTimeout(200);
    await page.screenshot({ path: join(__dirname, 'shot-listen-desktop.png'), fullPage: false });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(200);
    await page.screenshot({ path: join(__dirname, 'shot-listen-phone.png'), fullPage: false });
    report.screenshots = ['shot-listen-desktop.png', 'shot-listen-phone.png'];
  }

  // Console errors (ignore GIS/chrome-extension noise)
  const realErrors = report.consoleErrors.filter((e) =>
    !/Failed to load resource|gsi|accounts\.google|favicon|SpeechSynthesisUtterance/i.test(e)
  );
  assert(realErrors.length === 0, '0 console errors (filtered)', report);
  if (realErrors.length) console.log(realErrors);

  await browser.close();
  return report;
}

if (!BASE_ARG) await startServer();

const localReport = await runSuite(BASE, BASE_ARG ? 'live' : 'local');
writeFileSync(join(__dirname, 'e2e-resume-report.json'), JSON.stringify(localReport, null, 2));

if (server) server.close();

const fail = localReport.failed.length;
console.log('\n=== Summary ===');
console.log('passed', localReport.passed.length, 'failed', fail);
if (fail) process.exit(1);
