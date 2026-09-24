/**
 * Listen mode — Web Speech API with generation tokens, short utterances,
 * cancel-only stop (no pause/resume), watchdog, and quality voice ranking.
 */
(function (global) {
  'use strict';

  var listenOn = false;
  var speaking = false;
  var voices = [];
  var selectedVoiceURI = '';
  var voiceByLang = {}; // lang → voiceURI
  var langOverride = '';
  var detectedLang = 'en';
  var sentenceQueue = [];
  var currentSentenceMeta = null;
  var currentUtterance = null;
  var fallbackTimer = null;
  var watchdogTimer = null;
  var restartTimer = null;
  var speakDelayTimer = null;
  var gen = 0; // increments on every start/stop; stale handlers ignore
  var rateCalibration = 1;
  var achievedSamples = [];
  var lastBoundaryAt = 0;
  var handlers = {
    onWord: null,
    onEnd: null,
    onVoices: null,
    onPace: null // { wps } measured speech pace
  };

  var MAX_UTT_CHARS = 180;
  var DEBOUNCE_MS = 120;
  var CANCEL_SPEAK_GAP_MS = 80;
  var WATCHDOG_SLACK_MS = 3000;

  function supportsSpeech() {
    return typeof global.speechSynthesis !== 'undefined' &&
      typeof global.SpeechSynthesisUtterance !== 'undefined';
  }

  function loadVoices(silent) {
    if (!supportsSpeech()) return [];
    voices = speechSynthesis.getVoices() || [];
    if (!silent && handlers.onVoices) handlers.onVoices(voices);
    return voices;
  }

  if (supportsSpeech()) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  function detectLanguage(text) {
    var sample = (text || '').slice(0, 4000);
    if (/[\u0400-\u04FF]/.test(sample)) {
      if (/[іїєґІЇЄҐ]/.test(sample)) return 'uk';
      return 'ru';
    }
    var lower = sample.toLowerCase();
    var scores = {
      en: (lower.match(/\b(the|and|of|to|in|that|is|for|it|as|was|with)\b/g) || []).length,
      sk: (lower.match(/\b(a|je|sa|na|to|že|nie|ako|pre|ale|som|si)\b/g) || []).length,
      cs: (lower.match(/\b(je|se|na|to|že|ale|jak|pro|jsem|si|nebo)\b/g) || []).length,
      de: (lower.match(/\b(der|die|das|und|ist|von|zu|den|mit|sich|nicht)\b/g) || []).length,
      pl: (lower.match(/\b(się|nie|to|na|jest|do|że|jak|ale|od)\b/g) || []).length,
      hu: (lower.match(/\b(a|az|és|hogy|nem|van|egy|el|meg|de)\b/g) || []).length,
      fr: (lower.match(/\b(le|la|les|de|des|et|est|un|une|dans|que)\b/g) || []).length,
      es: (lower.match(/\b(el|la|de|que|y|en|los|se|del|las|un)\b/g) || []).length,
      it: (lower.match(/\b(il|di|che|la|e|un|per|è|una|sono)\b/g) || []).length
    };
    var best = 'en';
    var bestN = -1;
    Object.keys(scores).forEach(function (k) {
      if (scores[k] > bestN) { bestN = scores[k]; best = k; }
    });
    return best;
  }

  function voiceQualityTag(v) {
    var n = ((v && v.name) || '') + ' ' + ((v && v.voiceURI) || '');
    var lower = n.toLowerCase();
    if (/natural|neural|online \(natural\)|google/.test(lower)) return 'Natural';
    if (/premium|enhanced|super/.test(lower)) return 'Enhanced';
    return 'Standard';
  }

  function voiceQualityRank(v) {
    var tag = voiceQualityTag(v);
    if (tag === 'Natural') return 3;
    if (tag === 'Enhanced') return 2;
    return 1;
  }

  function pickVoice(lang) {
    loadVoices();
    var want = (langOverride || lang || 'en').toLowerCase();
    var langKey = want.slice(0, 2);
    var preferredURI = selectedVoiceURI || voiceByLang[langKey] || '';
    var list = voices.slice();

    function score(v) {
      var s = 0;
      var vl = (v.lang || '').toLowerCase();
      if (preferredURI && v.voiceURI === preferredURI) s += 100;
      if (vl.indexOf(want) === 0) s += 20;
      else if (vl.indexOf(langKey) === 0) s += 12;
      s += voiceQualityRank(v) * 8;
      var name = (v.name || '').toLowerCase();
      if (/natural|neural|premium|enhanced|online \(natural\)/.test(name)) s += 6;
      if (/google/.test(name)) s += 5;
      if (v.localService) s += 2;
      return s;
    }
    list.sort(function (a, b) { return score(b) - score(a); });
    return list[0] || null;
  }

  function cleanWordForSpeech(word) {
    if (global.ORP && typeof ORP.speechCleanWord === 'function') {
      return ORP.speechCleanWord(word);
    }
    return String(word || '').replace(/[_*#~^|\\\/<>\[\]{}=+@]+/g, '').trim();
  }

  /** Build utterance text + charIndex→wordIndex map from cleaned words. */
  function buildUtteranceFromRange(wordList, fromIdx, toIdxExclusive) {
    var parts = [];
    var offsets = [];
    var cursor = 0;
    for (var i = fromIdx; i < toIdxExclusive; i++) {
      var cleaned = cleanWordForSpeech(wordList[i]);
      if (!cleaned) continue;
      if (parts.length) {
        parts.push(' ');
        cursor += 1;
      }
      offsets.push({
        wordIndex: i,
        charStart: cursor,
        charEnd: cursor + cleaned.length
      });
      parts.push(cleaned);
      cursor += cleaned.length;
    }
    return {
      text: parts.join(''),
      startWordIndex: offsets.length ? offsets[0].wordIndex : fromIdx,
      endWordIndex: offsets.length ? offsets[offsets.length - 1].wordIndex : fromIdx,
      wordOffsets: offsets
    };
  }

  function buildSentenceQueue(wordList, startIndex) {
    var queue = [];
    var i = startIndex;
    var n = wordList.length;
    while (i < n) {
      var end = i;
      var approx = 0;
      while (end < n) {
        var cw = cleanWordForSpeech(wordList[end]);
        if (!cw) { end++; continue; }
        var add = (approx ? 1 : 0) + cw.length;
        var isSentenceEnd = /[.!?…]["')\]]*$/.test(wordList[end]);
        if (approx && approx + add > MAX_UTT_CHARS) break;
        approx += add;
        end++;
        if (isSentenceEnd) break;
        if (end - i >= 28) break;
      }
      if (end <= i) end = Math.min(n, i + 1);
      var meta = buildUtteranceFromRange(wordList, i, end);
      if (meta.text && meta.wordOffsets.length) queue.push(meta);
      i = end;
    }
    return queue;
  }

  function wpmToRate(wpm) {
    var natural = 160 * rateCalibration;
    var rate = wpm / natural;
    return Math.max(0.5, Math.min(2.0, rate));
  }

  function noteAchievement(wordsSpoken, elapsedMs) {
    if (elapsedMs < 400 || wordsSpoken < 3) return;
    var achieved = wordsSpoken / (elapsedMs / 60000);
    achievedSamples.push(achieved);
    if (achievedSamples.length > 8) achievedSamples.shift();
    var avg = achievedSamples.reduce(function (a, b) { return a + b; }, 0) / achievedSamples.length;
    if (global.VoiceLimit) VoiceLimit.setVoiceMax(Math.max(avg, VoiceLimit.getLimit()));
  }

  function charIndexToWordIndex(charIndex, meta) {
    if (!meta || !meta.wordOffsets || !meta.wordOffsets.length) {
      return meta ? meta.startWordIndex : 0;
    }
    var offs = meta.wordOffsets;
    for (var i = 0; i < offs.length; i++) {
      if (charIndex >= offs[i].charStart && charIndex < offs[i].charEnd) {
        return offs[i].wordIndex;
      }
    }
    if (charIndex >= offs[offs.length - 1].charEnd) return offs[offs.length - 1].wordIndex;
    return offs[0].wordIndex;
  }

  function clearFallback() {
    if (fallbackTimer) {
      clearInterval(fallbackTimer);
      fallbackTimer = null;
    }
  }

  function clearWatchdog() {
    if (watchdogTimer) {
      clearTimeout(watchdogTimer);
      watchdogTimer = null;
    }
  }

  function clearSpeakDelay() {
    if (speakDelayTimer) {
      clearTimeout(speakDelayTimer);
      speakDelayTimer = null;
    }
  }

  function clearRestartDebounce() {
    if (restartTimer) {
      clearTimeout(restartTimer);
      restartTimer = null;
    }
  }

  function bumpGen() {
    gen += 1;
    return gen;
  }

  function hardCancel() {
    clearFallback();
    clearWatchdog();
    clearSpeakDelay();
    currentUtterance = null;
    currentSentenceMeta = null;
    if (supportsSpeech()) {
      try { speechSynthesis.cancel(); } catch (e) {}
    }
  }

  function stopListening(silent) {
    speaking = false;
    bumpGen();
    hardCancel();
    clearRestartDebounce();
    if (!silent && handlers.onEnd) handlers.onEnd();
  }

  function expectedDurationMs(meta, wpm) {
    var words = (meta && meta.wordOffsets && meta.wordOffsets.length) || 1;
    var rate = wpmToRate(wpm);
    // rough: base at rate 1 ≈ 160 wpm
    return (words / (160 * rate)) * 60000;
  }

  function armWatchdog(myGen, wpm, meta, wordList) {
    clearWatchdog();
    var expect = expectedDurationMs(meta, wpm) + WATCHDOG_SLACK_MS;
    watchdogTimer = setTimeout(function () {
      if (myGen !== gen || !speaking || !listenOn) return;
      // stale — restart from last known word
      var restartAt = meta && meta.wordOffsets && meta.wordOffsets.length
        ? meta.wordOffsets[0].wordIndex
        : (handlers._lastWordIndex || 0);
      if (handlers.onWord && meta && meta.wordOffsets && meta.wordOffsets.length) {
        // keep display at current if we have a last word
      }
      var from = typeof handlers._lastWordIndex === 'number' ? handlers._lastWordIndex : restartAt;
      speakFromWordIndexImmediate(wordList, from, wpm);
    }, Math.max(4000, expect));
  }

  function speakNext(myGen, wpm, wordList) {
    if (myGen !== gen || !listenOn || !speaking) return;
    if (!sentenceQueue.length) {
      speaking = false;
      if (handlers.onEnd) handlers.onEnd();
      return;
    }
    var meta = sentenceQueue.shift();
    currentSentenceMeta = meta;
    var utt = new SpeechSynthesisUtterance(meta.text);
    var voice = pickVoice(detectedLang);
    if (voice) utt.voice = voice;
    utt.rate = wpmToRate(wpm);
    utt.lang = (voice && voice.lang) || detectedLang;
    currentUtterance = utt;
    var t0 = Date.now();
    var gotBoundary = false;
    var boundaryCount = 0;
    lastBoundaryAt = t0;

    utt.onboundary = function (ev) {
      if (myGen !== gen) return;
      if (ev.name && ev.name !== 'word') return;
      gotBoundary = true;
      boundaryCount++;
      lastBoundaryAt = Date.now();
      var wi = charIndexToWordIndex(ev.charIndex, meta);
      handlers._lastWordIndex = wi;
      if (handlers.onWord) handlers.onWord(wi);
      if (handlers.onPace && boundaryCount >= 2) {
        var elapsed = (Date.now() - t0) / 1000;
        if (elapsed > 0.2) handlers.onPace({ wps: boundaryCount / elapsed });
      }
    };

    utt.onend = function () {
      if (myGen !== gen) return;
      clearFallback();
      clearWatchdog();
      var elapsed = Date.now() - t0;
      noteAchievement(meta.wordOffsets.length, elapsed);
      var last = meta.wordOffsets[meta.wordOffsets.length - 1];
      if (last) {
        handlers._lastWordIndex = last.wordIndex;
        if (handlers.onWord) handlers.onWord(last.wordIndex);
        // Advance display to next word after utterance (re-sync)
        var next = last.wordIndex + 1;
        if (handlers.onWord && next < wordList.length) {
          // onend already set last; speakNext continues. Caller advances via boundaries.
        }
      }
      speakNext(myGen, wpm, wordList);
    };

    utt.onerror = function () {
      if (myGen !== gen) return;
      clearFallback();
      clearWatchdog();
      // Skip to next utterance rather than hang
      speakNext(myGen, wpm, wordList);
    };

    // After cancel, wait a tick before speak (Chrome hang workaround)
    clearSpeakDelay();
    speakDelayTimer = setTimeout(function () {
      speakDelayTimer = null;
      if (myGen !== gen || !speaking || !listenOn) return;
      try {
        speechSynthesis.speak(utt);
      } catch (e) {
        speakNext(myGen, wpm, wordList);
        return;
      }
      armWatchdog(myGen, wpm, meta, wordList);

      // Fallback timer if no boundary events
      setTimeout(function () {
        if (myGen !== gen || gotBoundary || !speaking || currentUtterance !== utt) return;
        var i = 0;
        var words = meta.wordOffsets;
        var perWord = Math.max(80, 60000 / Math.max(1, wpm));
        clearFallback();
        fallbackTimer = setInterval(function () {
          if (myGen !== gen || !speaking || currentUtterance !== utt) {
            clearFallback();
            return;
          }
          if (i >= words.length) {
            clearFallback();
            return;
          }
          handlers._lastWordIndex = words[i].wordIndex;
          if (handlers.onWord) handlers.onWord(words[i].wordIndex);
          i++;
        }, perWord);
      }, 400);
    }, CANCEL_SPEAK_GAP_MS);
  }

  function prepareWords(wordList) {
    if (global.FocusRoman && FocusRoman.transformForSpeech) {
      return FocusRoman.transformForSpeech(wordList || []);
    }
    return wordList || [];
  }

  function speakFromWordIndexImmediate(wordList, startIndex, wpm) {
    if (!supportsSpeech() || !listenOn) return;
    var myGen = bumpGen();
    hardCancel();
    wordList = prepareWords(wordList);
    sentenceQueue = buildSentenceQueue(wordList || [], Math.max(0, startIndex | 0));
    speaking = true;
    handlers._lastWordIndex = startIndex | 0;
    // small gap after cancel then speak
    clearSpeakDelay();
    speakDelayTimer = setTimeout(function () {
      speakDelayTimer = null;
      if (myGen !== gen) return;
      speakNext(myGen, wpm, wordList);
    }, CANCEL_SPEAK_GAP_MS);
  }

  function speakFromWordIndex(wordList, startIndex, wpm) {
    if (!supportsSpeech() || !listenOn) return;
    clearRestartDebounce();
    // Debounce rapid restarts (WPM/voice/jump spam)
    restartTimer = setTimeout(function () {
      restartTimer = null;
      speakFromWordIndexImmediate(wordList, startIndex, wpm);
    }, DEBOUNCE_MS);
  }

  function setListen(on) {
    listenOn = !!on;
    if (!listenOn) stopListening(true);
    else if (global.VoiceLimit) VoiceLimit.onListenEnabled();
    if (!listenOn && global.VoiceLimit) VoiceLimit.onListenDisabled();
  }

  function isListenOn() { return listenOn; }
  function isSpeaking() { return speaking; }

  function setVoiceURI(uri) {
    selectedVoiceURI = uri || '';
    var langKey = (langOverride || detectedLang || 'en').slice(0, 2);
    if (selectedVoiceURI) {
      voiceByLang[langKey] = selectedVoiceURI;
      try {
        localStorage.setItem('focusReader.voiceByLang', JSON.stringify(voiceByLang));
      } catch (e) {}
    }
  }

  function loadVoicePrefs() {
    try {
      voiceByLang = JSON.parse(localStorage.getItem('focusReader.voiceByLang') || '{}') || {};
    } catch (e) { voiceByLang = {}; }
  }
  loadVoicePrefs();

  function setLangOverride(lang) {
    langOverride = lang || '';
    var langKey = (langOverride || detectedLang || 'en').slice(0, 2);
    if (!selectedVoiceURI && voiceByLang[langKey]) {
      selectedVoiceURI = voiceByLang[langKey];
    }
  }

  function setDetectedFromText(text) {
    detectedLang = detectLanguage(text || '');
    var langKey = (langOverride || detectedLang || 'en').slice(0, 2);
    if (!selectedVoiceURI && voiceByLang[langKey]) {
      selectedVoiceURI = voiceByLang[langKey];
    }
    return detectedLang;
  }

  // Expose buildSentences for tests (absolute-index form)
  function buildSentences(words) {
    var list = (words || []).map(function (w) {
      return typeof w === 'string' ? w : (w && w.text) || '';
    });
    return buildSentenceQueue(list, 0);
  }

  /** Pluggable TTS engine interface used by the app (speechSynthesis impl). */
  var SpeechEngine = {
    name: 'speechSynthesis',
    supportsBackground: function () { return false; },
    speak: function (words, from, to, wpm) {
      var slice = (words || []).slice(from, to == null ? undefined : to);
      // Remap indices: speakFrom uses absolute indices in full list
      speakFromWordIndex(words, from, wpm);
    },
    stop: function () { stopListening(true); },
    setRate: function () {},
    onWord: function (fn) { handlers.onWord = fn; }
  };

  global.FocusTtsEngine = SpeechEngine;

  var engines = { speechSynthesis: SpeechEngine, device: SpeechEngine };
  var activeEngineName = 'device';

  function setEngine(name, engineObj) {
    if (engineObj) engines[name] = engineObj;
    if (name && engines[name]) {
      activeEngineName = name;
      global.FocusTtsEngine = engines[name];
    }
  }

  function getActiveEngine() {
    return engines[activeEngineName] || SpeechEngine;
  }

  // Wrap speak to optionally use Piper engine
  var _speakImm = speakFromWordIndexImmediate;
  speakFromWordIndexImmediate = function (wordList, startIndex, wpm) {
    var eng = getActiveEngine();
    if (eng && eng.name !== 'speechSynthesis' && typeof eng.speak === 'function' && activeEngineName === 'piper') {
      stopListening(true);
      gen += 1;
      var myGen = gen;
      speaking = true;
      var words = prepareWords(wordList || []);
      eng.setRate && eng.setRate(wpm);
      eng.on && eng.on('wordIndex', function (ev) {
        if (myGen !== gen) return;
        if (handlers.onWord) handlers.onWord(ev.wordIndex, ev);
      });
      eng.on && eng.on('end', function () {
        if (myGen !== gen) return;
        speaking = false;
        if (handlers.onEnd) handlers.onEnd();
      });
      Promise.resolve(eng.speak(words.slice(startIndex), startIndex, { wpm: wpm, voiceId: eng.getVoiceId && eng.getVoiceId() }))
        .catch(function (e) {
          speaking = false;
          if (handlers.onEnd) handlers.onEnd();
          console.warn('[FocusListen] piper speak failed', e);
        });
      return;
    }
    return _speakImm(wordList, startIndex, wpm);
  };

  var _stop = stopListening;
  stopListening = function (silent) {
    var eng = getActiveEngine();
    if (eng && activeEngineName === 'piper' && eng.stop) eng.stop();
    return _stop(silent);
  };

  global.FocusListen = {
    supportsSpeech: supportsSpeech,
    setListen: setListen,
    isListenOn: isListenOn,
    isSpeaking: isSpeaking,
    speakFromWordIndex: speakFromWordIndex,
    speakFromWordIndexImmediate: speakFromWordIndexImmediate,
    stop: stopListening,
    loadVoices: loadVoices,
    getVoices: function () { return voices.slice(); },
    setVoiceURI: setVoiceURI,
    getVoiceURI: function () { return selectedVoiceURI; },
    setLangOverride: setLangOverride,
    setDetectedFromText: setDetectedFromText,
    getDetectedLang: function () { return detectedLang; },
    detectLanguage: detectLanguage,
    charIndexToWordIndex: charIndexToWordIndex,
    buildSentences: buildSentences,
    buildUtteranceFromRange: buildUtteranceFromRange,
    cleanWordForSpeech: cleanWordForSpeech,
    voiceQualityTag: voiceQualityTag,
    pickVoice: pickVoice,
    wpmToRate: wpmToRate,
    getGen: function () { return gen; },
    prepareWords: prepareWords,
    engine: SpeechEngine,
    setEngine: setEngine,
    getEngineName: function () { return activeEngineName; },
    getActiveEngine: getActiveEngine,
    on: function (evt, fn) {
      if (evt === 'word') handlers.onWord = fn;
      if (evt === 'end') handlers.onEnd = fn;
      if (evt === 'voices') handlers.onVoices = fn;
      if (evt === 'pace') handlers.onPace = fn;
    }
  };

  global.stopListening = function (silent) {
    stopListening(!!silent);
  };
})(typeof window !== 'undefined' ? window : globalThis);
