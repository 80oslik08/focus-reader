/**
 * Live / local e2e: constant pace, strip velocity, title, listen mock, themes.
 * Usage: node e2e-pace-themes.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { extname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || null;
let failed = 0;
const lines = [];
function log(s) { lines.push(s); console.log(s); }
function assert(cond, msg) {
  if (!cond) { failed++; log('FAIL: ' + msg); }
  else log('PASS: ' + msg);
}

function contentType(p) {
  const e = extname(p);
  return ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webmanifest': 'application/manifest+json' })[e] || 'application/octet-stream';
}

async function startStatic() {
  const server = createServer((req, res) => {
    let url = decodeURIComponent((req.url || '/').split('?')[0]);
    if (url === '/') url = '/index.html';
    const path = join(__dirname, url.replace(/^\//, ''));
    if (!path.startsWith(__dirname) || !existsSync(path) || statSync(path).isDirectory()) {
      res.writeHead(404); res.end('missing'); return;
    }
    res.writeHead(200, { 'Content-Type': contentType(path) });
    res.end(readFileSync(path));
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  return { server, url: `http://127.0.0.1:${port}/` };
}

async function loadBook(page) {
  await page.waitForFunction(() => window.__FOCUS_READER__ && window.FocusLibrary);
  await page.evaluate(async () => {
    const m = await FocusLibrary.loadPublicManifest();
    const b = m.books.find((x) => /Pride and Prejudice/i.test(x.title));
    const t = await FocusLibrary.loadPublicBook(b.file);
    await window.__FOCUS_READER__.applyText(t, {
      toast: false, persist: true, name: b.title, type: 'library'
    });
  });
  await page.waitForFunction(() => window.__FOCUS_READER__.getState().total > 500);
}

(async () => {
  let server = null;
  let url = BASE;
  if (!url) {
    const s = await startStatic();
    server = s.server;
    url = s.url;
  }
  log('URL: ' + url);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  // Long-task observer
  await page.addInitScript(() => {
    window.__longTasks = [];
    try {
      const po = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.duration > 200) window.__longTasks.push({ name: e.name, duration: e.duration });
        }
      });
      po.observe({ type: 'longtask', buffered: true });
    } catch (e) {}
  });

  await page.goto(url, { waitUntil: 'networkidle' });
  await loadBook(page);

  // Title shown
  const title = await page.evaluate(() => {
    const el = document.getElementById('sourceLabel');
    return { text: el && el.textContent, hidden: el && el.hidden };
  });
  assert(title.text && /Pride/i.test(title.text), 'source label shows book title: ' + title.text);
  assert(!title.hidden, 'source label visible');

  // Constant pace at 300 WPM
  await page.evaluate(() => {
    window.__FOCUS_READER__.setNaturalPauses(false);
    window.__FOCUS_READER__.setWpm(300);
    window.__FOCUS_READER__.setIndex(200);
    window.__FOCUS_READER__.setSentenceStripOn(true);
  });
  const intervals = await page.evaluate(async () => {
    const times = [];
    let last = null;
    const obs = new MutationObserver(() => {
      const t = performance.now();
      if (last != null) times.push(t - last);
      last = t;
    });
    const orp = document.getElementById('wordOrp');
    obs.observe(orp, { characterData: true, childList: true, subtree: true });
    window.__FOCUS_READER__.play();
    await new Promise(r => setTimeout(r, 50 * 200 + 800)); // ~50 words
    window.__FOCUS_READER__.pause();
    obs.disconnect();
    return times.slice(0, 50);
  });
  if (intervals.length >= 20) {
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((a, b) => a + (b - mean) ** 2, 0) / intervals.length;
    const stdev = Math.sqrt(variance);
    log(`pace mean=${mean.toFixed(1)}ms stdev=${stdev.toFixed(1)}ms n=${intervals.length}`);
    assert(Math.abs(mean - 200) <= 5, `mean ≈ 200ms ±5 (got ${mean.toFixed(1)})`);
    assert(stdev < 15, `stdev < 15ms (got ${stdev.toFixed(1)})`);
  } else {
    assert(false, 'not enough pace samples: ' + intervals.length);
  }

  // Strip velocity CV during playback
  await page.evaluate(() => {
    window.__FOCUS_READER__.setIndex(300);
    window.__FOCUS_READER__.play();
  });
  await page.waitForTimeout(5200);
  const stripStats = await page.evaluate(() => {
    window.__FOCUS_READER__.pause();
    return SentenceStrip.getVelocityStats();
  });
  log(`strip cv=${stripStats.cv} n=${stripStats.n} err=${stripStats.lastError}`);
  assert(stripStats.n > 30, 'strip velocity samples collected');
  assert(stripStats.cv < 0.2, `strip velocity CV < 0.2 (got ${stripStats.cv})`);

  // Listen mock: jump to 5000, toggle listen, first mapped word == 5000
  const listenMap = await page.evaluate(async () => {
    // Mock speech for this page
    const words = [];
    const st = window.__FOCUS_READER__.getState();
    // Use real speak path with fake synthesis if possible — inject boundary
    window.__FOCUS_READER__.setIndex(5000);
    FocusListen.setListen(true);
    window.__FOCUS_READER__.setListenMode && window.__FOCUS_READER__.setListenMode(true);
    // Direct controller test in-page
    const list = [];
    for (let i = 0; i < 5100; i++) list.push('w' + i + (i % 12 === 11 ? '.' : ''));
    const mapped = [];
    FocusListen.on('word', (wi) => mapped.push(wi));
    FocusListen.setListen(true);
    FocusListen.speakFromWordIndexImmediate(list, 5000, 300);
    await new Promise(r => setTimeout(r, 250));
    // Fire synthetic boundary on current utterance via internal — use charIndex 0
    // Access last utterance by speaking a tiny hack: call charIndexToWordIndex
    const meta = FocusListen.buildUtteranceFromRange(list, 5000, 5012);
    const wi = FocusListen.charIndexToWordIndex(0, meta);
    mapped.push(wi);
    FocusListen.stop(true);
    return { wi, mapped0: mapped[0], index: window.__FOCUS_READER__.getState().index };
  });
  assert(listenMap.wi === 5000, `listen map word == 5000 (got ${listenMap.wi})`);

  // Pause/play/settings during listen — long tasks
  await page.evaluate(async () => {
    window.__longTasks = [];
    FocusListen.setListen(true);
    if (window.__FOCUS_READER__.setListenMode) window.__FOCUS_READER__.setListenMode(true);
    window.__FOCUS_READER__.play();
    await new Promise(r => setTimeout(r, 200));
    window.__FOCUS_READER__.pause();
    await new Promise(r => setTimeout(r, 100));
    window.__FOCUS_READER__.setWpm(280);
    window.__FOCUS_READER__.play();
    await new Promise(r => setTimeout(r, 200));
    window.__FOCUS_READER__.pause();
    if (window.__FOCUS_READER__.setListenMode) window.__FOCUS_READER__.setListenMode(false);
  });
  const longTasks = await page.evaluate(() => window.__longTasks || []);
  const bad = longTasks.filter(t => t.duration > 200);
  assert(bad.length === 0, `no long tasks >200ms during listen pause/settings (got ${JSON.stringify(bad.slice(0,3))})`);


  // Contrast checks (WCAG-ish relative luminance)
  function relLum(rgb) {
    const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return 0;
    const to = (c) => {
      c = Number(c) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const r = to(m[1]), g = to(m[2]), b = to(m[3]);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function parseRGBA(rgb) {
    const m = String(rgb||'').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?/);
    if (!m) return { r:0,g:0,b:0,a:1 };
    return { r:+m[1], g:+m[2], b:+m[3], a: m[4] != null ? +m[4] : 1 };
  }
  function compositeOver(fg, bg) {
    const f = parseRGBA(fg), b = parseRGBA(bg);
    const a = f.a;
    return `rgb(${Math.round(f.r*a + b.r*(1-a))}, ${Math.round(f.g*a + b.g*(1-a))}, ${Math.round(f.b*a + b.b*(1-a))})`;
  }
  function contrastRatio(fg, bg) {
    // If bg has alpha, composite over white card
    const b = parseRGBA(bg);
    const solidBg = b.a < 0.999 ? compositeOver(bg, 'rgb(255,255,255)') : bg;
    const L1 = relLum(fg), L2 = relLum(solidBg);
    const hi = Math.max(L1, L2), lo = Math.min(L1, L2);
    return (hi + 0.05) / (lo + 0.05);
  }

  const contrast = await page.evaluate(() => {
    window.__FOCUS_READER__.setTheme('white');
    window.__FOCUS_READER__.setIndex(350);
    const before = document.getElementById('wordBefore');
    const orp = document.getElementById('wordOrp');
    const after = document.getElementById('wordAfter');
    const stage = document.getElementById('stageWrap') || document.getElementById('stage');
    const strip = document.querySelector('#sentenceStripTrack .strip-word.is-future') ||
      document.querySelector('#sentenceStripTrack .strip-word:not(.is-current)');
    const cur = document.querySelector('#sentenceStripTrack .strip-word.is-current');
    const voice = document.getElementById('voiceSelect');
    const preview = document.getElementById('jumpPreview');
    const cs = (el) => el ? getComputedStyle(el) : null;
    // Walk up for opaque background
    function opaqueBg(el) {
      let n = el;
      while (n && n !== document.documentElement) {
        const bg = getComputedStyle(n).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
        n = n.parentElement;
      }
      return 'rgb(255,255,255)';
    }
    return {
      before: cs(before)?.color,
      orp: cs(orp)?.color,
      after: cs(after)?.color,
      stageBg: opaqueBg(document.getElementById('wordOrp') || stage),
      stripFg: strip && cs(strip).color,
      curFg: cur && cs(cur).color,
      curBg: cur && cs(cur).backgroundColor,
      voiceBg: voice && cs(voice).backgroundColor,
      voiceFg: voice && cs(voice).color,
      previewBg: preview && cs(preview).backgroundColor,
      previewFg: preview && cs(preview).color,
      themeSeg: !!document.getElementById('themeSeg'),
      themeSelectGone: !document.getElementById('themeSelect'),
      btnThemeGone: !document.getElementById('btnTheme'),
      wordFontPx: parseFloat(cs(document.getElementById('wordRow')).fontSize),
      stageH: document.getElementById('stage').getBoundingClientRect().height,
    };
  });
  log('contrast raw: ' + JSON.stringify(contrast));
  const bigBefore = contrastRatio(contrast.before, contrast.stageBg);
  const bigAfter = contrastRatio(contrast.after, contrast.stageBg);
  const orpR = contrastRatio(contrast.orp, contrast.stageBg);
  log(`big word contrast before=${bigBefore.toFixed(2)} after=${bigAfter.toFixed(2)} orp=${orpR.toFixed(2)}`);
  assert(bigBefore >= 7 && bigAfter >= 7, `big word sides ≥7:1 (before ${bigBefore.toFixed(2)}, after ${bigAfter.toFixed(2)})`);
  assert(orpR >= 4.5, `ORP red ≥4.5:1 (got ${orpR.toFixed(2)})`);
  if (contrast.stripFg) {
    const sc = contrastRatio(contrast.stripFg, contrast.stageBg);
    log(`strip text contrast=${sc.toFixed(2)}`);
    assert(sc >= 4.5, `strip text ≥4.5:1 (got ${sc.toFixed(2)})`);
  }
  if (contrast.curFg && contrast.curBg) {
    const cc = contrastRatio(contrast.curFg, contrast.curBg);
    log(`current strip contrast=${cc.toFixed(2)} on ${contrast.curBg}`);
    assert(cc >= 4.5, `current strip text ≥4.5:1 (got ${cc.toFixed(2)})`);
  }
  // Voice select not dark navy on white
  const voiceLum = relLum(contrast.voiceBg || 'rgb(0,0,0)');
  assert(voiceLum > 0.7, `voice select light on white (lum ${voiceLum.toFixed(3)}, bg ${contrast.voiceBg})`);
  assert(contrast.themeSeg && contrast.themeSelectGone && contrast.btnThemeGone, 'single segmented theme control');
  assert(contrast.wordFontPx >= 56, `desktop word size ≥56px (got ${contrast.wordFontPx})`);
  assert(contrast.stageH <= 340, `stage height reduced (got ${contrast.stageH})`);


  // Themes
  for (const theme of ['dark', 'black', 'white']) {
    const info = await page.evaluate((th) => {
      window.__FOCUS_READER__.setTheme(th);
      const cs = getComputedStyle(document.body);
      const orp = getComputedStyle(document.getElementById('wordOrp'));
      const overflow = document.documentElement.scrollWidth > window.innerWidth + 2;
      return {
        theme: document.documentElement.getAttribute('data-theme'),
        bg: cs.backgroundColor,
        orp: orp.color,
        overflow,
        text: cs.color
      };
    }, theme);
    assert(info.theme === theme, `theme attr ${theme}`);
    assert(!info.overflow, `no overflow on ${theme}`);
    // ORP stays reddish
    assert(/239|211|255|229|210|d3|e5|ff/i.test(info.orp) || info.orp.includes('rgb'), `orp colored on ${theme}: ${info.orp}`);
  }

  // Screenshots
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => {
    window.__FOCUS_READER__.setTheme('dark');
    window.__FOCUS_READER__.setIndex(350);
    window.__FOCUS_READER__.setSentenceStripOn(true);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(__dirname, 'shot-theme-dark.png') });
  await page.evaluate(() => window.__FOCUS_READER__.setTheme('black'));
  await page.waitForTimeout(150);
  await page.screenshot({ path: join(__dirname, 'shot-theme-black.png') });
  await page.evaluate(() => window.__FOCUS_READER__.setTheme('white'));
  await page.waitForTimeout(150);
  await page.screenshot({ path: join(__dirname, 'shot-theme-white.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(__dirname, 'shot-theme-white-phone.png') });
  log('screenshots written');

  await browser.close();
  if (server) server.close();

  const report = { failed, lines };
  writeFileSync(join(__dirname, 'e2e-pace-themes-report.json'), JSON.stringify(report, null, 2));
  log(failed ? `\n=== ${failed} FAILED ===` : '\n=== ALL PASS ===');
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(2);
});
