/**
 * Export / import app backup (JSON). User music stays local-only (documented).
 */
(function (global) {
  'use strict';

  function collect() {
    var out = {
      version: 1,
      exportedAt: Date.now(),
      note: 'User music files are NOT included — they stay on-device only.',
      localStorage: {},
      stats: global.FocusStats ? FocusStats.exportAll() : null,
      genres: global.FocusGenre ? FocusGenre.loadMap() : {}
    };
    var keys = [
      'focusReader.sentenceStrip', 'focusReader.naturalPauses', 'focusReader.theme',
      'focusReader.sessionMinutes', 'focusReader.beepEnabled', 'focusReader.musicSettings',
      'focusReader.voiceByLang', 'focusReader.bookLang', 'focusReader.bookGenres',
      'focusReader.digitsChapters', 'focusReader.deviceName', 'focusReader.stats',
      'focusReader.statsDeviceId'
    ];
    keys.forEach(function (k) {
      try {
        var v = localStorage.getItem(k);
        if (v != null) out.localStorage[k] = v;
      } catch (e) {}
    });
    return out;
  }

  function download() {
    var blob = new Blob([JSON.stringify(collect(), null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'focus-reader-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  function restore(obj) {
    if (!obj || typeof obj !== 'object') throw new Error('Invalid backup');
    if (obj.localStorage) {
      Object.keys(obj.localStorage).forEach(function (k) {
        try { localStorage.setItem(k, obj.localStorage[k]); } catch (e) {}
      });
    }
    if (obj.stats && global.FocusStats) FocusStats.importAll(obj.stats);
    if (obj.genres && global.FocusGenre) FocusGenre.saveMap(obj.genres);
    return true;
  }

  function importFile(file) {
    return file.text().then(function (t) {
      return restore(JSON.parse(t));
    });
  }

  global.FocusBackup = { collect: collect, download: download, restore: restore, importFile: importFile };
})(typeof window !== 'undefined' ? window : globalThis);
