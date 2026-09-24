/**
 * IndexedDB store for Focus Reader recent texts (works from file://).
 * Exposes window.RecentStore
 */
(function (global) {
  'use strict';

  var DB_NAME = 'FocusReaderRecent';
  var DB_VERSION = 1;
  var STORE = 'documents';
  var MAX_ENTRIES = 20;

  function openDb() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          var os = db.createObjectStore(STORE, { keyPath: 'id' });
          os.createIndex('lastOpened', 'lastOpened', { unique: false });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error || new Error('IDB open failed')); };
    });
  }

  function withStore(mode, fn) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, mode);
        var store = tx.objectStore(STORE);
        var result = fn(store, tx);
        tx.oncomplete = function () {
          db.close();
          resolve(result);
        };
        tx.onerror = function () {
          db.close();
          reject(tx.error || new Error('IDB tx failed'));
        };
        tx.onabort = function () {
          db.close();
          reject(tx.error || new Error('IDB tx aborted'));
        };
      });
    });
  }

  /** SHA-256 hex of string (UTF-8). Falls back to FNV-1a if SubtleCrypto unavailable. */
  function hashText(text) {
    var data = new TextEncoder().encode(text || '');
    if (global.crypto && crypto.subtle && crypto.subtle.digest) {
      return crypto.subtle.digest('SHA-256', data).then(function (buf) {
        var bytes = new Uint8Array(buf);
        var hex = '';
        for (var i = 0; i < bytes.length; i++) {
          hex += bytes[i].toString(16).padStart(2, '0');
        }
        return hex;
      });
    }
    // FNV-1a 64-ish fallback
    var h = 2166136261 >>> 0;
    for (var j = 0; j < data.length; j++) {
      h ^= data[j];
      h = Math.imul(h, 16777619) >>> 0;
    }
    return Promise.resolve('fnv_' + h.toString(16) + '_' + data.length);
  }

  function listAll() {
    return withStore('readonly', function (store) {
      return new Promise(function (resolve, reject) {
        var req = store.getAll();
        req.onsuccess = function () {
          var rows = req.result || [];
          rows.sort(function (a, b) { return (b.lastOpened || 0) - (a.lastOpened || 0); });
          resolve(rows);
        };
        req.onerror = function () { reject(req.error); };
      });
    }).then(function (p) { return p; });
  }

  // Fix withStore for async getAll — need nested promise properly
  function listAllFixed() {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, 'readonly');
        var store = tx.objectStore(STORE);
        var req = store.getAll();
        var rows = null;
        req.onsuccess = function () {
          rows = req.result || [];
          rows.sort(function (a, b) { return (b.lastOpened || 0) - (a.lastOpened || 0); });
        };
        tx.oncomplete = function () { db.close(); resolve(rows || []); };
        tx.onerror = function () { db.close(); reject(tx.error); };
      });
    });
  }

  function get(id) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, 'readonly');
        var store = tx.objectStore(STORE);
        var req = store.get(id);
        var val = null;
        req.onsuccess = function () { val = req.result || null; };
        tx.oncomplete = function () { db.close(); resolve(val); };
        tx.onerror = function () { db.close(); reject(tx.error); };
      });
    });
  }

  function put(doc) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, 'readwrite');
        var store = tx.objectStore(STORE);
        store.put(doc);
        tx.oncomplete = function () { db.close(); resolve(doc); };
        tx.onerror = function () { db.close(); reject(tx.error); };
      });
    }).then(function (saved) {
      return evictOldest().then(function () { return saved; });
    });
  }

  function remove(id) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).delete(id);
        tx.oncomplete = function () { db.close(); resolve(); };
        tx.onerror = function () { db.close(); reject(tx.error); };
      });
    }).then(function () {
      if (global.FocusSync && FocusSync.notifyLocalChange) {
        FocusSync.notifyLocalChange('deleted', id);
      }
    });
  }

  function clearAll() {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).clear();
        tx.oncomplete = function () { db.close(); resolve(); };
        tx.onerror = function () { db.close(); reject(tx.error); };
      });
    });
  }

  function evictOldest() {
    return listAllFixed().then(function (rows) {
      if (rows.length <= MAX_ENTRIES) return;
      var toRemove = rows.slice(MAX_ENTRIES);
      return openDb().then(function (db) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction(STORE, 'readwrite');
          var store = tx.objectStore(STORE);
          toRemove.forEach(function (r) { store.delete(r.id); });
          tx.oncomplete = function () { db.close(); resolve(); };
          tx.onerror = function () { db.close(); reject(tx.error); };
        });
      });
    });
  }

  /**
   * Upsert by content hash id. Preserves position if updating same id unless resetPosition.
   */
  function upsertDocument(opts) {
    var name = opts.name;
    var type = opts.type || 'paste';
    var text = opts.text || '';
    var wordCount = opts.wordCount || 0;
    var position = opts.position != null ? opts.position : 0;
    var wpm = opts.wpm || 300;
    var now = Date.now();

    return hashText(text).then(function (id) {
      return get(id).then(function (existing) {
        // Position rules:
        // - keepPosition / updateMetaOnly: always keep existing
        // - resetPosition: force incoming position (even 0)
        // - else if existing.position > 0 and incoming is 0: KEEP existing
        //   (prevents library reopen from wiping progress with a fresh timestamp)
        // - else use incoming position
        var nextPos;
        if (opts.updateMetaOnly && existing) {
          nextPos = existing.position || 0;
        } else if (opts.keepPosition && existing) {
          nextPos = existing.position || 0;
        } else if (opts.resetPosition) {
          nextPos = position;
        } else if (existing && (existing.position || 0) > 0 && (!position || position === 0)) {
          nextPos = existing.position;
        } else {
          nextPos = position;
        }
        var nextUpdated = now;
        // Don't bump updatedAt when we only reopen and keep the old position at 0-load
        if (existing && nextPos === (existing.position || 0) && opts.position === 0 && !opts.resetPosition) {
          nextUpdated = existing.updatedAt || existing.lastOpened || now;
        }
        var doc = {
          id: id,
          name: name,
          type: type,
          text: text,
          wordCount: wordCount,
          position: nextPos,
          wpm: wpm,
          lastOpened: now,
          createdAt: existing ? existing.createdAt : now,
          updatedAt: nextUpdated,
          cloudOnly: false,
          sourceUrl: opts.sourceUrl || (existing && existing.sourceUrl) || ''
        };
        return put(doc).then(function (saved) {
          if (global.FocusSync && FocusSync.notifyLocalChange) {
            FocusSync.notifyLocalChange('book', saved);
            FocusSync.notifyLocalChange('progress', saved);
          }
          return saved;
        });
      });
    });
  }

  function updateProgress(id, fields) {
    return get(id).then(function (doc) {
      if (!doc) return null;
      if (fields.position != null) doc.position = fields.position;
      if (fields.positionWord != null) doc.positionWord = fields.positionWord;
      if (fields.wpm != null) doc.wpm = fields.wpm;
      if (fields.lastOpened != null) doc.lastOpened = fields.lastOpened;
      else doc.lastOpened = Date.now();
      doc.updatedAt = Date.now();
      return put(doc).then(function (saved) {
        if (global.FocusSync && FocusSync.notifyLocalChange) {
          FocusSync.notifyLocalChange('progress', saved);
        }
        return saved;
      });
    });
  }

  global.RecentStore = {
    MAX_ENTRIES: MAX_ENTRIES,
    hashText: hashText,
    list: listAllFixed,
    get: get,
    put: put,
    remove: remove,
    clearAll: clearAll,
    upsertDocument: upsertDocument,
    updateProgress: updateProgress
  };
})(typeof window !== 'undefined' ? window : globalThis);
