/**
 * FocusSync — Google Drive appDataFolder sync (classic script).
 * Depends on RecentStore. Config via window.FOCUS_READER_CONFIG.googleClientId.
 *
 * Testable: FocusSync._mergeBooks / FocusSync._createAdapter for unit tests.
 */
(function (global) {
  'use strict';

  var SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
  var LS_CONNECTED = 'focusReader.syncConnected';
  var LS_DEVICE = 'focusReader.deviceName';
  var SYNC_INTERVAL_MS = 20000;
  var DRIVE_UPLOAD = 'https://www.googleapis.com/upload/drive/v3/files';
  var DRIVE_API = 'https://www.googleapis.com/drive/v3/files';

  var state = {
    clientId: '',
    token: null,
    tokenExpiresAt: 0,
    email: null,
    connected: false,
    lastSyncedAt: null,
    pendingCount: 0,
    syncing: false,
    pausedNeedReconnect: false,
    deviceName: detectDeviceName(),
    gsiLoaded: false,
    tokenClient: null,
    timer: null,
    lastPushedPos: {},
    listeners: []
  };

  function detectDeviceName() {
    try {
      var saved = localStorage.getItem(LS_DEVICE);
      if (saved) return saved;
    } catch (e) {}
    var ua = (navigator.userAgent || '').toLowerCase();
    if (/ipad|tablet|kindle|playbook|silk|(android(?!.*mobile))/.test(ua)) return 'Tablet';
    if (/mobi|iphone|ipod|android.*mobile|windows phone/.test(ua)) return 'Phone';
    return 'PC';
  }

  function cfgClientId() {
    var c = global.FOCUS_READER_CONFIG || {};
    return (c.googleClientId || '').trim();
  }

  function isConfigured() {
    return !!cfgClientId();
  }

  function emit() {
    state.listeners.forEach(function (fn) {
      try { fn(getStatus()); } catch (e) {}
    });
  }

  function getStatus() {
    return {
      configured: isConfigured(),
      connected: state.connected,
      pausedNeedReconnect: state.pausedNeedReconnect,
      email: state.email,
      lastSyncedAt: state.lastSyncedAt,
      pendingCount: state.pendingCount,
      syncing: state.syncing,
      deviceName: state.deviceName
    };
  }

  function onStatus(fn) {
    state.listeners.push(fn);
    return function () {
      state.listeners = state.listeners.filter(function (f) { return f !== fn; });
    };
  }

  /* ——— Local sync queue (IndexedDB) ——— */
  var QDB = 'FocusReaderSyncQueue';
  var QSTORE = 'queue';
  var QVER = 1;

  function openQ() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(QDB, QVER);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(QSTORE)) {
          db.createObjectStore(QSTORE, { keyPath: 'key' });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function queuePut(item) {
    return openQ().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(QSTORE, 'readwrite');
        tx.objectStore(QSTORE).put(item);
        tx.oncomplete = function () { db.close(); resolve(); };
        tx.onerror = function () { db.close(); reject(tx.error); };
      });
    }).then(refreshPending);
  }

  function queueAll() {
    return openQ().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(QSTORE, 'readonly');
        var req = tx.objectStore(QSTORE).getAll();
        var rows = [];
        req.onsuccess = function () { rows = req.result || []; };
        tx.oncomplete = function () { db.close(); resolve(rows); };
        tx.onerror = function () { db.close(); reject(tx.error); };
      });
    });
  }

  function queueClearKeys(keys) {
    return openQ().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(QSTORE, 'readwrite');
        var store = tx.objectStore(QSTORE);
        keys.forEach(function (k) { store.delete(k); });
        tx.oncomplete = function () { db.close(); resolve(); };
        tx.onerror = function () { db.close(); reject(tx.error); };
      });
    }).then(refreshPending);
  }

  function refreshPending() {
    return queueAll().then(function (rows) {
      state.pendingCount = rows.length;
      emit();
      return rows.length;
    });
  }

  function enqueueBook(doc) {
    return queuePut({
      key: 'book:' + doc.id,
      kind: 'book',
      id: doc.id,
      payload: {
        id: doc.id,
        name: doc.name,
        type: doc.type,
        text: doc.text,
        wordCount: doc.wordCount,
        createdAt: doc.createdAt || Date.now()
      },
      updatedAt: Date.now()
    });
  }

  function enqueueProgress(doc) {
    return queuePut({
      key: 'progress:' + doc.id,
      kind: 'progress',
      id: doc.id,
      payload: {
        id: doc.id,
        position: doc.position || 0,
        wpm: doc.wpm || 300,
        updatedAt: Date.now(),
        deviceName: state.deviceName
      },
      updatedAt: Date.now()
    });
  }

  function enqueueDelete(id) {
    return queuePut({
      key: 'deleted:' + id,
      kind: 'deleted',
      id: id,
      payload: { id: id, deletedAt: Date.now() },
      updatedAt: Date.now()
    });
  }

  /* ——— Merge logic (pure, unit-tested) ——— */
  /**
   * Merge local docs + cloud snapshots.
   * localDocs: [{id,name,type,text,wordCount,position,wpm,lastOpened,createdAt,updatedAt?}]
   * cloudBooks: map id -> book meta+text
   * cloudProgress: map id -> {position,wpm,updatedAt,deviceName}
   * tombstones: map id -> {deletedAt}
   * Returns { docs: mergedDocs[], downloads: id[] needing text from cloud, deletedLocal: id[] }
   */
  function mergeBooks(localDocs, cloudBooks, cloudProgress, tombstones, now) {
    now = now || Date.now();
    var byId = {};
    (localDocs || []).forEach(function (d) {
      byId[d.id] = Object.assign({}, d);
    });

    Object.keys(tombstones || {}).forEach(function (id) {
      if (byId[id]) delete byId[id];
    });

    var downloads = [];
    Object.keys(cloudBooks || {}).forEach(function (id) {
      if (tombstones && tombstones[id]) return;
      var cb = cloudBooks[id];
      var cp = (cloudProgress && cloudProgress[id]) || null;
      if (!byId[id]) {
        byId[id] = {
          id: id,
          name: cb.name,
          type: cb.type || 'paste',
          text: cb.text || '',
          wordCount: cb.wordCount || 0,
          position: cp ? cp.position : 0,
          wpm: cp ? cp.wpm : 300,
          lastOpened: cp ? cp.updatedAt : (cb.createdAt || now),
          createdAt: cb.createdAt || now,
          updatedAt: cp ? cp.updatedAt : (cb.createdAt || now),
          fromCloud: !cb.text
        };
        if (!cb.text) downloads.push(id);
      } else {
        // Update name/type/text if local missing text
        if ((!byId[id].text || !byId[id].text.length) && cb.text) {
          byId[id].text = cb.text;
          byId[id].wordCount = cb.wordCount || byId[id].wordCount;
          byId[id].name = cb.name || byId[id].name;
        }
        if (cp) {
          var localTs = byId[id].updatedAt || byId[id].lastOpened || 0;
          if (cp.updatedAt > localTs) {
            byId[id].position = cp.position;
            byId[id].wpm = cp.wpm;
            byId[id].updatedAt = cp.updatedAt;
            byId[id].lastOpened = Math.max(byId[id].lastOpened || 0, cp.updatedAt);
            byId[id]._remoteDevice = cp.deviceName;
          }
        }
      }
    });

    // Apply cloud progress for local-only books too
    Object.keys(cloudProgress || {}).forEach(function (id) {
      if (tombstones && tombstones[id]) return;
      if (!byId[id]) return;
      var cp = cloudProgress[id];
      var localTs = byId[id].updatedAt || byId[id].lastOpened || 0;
      if (cp.updatedAt > localTs) {
        byId[id].position = cp.position;
        byId[id].wpm = cp.wpm;
        byId[id].updatedAt = cp.updatedAt;
        byId[id]._remoteDevice = cp.deviceName;
      }
    });

    var deletedLocal = [];
    Object.keys(tombstones || {}).forEach(function (id) {
      deletedLocal.push(id);
    });

    var docs = Object.keys(byId).map(function (k) { return byId[k]; });
    docs.sort(function (a, b) { return (b.lastOpened || 0) - (a.lastOpened || 0); });
    return { docs: docs, downloads: downloads, deletedLocal: deletedLocal };
  }

  /* ——— Drive adapter ——— */
  function createDriveAdapter(opts) {
    opts = opts || {};
    var getToken = opts.getToken;
    var fetchImpl = opts.fetchImpl || fetch.bind(global);

    function authHeaders(extra) {
      var h = Object.assign({ Authorization: 'Bearer ' + getToken() }, extra || {});
      return h;
    }

    function listAppData() {
      var q = encodeURIComponent("trashed=false");
      var url = DRIVE_API + '?spaces=appDataFolder&pageSize=1000&fields=files(id,name,modifiedTime)&q=' + q;
      return fetchImpl(url, { headers: authHeaders() }).then(function (r) {
        if (r.status === 401) throw Object.assign(new Error('unauthorized'), { code: 401 });
        if (!r.ok) throw new Error('list failed ' + r.status);
        return r.json();
      }).then(function (data) {
        return data.files || [];
      });
    }

    function downloadJson(fileId) {
      return fetchImpl(DRIVE_API + '/' + encodeURIComponent(fileId) + '?alt=media', {
        headers: authHeaders()
      }).then(function (r) {
        if (r.status === 401) throw Object.assign(new Error('unauthorized'), { code: 401 });
        if (!r.ok) throw new Error('download failed');
        return r.json();
      });
    }

    function findByName(files, name) {
      for (var i = 0; i < files.length; i++) {
        if (files[i].name === name) return files[i];
      }
      return null;
    }

    function uploadJson(name, obj, existingId) {
      var metadata = existingId
        ? { name: name }
        : { name: name, parents: ['appDataFolder'] };
      var boundary = 'fr_boundary_' + Math.random().toString(36).slice(2);
      var body =
        '--' + boundary + '\r\n' +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) + '\r\n' +
        '--' + boundary + '\r\n' +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(obj) + '\r\n' +
        '--' + boundary + '--';
      var url = existingId
        ? DRIVE_UPLOAD + '/' + encodeURIComponent(existingId) + '?uploadType=multipart'
        : DRIVE_UPLOAD + '?uploadType=multipart';
      return fetchImpl(url, {
        method: existingId ? 'PATCH' : 'POST',
        headers: authHeaders({ 'Content-Type': 'multipart/related; boundary=' + boundary }),
        body: body
      }).then(function (r) {
        if (r.status === 401) throw Object.assign(new Error('unauthorized'), { code: 401 });
        if (!r.ok) throw new Error('upload failed ' + r.status);
        return r.json();
      });
    }

    return {
      listAppData: listAppData,
      downloadJson: downloadJson,
      findByName: findByName,
      uploadJson: uploadJson
    };
  }

  /* ——— Auth (GIS) ——— */
  function loadGsi() {
    if (state.gsiLoaded) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      if (global.google && google.accounts && google.accounts.oauth2) {
        state.gsiLoaded = true;
        resolve();
        return;
      }
      var s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.onload = function () { state.gsiLoaded = true; resolve(); };
      s.onerror = function () { reject(new Error('Failed to load Google Identity Services')); };
      document.head.appendChild(s);
    });
  }

  function ensureTokenClient() {
    state.clientId = cfgClientId();
    if (!state.clientId) return Promise.reject(new Error('not configured'));
    return loadGsi().then(function () {
      if (state.tokenClient) return;
      state.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: state.clientId,
        scope: SCOPE,
        callback: function () {}
      });
    });
  }

  function requestToken(prompt) {
    return ensureTokenClient().then(function () {
      return new Promise(function (resolve, reject) {
        state.tokenClient.callback = function (resp) {
          if (resp.error) {
            reject(new Error(resp.error));
            return;
          }
          state.token = resp.access_token;
          state.tokenExpiresAt = Date.now() + ((resp.expires_in || 3600) * 1000) - 30000;
          state.connected = true;
          state.pausedNeedReconnect = false;
          try { localStorage.setItem(LS_CONNECTED, '1'); } catch (e) {}
          fetchEmail().finally(function () {
            emit();
            resolve(state.token);
          });
        };
        var opts = {};
        if (prompt !== undefined) opts.prompt = prompt;
        state.tokenClient.requestAccessToken(opts);
      });
    });
  }

  function fetchEmail() {
    if (!state.token) return Promise.resolve();
    return fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: 'Bearer ' + state.token }
    }).then(function (r) {
      if (!r.ok) return null;
      return r.json();
    }).then(function (info) {
      if (info && info.email) state.email = info.email;
    }).catch(function () {});
  }

  function getValidToken() {
    if (state.token && Date.now() < state.tokenExpiresAt) {
      return Promise.resolve(state.token);
    }
    // silent refresh
    return requestToken('').catch(function () {
      state.connected = false;
      state.pausedNeedReconnect = true;
      emit();
      throw new Error('need reconnect');
    });
  }

  function connect() {
    if (!isConfigured()) return Promise.reject(new Error('not configured'));
    return requestToken('consent').then(function () {
      return syncNow();
    });
  }

  function disconnect() {
    var token = state.token;
    state.token = null;
    state.connected = false;
    state.email = null;
    state.pausedNeedReconnect = false;
    try { localStorage.removeItem(LS_CONNECTED); } catch (e) {}
    if (token && global.google && google.accounts && google.accounts.oauth2) {
      try { google.accounts.oauth2.revoke(token, function () {}); } catch (e) {}
    }
    emit();
    return Promise.resolve();
  }

  function trySilentReconnect() {
    if (!isConfigured()) return Promise.resolve(false);
    var flag = false;
    try { flag = localStorage.getItem(LS_CONNECTED) === '1'; } catch (e) {}
    if (!flag) return Promise.resolve(false);
    return requestToken('').then(function () {
      return syncNow().then(function () { return true; });
    }).catch(function () {
      state.pausedNeedReconnect = true;
      state.connected = false;
      emit();
      return false;
    });
  }

  /* ——— Sync orchestration ——— */
  function adapter() {
    return createDriveAdapter({
      getToken: function () { return state.token; }
    });
  }

  function syncNow() {
    if (!isConfigured()) return Promise.resolve({ skipped: true });
    if (state.syncing) return Promise.resolve({ busy: true });
    state.syncing = true;
    emit();
    return getValidToken().then(function () {
      return flushQueue().then(pullAndMerge).then(function (result) {
        state.lastSyncedAt = Date.now();
        return result;
      });
    }).catch(function (err) {
      if (err && err.code === 401) {
        return requestToken('').then(function () {
          return flushQueue().then(pullAndMerge);
        }).catch(function () {
          state.pausedNeedReconnect = true;
          state.connected = false;
          throw err;
        });
      }
      throw err;
    }).finally(function () {
      state.syncing = false;
      emit();
    });
  }

  function flushQueue() {
    var ad = adapter();
    return queueAll().then(function (items) {
      if (!items.length) return;
      return ad.listAppData().then(function (files) {
        var chain = Promise.resolve();
        var doneKeys = [];
        items.forEach(function (item) {
          chain = chain.then(function () {
            var name =
              item.kind === 'book' ? 'book-' + item.id + '.json' :
              item.kind === 'progress' ? 'progress-' + item.id + '.json' :
              'deleted-' + item.id + '.json';
            var existing = ad.findByName(files, name);
            return ad.uploadJson(name, item.payload, existing && existing.id).then(function (meta) {
              doneKeys.push(item.key);
              if (!existing && meta && meta.id) {
                files.push({ id: meta.id, name: name });
              }
            });
          });
        });
        return chain.then(function () { return queueClearKeys(doneKeys); });
      });
    });
  }

  function pullAndMerge() {
    var ad = adapter();
    return ad.listAppData().then(function (files) {
      var cloudBooks = {};
      var cloudProgress = {};
      var tombstones = {};
      var idByName = {};
      files.forEach(function (f) { idByName[f.name] = f.id; });

      var loads = files.map(function (f) {
        if (f.name.indexOf('book-') === 0 && f.name.endsWith('.json')) {
          return ad.downloadJson(f.id).then(function (data) {
            cloudBooks[data.id] = data;
          }).catch(function () {});
        }
        if (f.name.indexOf('progress-') === 0 && f.name.endsWith('.json')) {
          return ad.downloadJson(f.id).then(function (data) {
            cloudProgress[data.id] = data;
          }).catch(function () {});
        }
        if (f.name.indexOf('deleted-') === 0 && f.name.endsWith('.json')) {
          return ad.downloadJson(f.id).then(function (data) {
            tombstones[data.id] = data;
          }).catch(function () {});
        }
        return Promise.resolve();
      });

      return Promise.all(loads).then(function () {
        return RecentStore.list().then(function (localDocs) {
          var merged = mergeBooks(localDocs, cloudBooks, cloudProgress, tombstones);
          var ops = [];
          merged.deletedLocal.forEach(function (id) {
            ops.push(RecentStore.remove(id));
          });
          merged.docs.forEach(function (doc) {
            // strip internal fields before put
            var clean = {
              id: doc.id,
              name: doc.name,
              type: doc.type,
              text: doc.text || '',
              wordCount: doc.wordCount || 0,
              position: doc.position || 0,
              wpm: doc.wpm || 300,
              lastOpened: doc.lastOpened || Date.now(),
              createdAt: doc.createdAt || Date.now(),
              updatedAt: doc.updatedAt || doc.lastOpened || Date.now(),
              cloudOnly: !!(doc.fromCloud && !doc.text)
            };
            ops.push(RecentStore.put(clean));
          });
          return Promise.all(ops).then(function () {
            // download missing texts
            var dl = Promise.resolve();
            merged.downloads.forEach(function (id) {
              var fname = 'book-' + id + '.json';
              var fid = idByName[fname];
              if (!fid) return;
              dl = dl.then(function () {
                return ad.downloadJson(fid).then(function (book) {
                  return RecentStore.get(id).then(function (doc) {
                    if (!doc) return;
                    doc.text = book.text || '';
                    doc.wordCount = book.wordCount || doc.wordCount;
                    doc.name = book.name || doc.name;
                    doc.cloudOnly = false;
                    return RecentStore.put(doc);
                  });
                });
              });
            });
            return dl.then(function () {
              return {
                merged: merged,
                remoteHints: merged.docs.filter(function (d) { return d._remoteDevice; })
              };
            });
          });
        });
      });
    });
  }

  function notifyLocalChange(kind, docOrId) {
    if (!isConfigured()) return Promise.resolve();
    var p;
    if (kind === 'book') p = enqueueBook(docOrId);
    else if (kind === 'progress') p = enqueueProgress(docOrId);
    else if (kind === 'deleted') p = enqueueDelete(docOrId);
    else p = Promise.resolve();
    return p.then(function () {
      if (state.connected && navigator.onLine !== false) {
        // opportunistic flush later via sync loop
      }
    });
  }

  function startLoop(getReadingState) {
    stopLoop();
    state.timer = setInterval(function () {
      if (!state.connected || state.syncing) return;
      var st = getReadingState && getReadingState();
      if (!st || !st.playing) return;
      if (!st.docId) return;
      var last = state.lastPushedPos[st.docId];
      if (last === st.position) return;
      state.lastPushedPos[st.docId] = st.position;
      RecentStore.get(st.docId).then(function (doc) {
        if (!doc) return;
        doc.position = st.position;
        doc.wpm = st.wpm;
        doc.updatedAt = Date.now();
        return RecentStore.put(doc).then(function () {
          return enqueueProgress(doc).then(function () { return syncNow(); });
        });
      }).catch(function () {});
    }, SYNC_INTERVAL_MS);
  }

  function stopLoop() {
    if (state.timer) {
      clearInterval(state.timer);
      state.timer = null;
    }
  }

  function setDeviceName(name) {
    state.deviceName = (name || detectDeviceName()).slice(0, 40);
    try { localStorage.setItem(LS_DEVICE, state.deviceName); } catch (e) {}
    emit();
  }

  // Init device name from LS
  try {
    var dn = localStorage.getItem(LS_DEVICE);
    if (dn) state.deviceName = dn;
  } catch (e) {}

  global.FocusSync = {
    SCOPE: SCOPE,
    isConfigured: isConfigured,
    getStatus: getStatus,
    onStatus: onStatus,
    connect: connect,
    disconnect: disconnect,
    trySilentReconnect: trySilentReconnect,
    syncNow: syncNow,
    notifyLocalChange: notifyLocalChange,
    startLoop: startLoop,
    stopLoop: stopLoop,
    setDeviceName: setDeviceName,
    detectDeviceName: detectDeviceName,
    enqueueBook: enqueueBook,
    enqueueProgress: enqueueProgress,
    enqueueDelete: enqueueDelete,
    // test hooks
    _mergeBooks: mergeBooks,
    _createAdapter: createDriveAdapter,
    _queueAll: queueAll,
    _queueClearKeys: queueClearKeys,
    _refreshPending: refreshPending
  };
})(typeof window !== 'undefined' ? window : globalThis);
