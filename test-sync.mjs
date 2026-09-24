/**
 * Node unit tests for FocusSync merge + fake Drive adapter (two devices).
 */
import { readFileSync, writeFileSync } from 'fs';
import { pathToFileURL } from 'url';
import vm from 'vm';
import { createRequire } from 'module';

const lines = [];
let failed = 0;
function log(s = '') { lines.push(s); console.log(s); }
function assert(cond, msg) {
  if (!cond) { failed++; log('FAIL: ' + msg); }
  else log('PASS: ' + msg);
}

// Load sync.js into a sandbox with minimal DOM globals
const code = readFileSync(new URL('./sync.js', import.meta.url), 'utf8');
const sandbox = {
  window: {},
  globalThis: {},
  console,
  setTimeout,
  clearTimeout,
  Date,
  Math,
  JSON,
  Object,
  Array,
  Promise,
  Error,
  encodeURIComponent,
  navigator: { userAgent: 'NodeTest' },
  localStorage: {
    _d: {},
    getItem(k) { return this._d[k] ?? null; },
    setItem(k, v) { this._d[k] = String(v); },
    removeItem(k) { delete this._d[k]; }
  },
  indexedDB: undefined,
  fetch: async () => ({ ok: false })
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.FOCUS_READER_CONFIG = { googleClientId: 'test' };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const FocusSync = sandbox.FocusSync || sandbox.window.FocusSync;
assert(!!FocusSync, 'FocusSync loaded');
assert(typeof FocusSync._mergeBooks === 'function', 'mergeBooks exported');

const merge = FocusSync._mergeBooks.bind(FocusSync);

log('');
log('=== Merge LWW ===');

// Device A has book at 500
const bookId = 'abc123';
const book = {
  id: bookId,
  name: 'Demo',
  type: 'txt',
  text: 'one two three',
  wordCount: 3,
  createdAt: 1000
};

let localA = [{
  id: bookId, name: 'Demo', type: 'txt', text: book.text, wordCount: 3,
  position: 500, wpm: 300, lastOpened: 2000, createdAt: 1000, updatedAt: 2000
}];

let cloudBooks = { [bookId]: book };
let cloudProgress = { [bookId]: { id: bookId, position: 500, wpm: 300, updatedAt: 2000, deviceName: 'PC' } };

// Device B empty pulls
let m = merge([], cloudBooks, cloudProgress, {});
assert(m.docs.length === 1, 'B gets 1 book from cloud');
assert(m.docs[0].position === 500, 'B position is 500');
assert(m.docs[0].text === 'one two three', 'B got text');

// B reads to 800
cloudProgress[bookId] = { id: bookId, position: 800, wpm: 320, updatedAt: 5000, deviceName: 'Phone' };
localA[0].updatedAt = 2000;
localA[0].position = 500;
m = merge(localA, cloudBooks, cloudProgress, {});
assert(m.docs[0].position === 800, 'A adopts B position 800 (newer updatedAt)');
assert(m.docs[0]._remoteDevice === 'Phone', 'remote device hint set');

// Older cloud should not win
cloudProgress[bookId] = { id: bookId, position: 100, wpm: 300, updatedAt: 1500, deviceName: 'Phone' };
localA = [{
  id: bookId, name: 'Demo', type: 'txt', text: book.text, wordCount: 3,
  position: 800, wpm: 320, lastOpened: 5000, createdAt: 1000, updatedAt: 5000
}];
m = merge(localA, cloudBooks, cloudProgress, {});
assert(m.docs[0].position === 800, 'local newer wins over older cloud');

log('');
log('=== Tombstones ===');
m = merge(localA, cloudBooks, cloudProgress, { [bookId]: { id: bookId, deletedAt: 9000 } });
assert(m.docs.length === 0, 'tombstone removes book from merge');
assert(m.deletedLocal.includes(bookId), 'deletedLocal includes id');

log('');
log('=== Fake Drive two-device simulation ===');

function makeFakeDrive() {
  const files = new Map(); // name -> {id, name, json}
  let seq = 1;
  return {
    listAppData() {
      return Promise.resolve([...files.values()].map((f) => ({ id: f.id, name: f.name })));
    },
    downloadJson(fileId) {
      for (const f of files.values()) {
        if (f.id === fileId) return Promise.resolve(JSON.parse(JSON.stringify(f.json)));
      }
      return Promise.reject(new Error('missing'));
    },
    findByName(list, name) {
      return list.find((x) => x.name === name) || null;
    },
    uploadJson(name, obj, existingId) {
      const id = existingId || ('file' + seq++);
      files.set(name, { id, name, json: JSON.parse(JSON.stringify(obj)) });
      return Promise.resolve({ id, name });
    },
    _files: files
  };
}

const drive = makeFakeDrive();

// Simulate enqueue + flush for device A
async function pushBookAndProgress(drive, book, progress) {
  const files = await drive.listAppData();
  let ex = drive.findByName(files, 'book-' + book.id + '.json');
  await drive.uploadJson('book-' + book.id + '.json', book, ex && ex.id);
  const files2 = await drive.listAppData();
  ex = drive.findByName(files2, 'progress-' + book.id + '.json');
  await drive.uploadJson('progress-' + book.id + '.json', progress, ex && ex.id);
}

await pushBookAndProgress(drive, book, {
  id: bookId, position: 500, wpm: 300, updatedAt: 2000, deviceName: 'PC'
});

// Device B pull
let listed = await drive.listAppData();
assert(listed.length === 2, 'drive has book+progress files');
const bFile = drive.findByName(listed, 'book-' + bookId + '.json');
const pFile = drive.findByName(listed, 'progress-' + bookId + '.json');
const bJson = await drive.downloadJson(bFile.id);
const pJson = await drive.downloadJson(pFile.id);
m = merge([], { [bookId]: bJson }, { [bookId]: pJson }, {});
assert(m.docs[0].position === 500 && m.docs[0].text === book.text, 'device B sync gets text+pos 500');

// B -> 800
await pushBookAndProgress(drive, book, {
  id: bookId, position: 800, wpm: 350, updatedAt: 6000, deviceName: 'Phone'
});
listed = await drive.listAppData();
const pFile2 = drive.findByName(listed, 'progress-' + bookId + '.json');
const pJson2 = await drive.downloadJson(pFile2.id);
m = merge([{
  id: bookId, name: 'Demo', type: 'txt', text: book.text, wordCount: 3,
  position: 500, wpm: 300, lastOpened: 2000, createdAt: 1000, updatedAt: 2000
}], { [bookId]: book }, { [bookId]: pJson2 }, {});
assert(m.docs[0].position === 800, 'device A sync after B reaches 800');

// Delete on A
await drive.uploadJson('deleted-' + bookId + '.json', { id: bookId, deletedAt: 7000 }, null);
listed = await drive.listAppData();
const del = drive.findByName(listed, 'deleted-' + bookId + '.json');
const delJson = await drive.downloadJson(del.id);
m = merge(m.docs, { [bookId]: book }, { [bookId]: pJson2 }, { [bookId]: delJson });
assert(m.docs.length === 0, 'delete on A propagates to B merge');

log('');
log('=== Offline queue flush shape ===');
const queued = [
  { key: 'progress:' + bookId, kind: 'progress', id: bookId, payload: { id: bookId, position: 900, wpm: 300, updatedAt: 8000, deviceName: 'PC' } }
];
// flush simulation
for (const item of queued) {
  const name = 'progress-' + item.id + '.json';
  const filesNow = await drive.listAppData();
  const existing = drive.findByName(filesNow, name);
  await drive.uploadJson(name, item.payload, existing && existing.id);
}
listed = await drive.listAppData();
const flushed = await drive.downloadJson(drive.findByName(listed, 'progress-' + bookId + '.json').id);
assert(flushed.position === 900, 'offline queue flush uploads position 900');

log('');
if (failed === 0) log('RESULT: PASS');
else log('RESULT: FAIL (' + failed + ')');

writeFileSync(new URL('./sync-test.txt', import.meta.url), lines.join('\n') + '\n');
process.exit(failed === 0 ? 0 : 1);
