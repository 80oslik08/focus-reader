/**
 * Phase A2 — Piper neural TTS boot (ES module).
 * Vendored runtime: vendor/piper (onnxruntime-web + mintplex piper-tts-web, single-thread).
 */
import piper from './vendor/piper/piper-engine.js';

const LS_VOICE = 'focusReader.piperVoiceByLang';
const LS_PREF_ENGINE = 'focusReader.ttsEngine'; // 'piper' | 'device'

function loadMap(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; }
  catch (e) { return {}; }
}
function saveMap(key, map) {
  try { localStorage.setItem(key, JSON.stringify(map)); } catch (e) {}
}

/** Map WPM → Piper length_scale (higher = slower speech in Piper). Calibrated ≈ 180 WPM at 1.0. */
function wpmToLengthScale(wpm) {
  var w = Math.max(80, Math.min(600, Number(wpm) || 180));
  // length_scale ≈ 180/wpm, clamped
  return Math.max(0.55, Math.min(2.2, 180 / w));
}

function wpmToPlaybackRate(wpm, baseWpm) {
  var base = baseWpm || 180;
  var w = Math.max(80, Math.min(600, Number(wpm) || base));
  return Math.max(0.7, Math.min(1.6, w / base));
}

/**
 * Allocate word end-times (seconds) across duration using weighted character counts.
 * Punctuation at end of word adds pause weight. Monotonic; last === duration.
 */
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

function createPiperEngine() {
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
  var queue = []; // lookahead blobs
  var speaking = false;
  var voiceId = null;

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

  function onEnded() {
    stopTick();
    speaking = false;
    emit('end', { gen: gen });
  }

  audio.addEventListener('ended', onEnded);
  audio.addEventListener('error', function () {
    emit('error', { message: 'audio error', gen: gen });
  });

  async function synth(text, vid) {
    var blob = await piper.predict({
      text: text,
      voiceId: vid,
      wasmPaths: piper.DEFAULT_WASM
    });
    return blob;
  }

  return {
    supportsBackground: function () { return true; },
    setRate: function (wpm) {
      lengthScale = wpmToLengthScale(wpm);
      rate = wpmToPlaybackRate(wpm, 180 / lengthScale);
      try { audio.playbackRate = rate; } catch (e) {}
    },
    setVoiceId: function (id) { voiceId = id; },
    getVoiceId: function () { return voiceId; },
    stop: function () {
      gen += 1;
      speaking = false;
      stopTick();
      try { audio.pause(); audio.removeAttribute('src'); audio.load(); } catch (e) {}
      queue = [];
    },
    on: function (ev, fn) {
      if (handlers[ev]) handlers[ev].push(fn);
      return function () {
        handlers[ev] = (handlers[ev] || []).filter(function (x) { return x !== fn; });
      };
    },
    /**
     * speak(words[a..b]) — words array slice; fires {wordIndex} absolute via baseIndex.
     */
    speak: async function (words, startIndex, opts) {
      opts = opts || {};
      var myGen = ++gen;
      baseIndex = startIndex || 0;
      var list = (words || []).slice();
      if (!list.length) return;
      var vid = opts.voiceId || voiceId;
      if (!vid) throw new Error('No Piper voice selected — download one in Natural voices');

      // Prepare speech text (roman already applied upstream)
      var text = list.join(' ');
      this.setRate(opts.wpm || 180);

      var blob = await synth(text, vid);
      if (myGen !== gen) return; // cancelled

      var url = URL.createObjectURL(blob);
      audio.src = url;
      audio.playbackRate = rate;
      // Estimate duration after metadata
      await new Promise(function (resolve) {
        var done = function () { audio.removeEventListener('loadedmetadata', done); resolve(); };
        if (audio.readyState >= 1) resolve();
        else audio.addEventListener('loadedmetadata', done);
      });
      if (myGen !== gen) return;

      var dur = audio.duration;
      if (!(dur > 0) || !isFinite(dur)) {
        // fallback estimate from WPM
        dur = (list.length / Math.max(80, opts.wpm || 180)) * 60;
      }
      wordEnds = allocateWordTimes(list, dur);
      speaking = true;
      try {
        await audio.play();
      } catch (e) {
        emit('error', { message: String(e && e.message || e), gen: myGen });
        return;
      }
      if (myGen !== gen) return;
      stopTick();
      raf = requestAnimationFrame(tick);
    },
    getAudioEl: function () { return audio; },
    allocateWordTimes: allocateWordTimes,
    wpmToLengthScale: wpmToLengthScale,
    _piper: piper
  };
}

var engine = createPiperEngine();

window.FocusPiper = piper;
window.FocusPiperEngine = engine;
window.FocusPiperUtil = {
  allocateWordTimes: allocateWordTimes,
  wpmToLengthScale: wpmToLengthScale,
  wpmToPlaybackRate: wpmToPlaybackRate,
  wordIndexAtTime: wordIndexAtTime,
  loadVoiceMap: function () { return loadMap(LS_VOICE); },
  saveVoiceMap: function (m) { saveMap(LS_VOICE, m); },
  LS_VOICE: LS_VOICE,
  LS_PREF_ENGINE: LS_PREF_ENGINE
};

// Register as pluggable engine if FocusTtsEngine hook exists
if (window.FocusListen && typeof window.FocusListen.setEngine === 'function') {
  window.FocusListen.setEngine('piper', engine);
}

window.dispatchEvent(new CustomEvent('focuspiper-ready'));
console.info('[FocusPiper] ready (single-thread WASM)');
