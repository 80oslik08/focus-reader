/**
 * Unit tests: voice-limit learning, language detect, charIndex→word, merge resume rules.
 */
import { readFileSync } from 'fs';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
let failed = 0;
function assert(cond, msg) {
  if (!cond) { failed++; console.log('FAIL: ' + msg); }
  else console.log('PASS: ' + msg);
}

function loadScript(name, sandbox) {
  const code = readFileSync(join(__dirname, name), 'utf8');
  vm.runInContext(code, sandbox);
}

const sandbox = {
  console, setTimeout, clearTimeout, clearInterval, setInterval,
  Date, Math, JSON, Object, Array, Promise, Error, Map,
  localStorage: {
    _d: {},
    getItem(k) { return this._d[k] ?? null; },
    setItem(k, v) { this._d[k] = String(v); },
    removeItem(k) { delete this._d[k]; }
  },
  navigator: { languages: ['en-US'], userAgent: 'Node' },
  speechSynthesis: undefined,
  SpeechSynthesisUtterance: undefined,
  window: null,
  globalThis: null
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

loadScript('voice-limit.js', sandbox);
loadScript('listen.js', sandbox);
loadScript('sync.js', sandbox);

const VoiceLimit = sandbox.VoiceLimit;
const FocusListen = sandbox.FocusListen;
const merge = sandbox.FocusSync._mergeBooks;

console.log('\n=== Voice limit learning ===');
assert(VoiceLimit._learnRaise(300, 400) === 350 || VoiceLimit._learnRaise(300, 400) >= 350, 'raise toward 400');
assert(VoiceLimit._learnRaise(300, 400) === Math.max(300 + 0.5 * 100, 400 - 5), 'raise formula');
assert(VoiceLimit._learnLower(400, 300) === 350, 'lower formula');
assert(VoiceLimit._clamp(50) === 100, 'clamp min');
assert(VoiceLimit._clamp(900) === 600, 'clamp max');

console.log('\n=== Language detection ===');
assert(FocusListen.detectLanguage('The and of to in that is for it as was with the book') === 'en', 'detect en');
assert(FocusListen.detectLanguage('Der die das und ist von zu den mit sich nicht und die') === 'de', 'detect de');
assert(FocusListen.detectLanguage('Привет мир это русский текст книга') === 'ru', 'detect ru');
assert(FocusListen.detectLanguage('Привіт світ це українська ї ї ї') === 'uk', 'detect uk');

console.log('\n=== charIndex → wordIndex ===');
const meta = {
  startWordIndex: 10,
  wordOffsets: [
    { wordIndex: 10, charStart: 0, charEnd: 5 },
    { wordIndex: 11, charStart: 6, charEnd: 9 },
    { wordIndex: 12, charStart: 10, charEnd: 15 }
  ]
};
assert(FocusListen.charIndexToWordIndex(0, meta) === 10, 'char 0 → word 10');
assert(FocusListen.charIndexToWordIndex(6, meta) === 11, 'char 6 → word 11');
assert(FocusListen.charIndexToWordIndex(12, meta) === 12, 'char 12 → word 12');
assert(FocusListen.charIndexToWordIndex(100, meta) === 12, 'past end → last');

console.log('\n=== Merge: never regress / never 0-wipe ===');
const id = 'book1';
const local = [{
  id, name: 'A', type: 'library', text: 'x', wordCount: 100,
  position: 300, wpm: 300, lastOpened: 5000, createdAt: 1000, updatedAt: 5000
}];
// Older remote with smaller position must not win
let m = merge(local, {}, {
  [id]: { id, position: 50, wpm: 300, updatedAt: 4000, deviceName: 'phone' }
}, {});
assert(m.docs[0].position === 300, 'older remote does not regress position');

// Newer remote with position 0 must not wipe local 300
m = merge(local, {}, {
  [id]: { id, position: 0, wpm: 300, updatedAt: 9000, deviceName: 'phone' }
}, {});
assert(m.docs[0].position === 300, 'remote 0 does not wipe local progress');

// Newer remote with higher position wins
m = merge(local, {}, {
  [id]: { id, position: 400, wpm: 320, updatedAt: 9000, deviceName: 'phone' }
}, {});
assert(m.docs[0].position === 400, 'newer remote higher position wins');

console.log('\n=== Upsert position preserve rule (pure) ===');
function nextPos(existing, incoming, opts) {
  opts = opts || {};
  if (opts.updateMetaOnly && existing) return existing.position || 0;
  if (opts.keepPosition && existing) return existing.position || 0;
  if (opts.resetPosition) return incoming;
  if (existing && (existing.position || 0) > 0 && (!incoming || incoming === 0)) return existing.position;
  return incoming;
}
assert(nextPos({ position: 300 }, 0, {}) === 300, 'upsert keeps 300 when incoming 0');
assert(nextPos({ position: 300 }, 120, {}) === 120, 'upsert takes real incoming');
assert(nextPos({ position: 300 }, 0, { resetPosition: true }) === 0, 'reset forces 0');
assert(nextPos({ position: 300 }, 0, { keepPosition: true }) === 300, 'keepPosition');

if (failed) {
  console.log('\n' + failed + ' FAILED');
  process.exit(1);
}
console.log('\nAll listen/resume unit tests passed');
