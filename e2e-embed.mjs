/**
 * E2E: parent iframes ?embed=1 — handshake + layout at 400×820 and 400×600.
 */
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
let failed = 0;
const lines = [];
function log(s) { lines.push(s); console.log(s); }
function assert(c, m) { if (!c) { failed++; log('FAIL: ' + m); } else log('PASS: ' + m); }

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.wasm': 'application/wasm',
  '.data': 'application/octet-stream'
};
function ctype(p) { return MIME[extname(p)] || 'application/octet-stream'; }

function parentHtml(w, h) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>FR Embed</title>
<style>html,body{margin:0;height:100%;background:#111} iframe{border:0;display:block}</style>
</head><body>
<iframe id="fr" src="/?embed=1&cb=${w}x${h}" width="${w}" height="${h}"></iframe>
<script>
window.__frReady=0; window.__frLoaded=null;
window.addEventListener('message', function (ev) {
  var d = ev.data; if (!d || typeof d !== 'object') return;
  if (d.type === 'FR_READY') {
    window.__frReady++;
    if (!window.__frSent) {
      window.__frSent = true;
      ev.source.postMessage({
        type:'FR_LOAD', title:'Embed Test Book',
        text:'Alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omicron. Position readout words.',
        sourceUrl:'https://example.com/embed-test', genre:'Mystery/Crime'
      }, '*');
    }
  }
  if (d.type === 'FR_LOADED') window.__frLoaded = d;
});
</script></body></html>`;
}

async function staticServer() {
  const root = __dirname;
  let parent = parentHtml(400, 820);
  const server = createServer((req, res) => {
    let url = decodeURIComponent((req.url || '/').split('?')[0]);
    if (url === '/embed-parent.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(parent);
      return;
    }
    let path = url === '/' ? '/index.html' : url;
    const file = join(root, path.replace(/^\/+/, ''));
    if (!file.startsWith(root) || !existsSync(file) || (existsSync(file) && statSync(file).isDirectory())) {
      res.writeHead(404); res.end('no'); return;
    }
    res.writeHead(200, { 'Content-Type': ctype(file) });
    res.end(readFileSync(file));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return {
    server,
    origin: 'http://127.0.0.1:' + server.address().port,
    setSize(w, h) { parent = parentHtml(w, h); }
  };
}

function embedFrame(page) {
  return page.frames().find((f) => f !== page.mainFrame() && /embed=1/.test(f.url()))
    || page.frames().find((f) => f !== page.mainFrame());
}

async function assertEmbedLayout(page, label) {
  const frame = embedFrame(page);
  assert(!!frame, label + ' has iframe frame');
  if (!frame) return;
  const info = await frame.evaluate(() => {
    const vh = innerHeight;
    const listen = [...document.querySelectorAll('button')].filter((b) => {
      if (!/^Listen$/i.test((b.textContent || '').trim())) return false;
      const cs = getComputedStyle(b);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      const r = b.getBoundingClientRect();
      return r.width > 1 && r.height > 1;
    });
    const clipped = [];
    const ids = ['btnPlay', 'btnListenBar', 'btnControlsMore', 'btnWpmDown', 'btnWpmUp'];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) { clipped.push(id + ':missing'); return; }
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      const r = el.getBoundingClientRect();
      // allow 4px slack for subpixel / borders
      if (r.bottom > vh + 4 || r.top < -4 || r.width < 1) clipped.push(id + ':' + Math.round(r.bottom) + '>' + vh);
    });
    const sticky = document.querySelector('.controls-sticky') || document.getElementById('controls');
    const stickyBottom = sticky ? sticky.getBoundingClientRect().bottom : 0;
    const compact = document.getElementById('jumpCompactLabel');
    return {
      listenCount: listen.length,
      listenIds: listen.map((b) => b.id),
      stickyBottom,
      vh,
      clipped,
      compactText: compact ? compact.textContent : '',
      embed: document.body.classList.contains('is-embed')
    };
  });
  log(label + ' ' + JSON.stringify(info));
  assert(info.embed, label + ' is-embed');
  assert(info.listenCount === 1, label + ' exactly one visible Listen (got ' + info.listenCount + ')');
  assert(info.clipped.length === 0, label + ' no clipped primary controls (' + info.clipped.join(',') + ')');
  assert(info.stickyBottom <= info.vh + 4, label + ' sticky bar within viewport (' + info.stickyBottom + '/' + info.vh + ')');
  assert(/at\s+\d+/.test(info.compactText || '') || !/^0s\b/.test((info.compactText || '').trim()),
    label + ' scrub rest shows position (got "' + info.compactText + '")');
}

(async () => {
  const { server, origin, setSize } = await staticServer();
  const browser = await chromium.launch({ headless: true });

  for (const [w, h] of [[400, 820], [400, 600]]) {
    setSize(w, h);
    const context = await browser.newContext();
    await context.addInitScript(() => {
      // Avoid SW caching interfering across embed size iterations
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register = async () => ({});
      }
    });
    const page = await context.newPage();
    await page.goto(origin + '/embed-parent.html?v=' + w + 'x' + h + '&t=' + Date.now(), { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.__frReady >= 1, null, { timeout: 30000 });
    await page.waitForFunction(() => window.__frLoaded && window.__frLoaded.ok === true, null, { timeout: 30000 });
    assert(true, `${w}x${h} FR_LOADED`);
    const frame = embedFrame(page);
    await frame.waitForFunction(() => window.__FOCUS_READER__, null, { timeout: 15000 });
    await frame.evaluate(() => {
      if (__FOCUS_READER__.setIndex) __FOCUS_READER__.setIndex(5);
      if (typeof updateJumpScrubUI === 'function') updateJumpScrubUI();
    });
    await page.waitForTimeout(250);
    await assertEmbedLayout(page, `${w}x${h}`);
    await context.close();
  }

  await browser.close();
  server.close();
  writeFileSync(join(__dirname, 'e2e-embed-report.json'), JSON.stringify({ failed, lines }, null, 2));
  log(failed ? `=== ${failed} FAILED ===` : '=== ALL PASS ===');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
