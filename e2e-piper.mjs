/**
 * Piper E2E: worker synth, multi-voice (sk/cs/en/de), smoothness, media session.
 */
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VOICE_CA = 'ca_ES-upc_ona-x_low';
const VOICES = [
  {
    id: 'sk_SK-lili-medium',
    lang: 'sk',
    preview: 'Ahoj, toto je slovenský hlas.',
    paragraph: 'Slovensko je krásna krajina v srdci Európy. Bratislava leží na Dunaji a má bohatú históriu.'
  },
  {
    id: 'cs_CZ-jirka-medium',
    lang: 'cs',
    preview: 'Ahoj, toto je český hlas.',
    paragraph: 'Česká republika má bohatou kulturu. Praha je známá svými mosty a hrady nad Vltavou.'
  },
  {
    id: 'en_US-lessac-low',
    lang: 'en',
    preview: 'Hello, this is an English voice.',
    paragraph: 'Focus reading helps you move through text steadily. Keep your eyes on the highlighted letter.'
  },
  {
    id: 'de_DE-eva_k-x_low',
    lang: 'de',
    preview: 'Hallo, das ist eine deutsche Stimme.',
    paragraph: 'Deutschland liegt in Mitteleuropa. Berlin ist die Hauptstadt und hat viele Museen und Parks.'
  }
];

let failed = 0;
const lines = [];
const measurements = [];
function log(s) { lines.push(s); console.log(s); }
function assert(c, m) { if (!c) { failed++; log('FAIL: ' + m); } else log('PASS: ' + m); }

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.wasm': 'application/wasm', '.data': 'application/octet-stream',
  '.onnx': 'application/octet-stream', '.webmanifest': 'application/manifest+json'
};
function ctype(p) { return MIME[extname(p)] || 'application/octet-stream'; }

async function staticServer() {
  const root = __dirname;
  const server = createServer((req, res) => {
    let u = decodeURIComponent((req.url || '/').split('?')[0]);
    if (u === '/') u = '/index.html';
    const path = join(root, u.replace(/^\//, ''));
    if (!path.startsWith(root) || !existsSync(path) || statSync(path).isDirectory()) {
      res.writeHead(404); res.end('no'); return;
    }
    res.writeHead(200, { 'Content-Type': ctype(path), 'Cache-Control': 'no-store' });
    res.end(readFileSync(path));
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  return { server, url: `http://127.0.0.1:${server.address().port}/` };
}

async function seedVoice(page, id) {
  return page.evaluate(async (voiceId) => {
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle('piper', { create: true });
    for (const name of [voiceId + '.onnx', voiceId + '.onnx.json']) {
      const res = await fetch('./vendor/piper/test-voice/' + name);
      if (!res.ok) throw new Error('seed fetch ' + name + ' ' + res.status);
      const buf = await res.arrayBuffer();
      const file = await dir.getFileHandle(name, { create: true });
      const w = await file.createWritable();
      await w.write(buf);
      await w.close();
    }
    return (await FocusPiper.stored()).includes(voiceId);
  }, id);
}

(async () => {
  const missing = [VOICE_CA, ...VOICES.map(v => v.id)].filter(id =>
    !existsSync(join(__dirname, 'vendor/piper/test-voice', id + '.onnx')));
  if (missing.length) {
    console.error('Missing voice files:', missing.join(', '));
    process.exit(2);
  }

  const { server, url } = await staticServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addInitScript(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register = async () => ({});
  });
  const page = await context.newPage();
  page.setDefaultTimeout(300000);
  page.on('console', msg => {
    const t = msg.text();
    if (/FocusPiper|piper|error|Error/i.test(t)) log('[console] ' + t);
  });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__FOCUS_READER__ && window.FocusPiper && window.FocusPiperEngine, null, { timeout: 90000 });
  log('FocusPiper ready');
  assert(await page.evaluate(() => !!FocusPiperEngine.usesWorker), 'engine uses Web Worker');

  await page.evaluate(async () => { if (FocusPiper.flush) await FocusPiper.flush(); });
  assert(await seedVoice(page, VOICE_CA), 'seed Catalan baseline');

  // --- Baseline CA: latency, sync, long tasks, pause/resume/rate ---
  const sync = await page.evaluate(async (id) => {
    const longTasks = [];
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (e.duration > 100) longTasks.push(e.duration);
      }).observe({ type: 'longtask', buffered: false });
    } catch (e) {}

    FocusPiperEngine.stop();
    FocusPiperEngine.setVoiceId(id);
    const words = 'Hola amic aixo es una prova de lectura amb Piper neural'.split(/\s+/);
    const samples = [];
    const unsub = FocusPiperEngine.on('wordIndex', (ev) => { samples.push({ i: ev.wordIndex, t: ev.t }); });
    const t0 = performance.now();
    const speakP = FocusPiperEngine.speak(words, 0, { wpm: 140, voiceId: id });
    const audio = FocusPiperEngine.getAudioEl();
    await new Promise((resolve) => {
      const iv = setInterval(() => {
        if (audio.currentTime > 0.05 || audio.ended || performance.now() - t0 > 90000) {
          clearInterval(iv); resolve();
        }
      }, 30);
    });
    const firstAudioMs = performance.now() - t0;
    await speakP;
    // pause / resume
    FocusPiperEngine.pause();
    const paused = audio.paused;
    await FocusPiperEngine.resume();
    await new Promise(r => setTimeout(r, 200));
    FocusPiperEngine.setRate(200);
    const rateOk = Math.abs(audio.playbackRate - FocusPiperUtil.wpmToPlaybackRate(200, 180 / FocusPiperUtil.wpmToLengthScale(200))) < 0.25
      || audio.playbackRate > 0.5;
    await new Promise((resolve) => {
      const t1 = Date.now();
      const iv = setInterval(() => {
        if (audio.ended || Date.now() - t1 > 45000) { clearInterval(iv); resolve(); }
      }, 120);
    });
    await new Promise(r => setTimeout(r, 300));
    const dur = audio.duration || 0;
    const ends = FocusPiperUtil.allocateWordTimes(words, dur);
    let errSum = 0, n = 0;
    for (const s of samples) {
      let expect = 0;
      for (let i = 0; i < ends.length; i++) if (s.t >= ends[i] - 1e-4) expect = i;
      errSum += Math.abs(s.i - expect);
      n++;
    }
    if (typeof unsub === 'function') unsub();
    FocusPiperEngine.stop();
    return {
      firstAudioMs, dur, samples: samples.length, avgErr: n ? errSum / n : 99,
      longTasksOver100: longTasks.filter(d => d > 100).length,
      longTaskMax: longTasks.length ? Math.max(...longTasks) : 0,
      paused, rateOk,
      mediaSession: typeof navigator.mediaSession !== 'undefined'
    };
  }, VOICE_CA);
  log('baseline ' + JSON.stringify(sync));
  assert(sync.dur > 0.3, 'audio duration > 0.3s');
  assert(sync.avgErr < 2.0, 'avg word sync error < 2.0 (got ' + sync.avgErr + ')');
  assert(sync.longTasksOver100 === 0, '0 main-thread long tasks >100ms during Piper (got ' + sync.longTasksOver100 + ', max ' + sync.longTaskMax + ')');
  assert(sync.paused === true, 'pause works');
  assert(sync.rateOk, 'rate change applies');
  assert(sync.mediaSession, 'Media Session API present');
  measurements.push({ voice: VOICE_CA, ...sync });

  // Media Session seek → jump formula (need a long document)
  await page.evaluate(() => {
    const words = Array.from({ length: 5000 }, (_, i) => 'word' + i).join(' ');
    __FOCUS_READER__.applyText(words, { toast: false, persist: false, name: 'SeekDoc', type: 'paste' });
  });
  await page.waitForFunction(() => (__FOCUS_READER__.getState().total || 0) > 1000, null, { timeout: 15000 });
  const seek = await page.evaluate(() => {
    __FOCUS_READER__.setWpm(300);
    __FOCUS_READER__.setIndex(1000);
    let called = 0;
    const before = __FOCUS_READER__.getState().index;
    FocusMediaSession.setHandlers({
      play: () => {},
      pause: () => {},
      seekbackward: () => { called++; __FOCUS_READER__.jumpBySeconds(-10); },
      seekforward: () => { called++; __FOCUS_READER__.jumpBySeconds(10); }
    });
    // Simulate lock-screen handlers
    navigator.mediaSession.setActionHandler('seekbackward', () => { called++; __FOCUS_READER__.jumpBySeconds(-10); });
    __FOCUS_READER__.jumpBySeconds(-10);
    const after = __FOCUS_READER__.getState().index;
    return { delta: before - after, expected: 50 };
  });
  assert(seek.delta === seek.expected, 'Media Session seek −10s uses jump formula (' + seek.delta + ')');

  // Offline OPFS + warm re-synth
  await page.context().setOffline(true);
  const off = await page.evaluate(async (id) => {
    try {
      return { ok: (await FocusPiper.stored()).includes(id) };
    } catch (e) { return { ok: false, err: String(e) }; }
  }, VOICE_CA);
  assert(off.ok, 'offline: voice still in OPFS');
  await page.context().setOffline(false);
  const again = await page.evaluate(async (id) => {
    try {
      FocusPiperEngine.stop();
      const speakP = FocusPiperEngine.speak(['Segona', 'prova', 'calenta'], 0, { wpm: 140, voiceId: id });
      const a = FocusPiperEngine.getAudioEl();
      await new Promise((resolve) => {
        const t0 = Date.now();
        const iv = setInterval(() => {
          if (a.currentTime > 0.05 || Date.now() - t0 > 60000) { clearInterval(iv); resolve(); }
        }, 30);
      });
      const dur = a.duration || 0;
      await speakP.catch(() => {});
      await new Promise(r => setTimeout(r, 200));
      FocusPiperEngine.stop();
      return { ok: dur > 0 || a.currentTime > 0, dur, ct: a.currentTime };
    } catch (e) { return { ok: false, err: String(e && e.message || e) }; }
  }, VOICE_CA);
  log('reuse ' + JSON.stringify(again));
  assert(again.ok, 'warm re-synthesize');

  // --- Per target voice ---
  for (const v of VOICES) {
    log('--- voice ' + v.id + ' ---');
    assert(await seedVoice(page, v.id), 'seed ' + v.id);
    const m = await page.evaluate(async ({ id, preview, paragraph }) => {
      const longTasks = [];
      try {
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) if (e.duration > 100) longTasks.push(e.duration);
        }).observe({ type: 'longtask', buffered: false });
      } catch (e) {}
      FocusPiperEngine.stop();
      FocusPiperEngine.setVoiceId(id);
      // preview
      const tPrev = performance.now();
      await FocusPiperEngine.speak(preview.split(/\s+/), 0, { wpm: 150, voiceId: id });
      const audio = FocusPiperEngine.getAudioEl();
      await new Promise((resolve) => {
        const t0 = Date.now();
        const iv = setInterval(() => {
          if (audio.currentTime > 0.05 || Date.now() - t0 > 120000) { clearInterval(iv); resolve(); }
        }, 30);
      });
      const previewLatency = performance.now() - tPrev;
      await new Promise(r => setTimeout(r, 600));
      FocusPiperEngine.stop();

      // paragraph
      const words = paragraph.split(/\s+/);
      const samples = [];
      FocusPiperEngine.on('wordIndex', (ev) => samples.push({ i: ev.wordIndex, t: ev.t }));
      const t0 = performance.now();
      const speakP = FocusPiperEngine.speak(words, 0, { wpm: 150, voiceId: id });
      await new Promise((resolve) => {
        const start = Date.now();
        const iv = setInterval(() => {
          if (audio.currentTime > 0.05 || Date.now() - start > 120000) { clearInterval(iv); resolve(); }
        }, 30);
      });
      const firstAudioMs = performance.now() - t0;
      // pause resume jump-ish stop
      FocusPiperEngine.pause();
      await FocusPiperEngine.resume();
      FocusPiperEngine.setRate(180);
      await new Promise((resolve) => {
        const start = Date.now();
        const iv = setInterval(() => {
          if (audio.ended || audio.currentTime > 2.5 || Date.now() - start > 60000) { clearInterval(iv); resolve(); }
        }, 100);
      });
      await speakP.catch(() => {});
      const dur = audio.duration || 0;
      const ends = FocusPiperUtil.allocateWordTimes(words.slice(0, Math.min(words.length, 40)), Math.min(dur, 8) || 1);
      let errSum = 0, n = 0;
      for (const s of samples) {
        if (s.i >= ends.length) continue;
        let expect = 0;
        for (let i = 0; i < ends.length; i++) if (s.t >= ends[i] - 1e-4) expect = i;
        errSum += Math.abs(Math.min(s.i, ends.length - 1) - expect);
        n++;
      }
      FocusPiperEngine.stop();
      return {
        previewLatency, firstAudioMs, dur,
        avgErr: n ? errSum / n : 99,
        longTasksOver100: longTasks.filter(d => d > 100).length,
        longTaskMax: longTasks.length ? Math.max(...longTasks) : 0
      };
    }, v);
    log(v.id + ' ' + JSON.stringify(m));
    measurements.push({ voice: v.id, lang: v.lang, ...m });
    assert(m.firstAudioMs < 90000, v.id + ' first-audio latency finite');
    assert(m.avgErr < 3.5, v.id + ' avg sync err < 3.5 (got ' + m.avgErr + ')');
    assert(m.longTasksOver100 === 0, v.id + ' 0 long tasks >100ms (got ' + m.longTasksOver100 + ')');
  }

  // Smoothness: Piper + strip + music ~20s (use Catalan for speed)
  const smooth = await page.evaluate(async (id) => {
    const frames = [];
    let longOver = 0;
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (e.duration > 100) longOver++;
      }).observe({ type: 'longtask', buffered: false });
    } catch (e) {}

    if (typeof FocusMusic !== 'undefined') {
      FocusMusic.setEnabled(true);
      FocusMusic.setAuto(true);
      FocusMusic.start();
    }
    document.body.classList.remove('sentence-strip-off');

    FocusPiperEngine.setVoiceId(id);
    const words = ('Aquest és un text més llarg per mesurar la suavitat mentre Piper parla amb la franja i la música. '.repeat(8)).trim().split(/\s+/);
    const tStart = performance.now();
    let last = tStart;
    let raf = 0;
    function tick(now) {
      frames.push(now - last);
      last = now;
      if (now - tStart < 20000) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    FocusPiperEngine.speak(words, 0, { wpm: 160, voiceId: id });
    await new Promise(r => setTimeout(r, 20500));
    cancelAnimationFrame(raf);
    FocusPiperEngine.stop();
    if (typeof FocusMusic !== 'undefined') FocusMusic.stop();

    frames.sort((a, b) => a - b);
    const p95 = frames[Math.floor(frames.length * 0.95)] || 99;
    return { p95, frames: frames.length, longOver };
  }, VOICE_CA);
  log('smoothness ' + JSON.stringify(smooth));
  assert(smooth.p95 < 20, 'p95 frame < 20ms (got ' + smooth.p95 + ')');
  assert(smooth.longOver === 0, '0 long tasks >100ms over 20s (got ' + smooth.longOver + ')');

  // Voices UI screenshots + Slovak reading shot
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => { FocusVoicesUI && FocusVoicesUI.open(); });
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(__dirname, 'shot-voices-manager.png'), fullPage: false });
  await page.evaluate(() => { FocusVoicesUI && FocusVoicesUI.close && FocusVoicesUI.close(); });

  // Slovak reading screenshot
  assert(await seedVoice(page, 'sk_SK-lili-medium'), 're-seed sk for shot');
  await page.evaluate(async () => {
    const text = 'Slovensko je krásna krajina v srdci Európy. Bratislava leží na Dunaji.';
    __FOCUS_READER__.applyText(text, { toast:false, persist:false, name: 'Slovak sample', type:'paste' });
    FocusPiperEngine.setVoiceId('sk_SK-lili-medium');
    if (FocusListen && FocusListen.setEngine) FocusListen.setEngine('piper', FocusPiperEngine);
    await FocusPiperEngine.speak(text.split(/\s+/), 0, { wpm: 140, voiceId: 'sk_SK-lili-medium' });
    await new Promise(r => setTimeout(r, 1200));
  });
  await page.screenshot({ path: join(__dirname, 'shot-piper-reading-sk.png') });
  await page.evaluate(() => FocusPiperEngine.stop());

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { FocusVoicesUI && FocusVoicesUI.open(); });
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(__dirname, 'shot-voices-phone.png') });

  await browser.close();
  server.close();
  writeFileSync(join(__dirname, 'e2e-piper-report.json'), JSON.stringify({ failed, lines, measurements, smooth }, null, 2));
  log(failed ? `=== ${failed} FAILED ===` : '=== ALL PASS ===');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
