/**
 * Listen mode — Web Speech API, sentence utterances, ORP word sync.
 */
(function (global) {
  'use strict';

  var listenOn = false;
  var currentUtterance = null;
  var speaking = false;
  var voices = [];
  var selectedVoiceURI = '';
  var langOverride = '';
  var detectedLang = 'en';
  var sentenceQueue = [];
  var currentSentenceMeta = null; // { text, startWordIndex, wordOffsets: [{wordIndex, charStart, charEnd}] }
  var fallbackTimer = null;
  var rateCalibration = 1; // maps WPM to utterance.rate
  var achievedSamples = [];
  var handlers = {
    onWord: null,
    onEnd: null,
    onVoices: null
  };

  function supportsSpeech() {
    return typeof global.speechSynthesis !== 'undefined' && typeof global.SpeechSynthesisUtterance !== 'undefined';
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

  /** Simple language detection */
  function detectLanguage(text) {
    var sample = (text || '').slice(0, 4000);
    if (/[\u0400-\u04FF]/.test(sample)) {
      // rough uk vs ru
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
      it: (lower.match(/\b(il|di|che|la|e|il|un|per|è|una|sono)\b/g) || []).length
    };
    var best = 'en';
    var bestN = -1;
    Object.keys(scores).forEach(function (k) {
      if (scores[k] > bestN) { bestN = scores[k]; best = k; }
    });
    return best;
  }

  function pickVoice(lang) {
    loadVoices();
    var want = (langOverride || lang || 'en').toLowerCase();
    var list = voices.slice();
    // Prefer localService
    function score(v) {
      var s = 0;
      var vl = (v.lang || '').toLowerCase();
      if (vl.indexOf(want) === 0) s += 10;
      else if (vl.indexOf(want.slice(0, 2)) === 0) s += 6;
      if (v.localService) s += 5;
      if (selectedVoiceURI && v.voiceURI === selectedVoiceURI) s += 20;
      return s;
    }
    list.sort(function (a, b) { return score(b) - score(a); });
    return list[0] || null;
  }

  /** Split words array into sentence utterances with char→word maps */
  function buildSentences(words) {
    var sentences = [];
    var buf = [];
    var startIdx = 0;
    function flush() {
      if (!buf.length) return;
      var parts = [];
      var offsets = [];
      var cursor = 0;
      buf.forEach(function (item) {
        if (parts.length) {
          parts.push(' ');
          cursor += 1;
        }
        offsets.push({
          wordIndex: item.index,
          charStart: cursor,
          charEnd: cursor + item.text.length
        });
        parts.push(item.text);
        cursor += item.text.length;
      });
      var text = parts.join('');
      // Split long utterances at commas if > 200 chars
      if (text.length > 220) {
        var chunks = splitLong(text, offsets, 200);
        chunks.forEach(function (c) { sentences.push(c); });
      } else {
        sentences.push({ text: text, startWordIndex: buf[0].index, wordOffsets: offsets });
      }
      buf = [];
    }
    words.forEach(function (w, i) {
      if (!buf.length) startIdx = i;
      buf.push({ text: w, index: i });
      if (/[.!?…]["')\]]*$/.test(w) || buf.length >= 40) flush();
    });
    flush();
    return sentences;
  }

  function splitLong(text, offsets, maxLen) {
    // Prefer splitting at comma near maxLen
    var result = [];
    var start = 0;
    while (start < text.length) {
      var end = Math.min(text.length, start + maxLen);
      if (end < text.length) {
        var comma = text.lastIndexOf(',', end);
        if (comma > start + 40) end = comma + 1;
      }
      var slice = text.slice(start, end).trim();
      var off = offsets.filter(function (o) {
        return o.charStart >= start && o.charStart < end;
      }).map(function (o) {
        return {
          wordIndex: o.wordIndex,
          charStart: o.charStart - start,
          charEnd: o.charEnd - start
        };
      });
      if (slice && off.length) {
        result.push({
          text: slice,
          startWordIndex: off[0].wordIndex,
          wordOffsets: off
        });
      }
      start = end;
    }
    return result;
  }

  function wpmToRate(wpm) {
    // Calibrated: rate 1 ≈ naturalWpm (default 160)
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
    // Adapt calibration so displayed WPM ≈ achieved at rate mapping
    // If user set 300 but achieved 180 at computed rate, raise natural estimate
    if (global.VoiceLimit) VoiceLimit.setVoiceMax(Math.max(avg, VoiceLimit.getLimit()));
  }

  function charIndexToWordIndex(charIndex, meta) {
    if (!meta || !meta.wordOffsets || !meta.wordOffsets.length) return meta ? meta.startWordIndex : 0;
    var offs = meta.wordOffsets;
    for (var i = 0; i < offs.length; i++) {
      if (charIndex >= offs[i].charStart && charIndex < offs[i].charEnd) {
        return offs[i].wordIndex;
      }
    }
    // past end → last word of utterance
    if (charIndex >= offs[offs.length - 1].charEnd) return offs[offs.length - 1].wordIndex;
    // before first
    return offs[0].wordIndex;
  }

  function clearFallback() {
    if (fallbackTimer) {
      clearInterval(fallbackTimer);
      fallbackTimer = null;
    }
  }

  function stopListening(silent) {
    speaking = false;
    clearFallback();
    if (supportsSpeech()) {
      try { speechSynthesis.cancel(); } catch (e) {}
    }
    currentUtterance = null;
    currentSentenceMeta = null;
    if (!silent && handlers.onEnd) handlers.onEnd();
  }

  function speakFromWordIndex(wordList, startIndex, wpm) {
    if (!supportsSpeech() || !listenOn) return;
    stopListening(true);
    var slice = [];
    for (var i = startIndex; i < wordList.length; i++) {
      slice.push(wordList[i]);
    }
    // Remap to absolute indices
    var absolute = slice.map(function (w, j) {
      return w;
    });
    // buildSentences expects words with indices — pass pairs
    var paired = [];
    for (var k = startIndex; k < wordList.length; k++) {
      paired.push({ text: wordList[k], index: k });
    }
    // inline build using absolute indices
    sentenceQueue = [];
    var buf = [];
    function flush() {
      if (!buf.length) return;
      var parts = [];
      var offsets = [];
      var cursor = 0;
      buf.forEach(function (item) {
        if (parts.length) { parts.push(' '); cursor += 1; }
        offsets.push({ wordIndex: item.index, charStart: cursor, charEnd: cursor + item.text.length });
        parts.push(item.text);
        cursor += item.text.length;
      });
      var text = parts.join('');
      if (text.length > 220) {
        splitLong(text, offsets, 200).forEach(function (c) { sentenceQueue.push(c); });
      } else {
        sentenceQueue.push({ text: text, startWordIndex: buf[0].index, wordOffsets: offsets });
      }
      buf = [];
    }
    paired.forEach(function (item) {
      buf.push(item);
      if (/[.!?…]["')\]]*$/.test(item.text) || buf.length >= 40) flush();
    });
    flush();
    speaking = true;
    speakNext(wpm);
  }

  function speakNext(wpm) {
    if (!listenOn || !speaking) return;
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
    var lastWord = meta.startWordIndex;
    var gotBoundary = false;

    utt.onboundary = function (ev) {
      if (ev.name && ev.name !== 'word') return;
      gotBoundary = true;
      var wi = charIndexToWordIndex(ev.charIndex, meta);
      lastWord = wi;
      if (handlers.onWord) handlers.onWord(wi);
    };

    utt.onend = function () {
      clearFallback();
      var elapsed = Date.now() - t0;
      noteAchievement(meta.wordOffsets.length, elapsed);
      if (handlers.onWord) {
        var last = meta.wordOffsets[meta.wordOffsets.length - 1];
        if (last) handlers.onWord(last.wordIndex);
      }
      speakNext(wpm);
    };
    utt.onerror = function () {
      clearFallback();
      speakNext(wpm);
    };

    speechSynthesis.speak(utt);

    // Fallback timer if no boundary events within 400ms
    setTimeout(function () {
      if (!gotBoundary && speaking && currentUtterance === utt) {
        var i = 0;
        var words = meta.wordOffsets;
        var perWord = Math.max(80, (60000 / wpm));
        fallbackTimer = setInterval(function () {
          if (!speaking || currentUtterance !== utt) {
            clearFallback();
            return;
          }
          if (i >= words.length) {
            clearFallback();
            return;
          }
          if (handlers.onWord) handlers.onWord(words[i].wordIndex);
          i++;
        }, perWord);
      }
    }, 400);
  }

  function setListen(on) {
    listenOn = !!on;
    if (!listenOn) stopListening(true);
    else if (global.VoiceLimit) VoiceLimit.onListenEnabled();
    if (!listenOn && global.VoiceLimit) VoiceLimit.onListenDisabled();
  }

  function isListenOn() { return listenOn; }
  function isSpeaking() { return speaking; }

  function setVoiceURI(uri) { selectedVoiceURI = uri || ''; }
  function setLangOverride(lang) { langOverride = lang || ''; }
  function setDetectedFromText(text) {
    detectedLang = detectLanguage(text || '');
    return detectedLang;
  }

  global.FocusListen = {
    supportsSpeech: supportsSpeech,
    setListen: setListen,
    isListenOn: isListenOn,
    isSpeaking: isSpeaking,
    speakFromWordIndex: speakFromWordIndex,
    stop: stopListening,
    loadVoices: loadVoices,
    getVoices: function () { return voices.slice(); },
    setVoiceURI: setVoiceURI,
    setLangOverride: setLangOverride,
    setDetectedFromText: setDetectedFromText,
    getDetectedLang: function () { return detectedLang; },
    detectLanguage: detectLanguage,
    charIndexToWordIndex: charIndexToWordIndex,
    buildSentences: buildSentences,
    wpmToRate: wpmToRate,
    on: function (evt, fn) {
      if (evt === 'word') handlers.onWord = fn;
      if (evt === 'end') handlers.onEnd = fn;
      if (evt === 'voices') handlers.onVoices = fn;
    }
  };

  // Back-compat stub used by applyText
  global.stopListening = function (silent) {
    stopListening(!!silent);
  };
})(typeof window !== 'undefined' ? window : globalThis);
