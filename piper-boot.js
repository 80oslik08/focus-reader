/**
 * Phase A2 — Piper neural TTS boot (ES module).
 * ONNX inference runs in piper-worker.js; main thread plays audio + ORP sync.
 */
const LS_VOICE = 'focusReader.piperVoiceByLang';
const LS_PREF_ENGINE = 'focusReader.ttsEngine';
const LOOKAHEAD = 2;
const CHUNK_WORDS = 18;

function loadMap(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; }
  catch (e) { return {}; }
}
function saveMap(key, map) {
  try { localStorage.setItem(key, JSON.stringify(map)); } catch (e) {}
}

function wpmToLengthScale(wpm) {
  var w = Math.max(80, Math.min(600, Number(wpm) || 180));
  return Math.max(0.55, Math.min(2.2, 180 / w));
}
function wpmToPlaybackRate(wpm, baseWpm) {
  var base = baseWpm || 180;
  var w = Math.max(80, Math.min(600, Number(wpm) || base));
  return Math.max(0.7, Math.min(1.6, w / base));
}

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
    return words.map(function (_, i) { return ((i + 1) / words.length) * (durationSec || 0); });
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

function wordIndexAtTime(ends, t) {
  if (!ends.length) return 0;
  for (var i = 0; i < ends.length; i++) {
    if (t < ends[i] - 1e-4) return i;
  }
  return ends.length - 1;
}

/** Split words into speech chunks at sentence boundaries, capped at CHUNK_WORDS. */
function chunkWords(words) {
  var out = [];
  var cur = [];
  for (var i = 0; i < words.length; i++) {
    cur.push(words[i]);
    var endSent = /[.!?…]$/.test(String(words[i] || ''));
    if (endSent || cur.length >= CHUNK_WORDS) {
      out.push(cur);
      cur = [];
    }
  }
  if (cur.length) out.push(cur);
  return out;
}

function setPrepVisible(on, text) {
  var el = document.getElementById('voicePrepBanner');
  var tx = document.getElementById('voicePrepText');
  if (tx && text) tx.textContent = text;
  if (el) {
    if (on) el.hidden = false;
    else el.hidden = true;
  }
}

function createWorkerRpc() {
  var worker = new Worker(new URL('./piper-worker.js', import.meta.url), { type: 'module' });
  var nextId = 1;
  var pending = new Map();
  var ready = false;
  var readyWaiters = [];

  worker.onmessage = function (e) {
    var msg = e.data || {};
    if (msg.type === 'worker-ready') {
      ready = true;
      readyWaiters.splice(0).forEach(function (fn) { fn(); });
      return;
    }
    if (msg.type === 'download-progress') {
      var p = pending.get(msg.id);
      if (p && p.onProgress) p.onProgress(msg.progress);
      return;
    }
    var entry = pending.get(msg.id);
    if (!entry) return;
    if (msg.type === 'error') {
      pending.delete(msg.id);
      entry.reject(new Error(msg.message || 'worker error'));
      return;
    }
    // terminal replies
    if (/-done$/.test(msg.type) || msg.type === 'pong' || msg.type === 'synth-done') {
      pending.delete(msg.id);
      entry.resolve(msg);
    }
  };
  worker.onerror = function (err) {
    console.error('[FocusPiper] worker error', err);
  };

  function whenReady() {
    if (ready) return Promise.resolve();
    return new Promise(function (resolve) { readyWaiters.push(resolve); });
  }

  function call(type, payload, onProgress) {
    return whenReady().then(function () {
      var id = nextId++;
      return new Promise(function (resolve, reject) {
        pending.set(id, { resolve: resolve, reject: reject, onProgress: onProgress });
        worker.postMessage({ id: id, type: type, payload: payload || {} });
      });
    });
  }

  return {
    worker: worker,
    call: call,
    cancelAll: function () {
      pending.forEach(function (entry, id) {
        try { entry.reject(new Error('cancelled')); } catch (e) {}
      });
      pending.clear();
      return call('cancel-all', {});
    }
  };
}

function createPiperFacade(rpc) {
  return {
    predict: async function (config, callback) {
      if (callback) callback({ stage: 'worker' });
      var msg = await rpc.call('synth', {
        text: config.text,
        voiceId: config.voiceId || config.voice
      });
      return new Blob([msg.buffer], { type: msg.mime || 'audio/wav' });
    },
    download: function (voiceId, callback) {
      return rpc.call('download', { voiceId: voiceId }, callback).then(function () { return true; });
    },
    remove: function (voiceId) {
      return rpc.call('remove', { voiceId: voiceId });
    },
    flush: function () {
      return rpc.call('flush', {});
    },
    stored: async function () {
      var msg = await rpc.call('stored', {});
      return msg.stored || [];
    },
    voices: async function () {
      var msg = await rpc.call('voices', {});
      return msg.voices;
    },
    DEFAULT_WASM: null,
    TtsSession: { _instance: null },
    HF_BASE: 'https://huggingface.co/rhasspy/piper-voices/resolve/main'
  };
}

function createPiperEngine(rpc) {
  var audio = new Audio();
  audio.setAttribute('playsinline', 'true');
  audio.preload = 'auto';
  var gen = 0;
  var rate = 1;
  var lengthScale = 1;
  var handlers = { wordIndex: [], end: [], error: [] };
  var wordEnds = [];
  var baseIndex = 0;
  var raf = 0;
  var speaking = false;
  var voiceId = null;
  var warmed = {};
  var playQueue = []; // { blobUrl, words, baseIndex }
  var fetching = 0;
  var starting = false;
  var chunkPlan = null; // { chunks, nextFetch, voiceId, wpm, myGen }
  var currentUrl = null;

  function emit(type, payload) {
    (handlers[type] || []).forEach(function (fn) {
      try { fn(payload); } catch (e) {}
    });
  }
  function stopTick() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }
  function tick() {
    if (!speaking || audio.paused) return;
    var idx = wordIndexAtTime(wordEnds, audio.currentTime);
    emit('wordIndex', { wordIndex: baseIndex + idx, t: audio.currentTime, gen: gen });
    raf = requestAnimationFrame(tick);
  }

  function revokeCurrent() {
    if (currentUrl) {
      try { URL.revokeObjectURL(currentUrl); } catch (e) {}
      currentUrl = null;
    }
  }

  async function ensureWarm(vid) {
    if (warmed[vid]) return;
    setPrepVisible(true, 'Preparing voice…');
    try {
      await rpc.call('warm', { voiceId: vid, text: 'Ready.' });
      warmed[vid] = true;
    } finally {
      setPrepVisible(false);
    }
  }

  async function fetchChunk(plan, chunkIndex) {
    if (!plan || plan.myGen !== gen) return;
    if (chunkIndex >= plan.chunks.length) return;
    fetching++;
    try {
      if (!warmed[plan.voiceId]) {
        setPrepVisible(true, 'Preparing voice…');
      }
      var words = plan.chunks[chunkIndex];
      var text = words.join(' ');
      var msg = await rpc.call('synth', { text: text, voiceId: plan.voiceId });
      if (plan.myGen !== gen) return;
      warmed[plan.voiceId] = true;
      setPrepVisible(false);
      var blob = new Blob([msg.buffer], { type: msg.mime || 'audio/wav' });
      var url = URL.createObjectURL(blob);
      var absBase = plan.startIndex;
      for (var i = 0; i < chunkIndex; i++) absBase += plan.chunks[i].length;
      playQueue.push({ url: url, words: words, baseIndex: absBase });
      maybeStartPlay(plan);
    } catch (e) {
      if (plan.myGen === gen) {
        setPrepVisible(false);
        emit('error', { message: String(e && e.message || e), gen: plan.myGen });
      }
    } finally {
      fetching--;
      fillLookahead(plan);
    }
  }

  function fillLookahead(plan) {
    if (!plan || plan.myGen !== gen) return;
    while (
      plan.nextFetch < plan.chunks.length &&
      (playQueue.length + fetching) < LOOKAHEAD + (speaking ? 0 : 1)
    ) {
      var idx = plan.nextFetch++;
      fetchChunk(plan, idx);
    }
  }

  async function playItem(item, plan) {
    revokeCurrent();
    currentUrl = item.url;
    baseIndex = item.baseIndex;
    audio.src = item.url;
    audio.playbackRate = rate;
    await new Promise(function (resolve) {
      var done = function () { audio.removeEventListener('loadedmetadata', done); resolve(); };
      if (audio.readyState >= 1) resolve();
      else audio.addEventListener('loadedmetadata', done);
    });
    if (plan.myGen !== gen) return;
    var dur = audio.duration;
    if (!(dur > 0) || !isFinite(dur)) {
      dur = (item.words.length / Math.max(80, plan.wpm || 180)) * 60;
    }
    wordEnds = allocateWordTimes(item.words, dur);
    speaking = true;
    try {
      await audio.play();
    } catch (e) {
      emit('error', { message: String(e && e.message || e), gen: plan.myGen });
      return;
    }
    if (plan.myGen !== gen) return;
    stopTick();
    raf = requestAnimationFrame(tick);
    fillLookahead(plan);
  }

  function maybeStartPlay(plan) {
    if (!plan || plan.myGen !== gen) return;
    if (speaking || starting) return;
    if (!playQueue.length) {
      if (!fetching && plan.nextFetch >= plan.chunks.length) {
        speaking = false;
        emit('end', { gen: plan.myGen });
      }
      return;
    }
    var item = playQueue.shift();
    starting = true;
    Promise.resolve(playItem(item, plan)).finally(function () { starting = false; });
  }

  function onEnded() {
    stopTick();
    speaking = false;
    revokeCurrent();
    if (!chunkPlan || chunkPlan.myGen !== gen) {
      emit('end', { gen: gen });
      return;
    }
    if (playQueue.length) {
      maybeStartPlay(chunkPlan);
      return;
    }
    if (chunkPlan.nextFetch < chunkPlan.chunks.length || fetching) {
      // wait for next chunk
      var wait = setInterval(function () {
        if (!chunkPlan || chunkPlan.myGen !== gen) {
          clearInterval(wait);
          return;
        }
        if (playQueue.length) {
          clearInterval(wait);
          maybeStartPlay(chunkPlan);
        } else if (!fetching && chunkPlan.nextFetch >= chunkPlan.chunks.length) {
          clearInterval(wait);
          emit('end', { gen: chunkPlan.myGen });
        }
      }, 40);
      fillLookahead(chunkPlan);
      return;
    }
    emit('end', { gen: chunkPlan.myGen });
  }

  audio.addEventListener('ended', onEnded);
  audio.addEventListener('error', function () {
    emit('error', { message: 'audio error', gen: gen });
  });

  return {
    supportsBackground: function () { return true; },
    setRate: function (wpm) {
      lengthScale = wpmToLengthScale(wpm);
      rate = wpmToPlaybackRate(wpm, 180 / lengthScale);
      try { audio.playbackRate = rate; } catch (e) {}
    },
    setVoiceId: function (id) { voiceId = id; },
    getVoiceId: function () { return voiceId; },
    pause: function () { try { audio.pause(); } catch (e) {} },
    resume: function () {
      try {
        audio.play();
        stopTick();
        raf = requestAnimationFrame(tick);
      } catch (e) {}
    },
    stop: function () {
      gen += 1;
      speaking = false;
      stopTick();
      try { audio.pause(); audio.removeAttribute('src'); audio.load(); } catch (e) {}
      playQueue.forEach(function (q) {
        try { URL.revokeObjectURL(q.url); } catch (e) {}
      });
      playQueue = [];
      revokeCurrent();
      chunkPlan = null;
      starting = false;
      setPrepVisible(false);
      try { rpc.cancelAll(); } catch (e) {}
    },
    on: function (ev, fn) {
      if (handlers[ev]) handlers[ev].push(fn);
      return function () {
        handlers[ev] = (handlers[ev] || []).filter(function (x) { return x !== fn; });
      };
    },
    warm: function (vid) {
      return ensureWarm(vid || voiceId);
    },
    speak: async function (words, startIndex, opts) {
      opts = opts || {};
      var myGen = ++gen;
      playQueue.forEach(function (q) {
        try { URL.revokeObjectURL(q.url); } catch (e) {}
      });
      playQueue = [];
      revokeCurrent();
      speaking = false;
      stopTick();
      try { audio.pause(); } catch (e) {}

      var list = (words || []).slice();
      if (!list.length) return;
      var vid = opts.voiceId || voiceId;
      if (!vid) throw new Error('No Piper voice selected — download one in Natural voices');
      this.setRate(opts.wpm || 180);

      var chunks = chunkWords(list);
      chunkPlan = {
        chunks: chunks,
        nextFetch: 0,
        voiceId: vid,
        wpm: opts.wpm || 180,
        startIndex: startIndex || 0,
        myGen: myGen
      };
      fillLookahead(chunkPlan);
      // Wait until first audio is playing or error/cancel
      var start = Date.now();
      while (myGen === gen && Date.now() - start < 120000) {
        if (speaking) return;
        if (!fetching && !playQueue.length && chunkPlan.nextFetch >= chunks.length) return;
        await new Promise(function (r) { setTimeout(r, 30); });
      }
    },
    getAudioEl: function () { return audio; },
    allocateWordTimes: allocateWordTimes,
    wpmToLengthScale: wpmToLengthScale,
    usesWorker: true
  };
}

var rpc = createWorkerRpc();
var piperApi = createPiperFacade(rpc);
var engine = createPiperEngine(rpc);

window.FocusPiper = piperApi;
window.FocusPiperEngine = engine;
window.FocusPiperUtil = {
  allocateWordTimes: allocateWordTimes,
  wpmToLengthScale: wpmToLengthScale,
  wpmToPlaybackRate: wpmToPlaybackRate,
  wordIndexAtTime: wordIndexAtTime,
  chunkWords: chunkWords,
  loadVoiceMap: function () { return loadMap(LS_VOICE); },
  saveVoiceMap: function (m) { saveMap(LS_VOICE, m); },
  LS_VOICE: LS_VOICE,
  LS_PREF_ENGINE: LS_PREF_ENGINE
};

if (window.FocusListen && typeof window.FocusListen.setEngine === 'function') {
  window.FocusListen.setEngine('piper', engine);
}

window.dispatchEvent(new CustomEvent('focuspiper-ready'));
console.info('[FocusPiper] ready (module worker + lookahead)');
