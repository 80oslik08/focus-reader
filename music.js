/**
 * Procedural ambient music (WebAudio) + optional user tracks per genre.
 * Engine-light: oscillators/noise, no samples required.
 */
(function (global) {
  'use strict';

  var ctx = null;
  var master = null;
  var duckGain = null;
  var nodes = [];
  var playing = false;
  var family = 'minimal';
  var volume = 0.35;
  var duck = true;
  var autoGenre = true;
  var enabled = false;
  var seed = 1;
  var userTracks = {}; // genre -> [{id,name,blob}]
  var currentAudio = null;
  var DB = 'focusReaderMusic';
  var LS = 'focusReader.musicSettings';

  function loadSettings() {
    try {
      var s = JSON.parse(localStorage.getItem(LS) || '{}');
      if (s.enabled != null) enabled = !!s.enabled;
      if (s.volume != null) volume = Math.max(0, Math.min(1, Number(s.volume)));
      if (s.duck != null) duck = !!s.duck;
      if (s.autoGenre != null) autoGenre = !!s.autoGenre;
      if (s.family) family = s.family;
    } catch (e) {}
  }
  function saveSettings() {
    try {
      localStorage.setItem(LS, JSON.stringify({
        enabled: enabled, volume: volume, duck: duck, autoGenre: autoGenre, family: family
      }));
    } catch (e) {}
  }
  loadSettings();

  function ensureCtx() {
    if (ctx) return ctx;
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    duckGain = ctx.createGain();
    duckGain.gain.value = 1;
    master.gain.value = volume;
    duckGain.connect(master);
    master.connect(ctx.destination);
    return ctx;
  }

  function rnd() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  function stopNodes() {
    nodes.forEach(function (n) {
      try { n.stop && n.stop(); } catch (e) {}
      try { n.disconnect && n.disconnect(); } catch (e) {}
    });
    nodes = [];
    if (currentAudio) {
      try { currentAudio.pause(); currentAudio.src = ''; } catch (e) {}
      currentAudio = null;
    }
  }

  function addOsc(freq, type, gainVal, lfoRate) {
    if (!ctx) return;
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.value = gainVal;
    if (lfoRate) {
      var lfo = ctx.createOscillator();
      var lg = ctx.createGain();
      lfo.frequency.value = lfoRate;
      lg.gain.value = freq * 0.01;
      lfo.connect(lg);
      lg.connect(o.frequency);
      lfo.start();
      nodes.push(lfo);
    }
    o.connect(g);
    g.connect(duckGain);
    o.start();
    nodes.push(o, g);
  }

  function buildFamily(fam) {
    stopNodes();
    seed = (fam || 'x').length * 997 + 13;
    fam = fam || 'minimal';
    if (fam === 'scifi') {
      addOsc(55, 'sawtooth', 0.04, 0.05);
      addOsc(110.5, 'triangle', 0.03, 0.07);
      addOsc(220 + rnd() * 40, 'sine', 0.02, 0.11);
    } else if (fam === 'action') {
      addOsc(60, 'square', 0.035, 0.2);
      addOsc(90, 'sawtooth', 0.025, 0.15);
      addOsc(180, 'triangle', 0.015, 0.4);
    } else if (fam === 'horror') {
      addOsc(40, 'sawtooth', 0.05, 0.03);
      addOsc(43.5, 'sawtooth', 0.04, 0.04);
      addOsc(180 + rnd() * 80, 'sine', 0.02, 0.02);
    } else if (fam === 'mystery') {
      addOsc(130, 'triangle', 0.03, 0.08);
      addOsc(195, 'sine', 0.02, 0.06);
      addOsc(65, 'sine', 0.04, 0.05);
    } else if (fam === 'romance') {
      addOsc(174, 'sine', 0.04, 0.04);
      addOsc(220, 'triangle', 0.03, 0.05);
      addOsc(261, 'sine', 0.02, 0.03);
    } else if (fam === 'historical') {
      addOsc(98, 'triangle', 0.04, 0.03);
      addOsc(147, 'sine', 0.03, 0.04);
      addOsc(50, 'sine', 0.05, 0.02);
    } else if (fam === 'calm') {
      addOsc(87, 'sine', 0.05, 0.02);
      addOsc(130.5, 'sine', 0.035, 0.025);
      addOsc(174, 'triangle', 0.02, 0.03);
    } else if (fam === 'fantasy') {
      addOsc(523, 'sine', 0.02, 0.1);
      addOsc(659, 'triangle', 0.015, 0.12);
      addOsc(784, 'sine', 0.012, 0.09);
      addOsc(130, 'sine', 0.03, 0.04);
    } else {
      addOsc(100, 'sine', 0.03, 0.05);
      addOsc(150, 'triangle', 0.02, 0.06);
    }
  }

  function openDb() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB, 1);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains('tracks')) db.createObjectStore('tracks', { keyPath: 'id' });
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function listUserTracks(genre) {
    return openDb().then(function (db) {
      return new Promise(function (resolve) {
        var tx = db.transaction('tracks', 'readonly');
        var req = tx.objectStore('tracks').getAll();
        req.onsuccess = function () {
          var all = req.result || [];
          resolve(genre ? all.filter(function (t) { return t.genre === genre; }) : all);
        };
        req.onerror = function () { resolve([]); };
      });
    }).catch(function () { return []; });
  }

  function addUserTrack(genre, file) {
    return openDb().then(function (db) {
      return file.arrayBuffer().then(function (buf) {
        return new Promise(function (resolve, reject) {
          var id = 'trk_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
          var tx = db.transaction('tracks', 'readwrite');
          tx.objectStore('tracks').put({
            id: id, genre: genre, name: file.name, type: file.type || 'audio/mpeg',
            buffer: buf, addedAt: Date.now()
          });
          tx.oncomplete = function () { resolve(id); };
          tx.onerror = function () { reject(tx.error); };
        });
      });
    });
  }

  function playUserTrack(track) {
    if (!track || !track.buffer) return false;
    var blob = new Blob([track.buffer], { type: track.type || 'audio/mpeg' });
    var url = URL.createObjectURL(blob);
    var a = new Audio(url);
    a.loop = false;
    a.volume = volume;
    a.onended = function () {
      listUserTracks(track.genre).then(function (list) {
        if (!playing || !enabled || !list.length) return;
        var next = list[Math.floor(Math.random() * list.length)];
        playUserTrack(next);
      });
    };
    currentAudio = a;
    a.play().catch(function () {});
    return true;
  }

  function start() {
    if (!enabled) return;
    playing = true;
    var c = ensureCtx();
    if (c && c.state === 'suspended') c.resume();
    var genreLabel = family;
    listUserTracks(family).then(function (list) {
      if (!playing) return;
      if (list.length) {
        stopNodes();
        playUserTrack(list[Math.floor(Math.random() * list.length)]);
      } else {
        if (!c) return;
        buildFamily(family);
        fadeMaster(volume, 0.8);
      }
    });
  }

  function fadeMaster(to, sec) {
    if (!master || !ctx) return;
    var now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(to, now + (sec || 0.6));
  }

  function stop() {
    playing = false;
    fadeMaster(0.0001, 0.5);
    setTimeout(function () { if (!playing) stopNodes(); }, 600);
  }

  function setEnabled(on) {
    enabled = !!on;
    saveSettings();
    if (!enabled) stop();
  }
  function setVolume(v) {
    volume = Math.max(0, Math.min(1, Number(v) || 0));
    saveSettings();
    if (master) master.gain.value = volume;
    if (currentAudio) currentAudio.volume = volume;
  }
  function setDuck(on) { duck = !!on; saveSettings(); }
  function setAuto(on) { autoGenre = !!on; saveSettings(); }
  function setFamily(fam) {
    family = fam || 'minimal';
    saveSettings();
    if (playing && enabled) start();
  }
  function setGenreLabel(genre) {
    if (!autoGenre) return;
    var fam = (global.FocusGenre && FocusGenre.musicFamily(genre)) || 'minimal';
    if (fam !== family) {
      family = fam;
      saveSettings();
      if (playing && enabled) start();
    }
  }
  function notifyVoice(active) {
    if (!duck || !duckGain || !ctx) return;
    var now = ctx.currentTime;
    duckGain.gain.cancelScheduledValues(now);
    duckGain.gain.setValueAtTime(duckGain.gain.value, now);
    duckGain.gain.linearRampToValueAtTime(active ? 0.22 : 1, now + 0.15);
  }

  global.FocusMusic = {
    start: start,
    stop: stop,
    setEnabled: setEnabled,
    isEnabled: function () { return enabled; },
    isPlaying: function () { return playing; },
    setVolume: setVolume,
    getVolume: function () { return volume; },
    setDuck: setDuck,
    getDuck: function () { return duck; },
    setAuto: setAuto,
    getAuto: function () { return autoGenre; },
    setFamily: setFamily,
    getFamily: function () { return family; },
    setGenreLabel: setGenreLabel,
    notifyVoice: notifyVoice,
    addUserTrack: addUserTrack,
    listUserTracks: listUserTracks,
    ensureCtx: ensureCtx,
    getMasterGain: function () { return master ? master.gain.value : 0; },
    getDuckGain: function () { return duckGain ? duckGain.gain.value : 1; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
