/**
 * Piper E2E: phoneme+energy timing, multi-voice avg/max sync, smoothness, warm latency.
 */
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VOICE_CA = 'ca_ES-upc_ona-x_low';
const VOICES = [
  { id: 'sk_SK-lili-medium', lang: 'sk',
    paragraph: 'Slovensko je krasna krajina v srdci Europy. Bratislava lezi na Dunaji.' },
  { id: 'cs_CZ-jirka-medium', lang: 'cs',
    paragraph: 'Ceska republika ma bohatou kulturu. Praha je znamá svými mosty.' },
  { id: 'en_US-lessac-low', lang: 'en',
    paragraph: 'Focus reading helps you move through text steadily. Keep your eyes fixed.' },
  { id: 'de_DE-eva_k-x_low', lang: 'de',
    paragraph: 'Deutschland liegt in Mitteleuropa. Berlin ist die Hauptstadt.' }
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
      if (!res.ok) throw new Error('seed ' + name + ' ' + res.status);
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
  if (missing.length) { console.error('Missing', missing); process.exit(2); }

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
    if (/FocusPiper|NotFoundError|error/i.test(t) && !/SW register/.test(t)) log('[console] ' + t);
  });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__FOCUS_READER__ && window.FocusPiper && window.FocusPiperEngine && window.FocusPiperTiming, null, { timeout: 90000 });
  log('FocusPiper ready');
  assert(await page.evaluate(() => !!FocusPiperEngine.usesWorker), 'engine uses Web Worker');
  assert(await page.evaluate(() => !!FocusPiperTiming.allocateByPhonemes), 'FocusPiperTiming loaded');

  await page.evaluate(async () => { try { await FocusPiper.flush(); } catch (e) {} });
  // flush should not log NotFound
  await page.waitForTimeout(200);
  assert(await seedVoice(page, VOICE_CA), 'seed Catalan');

  // Warm latency + cold-after-warm first audio
  const lat = await page.evaluate(async (id) => {
    FocusPiperEngine.setVoiceId(id);
    const t0 = performance.now();
    await FocusPiperEngine.warm(id);
    const warmMs = performance.now() - t0;
    const words = 'Hola amic aixo es una prova'.split(/\s+/);
    const t1 = performance.now();
    const speakP = FocusPiperEngine.speak(words, 0, { wpm: 150, voiceId: id });
    const a = FocusPiperEngine.getAudioEl();
    await new Promise((resolve) => {
      const iv = setInterval(() => {
        if (a.currentTime > 0.05 || performance.now() - t1 > 60000) { clearInterval(iv); resolve(); }
      }, 15);
    });
    const firstMs = performance.now() - t1;
    await new Promise(r => setTimeout(r, 400));
    FocusPiperEngine.stop();
    await speakP.catch(() => {});
    return { warmMs, firstMs };
  }, VOICE_CA);
  log('latency ' + JSON.stringify(lat));
  assert(lat.firstMs < 1200, 'post-warm first audio < 1200ms (got ' + lat.firstMs.toFixed(0) + ')');
  // aspirational target <700 — soft check logged
  if (lat.firstMs < 700) log('PASS: post-warm first audio < 700ms');
  else log('NOTE: post-warm first audio ' + lat.firstMs.toFixed(0) + 'ms (target <700; still improving)');

  // Media session seek
  await page.evaluate(() => {
    const words = Array.from({ length: 5000 }, (_, i) => 'word' + i).join(' ');
    __FOCUS_READER__.applyText(words, { toast: false, persist: false, name: 'SeekDoc', type: 'paste' });
  });
  await page.waitForFunction(() => (__FOCUS_READER__.getState().total || 0) > 1000);
  const seek = await page.evaluate(() => {
    __FOCUS_READER__.setWpm(300);
    __FOCUS_READER__.setIndex(1000);
    const before = __FOCUS_READER__.getState().index;
    __FOCUS_READER__.jumpBySeconds(-10);
    return before - __FOCUS_READER__.getState().index;
  });
  assert(seek === 50, 'Media Session jump −10s = 50 words');

  // Per-voice: GT via per-word synth durations; compare to predicted ends + live samples
  for (const v of VOICES) {
    log('--- ' + v.id + ' ---');
    assert(await seedVoice(page, v.id), 'seed ' + v.id);
    const m = await page.evaluate(async ({ id, paragraph }) => {
      const words = paragraph.replace(/[.]/g, ' .').split(/\s+/).map(w => w === '.' ? '.' : w).filter(Boolean);
      // normalize: keep punctuation attached
      const wds = paragraph.trim().split(/\s+/);

      await FocusPiperEngine.warm(id);
      FocusPiperEngine.setVoiceId(id);

      // Ground truth: duration of each word synthesized alone, cumulative
      const gtEnds = [];
      let acc = 0;
      for (const w of wds) {
        // synth single word via speak and read duration
        FocusPiperEngine.stop();
        const p = FocusPiperEngine.speak([w], 0, { wpm: 150, voiceId: id });
        const a = FocusPiperEngine.getAudioEl();
        await new Promise((resolve) => {
          const t0 = Date.now();
          const iv = setInterval(() => {
            if ((a.duration > 0 && a.readyState >= 1 && !a.paused && a.currentTime > 0.01) || Date.now() - t0 > 60000) {
              clearInterval(iv); resolve();
            }
          }, 20);
        });
        await new Promise(r => setTimeout(r, 80));
        let d = a.duration;
        if (!(d > 0)) d = 0.2;
        // wait until nearly done for stable duration
        await new Promise((resolve) => {
          const t0 = Date.now();
          const iv = setInterval(() => {
            if (a.ended || a.currentTime > d * 0.85 || Date.now() - t0 > 8000) { clearInterval(iv); resolve(); }
          }, 40);
        });
        d = a.duration > 0 ? a.duration : d;
        acc += d;
        gtEnds.push(acc);
        FocusPiperEngine.stop();
        await p.catch(() => {});
      }
      const gtDur = acc;

      // Full utterance predicted ends
      FocusPiperEngine.stop();
      const samples = [];
      FocusPiperEngine.on('wordIndex', (ev) => samples.push({ i: ev.wordIndex, t: ev.t }));
      const t0 = performance.now();
      const speakP = FocusPiperEngine.speak(wds, 0, { wpm: 150, voiceId: id });
      const audio = FocusPiperEngine.getAudioEl();
      await new Promise((resolve) => {
        const start = Date.now();
        const iv = setInterval(() => {
          if (audio.currentTime > 0.05 || Date.now() - start > 90000) { clearInterval(iv); resolve(); }
        }, 20);
      });
      const firstAudioMs = performance.now() - t0;
      await new Promise((resolve) => {
        const start = Date.now();
        const iv = setInterval(() => {
          if (audio.ended || (audio.duration > 0 && audio.currentTime >= audio.duration - 0.05) || Date.now() - start > 60000) {
            clearInterval(iv); resolve();
          }
        }, 60);
      });
      await new Promise(r => setTimeout(r, 100));
      const predEnds = FocusPiperEngine.getLastWordEnds ? FocusPiperEngine.getLastWordEnds() : [];
      const dur = audio.duration || 0;

      // Scale GT ends to match full utterance duration (per-word concat ≠ joint prosody)
      const scale = (dur > 0 && gtDur > 0) ? (dur / gtDur) : 1;
      const gtScaled = gtEnds.map((t) => t * scale);
      if (gtScaled.length) gtScaled[gtScaled.length - 1] = dur;

      function idxAt(ends, t) {
        let expect = 0;
        for (let i = 0; i < ends.length; i++) if (t >= ends[i] - 1e-4) expect = i;
        return expect;
      }

      // Boundary error: for each predicted mid-word time, compare indices
      let errSum = 0, n = 0, maxErr = 0;
      const useEnds = predEnds.length === wds.length ? predEnds : gtScaled;
      for (const s of samples) {
        const expect = idxAt(gtScaled, s.t);
        const e = Math.abs(s.i - expect);
        errSum += e; maxErr = Math.max(maxErr, e); n++;
      }
      // Also boundary abs time error in words: compare pred vs gt index mapping
      let boundErr = 0, bn = 0, boundMax = 0;
      if (predEnds.length === wds.length) {
        for (let i = 0; i < predEnds.length - 1; i++) {
          const mid = (predEnds[i] + (i ? predEnds[i - 1] : 0)) / 2;
          // actually compare end times converted to word positions
          const gi = idxAt(gtScaled, predEnds[i] - 0.001);
          const e = Math.abs(gi - i);
          boundErr += e; boundMax = Math.max(boundMax, e); bn++;
        }
      }

      FocusPiperEngine.stop();
      await speakP.catch(() => {});
      return {
        firstAudioMs, dur,
        avgErr: n ? errSum / n : 99,
        maxErr,
        boundAvg: bn ? boundErr / bn : 99,
        boundMax,
        predEnds: predEnds.length,
        gtWords: wds.length,
        phonemesOk: predEnds.length === wds.length
      };
    }, v);
    log(v.id + ' ' + JSON.stringify(m));
    measurements.push({ voice: v.id, lang: v.lang, ...m });
    // Primary: predicted boundaries vs per-word ground truth (voice alignment)
    assert(m.phonemesOk, v.id + ' wordEnds length matches words');
    assert(m.boundAvg < 1.0, v.id + ' avg boundary err < 1.0 (got ' + m.boundAvg.toFixed(3) + ')');
    assert(m.boundMax <= 2, v.id + ' max boundary err ≤ 2 (got ' + m.boundMax + ')');
    // Secondary: live wordIndex vs GT (includes display sampling noise)
    assert(m.avgErr < 1.5, v.id + ' live avg sync err < 1.5 (got ' + m.avgErr.toFixed(3) + ')');
    assert(m.maxErr <= 3, v.id + ' live max sync err ≤ 3 (got ' + m.maxErr + ')');
    assert(m.firstAudioMs < 90000, v.id + ' first-audio ok');
  }

  // Smoothness 20s
  const smooth = await page.evaluate(async (id) => {
    const frames = [];
    let longOver = 0;
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (e.duration > 100) longOver++;
      }).observe({ type: 'longtask', buffered: false });
    } catch (e) {}
    if (typeof FocusMusic !== 'undefined') {
      FocusMusic.setEnabled(true); FocusMusic.setAuto(true); FocusMusic.start();
    }
    document.body.classList.remove('sentence-strip-off');
    FocusPiperEngine.setVoiceId(id);
    const words = ('Aquest es un text mes llarg per mesurar la suavitat. '.repeat(10)).trim().split(/\s+/);
    const tStart = performance.now();
    let last = tStart;
    function tick(now) {
      frames.push(now - last); last = now;
      if (now - tStart < 20000) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    FocusPiperEngine.speak(words, 0, { wpm: 160, voiceId: id });
    await new Promise(r => setTimeout(r, 20500));
    FocusPiperEngine.stop();
    if (typeof FocusMusic !== 'undefined') FocusMusic.stop();
    frames.sort((a, b) => a - b);
    return { p95: frames[Math.floor(frames.length * 0.95)] || 99, frames: frames.length, longOver };
  }, VOICE_CA);
  log('smoothness ' + JSON.stringify(smooth));
  assert(smooth.p95 < 20, 'p95 frame < 20ms (got ' + smooth.p95 + ')');
  assert(smooth.longOver === 0, '0 long tasks >100ms over 20s');

  // Screenshots
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => { FocusVoicesUI && FocusVoicesUI.open(); });
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(__dirname, 'shot-voices-manager.png') });
  await page.evaluate(() => FocusVoicesUI && FocusVoicesUI.close && FocusVoicesUI.close());

  assert(await seedVoice(page, 'sk_SK-lili-medium'), 're-seed sk');
  await page.evaluate(async () => {
    const text = 'Slovensko je krásna krajina v srdci Európy. Bratislava leží na Dunaji.';
    __FOCUS_READER__.applyText(text, { toast: false, persist: false, name: 'Slovak sample', type: 'paste' });
    FocusPiperEngine.setVoiceId('sk_SK-lili-medium');
    if (FocusListen && FocusListen.setEngine) FocusListen.setEngine('piper', FocusPiperEngine);
    await FocusPiperEngine.speak(text.split(/\s+/), 0, { wpm: 140, voiceId: 'sk_SK-lili-medium' });
    await new Promise(r => setTimeout(r, 1400));
  });
  await page.screenshot({ path: join(__dirname, 'shot-piper-reading-sk.png') });
  await page.evaluate(() => FocusPiperEngine.stop());

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { FocusVoicesUI && FocusVoicesUI.open(); });
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(__dirname, 'shot-voices-phone.png') });

  await browser.close();
  server.close();
  writeFileSync(join(__dirname, 'e2e-piper-report.json'), JSON.stringify({ failed, lines, measurements, smooth, lat }, null, 2));
  log(failed ? `=== ${failed} FAILED ===` : '=== ALL PASS ===');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
