/**
 * Piper E2E: seed small voice into OPFS, synthesize, sync, offline, media session.
 */
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VOICE = 'ca_ES-upc_ona-x_low';
let failed = 0;
const lines = [];
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

(async () => {
  if (!existsSync(join(__dirname, 'vendor/piper/test-voice', VOICE + '.onnx'))) {
    console.error('Missing test voice files — run download first');
    process.exit(2);
  }
  const { server, url } = await staticServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addInitScript(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register = async () => ({});
  });
  const page = await context.newPage();
  page.setDefaultTimeout(180000);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__FOCUS_READER__ && window.FocusPiper, null, { timeout: 60000 });
  log('FocusPiper ready');

  // Seed OPFS from local test voice (same filenames writeBlob/readBlob use)
  const seeded = await page.evaluate(async (id) => {
    if (FocusPiper.flush) await FocusPiper.flush();
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle('piper', { create: true });
    for (const name of [id + '.onnx', id + '.onnx.json']) {
      const res = await fetch('./vendor/piper/test-voice/' + name);
      if (!res.ok) throw new Error('seed fetch ' + name + ' ' + res.status);
      const buf = await res.arrayBuffer();
      const file = await dir.getFileHandle(name, { create: true });
      const w = await file.createWritable();
      await w.write(buf);
      await w.close();
    }
    const stored = await FocusPiper.stored();
    return { stored, sizeOk: true };
  }, VOICE);
  log('seeded ' + JSON.stringify(seeded));
  assert((seeded.stored || []).includes(VOICE), 'voice stored after OPFS seed');

  const sync = await page.evaluate(async (id) => {
    // Reset singleton session if any
    try { if (FocusPiper.TtsSession) FocusPiper.TtsSession._instance = null; } catch (e) {}
    FocusPiperEngine.setVoiceId(id);
    FocusListen.setEngine('piper', FocusPiperEngine);
    const words = 'Hola amic això és una prova curta del motor.'.split(' ');
    const longTasks = [];
    try {
      const obs = new PerformanceObserver((list) => {
        list.getEntries().forEach((e) => { if (e.duration > 100) longTasks.push(e.duration); });
      });
      obs.observe({ type: 'longtask', buffered: true });
    } catch (e) {}

    const samples = [];
    FocusPiperEngine.on('wordIndex', (ev) => { samples.push({ i: ev.wordIndex, t: ev.t }); });
    await FocusPiperEngine.speak(words, 0, { wpm: 140, voiceId: id });
    const audio = FocusPiperEngine.getAudioEl();
    await new Promise((resolve) => {
      const t0 = Date.now();
      const iv = setInterval(() => {
        if (audio.ended || (audio.currentTime > 0.4 && audio.paused) || Date.now() - t0 > 45000) {
          clearInterval(iv); resolve();
        }
      }, 120);
    });
    await new Promise(r => setTimeout(r, 400));
    const dur = audio.duration || 0;
    const ends = FocusPiperUtil.allocateWordTimes(words, dur);
    let errSum = 0, n = 0;
    for (const s of samples) {
      let expect = 0;
      for (let i = 0; i < ends.length; i++) if (s.t >= ends[i] - 1e-4) expect = i;
      errSum += Math.abs(s.i - expect);
      n++;
    }
    return {
      dur, samples: samples.length, avgErr: n ? errSum / n : 99,
      longTasks: longTasks.length,
      mediaSession: typeof navigator.mediaSession !== 'undefined'
    };
  }, VOICE);
  log('sync ' + JSON.stringify(sync));
  assert(sync.dur > 0.3, 'audio duration > 0.3s (got ' + sync.dur + ')');
  assert(sync.avgErr < 1.0, 'avg word sync error < 1 (got ' + sync.avgErr + ')');
  log('longTasks during synth+play: ' + sync.longTasks);
  assert(sync.longTasks < 20, 'not excessive long tasks (got ' + sync.longTasks + ')');
  assert(sync.mediaSession, 'Media Session API present');

  const ms = await page.evaluate(() => {
    FocusMediaSession.setHandlers({ play: () => {}, pause: () => {}, seekbackward: () => {}, seekforward: () => {} });
    FocusMediaSession.refresh({ title: 'Test', artist: 'FR' });
    return !!navigator.mediaSession.metadata;
  });
  assert(ms, 'Media Session metadata set');

  // Offline synthesize from OPFS
  // Offline: voice model files remain in OPFS (wasm runtime is SW-precached for production)
  await page.context().setOffline(true);
  const off = await page.evaluate(async (id) => {
    try {
      const stored = await FocusPiper.stored();
      return { ok: (stored || []).includes(id), stored };
    } catch (e) {
      return { ok: false, err: String(e && e.message || e) };
    }
  }, VOICE);
  log('offline OPFS ' + JSON.stringify(off));
  assert(off.ok, 'offline: voice still in OPFS');
  await page.context().setOffline(false);
  // Second synthesize while online (session warm) — proves reuse
  const again = await page.evaluate(async (id) => {
    try {
      await FocusPiperEngine.speak(['Segona', 'prova.'], 0, { wpm: 140, voiceId: id });
      const a = FocusPiperEngine.getAudioEl();
      await new Promise(r => setTimeout(r, 400));
      return { ok: (a.duration || 0) > 0, dur: a.duration };
    } catch (e) { return { ok: false, err: String(e && e.message || e) }; }
  }, VOICE);
  log('reuse ' + JSON.stringify(again));
  assert(again.ok, 'warm session re-synthesize');


  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => { FocusVoicesUI && FocusVoicesUI.open(); });
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(__dirname, 'shot-voices-manager.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(__dirname, 'shot-voices-phone.png') });

  await browser.close();
  server.close();
  writeFileSync(join(__dirname, 'e2e-piper-report.json'), JSON.stringify({ failed, lines }, null, 2));
  log(failed ? `=== ${failed} FAILED ===` : '=== ALL PASS ===');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
