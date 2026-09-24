import SentenceStrip from './sentence-strip.mjs';

let failed = 0;
function assert(cond, msg) {
  if (!cond) { failed++; console.log('FAIL:', msg); }
  else console.log('PASS:', msg);
}

console.log('=== windowing ===');
let w = SentenceStrip.computeWindow(0, 200, 50);
assert(w.start === 0 && w.end >= 99, 'start edge fills forward');
w = SentenceStrip.computeWindow(199, 200, 50);
assert(w.end === 199 && w.start <= 100, 'end edge fills backward');
w = SentenceStrip.computeWindow(100, 200, 50);
assert(w.start === 50 && w.end === 150, 'mid window 50..150');

console.log('\n=== align math ===');
// Fake layout: three words with known widths; current = middle
const layout = [
  { beforeW: 10, orpW: 8, afterW: 10 },  // 28
  { beforeW: 20, orpW: 10, afterW: 5 },   // 35, orp center at 28+gap+20+5
  { beforeW: 5, orpW: 5, afterW: 5 }
];
const gap = 8;
const anchorX = 200;
const r = SentenceStrip.computeAlignTranslate(layout, 1, gap, anchorX, 0);
const expectedOrp = 28 + gap + 20 + 10 / 2; // 28+8+20+5 = 61
assert(Math.abs(r.orpCenter - expectedOrp) < 0.01, 'orpCenter math = ' + r.orpCenter);
assert(Math.abs((r.orpCenter + r.translateX) - anchorX) < 0.01, 'aligned orp == anchor within 1px');
assert(Math.abs(r.translateX - (anchorX - expectedOrp)) < 0.01, 'translateX correct');

// Empty / single
const r0 = SentenceStrip.computeAlignTranslate([{ beforeW: 0, orpW: 12, afterW: 0 }], 0, 0, 100, 0);
assert(Math.abs(r0.orpCenter + r0.translateX - 100) < 0.01, 'single word aligns');

if (failed) { console.log(failed + ' FAILED'); process.exit(1); }
console.log('\nAll strip unit tests passed');
