/**
 * E2E: parent page iframes app?embed=1, waits for FR_READY, posts FR_LOAD, asserts FR_LOADED + text.
 */
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync } from 'fs';
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
  '.svg': 'image/svg+xml'
};

function ctype(p) { return MIME[extname(p)] || 'application/octet-stream'; }

const PARENT_HTML = `<!doctype html>
<html><head><meta charset="utf-8"><title>FR Embed Parent</title></head>
<body>
<h1>Embed parent</h1>
<iframe id="fr" src="/?embed=1" style="width:400px;height:700px;border:1px solid #333"></iframe>
<script>
window.__frLog = [];
window.__frReady = 0;
window.__frLoaded = null;
window.addEventListener('message', function (ev) {
  var d = ev.data;
  if (!d || typeof d !== 'object') return;
  window.__frLog.push(d.type);
  if (d.type === 'FR_READY') {
    window.__frReady++;
    if (!window.__frSent) {
      window.__frSent = true;
      ev.source.postMessage({
        type: 'FR_LOAD',
        title: 'Embed Test Book',
        text: 'Alpha beta gamma delta epsilon zeta. Chapter XIV begins here with more words for the reader.',
        sourceUrl: 'https://example.com/embed-test',
        genre: 'Mystery/Crime',
        wpmHint: 280
      }, '*');
    }
  }
  if (d.type === 'FR_LOADED') window.__frLoaded = d;
});
</script>
</body></html>`;

async function staticServer() {
  const root = __dirname;
  const server = createServer((req, res) => {
    let url = decodeURIComponent((req.url || '/').split('?')[0]);
    if (url === '/embed-parent.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(PARENT_HTML);
      return;
    }
    let path = url === '/' ? '/index.html' : url;
    const file = join(root, path.replace(/^\/+/, ''));
    if (!file.startsWith(root) || !existsSync(file)) {
      res.writeHead(404); res.end('no'); return;
    }
    try {
      const body = readFileSync(file);
      res.writeHead(200, { 'Content-Type': ctype(file) });
      res.end(body);
    } catch (e) {
      res.writeHead(500); res.end(String(e));
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  return { server, origin: 'http://127.0.0.1:' + port };
}

(async () => {
  const { server, origin } = await staticServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(origin + '/embed-parent.html', { waitUntil: 'domcontentloaded' });

  // Wait for FR_LOADED
  await page.waitForFunction(() => window.__frLoaded && window.__frLoaded.ok === true, null, { timeout: 30000 });
  const meta = await page.evaluate(() => ({
    ready: window.__frReady,
    loaded: window.__frLoaded,
    log: window.__frLog.slice(0, 20)
  }));
  log('meta ' + JSON.stringify(meta));
  assert(meta.ready >= 1, 'received FR_READY from iframe');
  assert(meta.loaded && meta.loaded.ok === true, 'FR_LOADED ok');

  const frame = page.frameLocator('#fr');
  // Compact embed class
  const embedOn = await page.evaluate(() => {
    const f = document.getElementById('fr');
    return f.contentDocument.documentElement.classList.contains('is-embed')
      || f.contentDocument.body.classList.contains('is-embed');
  });
  assert(embedOn, 'iframe has is-embed class');

  // Text loaded into reader — check word or source / toast path via evaluate in frame
  const loaded = await page.evaluate(() => {
    const w = document.getElementById('fr').contentWindow;
    const st = w.__FOCUS_READER__ && w.__FOCUS_READER__.getState && w.__FOCUS_READER__.getState();
    const name = st && (st.currentDocName || st.docName);
    const words = st && (st.total || st.totalWords);
    const textSample = (w.document.getElementById('source') || {}).value || '';
    const wordEl = w.document.getElementById('word') || w.document.querySelector('.word');
    return {
      name,
      words,
      hasAlpha: /Alpha/.test(textSample) || (wordEl && /Alpha|beta|gamma/i.test(wordEl.textContent || '')),
      textLen: textSample.length,
      genre: w.__FOCUS_READER__ && w.__FOCUS_READER__.getGenre && w.__FOCUS_READER__.getGenre()
    };
  });
  log('loaded state ' + JSON.stringify(loaded));
  assert(loaded.hasAlpha || (loaded.words && loaded.words > 5) || loaded.textLen > 20, 'embed text present in app');
  assert(!loaded.name || /Embed Test/i.test(loaded.name) || loaded.hasAlpha, 'title applied or text visible');

  // Header clutter hidden in embed
  const headerHidden = await page.evaluate(() => {
    const doc = document.getElementById('fr').contentDocument;
    const hdr = doc.querySelector('header.header, .header, .app-header, header');
    if (!hdr) return true;
    const cs = getComputedStyle(hdr);
    return cs.display === 'none' || cs.visibility === 'hidden' || hdr.offsetHeight === 0;
  });
  assert(headerHidden, 'embed hides header clutter');

  await browser.close();
  server.close();
  writeFileSync(join(__dirname, 'e2e-embed-report.json'), JSON.stringify({ failed, lines }, null, 2));
  log(failed ? `=== ${failed} FAILED ===` : '=== ALL PASS ===');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
