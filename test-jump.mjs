import FocusJump from './jump.mjs';

let failed = 0;
function assert(cond, msg) {
  if (!cond) { failed++; console.log('FAIL:', msg); }
  else console.log('PASS:', msg);
}

console.log('=== seconds → words ===');
assert(FocusJump.secondsToWords(10, 300) === 50, '300 WPM 10s = 50');
assert(FocusJump.secondsToWords(30, 300) === 150, '300 WPM 30s = 150');
assert(FocusJump.secondsToWords(120, 300) === 600, '300 WPM 2m = 600');
assert(FocusJump.secondsToWords(300, 300) === 1500, '300 WPM 5m = 1500');
assert(FocusJump.secondsToWords(10, 450) === 75, '450 WPM 10s = 75');

console.log('\n=== log mapping + snap ===');
assert(FocusJump.sliderToSeconds(0) === 0, 'v=0 -> 0');
const a = FocusJump.sliderToSeconds(0.3);
const b = FocusJump.sliderToSeconds(0.6);
const c = FocusJump.sliderToSeconds(1);
assert(a > 0 && b > a && c >= b, 'positive side monotonic');
assert(FocusJump.sliderToSeconds(-0.3) === -FocusJump.sliderToSeconds(0.3), 'symmetric ±0.3');
assert(FocusJump.sliderToSeconds(-0.8) === -FocusJump.sliderToSeconds(0.8), 'symmetric ±0.8');
assert(FocusJump.NICE_STEPS.includes(Math.abs(FocusJump.sliderToSeconds(0.5))), 'snapped to nice step');
assert(Math.abs(FocusJump.sliderToSeconds(1)) === FocusJump.MAX_SEC, 'v=1 snaps to max 10h');

// Find a slider value near −2m
let found2m = false;
for (let v = -1; v <= 0; v += 0.001) {
  if (FocusJump.sliderToSeconds(v) === -120) { found2m = true; break; }
}
assert(found2m, 'some v maps to snapped −2m');

console.log('\n=== clamp ===');
let p = FocusJump.planJump(10, 1000, -120, 300); // −600 words from 10
assert(p.targetIndex === 0 && p.clamped && p.clampReason === 'start', 'clamp start');
p = FocusJump.planJump(900, 1000, 120, 300); // +600 from 900 -> end
assert(p.targetIndex === 999 && p.clamped && p.clampReason === 'end', 'clamp end');
p = FocusJump.planJump(500, 1000, -10, 300); // −50
assert(p.targetIndex === 450 && !p.clamped, 'mid-book no clamp');

console.log('\n=== format ===');
assert(FocusJump.formatSignedTime(-150) === '−2m 30s', 'format −2m 30s');
assert(FocusJump.formatSignedTime(3600 + 900) === '+1h 15m', 'format +1h 15m');
assert(FocusJump.formatSignedWords(-600) === '−600 words', 'format −600 words');

if (failed) {
  console.log('\n' + failed + ' FAILED');
  process.exit(1);
}
console.log('\nAll jump unit tests passed');
