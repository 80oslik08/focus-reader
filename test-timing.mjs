/**
 * Constant-pace timing + text cleanup unit tests
 */
import {
  tokenize,
  displayDurationMs,
  estimateRemainingMs,
  baseMs,
  cleanRawToken,
  speechCleanWord,
  findNearestWordIndex,
} from './orp.mjs';

let failed = 0;
function assert(cond, msg) {
  if (!cond) { failed++; console.log('FAIL:', msg); }
  else console.log('PASS:', msg);
}

const wpm = 300;
const base = baseMs(wpm);
assert(Math.abs(base - 200) < 1e-9, 'baseMs(300) === 200');

const tokens = tokenize('Hi there world. Next');
const words = tokens.filter(t => t.type === 'word');
assert(words.length >= 4, 'tokenized words');

for (const t of words) {
  const d = displayDurationMs(t, wpm, 0, { naturalPauses: false });
  assert(Math.abs(d - 200) < 1e-6, `constant duration for "${t.text}" == 200 (got ${d})`);
}

const indices = [];
tokens.forEach((t, i) => { if (t.type === 'word') indices.push(i); });
const rem = estimateRemainingMs(tokens, indices, 0, wpm, { naturalPauses: false });
assert(Math.abs(rem - indices.length * 200) < 1e-6, `estimate = n*200 (${rem})`);

// Natural pauses ON should differ for long words / punct
const long = { text: 'antidisestablishmentarianism', type: 'word' };
const dNat = displayDurationMs(long, wpm, 0, { naturalPauses: true });
const dConst = displayDurationMs(long, wpm, 0, { naturalPauses: false });
assert(dNat > dConst, `natural pauses lengthen long words (${dNat} > ${dConst})`);

assert(cleanRawToken('_Sense_') === 'Sense', "_Sense_ -> Sense");
assert(cleanRawToken('*Hello*') === 'Hello', "*Hello* -> Hello");
assert(cleanRawToken('[Illustration]') === '', '[Illustration] skipped');
assert(cleanRawToken('foo--bar') === 'foo—bar', 'double hyphen to em dash');

const cleaned = tokenize('See _Sense_ and [Illustration] Sensibility.');
const cw = cleaned.filter(t => t.type === 'word').map(t => t.text);
assert(cw.includes('Sense'), 'Sense present after cleanup');
assert(!cw.some(w => /Illustration/i.test(w)), 'Illustration removed');
assert(!cw.some(w => w.includes('_')), 'no underscores in tokens');

assert(speechCleanWord('_Hello_') === 'Hello' || speechCleanWord('_Hello_') === 'Hello', 'speech clean');
assert(!speechCleanWord('***').includes('*'), 'speech strips stars');
assert(speechCleanWord('Hello,').endsWith(','), 'keeps comma');

const list = ['a','b','c','Sense','e','f'];
assert(findNearestWordIndex(list, 0, 'Sense', 50) === 3, 'findNearest Sense');
assert(findNearestWordIndex(list, 3, 'Sense', 50) === 3, 'exact match');

console.log(failed ? `\n${failed} FAILED` : '\nAll timing/cleanup tests passed');
process.exit(failed ? 1 : 0);
