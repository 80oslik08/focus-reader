import { readFileSync } from 'fs';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
const code = readFileSync(join(__dirname, 'roman.js'), 'utf8');
const sandbox = { window: {}, globalThis: {}, console };
sandbox.window = sandbox; sandbox.globalThis = sandbox;
vm.runInNewContext(code, sandbox);
const R = sandbox.FocusRoman;
let failed = 0;
function assert(c, m) { if (!c) { failed++; console.log('FAIL', m); } else console.log('PASS', m); }

assert(R.romanToInt('XIV') === 14, 'XIV=14');
assert(R.romanToInt('XLII') === 42, 'XLII=42');
assert(R.romanToInt('MCMXCIX') === 1999, 'MCMXCIX');
assert(!R.isValidRoman('MIXED'), 'MIXED invalid as full roman? ' + R.isValidRoman('MIXED'));
// MIX is valid roman 1009 — but shouldConvert for prose 'MIX' without context is false
assert(R.shouldConvert(['the','MIX','of'], 1, {}) === false, 'MIX in prose not converted');

const chap = ['CHAPTER', 'XIV', 'began'];
assert(R.shouldConvert(chap, 1, {}), 'CHAPTER XIV converts');
assert(R.convertWord('XIV') === '14', 'convert XIV');
const speech = R.transformForSpeech(['CHAPTER', 'XIV', 'began']);
assert(speech[0] === 'CHAPTER' && speech[1] === '14', 'CHAPTER XIV -> Chapter context keeps word, 14: ' + speech.join(' '));

const prose = ['I', 'went', 'home'];
assert(R.transformForSpeech(prose).join(' ') === 'I went home', 'I went unchanged');

const heading = R.transformForSpeech(['XLII.'], [{type:'para'},{type:'word'}], [1]);
// without tokens heading detection: lineStart via tokens
const words = ['XLII.'];
const tokens = [{ type: 'para' }, { type: 'word', text: 'XLII.' }];
const idxs = [1];
const out = R.transformForSpeech(words, tokens, idxs);
assert(out[0] === '42.' || out[0] === '42', 'heading XLII. -> 42: ' + out[0]);

console.log(failed ? failed + ' FAILED' : 'All roman tests passed');
process.exit(failed ? 1 : 0);
