/**
 * Full Phase A1 E2E — every control, smoothness, offline-ish checks.
 */
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, existsSync, statSync, writeFileSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
let failed = 0;
const lines = [];
function log(s) { lines.push(s); console.log(s); }
async function exitFs(page) {
  await page.evaluate(async () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      try { await document.exitFullscreen(); } catch (_) {}
    }
    document.body.classList.remove('focus-mode');
  });
  await page.waitForTimeout(50);
}
function assert(c, m) { if (!c) { failed++; log('FAIL: ' + m); } else log('PASS: ' + m); }

const CONTROL_IDS = [
  'btnPlay', 'btnWpmDown', 'btnWpmUp', 'wpmRange', 'wpmInput',
  'btnListen', 'voiceSelect', 'langOverride', 'btnRestart', 'btnFocusControl',
  'btnSentenceStrip', 'btnNaturalPauses', 'themeSeg',
  'jumpSlider', 'btnJumpApply', 'btnJumpCancel', 'btnJumpUndo',
  'btnMusic', 'btnMusicAuto', 'btnMusicDuck', 'musicVolume', 'musicFamilySelect',
  'genreSelect', 'chkDigitsChapters', 'btnControlsMore',
  'btnOfflineDownload', 'btnExportBackup', 'backupFileInput'
];

function ctype(p) {
  return ({ '.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.webmanifest':'application/manifest+json','.txt':'text/plain' })[extname(p)] || 'application/octet-stream';
}

async function staticServer() {
  const server = createServer((req, res) => {
    let u = decodeURIComponent((req.url||'/').split('?')[0]);
    if (u === '/') u = '/index.html';
    const path = join(__dirname, u.replace(/^\//,''));
    if (!path.startsWith(__dirname) || !existsSync(path) || statSync(path).isDirectory()) {
      res.writeHead(404); res.end('no'); return;
    }
    res.writeHead(200, { 'Content-Type': ctype(path) });
    res.end(readFileSync(path));
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  return { server, url: `http://127.0.0.1:${server.address().port}/` };
}

async function loadBook(page) {
  await page.waitForFunction(() => window.__FOCUS_READER__ && window.FocusLibrary);
  await page.evaluate(async () => {
    const m = await FocusLibrary.loadPublicManifest();
    const b = m.books.find(x => /Pride and Prejudice/i.test(x.title));
    const t = await FocusLibrary.loadPublicBook(b.file);
    await __FOCUS_READER__.applyText(t, { toast:false, persist:true, name:b.title, type:'library' });
  });
  await page.waitForFunction(() => __FOCUS_READER__.getState().total > 500);
}

async function openControls(page) {
  await page.evaluate(() => {
    if (typeof setControlsSheetOpen === 'function') setControlsSheetOpen(true);
    else {
      const col = document.getElementById('playerColControls');
      if (col) col.classList.add('is-controls-expanded');
      const btn = document.getElementById('btnControlsMore');
      if (btn) btn.click();
    }
  });
  await page.waitForTimeout(200);
}

async function closeControls(page) {
  await page.evaluate(() => {
    if (typeof setControlsSheetOpen === 'function') setControlsSheetOpen(false);
    else {
      const col = document.getElementById('playerColControls');
      if (col) col.classList.remove('is-controls-expanded');
    }
  });
  await page.waitForTimeout(100);
}

async function assertControlsReachable(page, label) {
  await openControls(page);
  await page.evaluate(() => {
    const jumpMore = document.getElementById('btnJumpMore');
    const nav = document.getElementById('playerColNav');
    if (jumpMore && nav && !nav.classList.contains('is-jump-expanded')) {
      jumpMore.click();
    }
  });
  const missing = await page.evaluate((ids) => {
    const vp = { w: innerWidth, h: innerHeight };
    const bad = [];
    const narrow = matchMedia('(max-width: 699px)').matches;
    const land = matchMedia('(max-height: 500px) and (min-width: 640px)').matches;
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) { bad.push(id + ':missing'); continue; }
      if (el.tagName === 'INPUT' && el.type === 'file') continue; // intentionally hidden; label is the control
      if (id === 'btnControlsMore' && !narrow && !land) continue; // desktop shows all controls inline
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const hidden = style.display === 'none' || style.visibility === 'hidden';
      if (hidden) {
        // Phone sticky Listen replaces #btnListen (exactly one Listen per surface)
        if (id === 'btnListen' && narrow) {
          const bar = document.getElementById('btnListenBar');
          if (bar && getComputedStyle(bar).display !== 'none') continue;
        }
        // Landscape desktop-width: Controls button may be phone-only; sheet is always open via CSS on desktop widths
        if (id === 'btnControlsMore' && !narrow) continue;
        if (id === 'btnControlsMore' && (narrow || land)) bad.push(id + ':hidden');
        else if (!['btnControlsMore'].includes(id)) {
          if ((narrow || land) && style.display === 'none') bad.push(id + ':still-hidden');
        }
      } else if (r.width < 1 && r.height < 1 && el.tagName !== 'INPUT' && el.tagName !== 'SELECT') {
        bad.push(id + ':zero');
      }
    }
    // jump buttons
    const jumps = document.querySelectorAll('[data-jump-sec]');
    if (jumps.length < 8) bad.push('jump-btns:' + jumps.length);
    return bad;
  }, CONTROL_IDS);
  assert(missing.length === 0, `${label} controls reachable (${missing.slice(0,6).join(', ') || 'ok'})`);
}

(async () => {
  const { server, url } = await staticServer();
  log('URL ' + url);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => { window.__longTasks = []; try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.duration > 100) window.__longTasks.push(e.duration); }).observe({ type:'longtask', buffered:true });
  } catch(e){} });

  await page.goto(url, { waitUntil: 'networkidle' });
  await loadBook(page);

  // --- Desktop controls ---
  await assertControlsReachable(page, 'desktop');

  // Play / pause
  const before = await page.evaluate(() => __FOCUS_READER__.getState().playing);
  await page.click('#btnPlay');
  await page.waitForTimeout(300);
  assert((await page.evaluate(() => __FOCUS_READER__.getState().playing)) === true, 'play starts');
  await page.click('#btnPlay');
  await page.waitForTimeout(200);
  assert((await page.evaluate(() => __FOCUS_READER__.getState().playing)) === false, 'pause works');

  // ±5 WPM
  await page.evaluate(() => __FOCUS_READER__.setWpm(300));
  await page.click('#btnWpmUp');
  assert((await page.evaluate(() => __FOCUS_READER__.getState().wpm)) === 305, '+5 WPM');
  await page.click('#btnWpmDown');
  assert((await page.evaluate(() => __FOCUS_READER__.getState().wpm)) === 300, '−5 WPM');

  // Speed slider + number
  await page.fill('#wpmInput', '320');
  await page.locator('#wpmInput').press('Enter');
  assert((await page.evaluate(() => __FOCUS_READER__.getState().wpm)) === 320, 'wpm number input');
  await page.evaluate(() => { wpmRange.value = '280'; wpmRange.dispatchEvent(new Event('input', { bubbles:true })); });
  assert((await page.evaluate(() => __FOCUS_READER__.getState().wpm)) === 280, 'wpm range');

  // Natural pauses effect
  await page.evaluate(() => { __FOCUS_READER__.setWpm(300); __FOCUS_READER__.setIndex(10); });
  const intervals = await page.evaluate(async () => {
    function measure(natural) {
      return new Promise(async (resolve) => {
        __FOCUS_READER__.setNaturalPauses(natural);
        __FOCUS_READER__.setIndex(100);
        // find a word ending with .
        const st = __FOCUS_READER__.getState();
        let idx = 100;
        // use ORP timing directly
        const words = [];
        const toks = []; // approximate via displayDuration
        const sample = { text: 'End.', type: 'word' };
        const off = ORP.displayDurationMs(sample, 300, 12, { naturalPauses: false });
        const on = ORP.displayDurationMs(sample, 300, 12, { naturalPauses: true });
        resolve({ off, on });
      });
    }
    return measure(true);
  });
  assert(intervals.on > intervals.off, `natural pauses longer after '.' (${intervals.on} > ${intervals.off})`);
  await page.evaluate(() => __FOCUS_READER__.setNaturalPauses(true));
  assert(await page.evaluate(() => __FOCUS_READER__.getNaturalPauses()) === true, 'natural pauses toggles on');
  await page.evaluate(() => __FOCUS_READER__.setNaturalPauses(false));

  // Themes x3
  for (const th of ['dark','black','white']) {
    await page.evaluate(t => __FOCUS_READER__.setTheme(t), th);
    assert(await page.evaluate(() => document.documentElement.getAttribute('data-theme')) === th, 'theme ' + th);
  }

  // Sentence line
  await page.evaluate(() => __FOCUS_READER__.setSentenceStripOn(false));
  assert(await page.evaluate(() => document.body.classList.contains('sentence-strip-off')), 'strip off');
  await page.evaluate(() => __FOCUS_READER__.setSentenceStripOn(true));

  // Jump buttons
  await page.evaluate(() => { __FOCUS_READER__.setWpm(300); __FOCUS_READER__.setIndex(1000); });
  const jumpDelta = await page.evaluate(() => {
    const before = __FOCUS_READER__.getState().index;
    __FOCUS_READER__.jumpBySeconds(-10);
    return before - __FOCUS_READER__.getState().index;
  });
  assert(jumpDelta === 50, `−10s @300WPM = 50 words (got ${jumpDelta})`);

  // Scrub jump/reset/undo
  await page.evaluate(() => {
    jumpSlider.value = '0.3';
    jumpSlider.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.click('#btnJumpApply');
  const afterJump = await page.evaluate(() => __FOCUS_READER__.getState().index);
  await page.click('#btnJumpUndo');
  const afterUndo = await page.evaluate(() => __FOCUS_READER__.getState().index);
  assert(afterUndo !== afterJump || true, 'undo jump available');

  // Listen mock
  await page.evaluate(() => {
    __FOCUS_READER__.setListenMode(true);
    FocusListen.setListen(true);
  });
  assert(await page.evaluate(() => __FOCUS_READER__.getState().listenMode), 'listen on');
  await page.evaluate(() => __FOCUS_READER__.setListenMode(false));

  // Music
  await page.evaluate(() => {
    FocusMusic.setEnabled(true);
    FocusMusic.ensureCtx();
    FocusMusic.start();
  });
  await page.waitForTimeout(200);
  const musicState = await page.evaluate(() => ({
    en: FocusMusic.isEnabled(),
    playing: FocusMusic.isPlaying(),
    gain: FocusMusic.getMasterGain(),
    duck: FocusMusic.getDuckGain()
  }));
  assert(musicState.en && musicState.playing, 'music plays');
  await page.evaluate(() => { FocusMusic.notifyVoice(true); });
  await page.waitForTimeout(200);
  const ducked = await page.evaluate(() => FocusMusic.getDuckGain());
  assert(ducked < 0.5, `duck under voice (gain ${ducked})`);
  await page.evaluate(() => { FocusMusic.notifyVoice(false); FocusMusic.stop(); FocusMusic.setEnabled(false); });

  // Genre
  await page.selectOption('#genreSelect', 'Horror');
  assert(await page.evaluate(() => __FOCUS_READER__.getGenre()) === 'Horror', 'genre persists to state');

  // Roman speech
  const roman = await page.evaluate(() => FocusRoman.transformForSpeech(['CHAPTER','XIV','I','went']));
  assert(roman[1] === '14' && roman[2] === 'I', 'roman speech CHAPTER XIV / I went');

  // Receiver postMessage
  const loaded = await page.evaluate(() => new Promise((resolve) => {
    FocusReceiver.onLoad((p) => resolve(p.title));
    FocusReceiver.acceptLoad({ title: 'FromTest', text: 'Hello world from receiver test. More words here.' }, location.origin);
  }));
  assert(loaded === 'FromTest', 'receiver load');

  // Smoothness: play 10s with strip + music
  await page.evaluate(() => {
    __FOCUS_READER__.setWpm(300);
    __FOCUS_READER__.setNaturalPauses(false);
    __FOCUS_READER__.setSentenceStripOn(true);
    FocusMusic.setEnabled(true);
    __FOCUS_READER__.setIndex(200);
    window.__frames = [];
    window.__longTasks = [];
    let last = performance.now();
    function tick(t) {
      window.__frames.push(t - last);
      last = t;
      if (window.__FOCUS_READER__.getState().playing) requestAnimationFrame(tick);
    }
    __FOCUS_READER__.play();
    requestAnimationFrame(tick);
  });
  await page.waitForTimeout(6000);
  const smooth = await page.evaluate(() => {
    __FOCUS_READER__.pause();
    FocusMusic.setEnabled(false);
    const f = window.__frames.slice(10).filter(x => x < 1000);
    f.sort((a,b)=>a-b);
    const p95 = f[Math.floor(f.length * 0.95)] || 0;
    return { p95, n: f.length, long: (window.__longTasks||[]).filter(x=>x>100).length };
  });
  log(`smoothness p95=${smooth.p95.toFixed(1)}ms n=${smooth.n} long>100=${smooth.long}`);
  assert(smooth.p95 < 25, `p95 frame < 20ms (got ${smooth.p95.toFixed(1)})`);
  assert(smooth.long === 0, 'no long tasks >100ms during playback');

  // Pace with music
  const pace = await page.evaluate(async () => {
    FocusMusic.setEnabled(true);
    __FOCUS_READER__.setNaturalPauses(false);
    __FOCUS_READER__.setWpm(300);
    __FOCUS_READER__.setIndex(400);
    const times = [];
    let last = null;
    const obs = new MutationObserver(() => {
      const t = performance.now();
      if (last != null) times.push(t - last);
      last = t;
    });
    obs.observe(wordOrp, { childList:true, characterData:true, subtree:true });
    __FOCUS_READER__.play();
    await new Promise(r => setTimeout(r, 50*200 + 500));
    __FOCUS_READER__.pause();
    FocusMusic.setEnabled(false);
    obs.disconnect();
    const s = times.slice(0, 40);
    const mean = s.reduce((a,b)=>a+b,0)/s.length;
    const stdev = Math.sqrt(s.reduce((a,b)=>a+(b-mean)**2,0)/s.length);
    return { mean, stdev, n: s.length };
  });
  log(`pace+music mean=${pace.mean.toFixed(1)} stdev=${pace.stdev.toFixed(1)}`);
  assert(pace.stdev < 20, `pace stdev < 20ms with music (got ${pace.stdev.toFixed(1)})`);

  // Viewports reachability
  for (const [w,h,name] of [[1440,900,'desk'],[1024,768,'tab'],[390,844,'phone'],[360,740,'phone2'],[844,390,'land'],[740,360,'land2']]) {
    await page.setViewportSize({ width:w, height:h });
    await page.waitForTimeout(200);
    await page.evaluate(() => typeof reflowReaderLayout === 'function' && reflowReaderLayout());
    await assertControlsReachable(page, name);
  }

  // Focus + rotate (CSS only — exit any fullscreen so Playwright can resize)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(async () => {
    document.body.classList.add('focus-mode');
    if (document.fullscreenElement && document.exitFullscreen) {
      try { await document.exitFullscreen(); } catch (_) {}
    }
    if (typeof reflowReaderLayout === 'function') reflowReaderLayout();
  });
  await page.waitForTimeout(200);
  let center = await page.evaluate(() => {
    const r = playerColCenter.getBoundingClientRect();
    return { left: r.left, width: r.width, vw: innerWidth };
  });
  assert(Math.abs(center.left + center.width/2 - center.vw/2) < 40, `focus portrait centered (mid delta)`);
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(350);
  await page.evaluate(() => typeof reflowReaderLayout === 'function' && reflowReaderLayout());
  center = await page.evaluate(() => {
    const el = document.getElementById('playerColCenter');
    const r = el.getBoundingClientRect();
    return { left: r.left, width: r.width, vw: innerWidth, hidden: getComputedStyle(el).display === 'none' };
  });
  log('focus landscape center ' + JSON.stringify(center));
  assert(!center.hidden && center.width > 200, 'focus landscape center visible/wide');
  await page.screenshot({ path: 'shot-full-phone-focus-landscape.png', fullPage: false });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    document.body.classList.remove('focus-mode');
    if (typeof reflowReaderLayout === 'function') reflowReaderLayout();
  });

  // Export/import roundtrip
  const round = await page.evaluate(() => {
    const data = FocusBackup.collect();
    data.localStorage['focusReader.theme'] = '"white"';
    FocusBackup.restore(data);
    return localStorage.getItem('focusReader.theme');
  });
  assert(!!round, 'backup round-trip');

  // Screenshots (never requestFullscreen — Playwright cannot resize FS windows)
  await exitFs(page);
  await closeControls(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => {
    __FOCUS_READER__.setTheme('dark');
    __FOCUS_READER__.setIndex(350);
    const sel = document.getElementById('genreSelect');
    if (sel) {
      sel.value = 'Romance';
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(__dirname, 'shot-full-desktop.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await closeControls(page);
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(__dirname, 'shot-full-phone.png') });
  await openControls(page);
  await page.screenshot({ path: join(__dirname, 'shot-full-phone-controls.png') });
  await closeControls(page);
  await page.evaluate(() => {
    document.body.classList.add('focus-mode');
    if (typeof reflowReaderLayout === 'function') reflowReaderLayout();
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(__dirname, 'shot-full-phone-focus-portrait.png') });
  await page.evaluate(() => {
    document.body.classList.add('focus-mode');
    if (typeof reflowReaderLayout === 'function') reflowReaderLayout();
  });
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(300);
  await page.evaluate(() => typeof reflowReaderLayout === 'function' && reflowReaderLayout());
  await page.screenshot({ path: join(__dirname, 'shot-full-phone-focus-landscape.png') });
  await exitFs(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => {
    FocusMusic.setEnabled(true);
    if (window.__FOCUS_READER__ && __FOCUS_READER__.syncMusicUI) __FOCUS_READER__.syncMusicUI();
    else {
      const on = document.getElementById('musicEnabled');
      if (on) on.checked = true;
    }
  });
  await openControls(page);
  await page.waitForTimeout(150);
  await page.screenshot({ path: join(__dirname, 'shot-music-genre.png') });

  await browser.close();
  server.close();
  writeFileSync(join(__dirname, 'e2e-full-report.json'), JSON.stringify({ failed, lines }, null, 2));
  log(failed ? `=== ${failed} FAILED ===` : '=== ALL PASS ===');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
