/**
 * Reading stats — local + sync-friendly additive counters.
 */
(function (global) {
  'use strict';

  var LS = 'focusReader.stats';
  var deviceId = null;

  function getDeviceId() {
    if (deviceId) return deviceId;
    try {
      deviceId = localStorage.getItem('focusReader.statsDeviceId');
      if (!deviceId) {
        deviceId = 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem('focusReader.statsDeviceId', deviceId);
      }
    } catch (e) { deviceId = 'anon'; }
    return deviceId;
  }

  function dayKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem(LS) || '{}') || {};
    } catch (e) { return {}; }
  }
  function save(data) {
    try { localStorage.setItem(LS, JSON.stringify(data)); } catch (e) {}
    if (global.FocusSync && FocusSync.notifySettings) {
      // piggyback small stats blob via settings sync key
      try {
        FocusSync.notifySettings({ stats: data, updatedAt: Date.now(), kind: 'stats' });
      } catch (e) {}
    }
  }

  function ensure(data) {
    data.byDay = data.byDay || {};
    data.byBook = data.byBook || {};
    data.byDevice = data.byDevice || {};
    data.updatedAt = data.updatedAt || 0;
    return data;
  }

  function addReading(bookId, ms, words, wpm) {
    var data = ensure(load());
    var day = dayKey();
    var dev = getDeviceId();
    data.byDay[day] = data.byDay[day] || { ms: 0, words: 0 };
    data.byDay[day].ms += ms;
    data.byDay[day].words += words;
    if (bookId) {
      data.byBook[bookId] = data.byBook[bookId] || { ms: 0, words: 0, sessions: 0 };
      data.byBook[bookId].ms += ms;
      data.byBook[bookId].words += words;
    }
    data.byDevice[dev] = data.byDevice[dev] || { ms: 0, words: 0 };
    data.byDevice[dev].ms += ms;
    data.byDevice[dev].words += words;
    data.updatedAt = Date.now();
    data.lastWpm = wpm || data.lastWpm;
    save(data);
    return data;
  }

  function noteSession(bookId) {
    var data = ensure(load());
    if (bookId) {
      data.byBook[bookId] = data.byBook[bookId] || { ms: 0, words: 0, sessions: 0 };
      data.byBook[bookId].sessions = (data.byBook[bookId].sessions || 0) + 1;
      data.updatedAt = Date.now();
      save(data);
    }
  }

  function weekKeys() {
    var keys = [];
    var d = new Date();
    for (var i = 0; i < 7; i++) {
      keys.push(dayKey(d));
      d.setDate(d.getDate() - 1);
    }
    return keys;
  }

  function summarize() {
    var data = ensure(load());
    var today = data.byDay[dayKey()] || { ms: 0, words: 0 };
    var week = { ms: 0, words: 0 };
    weekKeys().forEach(function (k) {
      var x = data.byDay[k];
      if (x) { week.ms += x.ms; week.words += x.words; }
    });
    var all = { ms: 0, words: 0 };
    Object.keys(data.byDevice).forEach(function (d) {
      all.ms += data.byDevice[d].ms || 0;
      all.words += data.byDevice[d].words || 0;
    });
    // fallback sum days if devices empty
    if (!all.ms) {
      Object.keys(data.byDay).forEach(function (k) {
        all.ms += data.byDay[k].ms || 0;
        all.words += data.byDay[k].words || 0;
      });
    }
    return { today: today, week: week, all: all, byBook: data.byBook, raw: data };
  }

  function mergeRemote(remote) {
    if (!remote) return load();
    var local = ensure(load());
    var rem = ensure(remote);
    // LWW on updatedAt for structure, additive merge for byDevice keys
    Object.keys(rem.byDevice || {}).forEach(function (d) {
      if (d === getDeviceId()) return; // keep local device authoritative locally
      local.byDevice[d] = rem.byDevice[d];
    });
    Object.keys(rem.byDay || {}).forEach(function (k) {
      if (!local.byDay[k] || (rem.updatedAt > (local.dayMeta && local.dayMeta[k] || 0))) {
        // take max per field to avoid wipe
        var a = local.byDay[k] || { ms: 0, words: 0 };
        var b = rem.byDay[k] || { ms: 0, words: 0 };
        local.byDay[k] = { ms: Math.max(a.ms, b.ms), words: Math.max(a.words, b.words) };
      }
    });
    Object.keys(rem.byBook || {}).forEach(function (id) {
      var a = local.byBook[id] || { ms: 0, words: 0, sessions: 0 };
      var b = rem.byBook[id] || { ms: 0, words: 0, sessions: 0 };
      local.byBook[id] = {
        ms: Math.max(a.ms, b.ms),
        words: Math.max(a.words, b.words),
        sessions: Math.max(a.sessions || 0, b.sessions || 0)
      };
    });
    local.updatedAt = Math.max(local.updatedAt || 0, rem.updatedAt || 0);
    save(local);
    return local;
  }

  function exportAll() { return ensure(load()); }
  function importAll(data) { save(ensure(data || {})); }

  global.FocusStats = {
    addReading: addReading,
    noteSession: noteSession,
    summarize: summarize,
    mergeRemote: mergeRemote,
    exportAll: exportAll,
    importAll: importAll,
    load: load,
    dayKey: dayKey
  };
})(typeof window !== 'undefined' ? window : globalThis);
