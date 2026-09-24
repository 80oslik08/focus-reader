/**
 * Headless ORP / tokenize smoke test for Focus Reader.
 * Run: node test-orp.mjs
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  alphaLength,
  orpIndexForLength,
  orpCharIndex,
  splitAtOrp,
  highlightOrpBracket,
  tokenize,
} from './orp.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, 'test-run.txt');
const lines = [];
let failed = 0;

function log(s = '') {
  lines.push(s);
  console.log(s);
}

function assert(cond, msg) {
  if (!cond) {
    failed++;
    log(`FAIL: ${msg}`);
  } else {
    log(`PASS: ${msg}`);
  }
}

log('Focus Reader — ORP test run');
log('===========================');
log('');

// Length → ORP index (0-based)
const lengthCases = [
  [1, 0],
  [2, 1],
  [3, 1],
  [4, 1],
  [5, 1],
  [6, 2],
  [7, 2],
  [9, 2],
  [10, 3],
  [13, 3],
  [14, 4],
  [28, 4],
];
for (const [len, idx] of lengthCases) {
  assert(orpIndexForLength(len) === idx, `orpIndexForLength(${len}) === ${idx}`);
}

log('');
log('Word ORP examples');
log('-----------------');

const wordCases = [
  ['a', 0, '[a]'],
  ['to', 1, 't[o]'],
  ['the', 1, 't[h]e'],
  ['read', 1, 'r[e]ad'],
  ['reading', 2, 're[a]ding'],
  ['recognition', 3, 'rec[o]gnition'],
  ['antidisestablishmentarianism', 4, 'anti[d]isestablishmentarianism'],
  ['Hello,', 1, 'H[e]llo,'],
];

for (const [word, expectIdx, expectFmt] of wordCases) {
  const len = alphaLength(word);
  const idx = orpCharIndex(word);
  const fmt = highlightOrpBracket(word);
  const { orp } = splitAtOrp(word);
  assert(idx === expectIdx, `"${word}" (len=${len}) ORP char index ${idx} === ${expectIdx}`);
  assert(fmt === expectFmt, `"${word}" highlight "${fmt}" === "${expectFmt}"`);
  log(`  ${word.padEnd(32)} len=${String(len).padStart(2)}  focus="${orp}"  →  ${fmt}`);
}

log('');
const sample = `Speed reading with RSVP presents one word at a time, aligned to an Optimal Recognition Point. Your eyes stay fixed while meaning flows forward.

Practice at a comfortable pace first.`;
const tokens = tokenize(sample);
const words = tokens.filter((t) => t.type === 'word').map((t) => t.text);
assert(words.length >= 20, `tokenized at least 20 words (got ${words.length})`);
assert(tokens.some((t) => t.type === 'para'), 'paragraph break token present');

log('');
log('First 20 words with ORP highlight');
log('---------------------------------');
words.slice(0, 20).forEach((w, i) => {
  log(`${String(i + 1).padStart(2)}. ${highlightOrpBracket(w)}`);
});

log('');
if (failed === 0) {
  log('RESULT: PASS (all assertions ok)');
} else {
  log(`RESULT: FAIL (${failed} assertion(s) failed)`);
}

writeFileSync(outPath, lines.join('\n') + '\n', 'utf8');
console.log(`\nWrote ${outPath}`);
process.exit(failed === 0 ? 0 : 1);
