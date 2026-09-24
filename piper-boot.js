/**
 * Piper TTS boot — worker synth with phoneme/energy wordEnds; dual <audio> ping-pong.
 * Media Session stays on the audible <audio> element.
 */
import './piper-timing.js';

const LS_VOICE = 'focusReader.piperVoiceByLang';
const LS_PREF_ENGINE = 'focusReader.ttsEngine';
const LOOKAHEAD = 2;
const CHUNK_WORDS = 25;

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

function wordIndexAtTime(ends, t) {
  if (!ends.length) return 0;
  for (var i = 0; i < ends.length; i++) {
    if (t < ends[i] - 1e-4) return i;
  }
  return ends.length - 1;
}

function setPrepVisible(on, text) {
  var el = document.getElementById('voicePrepBanner');
  var tx = document.getElementById('voicePrepText');
  if (tx && text) tx.textContent = text;
  if (el) el.hidden = !on;
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
    call: call,
    cancelAll: function () {
      pending.forEach(function (entry) {
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
        voiceId: config.voiceId || config.voice,
        words: config.words
      });
      return new Blob([msg.buffer], { type: msg.mime || 'audio/wav' });
    },
    download: function (voiceId, callback) {
      return rpc.call('download', { voiceId: voiceId }, callback).then(function () { return true; });
    },
    remove: function (voiceId) { return rpc.call('remove', { voiceId: voiceId }); },
    flush: function () { return rpc.call('flush', {}); },
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

function makeAudio() {
  var a = new Audio();
  a.setAttribute('playsinline', 'true');
  a.preload = 'auto';
  return a;
}

function createPiperEngine(rpc) {
  // Dual audio ping-pong for seamless chunk joins
  var a0 = makeAudio();
  var a1 = makeAudio();
  var active = 0;
  function curAudio() { return active === 0 ? a0 : a1; }
  function nextAudio() { return active === 0 ? a1 : a0; }

  var gen = 0;
  var rate = 1;
  var handlers = { wordIndex: [], end: [], error: [] };
  var wordEnds = [];
  var baseIndex = 0;
  var raf = 0;
  var speaking = false;
  var starting = false;
  var voiceId = null;
  var warmed = {};
  var playQueue = [];
  var fetching = 0;
  var chunkPlan = null;
  var urls = [];
  var lastMeta = { wordEnds: [], words: [], phonemeCount: 0, timelineEnds: [], timelineWords: [], timelineOffset: 0 };

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
    var audio = curAudio();
    if (!speaking || audio.paused) return;
    var idx = wordIndexAtTime(wordEnds, audio.currentTime);
    emit('wordIndex', { wordIndex: baseIndex + idx, t: audio.currentTime, gen: gen });
    raf = requestAnimationFrame(tick);
  }

  function revokeAll() {
    urls.forEach(function (u) { try { URL.revokeObjectURL(u); } catch (e) {} });
    urls = [];
  }

  async function ensureWarm(vid) {
    if (!vid || warmed[vid]) return;
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
      if (!warmed[plan.voiceId]) setPrepVisible(true, 'Preparing voice…');
      var words = plan.chunks[chunkIndex];
      var text = words.join(' ');
      var msg = await rpc.call('synth', {
        text: text,
        voiceId: plan.voiceId,
        words: words
      });
      if (plan.myGen !== gen) return;
      warmed[plan.voiceId] = true;
      setPrepVisible(false);
      var blob = new Blob([msg.buffer], { type: msg.mime || 'audio/wav' });
      var url = URL.createObjectURL(blob);
      urls.push(url);
      var absBase = plan.startIndex;
      for (var i = 0; i < chunkIndex; i++) absBase += plan.chunks[i].length;
      playQueue.push({
        url: url,
        words: words,
        baseIndex: absBase,
        wordEnds: msg.wordEnds || [],
        durationSec: msg.durationSec || 0,
        phonemeCount: msg.phonemeCount || 0
      });
      // Preload into the idle audio element when queue has ≥1 and we're speaking or about to
      preloadNext();
      maybeStartPlay(plan);
    } catch (e) {
      if (plan.myGen === gen) {
        setPrepVisible(false);
        if (String(e && e.message) !== 'cancelled') {
          emit('error', { message: String(e && e.message || e), gen: plan.myGen });
        }
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
      (playQueue.length + fetching) < LOOKAHEAD + (speaking || starting ? 0 : 1)
    ) {
      fetchChunk(plan, plan.nextFetch++);
    }
  }

  function preloadNext() {
    if (!playQueue.length) return;
    var idle = speaking ? nextAudio() : curAudio();
    var item = playQueue[0];
    if (idle.src !== item.url) {
      try {
        idle.src = item.url;
        idle.load();
      } catch (e) {}
    }
  }

  async function playItem(item, plan) {
    var audio = curAudio();
    // If next already preloaded on the other element with this url, swap
    var other = nextAudio();
    if (other.src === item.url && other.readyState >= 1) {
      active = 1 - active;
      audio = curAudio();
    } else if (audio.src !== item.url) {
      audio.src = item.url;
    }
    audio.playbackRate = rate;
    await new Promise(function (resolve) {
      var done = function () { audio.removeEventListener('loadedmetadata', done); resolve(); };
      if (audio.readyState >= 1) resolve();
      else audio.addEventListener('loadedmetadata', done);
    });
    if (plan.myGen !== gen) return;

    baseIndex = item.baseIndex;
    var dur = audio.duration;
    if (!(dur > 0) || !isFinite(dur)) dur = item.durationSec || 1;
    wordEnds = (item.wordEnds && item.wordEnds.length === item.words.length)
      ? item.wordEnds.slice()
      : (globalThis.FocusPiperTiming
        ? FocusPiperTiming.allocateByPhonemes(item.words, [], dur)
        : item.words.map(function (_, i) { return ((i + 1) / item.words.length) * dur; }));
    if (wordEnds.length) wordEnds[wordEnds.length - 1] = dur;
    lastMeta.wordEnds = wordEnds.slice();
    lastMeta.words = item.words.slice();
    lastMeta.phonemeCount = (item.wordEnds && item.wordEnds.length) || 0;
    // Absolute timeline across chunks (offset by prior chunk durations)
    var off = lastMeta.timelineOffset || 0;
    for (var ti = 0; ti < wordEnds.length; ti++) {
      lastMeta.timelineEnds.push(off + wordEnds[ti]);
      lastMeta.timelineWords.push(item.words[ti]);
    }
    lastMeta.timelineOffset = off + (wordEnds.length ? wordEnds[wordEnds.length - 1] : 0);

    speaking = true;
    starting = false;
    try {
      await audio.play();
    } catch (e) {
      emit('error', { message: String(e && e.message || e), gen: plan.myGen });
      return;
    }
    if (plan.myGen !== gen) return;
    stopTick();
    raf = requestAnimationFrame(tick);
    // Preload following chunk onto the other element
    preloadNext();
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
    if (!chunkPlan || chunkPlan.myGen !== gen) {
      emit('end', { gen: gen });
      return;
    }
    // Seamlessly continue — swap to next if ready
    if (playQueue.length) {
      active = 1 - active;
      maybeStartPlay(chunkPlan);
      return;
    }
    if (chunkPlan.nextFetch < chunkPlan.chunks.length || fetching) {
      var wait = setInterval(function () {
        if (!chunkPlan || chunkPlan.myGen !== gen) { clearInterval(wait); return; }
        if (playQueue.length) {
          clearInterval(wait);
          active = 1 - active;
          maybeStartPlay(chunkPlan);
        } else if (!fetching && chunkPlan.nextFetch >= chunkPlan.chunks.length) {
          clearInterval(wait);
          emit('end', { gen: chunkPlan.myGen });
        }
      }, 20);
      fillLookahead(chunkPlan);
      return;
    }
    emit('end', { gen: chunkPlan.myGen });
  }

  a0.addEventListener('ended', onEnded);
  a1.addEventListener('ended', onEnded);
  function onErr() { emit('error', { message: 'audio error', gen: gen }); }
  a0.addEventListener('error', onErr);
  a1.addEventListener('error', onErr);

  var Timing = globalThis.FocusPiperTiming;

  return {
    supportsBackground: function () { return true; },
    setRate: function (wpm) {
      rate = wpmToPlaybackRate(wpm, 180 / wpmToLengthScale(wpm));
      try { a0.playbackRate = rate; a1.playbackRate = rate; } catch (e) {}
    },
    setVoiceId: function (id) { voiceId = id; },
    getVoiceId: function () { return voiceId; },
    pause: function () { try { curAudio().pause(); } catch (e) {} },
    resume: function () {
      try {
        curAudio().play();
        stopTick();
        raf = requestAnimationFrame(tick);
      } catch (e) {}
    },
    stop: function () {
      gen += 1;
      speaking = false;
      starting = false;
      stopTick();
      try { a0.pause(); a0.removeAttribute('src'); a0.load(); } catch (e) {}
      try { a1.pause(); a1.removeAttribute('src'); a1.load(); } catch (e) {}
      playQueue = [];
      revokeAll();
      chunkPlan = null;
      setPrepVisible(false);
      try { rpc.cancelAll(); } catch (e) {}
    },
    on: function (ev, fn) {
      if (handlers[ev]) handlers[ev].push(fn);
      return function () {
        handlers[ev] = (handlers[ev] || []).filter(function (x) { return x !== fn; });
      };
    },
    warm: function (vid) { return ensureWarm(vid || voiceId); },
    speak: async function (words, startIndex, opts) {
      opts = opts || {};
      var myGen = ++gen;
      playQueue = [];
      revokeAll();
      speaking = false;
      starting = false;
      stopTick();
      try { a0.pause(); a1.pause(); } catch (e) {}
      lastMeta = { wordEnds: [], words: [], phonemeCount: 0, timelineEnds: [], timelineWords: [], timelineOffset: 0 };

      var list = (words || []).slice();
      if (!list.length) return;
      var vid = opts.voiceId || voiceId;
      if (!vid) throw new Error('No Piper voice selected — download one in Natural voices');
      this.setRate(opts.wpm || 180);

      var chunks = Timing ? Timing.chunkWords(list, CHUNK_WORDS) : [list];
      chunkPlan = {
        chunks: chunks,
        nextFetch: 0,
        voiceId: vid,
        wpm: opts.wpm || 180,
        startIndex: startIndex || 0,
        myGen: myGen
      };
      fillLookahead(chunkPlan);
      var start = Date.now();
      while (myGen === gen && Date.now() - start < 120000) {
        if (speaking) return;
        if (!fetching && !playQueue.length && chunkPlan.nextFetch >= chunks.length) return;
        await new Promise(function (r) { setTimeout(r, 20); });
      }
    },
    getAudioEl: function () { return curAudio(); },
    getLastWordEnds: function () {
      return (lastMeta.timelineEnds.length ? lastMeta.timelineEnds : lastMeta.wordEnds).slice();
    },
    getLastWords: function () {
      return (lastMeta.timelineWords.length ? lastMeta.timelineWords : lastMeta.words).slice();
    },
    allocateWordTimes: function (words, dur) {
      return Timing ? Timing.allocateByPhonemes(words, [], dur) : [];
    },
    wpmToLengthScale: wpmToLengthScale,
    usesWorker: true
  };
}

var rpc = createWorkerRpc();
var piperApi = createPiperFacade(rpc);
var engine = createPiperEngine(rpc);
var Timing = globalThis.FocusPiperTiming;

window.FocusPiper = piperApi;
window.FocusPiperEngine = engine;
window.FocusPiperUtil = {
  allocateWordTimes: function (words, dur, phonemes, pcm, sr) {
    if (Timing && (phonemes || pcm)) return Timing.allocateWordTimes(words, phonemes || [], dur, pcm, sr);
    if (Timing) return Timing.allocateByPhonemes(words, phonemes || [], dur);
    return words.map(function (_, i) { return ((i + 1) / words.length) * dur; });
  },
  allocateByPhonemes: Timing && Timing.allocateByPhonemes,
  snapToEnergy: Timing && Timing.snapToEnergy,
  chunkWords: Timing && Timing.chunkWords,
  wpmToLengthScale: wpmToLengthScale,
  wpmToPlaybackRate: wpmToPlaybackRate,
  wordIndexAtTime: wordIndexAtTime,
  loadVoiceMap: function () { return loadMap(LS_VOICE); },
  saveVoiceMap: function (m) { saveMap(LS_VOICE, m); },
  LS_VOICE: LS_VOICE,
  LS_PREF_ENGINE: LS_PREF_ENGINE
};

if (window.FocusListen && typeof window.FocusListen.setEngine === 'function') {
  window.FocusListen.setEngine('piper', engine);
}

window.dispatchEvent(new CustomEvent('focuspiper-ready'));
console.info('[FocusPiper] ready (worker phoneme+energy timing, dual-audio)');
