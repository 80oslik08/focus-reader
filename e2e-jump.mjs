/**
 * Playwright E2E: time jumps (quick buttons + scrub + undo + listen + persist).
 * Usage: node e2e-jump.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { writeFileSync, readFileSync, existsSync, statSync } from 'fs';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_ARG = process.argv[2];
const PORT = 8767;
let server = null;
let BASE = BASE_ARG || `http://127.0.0.1:${PORT}/`;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.txt': 'text/plain', '.md': 'text/plain'
};

function startServer() {
  return new Promise((resolve) => {
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
    server.listen(PORT, '127.0.0.1', resolve);
  });
}

function assert(cond, msg, report) {
  if (!cond) { report.failed.push(msg); console.log('FAIL:', msg); }
  else { report.passed.push(msg); console.log('PASS:', msg); }
}

async function waitReady(page) {
  await page.waitForFunction(() => window.__FOCUS_READER__ && window.FocusJump && document.getElementById('jumpSlider'), { timeout: 20000 });
}

async function waitRestored(page) {
  await page.waitForFunction(() => {
    const s = window.__FOCUS_READER__.getState();
    return s && s.positionRestored && s.total > 50;
  }, { timeout: 30000 });
}

// Long enough books for ±5m jumps at 300 WPM (1500 words)
const bookA = Array.from({ length: 2500 }, (_, i) => 'alpha' + i).join(' ') + '.';
const bookB = Array.from({ length: 800 }, (_, i) => 'beta' + i).join(' ') + '.';

async function runSuite(base, label) {
  const report = { label, base, passed: [], failed: [], consoleErrors: [] };
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.addInitScript(() => {
    const voices = [
      { name: 'Mock EN', lang: 'en-US', localService: true, voiceURI: 'mock-en', default: true }
    ];
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.getVoices = () => voices;
    Object.defineProperty(synth, 'speaking', {
      configurable: true,
      get() { return !!this._mockSpeaking; },
      set(v) { this._mockSpeaking = !!v; }
    });
    synth.cancel = function () { this._mockSpeaking = false; };
    synth.speak = function (utt) {
      this._mockSpeaking = true;
      this._lastText = utt.text;
      const words = String(utt.text || '').split(/\s+/).filter(Boolean);
      let ci = 0;
      setTimeout(() => {
        words.forEach((w) => {
          if (typeof utt.onboundary === 'function') utt.onboundary({ name: 'word', charIndex: ci });
          ci += w.length + 1;
        });
        this._mockSpeaking = false;
        if (typeof utt.onend === 'function') utt.onend();
      }, 40);
    };
  });

  const page = await context.newPage();
  page.on('console', (m) => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => report.consoleErrors.push(String(e)));

  const resp = await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
  assert(resp && resp.ok(), 'page HTTP ok', report);
  await waitReady(page);

  await page.evaluate(async () => { if (window.RecentStore) await RecentStore.clearAll(); });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitReady(page);

  await page.evaluate(({ bookA }) => {
    window.__TEST_BOOKS__ = { A: bookA };
    return window.__FOCUS_READER__.applyText(bookA, {
      toast: false, persist: true, name: 'Jump Book A', type: 'txt'
    });
  }, { bookA });
  await waitRestored(page);

  // Set WPM 300 and index mid-book
  await page.evaluate(() => {
    window.__FOCUS_READER__.setIndex(1000);
  });
  // set wpm via UI
  await page.fill('#wpmInput', '300');
  await page.dispatchEvent('#wpmInput', 'change');
  await page.waitForTimeout(100);
  let st = await page.evaluate(() => window.__FOCUS_READER__.getState());
  assert(st.wpm === 300 && st.index === 1000, 'setup at word 1000 / 300 WPM', report);

  // Quick −10s => −50 words
  await page.click('[data-jump-sec="-10"]');
  await page.waitForTimeout(150);
  st = await page.evaluate(() => window.__FOCUS_READER__.getState());
  assert(st.index === 950, '−10s at 300 WPM moves −50 words (1000→950)', report);

  await page.click('[data-jump-sec="30"]');
  await page.waitForTimeout(150);
  st = await page.evaluate(() => window.__FOCUS_READER__.getState());
  assert(st.index === 1100, '+30s at 300 WPM moves +150 (950→1100)', report);

  await page.click('[data-jump-sec="-120"]');
  await page.waitForTimeout(150);
  st = await page.evaluate(() => window.__FOCUS_READER__.getState());
  assert(st.index === 500, '−2m at 300 WPM moves −600 (1100→500)', report);

  // Reset to a known index before scrub so −2m is not stacked on prior quick jumps
  await page.evaluate(() => window.__FOCUS_READER__.setIndex(800));
  await page.waitForTimeout(50);

  // Slider to −2m: find v that snaps to −120
  const sliderV = await page.evaluate(() => {
    for (let v = -1; v <= 0; v += 0.0005) {
      if (FocusJump.sliderToSeconds(v) === -120) return v;
    }
    return FocusJump.secondsToSlider(-120);
  });
  await page.evaluate((v) => window.__FOCUS_READER__.setJumpSlider(v), sliderV);
  await page.waitForTimeout(100);
  const readout = await page.evaluate(() => ({
    time: document.getElementById('jumpTimeLabel').textContent,
    words: document.getElementById('jumpWordsLabel').textContent,
    preview: document.getElementById('jumpPreview').textContent,
    pending: window.__FOCUS_READER__.getJumpPending()
  }));
  assert(/−\s*2m/.test(readout.time.replace(/\s+/g, '')) || readout.time.includes('−2m') || readout.pending.seconds === -120,
    'slider readout shows −2m', report);
  assert(readout.words.replace(/[^\d−-]/g, '').includes('600') || /−\s*600/.test(readout.words),
    'slider readout shows −600 words', report);
  assert(/alpha/.test(readout.preview), 'preview snippet visible', report);

  if (label === 'local') {
    await page.screenshot({ path: join(__dirname, 'shot-jump-desktop.png') });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(200);
    await page.screenshot({ path: join(__dirname, 'shot-jump-phone.png') });
    await page.setViewportSize({ width: 1280, height: 800 });
    report.screenshots = ['shot-jump-desktop.png', 'shot-jump-phone.png'];
  }

  const beforeApply = await page.evaluate(() => window.__FOCUS_READER__.getState().index);
  assert(beforeApply === 800, 'pre-apply index is 800', report);
  await page.click('#btnJumpApply');
  await page.waitForTimeout(200);
  st = await page.evaluate(() => window.__FOCUS_READER__.getState());
  assert(st.index === 200, `Apply −2m: ${beforeApply}→${st.index} (expect 200)`, report);

  const sliderReset = await page.evaluate(() => Number(document.getElementById('jumpSlider').value));
  assert(Math.abs(sliderReset) < 0.001, 'slider resets to 0 after apply', report);

  const afterJump = st.index;
  await page.click('#btnJumpUndo');
  await page.waitForTimeout(150);
  st = await page.evaluate(() => window.__FOCUS_READER__.getState());
  assert(st.index === beforeApply, 'Undo restores pre-jump position', report);

  // Forward scrub briefly
  await page.evaluate(() => window.__FOCUS_READER__.setIndex(100));
  await page.click('[data-jump-sec="10"]');
  st = await page.evaluate(() => window.__FOCUS_READER__.getState());
  assert(st.index === 150, '+10s forward works (100→150)', report);

  // Clamp at start
  await page.evaluate(() => window.__FOCUS_READER__.setIndex(20));
  await page.click('[data-jump-sec="-300"]'); // −1500 words
  await page.waitForTimeout(150);
  st = await page.evaluate(() => window.__FOCUS_READER__.getState());
  assert(st.index === 0, 'clamp at start of book', report);

  // Persist across book switch
  await page.evaluate(() => window.__FOCUS_READER__.setIndex(777));
  await page.evaluate(() => window.__FOCUS_READER__.flush());
  await page.waitForTimeout(200);
  await page.evaluate(({ bookA, bookB }) => {
    window.__TEST_BOOKS__ = { A: bookA, B: bookB };
    return window.__FOCUS_READER__.applyText(bookB, {
      toast: false, persist: true, name: 'Jump Book B', type: 'txt'
    });
  }, { bookA, bookB });
  await waitRestored(page);
  await page.evaluate(() => window.__FOCUS_READER__.setIndex(50));
  await page.evaluate(() => window.__FOCUS_READER__.flush());
  await page.waitForTimeout(200);
  await page.evaluate(({ bookA }) => {
    return window.__FOCUS_READER__.applyText(bookA, {
      toast: false, persist: true, name: 'Jump Book A', type: 'txt'
    });
  }, { bookA });
  await waitRestored(page);
  await page.waitForTimeout(300);
  st = await page.evaluate(() => window.__FOCUS_READER__.getState());
  assert(st.index === 777, 'after jump, switch book and back retains position', report);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitReady(page);
  await waitRestored(page);
  await page.waitForTimeout(400);
  st = await page.evaluate(() => window.__FOCUS_READER__.getState());
  assert(st.index === 777, 'reload retains jumped position', report);

  // Listen mode: jump while paused, then Play — speech must start at exact target word
  await page.evaluate(() => {
    if (!window.__FOCUS_READER__.getState().listenMode) {
      document.getElementById('btnListen').click();
    }
    // Spy on speakFromWordIndex (more reliable than speechSynthesis mock timing)
    if (window.FocusListen && !window.FocusListen.__jumpSpy) {
      const orig = FocusListen.speakFromWordIndex.bind(FocusListen);
      FocusListen.speakFromWordIndex = function (words, start, wpm) {
        window.__LAST_SPEAK_START__ = {
          start: start,
          word: words[start],
          textHead: (words.slice(start, start + 5) || []).join(' ')
        };
        return orig(words, start, wpm);
      };
      FocusListen.__jumpSpy = true;
    }
  });
  await page.waitForTimeout(80);
  await page.evaluate(() => {
    const s = window.__FOCUS_READER__.getState();
    if (s.playing) document.getElementById('btnPlay').click();
  });
  await page.evaluate(() => window.__FOCUS_READER__.setIndex(200));
  await page.click('[data-jump-sec="10"]');
  await page.waitForTimeout(150);
  let listenIdx = await page.evaluate(() => window.__FOCUS_READER__.getState().index);
  assert(listenIdx === 250, 'Listen jump +10s -> index 250', report);
  await page.evaluate(() => { window.__LAST_SPEAK_START__ = null; });
  await page.click('#btnPlay');
  await page.waitForTimeout(200);
  const listenCheck = await page.evaluate(() => window.__LAST_SPEAK_START__);
  assert(!!listenCheck && listenCheck.start === 250 && listenCheck.word === 'alpha250',
    'Listen restarts speaking from target word (start=' + (listenCheck && listenCheck.start) + ' word=' + (listenCheck && listenCheck.word) + ')', report);

  // Also while playing: jump should restart from new target
  await page.evaluate(() => { window.__LAST_SPEAK_START__ = null; });
  await page.click('[data-jump-sec="-10"]');
  await page.waitForTimeout(200);
  const midPlay = await page.evaluate(() => ({
    idx: window.__FOCUS_READER__.getState().index,
    speak: window.__LAST_SPEAK_START__,
    playing: window.__FOCUS_READER__.getState().playing
  }));
  // 250 - 50 = 200; if still playing, speak should restart at 200
  assert(midPlay.idx === 200, 'mid-play Listen jump −10s -> 200', report);
  if (midPlay.playing) {
    assert(midPlay.speak && midPlay.speak.start === 200 && midPlay.speak.word === 'alpha200',
      'mid-play Listen restarts from new target', report);
  } else {
    // Mock may have ended the book; play again and confirm
    await page.click('#btnPlay');
    await page.waitForTimeout(150);
    const again = await page.evaluate(() => window.__LAST_SPEAK_START__);
    assert(again && again.start === 200 && again.word === 'alpha200',
      'Listen restarts from target after re-play', report);
  }

  const realErrors = report.consoleErrors.filter((e) =>
    !/Failed to load resource|gsi|accounts\.google|favicon|SpeechSynthesisUtterance/i.test(e)
  );
  assert(realErrors.length === 0, '0 console errors (filtered)', report);
  if (realErrors.length) console.log(realErrors);

  await browser.close();
  return report;
}

if (!BASE_ARG) await startServer();
const report = await runSuite(BASE, BASE_ARG ? 'live' : 'local');
writeFileSync(join(__dirname, 'e2e-jump-report.json'), JSON.stringify(report, null, 2));
if (server) server.close();
console.log('\n=== Summary ===');
console.log('passed', report.passed.length, 'failed', report.failed.length);
if (report.failed.length) process.exit(1);
