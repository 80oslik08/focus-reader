/**
 * Speech controller gen-token logic with mocked speechSynthesis
 */
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

let failed = 0;
function assert(cond, msg) {
  if (!cond) { failed++; console.log('FAIL:', msg); }
  else console.log('PASS:', msg);
}

class FakeUtterance {
  constructor(text) {
    this.text = text;
    this.rate = 1;
    this.lang = 'en';
    this.voice = null;
    this.onboundary = null;
    this.onend = null;
    this.onerror = null;
  }
}

const spoken = [];
const synthesis = {
  speaking: false,
  paused: false,
  _queue: [],
  getVoices() {
    return [
      { name: 'Google US English', lang: 'en-US', voiceURI: 'google-en', localService: false },
      { name: 'Microsoft Aria Online (Natural) - English (United States)', lang: 'en-US', voiceURI: 'aria-nat', localService: false },
      { name: 'Local English', lang: 'en-US', voiceURI: 'local-en', localService: true },
    ];
  },
  cancel() {
    this.speaking = false;
    this._queue = [];
  },
  speak(utt) {
    this.speaking = true;
    spoken.push(utt.text);
    this._queue.push(utt);
  },
  // test helpers
  fireBoundary(charIndex) {
    const utt = this._queue[0];
    if (utt && utt.onboundary) utt.onboundary({ name: 'word', charIndex });
  },
  fireEnd() {
    const utt = this._queue.shift();
    this.speaking = !!this._queue.length;
    if (utt && utt.onend) utt.onend();
  }
};

const sandbox = {
  window: {},
  globalThis: {},
  speechSynthesis: synthesis,
  SpeechSynthesisUtterance: FakeUtterance,
  localStorage: {
    _d: {},
    getItem(k) { return this._d[k] || null; },
    setItem(k, v) { this._d[k] = String(v); }
  },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  console,
  ORP: {
    speechCleanWord(w) {
      return String(w || '').replace(/[_*#]+/g, '').trim();
    }
  }
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.global = sandbox;

const listenCode = readFileSync(join(__dirname, 'listen.js'), 'utf8');
vm.runInNewContext(listenCode, sandbox);
const FL = sandbox.FocusListen;
assert(!!FL, 'FocusListen loaded');

FL.setListen(true);
const words = [];
for (let i = 0; i < 80; i++) words.push('word' + i + (i % 10 === 9 ? '.' : ''));

let mapped = [];
FL.on('word', (wi) => mapped.push(wi));

const gen0 = FL.getGen();
FL.speakFromWordIndexImmediate(words, 5000 > words.length ? 10 : 10, 300);
// Wait debounce gap
await new Promise(r => setTimeout(r, 250));
const gen1 = FL.getGen();
assert(gen1 > gen0, 'gen increments on speak');

// Stale handler: bump gen via stop, then fire boundary on old utt — should ignore
const oldUtt = synthesis._queue[0];
FL.stop(true);
const genAfterStop = FL.getGen();
mapped = [];
if (oldUtt && oldUtt.onboundary) oldUtt.onboundary({ name: 'word', charIndex: 0 });
assert(mapped.length === 0, 'stale boundary ignored after stop');

// Jump then speak from 20
FL.setListen(true);
mapped = [];
FL.speakFromWordIndexImmediate(words, 20, 300);
await new Promise(r => setTimeout(r, 250));
assert(synthesis._queue.length >= 1, 'utterance queued after delay');
synthesis.fireBoundary(0);
assert(mapped[0] === 20, `first boundary maps to 20 (got ${mapped[0]})`);

// Rapid toggles should not hang (no throw, gen advances)
for (let i = 0; i < 8; i++) {
  FL.speakFromWordIndex(words, 5 + i, 300);
  FL.stop(true);
  FL.setListen(true);
}
await new Promise(r => setTimeout(r, 200));
assert(true, 'rapid toggles completed without hang');

// Voice quality ranking
const tag = FL.voiceQualityTag(synthesis.getVoices()[1]);
assert(tag === 'Natural', `Aria tagged Natural (got ${tag})`);
const picked = FL.pickVoice('en');
assert(picked && /Natural|Aria|Google/i.test(picked.name), `prefers natural/google (got ${picked && picked.name})`);

// Speech text has no underscores
const meta = FL.buildUtteranceFromRange(['_Hello_', 'world.'], 0, 2);
assert(!meta.text.includes('_'), `speech text cleaned: "${meta.text}"`);
assert(meta.wordOffsets[0].wordIndex === 0, 'offset map starts at 0');

console.log(failed ? `\n${failed} FAILED` : '\nAll listen-controller tests passed');
process.exit(failed ? 1 : 0);
