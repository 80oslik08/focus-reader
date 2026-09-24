/** Unit tests: word timing allocation + WPM↔length_scale (no WASM required). */
function allocateWordTimes(words, durationSec) {
  var weights = [];
  var total = 0;
  for (var i = 0; i < words.length; i++) {
    var w = String(words[i] || '');
    var letters = w.replace(/[^A-Za-zÀ-ž0-9]/g, '').length || 1;
    var punct = /[.!?…]$/.test(w) ? 2.2 : /[,;:]$/.test(w) ? 1.2 : 0;
    var wt = Math.max(0.35, letters * 0.55 + punct);
    weights.push(wt);
    total += wt;
  }
  if (!words.length) return [];
  if (!(durationSec > 0) || !(total > 0)) {
    return words.map((_, i) => ((i + 1) / words.length) * (durationSec || 0));
  }
  var ends = [];
  var acc = 0;
  for (var j = 0; j < weights.length; j++) {
    acc += weights[j];
    ends.push((acc / total) * durationSec);
  }
  ends[ends.length - 1] = durationSec;
  return ends;
}
function wpmToLengthScale(wpm) {
  var w = Math.max(80, Math.min(600, Number(wpm) || 180));
  return Math.max(0.55, Math.min(2.2, 180 / w));
}

let failed = 0;
function assert(c, m) { if (!c) { failed++; console.log('FAIL', m); } else console.log('PASS', m); }

const words = ['Hello', 'world,', 'this', 'is', 'a', 'test.'];
const ends = allocateWordTimes(words, 10);
assert(ends.length === 6, 'length');
assert(ends.every((v, i) => i === 0 || v >= ends[i - 1]), 'monotonic');
assert(Math.abs(ends[ends.length - 1] - 10) < 1e-9, 'sums to duration');
assert(ends[5] > ends[4], 'last > prev');
// sentence-end word should get more share than tiny word
const e2 = allocateWordTimes(['a', 'end.'], 10);
assert(e2[1] - e2[0] > e2[0], 'punct word longer share');

assert(Math.abs(wpmToLengthScale(180) - 1) < 1e-9, '180→1.0');
assert(wpmToLengthScale(360) < 1, 'faster → lower scale');
assert(wpmToLengthScale(90) > 1, 'slower → higher scale');
assert(wpmToLengthScale(1000) === 0.55, 'clamp low');
assert(wpmToLengthScale(10) === 2.2, 'clamp high via max80→2.2');

// Phoneme-based allocation (mirrors piper-timing.js)
function phonemesPerWord(phonemes) {
  var groups = [[]];
  for (var i = 0; i < (phonemes || []).length; i++) {
    var p = phonemes[i];
    if (p === ' ' || p === '' || p === '_' || p === '|') {
      if (groups[groups.length - 1].length) groups.push([]);
    } else groups[groups.length - 1].push(p);
  }
  if (groups.length && !groups[groups.length - 1].length) groups.pop();
  return groups;
}
function allocateByPhonemes(words, phonemes, durationSec) {
  var groups = phonemesPerWord(phonemes);
  var weights = [], total = 0;
  for (var i = 0; i < words.length; i++) {
    var phCount = (groups[i] && groups[i].length) || 1;
    var punct = /[.!?…]$/.test(words[i]) ? 2.6 : /[,;:]$/.test(words[i]) ? 1.5 : 0;
    var wt = Math.max(0.4, phCount) + punct;
    weights.push(wt); total += wt;
  }
  var ends = [], acc = 0;
  for (var k = 0; k < weights.length; k++) {
    acc += weights[k]; ends.push((acc / total) * durationSec);
  }
  ends[ends.length - 1] = durationSec;
  return ends;
}
const ph = ['h','ə','l','o',' ','w','ɝ','l','d'];
const pe = allocateByPhonemes(['Hello','world'], ph, 2);
assert(pe.length === 2, 'phoneme ends length');
assert(Math.abs(pe[1] - 2) < 1e-9, 'phoneme ends duration');
assert(phonemesPerWord(ph).length === 2, 'phoneme groups = 2');
console.log(failed ? `FAILED ${failed}` : 'All piper timing tests passed (incl phonemes)');
process.exit(failed ? 1 : 0);
