/**
 * Piper word timing: phoneme counts + punctuation pause weights + RMS energy snap.
 */
(function (global) {
  'use strict';

  var PAUSE = {
    ',': 1.4,
    ';': 1.8,
    ':': 1.6,
    '.': 2.6,
    '!': 2.6,
    '?': 2.6,
    '…': 2.4,
    '\n': 3.0
  };

  function isWordBreakPhoneme(p) {
    if (p == null) return true;
    var s = String(p);
    return s === ' ' || s === '' || s === '_' || s === '|' || s === '\t';
  }

  /** Split phoneme list into per-word groups (by space/_/|). */
  function phonemesPerWord(phonemes) {
    var groups = [[]];
    for (var i = 0; i < (phonemes || []).length; i++) {
      var p = phonemes[i];
      if (isWordBreakPhoneme(p)) {
        if (groups[groups.length - 1].length) groups.push([]);
      } else {
        groups[groups.length - 1].push(p);
      }
    }
    if (groups.length && !groups[groups.length - 1].length) groups.pop();
    return groups;
  }

  function punctWeight(word) {
    var w = String(word || '');
    var last = w.slice(-1);
    if (PAUSE[last] != null) return PAUSE[last];
    if (/[.!?…]$/.test(w)) return 2.6;
    if (/[,;:]$/.test(w)) return 1.5;
    return 0;
  }

  /**
   * Allocate end-times (seconds) from phoneme counts (+ pause weights).
   * If phoneme groups don't match word count, fall back to char weights.
   */
  function allocateByPhonemes(words, phonemes, durationSec) {
    words = words || [];
    if (!words.length) return [];
    if (!(durationSec > 0)) {
      return words.map(function (_, i) { return ((i + 1) / words.length) * (durationSec || 0); });
    }
    var groups = phonemesPerWord(phonemes);
    var weights = [];
    var total = 0;
    for (var i = 0; i < words.length; i++) {
      var phCount = (groups[i] && groups[i].length) || 0;
      if (!phCount) {
        // fallback for this word
        var letters = String(words[i] || '').replace(/[^A-Za-zÀ-ž0-9]/g, '').length || 1;
        phCount = Math.max(1, Math.round(letters * 0.7));
      }
      var wt = Math.max(1.0, phCount * 1.0) + punctWeight(words[i]);
      weights.push(wt);
      total += wt;
    }
    // If group count wildly off, blend with char weights
    if (groups.length && Math.abs(groups.length - words.length) > 1) {
      weights = [];
      total = 0;
      for (var j = 0; j < words.length; j++) {
        var letters2 = String(words[j] || '').replace(/[^A-Za-zÀ-ž0-9]/g, '').length || 1;
        var wt2 = Math.max(0.4, letters2 * 0.55) + punctWeight(words[j]);
        weights.push(wt2);
        total += wt2;
      }
    }
    var ends = [];
    var acc = 0;
    for (var k = 0; k < weights.length; k++) {
      acc += weights[k];
      ends.push((acc / total) * durationSec);
    }
    ends[ends.length - 1] = durationSec;
    return ends;
  }

  /** Short-time RMS energy, frameMs default 10. Returns {rms, times, sampleRate}. */
  function computeRms(pcm, sampleRate, frameMs) {
    frameMs = frameMs || 10;
    var frame = Math.max(1, Math.round(sampleRate * frameMs / 1000));
    var rms = [];
    var times = [];
    for (var i = 0; i + frame <= pcm.length; i += frame) {
      var sum = 0;
      for (var j = 0; j < frame; j++) {
        var s = pcm[i + j];
        sum += s * s;
      }
      rms.push(Math.sqrt(sum / frame));
      times.push((i + frame / 2) / sampleRate);
    }
    return { rms: rms, times: times, sampleRate: sampleRate, frameMs: frameMs };
  }

  /** Local minima below median*factor — candidate pause times (seconds). */
  function energyMinima(rmsInfo, factor) {
    factor = factor == null ? 0.45 : factor;
    var rms = rmsInfo.rms;
    var times = rmsInfo.times;
    if (!rms.length) return [];
    var sorted = rms.slice().sort(function (a, b) { return a - b; });
    var med = sorted[Math.floor(sorted.length / 2)] || 0;
    var thr = med * factor;
    var mins = [];
    for (var i = 1; i < rms.length - 1; i++) {
      if (rms[i] <= thr && rms[i] <= rms[i - 1] && rms[i] <= rms[i + 1]) {
        mins.push(times[i]);
      }
    }
    return mins;
  }

  function nearest(list, t) {
    if (!list || !list.length) return t;
    var best = list[0];
    var bestD = Math.abs(best - t);
    for (var i = 1; i < list.length; i++) {
      var d = Math.abs(list[i] - t);
      if (d < bestD) { best = list[i]; bestD = d; }
    }
    return best;
  }

  /**
   * Snap predicted ends to energy minima.
   * Punctuation boundaries always snap within ±80ms; others optionally.
   */
  function snapToEnergy(words, ends, pcm, sampleRate, opts) {
    opts = opts || {};
    var win = opts.windowSec != null ? opts.windowSec : 0.08;
    var snapAll = opts.snapAll !== false; // default true
    var minGap = opts.minGapSec != null ? opts.minGapSec : 0.07;
    if (!pcm || !pcm.length || !ends.length) return ends.slice();
    var info = computeRms(pcm, sampleRate || 22050, 10);
    var mins = energyMinima(info, 0.35);
    if (!mins.length) return ends.slice();
    var out = ends.slice();
    var prev = 0;
    var total = ends[ends.length - 1] || 1;
    for (var i = 0; i < out.length - 1; i++) {
      var w = String(words[i] || '');
      var isPunct = /[,;:.!?…]$/.test(w);
      if (!isPunct && !snapAll) { prev = out[i]; continue; }
      var t = out[i];
      var snapped = nearest(mins, t);
      var maxT = total - minGap * (out.length - 1 - i);
      if (Math.abs(snapped - t) <= win && snapped >= prev + minGap && snapped <= maxT) {
        out[i] = snapped;
        prev = snapped;
      } else {
        // keep predicted but enforce min gap
        if (out[i] < prev + minGap) out[i] = prev + minGap;
        prev = out[i];
      }
    }
    for (var j = 1; j < out.length; j++) {
      if (out[j] < out[j - 1] + minGap) out[j] = out[j - 1] + minGap;
    }
    // rescale to fit duration if we overflowed
    var last = out[out.length - 1];
    if (last > total && last > 0) {
      var s = total / last;
      for (var k = 0; k < out.length; k++) out[k] *= s;
    }
    out[out.length - 1] = total;
    return out;
  }

  function allocateWordTimes(words, phonemes, durationSec, pcm, sampleRate) {
    var ends = allocateByPhonemes(words, phonemes, durationSec);
    if (pcm && pcm.length) {
      ends = snapToEnergy(words, ends, pcm, sampleRate, { snapAll: true, windowSec: 0.08 });
    }
    return ends;
  }

  /** Chunk words: sentence boundaries; long sentences at ,/; cap ~25. */
  function chunkWords(words, maxWords) {
    maxWords = maxWords || 25;
    words = words || [];
    // Short passages: single chunk (avoids boundary drift & re-anchor noise)
    if (words.length <= maxWords) return words.length ? [words.slice()] : [];
    var out = [];
    var cur = [];
    function push() {
      if (cur.length) { out.push(cur); cur = []; }
    }
    for (var i = 0; i < words.length; i++) {
      cur.push(words[i]);
      var w = String(words[i] || '');
      var endSent = /[.!?…]$/.test(w);
      var soft = /[,;:]$/.test(w) && cur.length >= 12;
      var remaining = words.length - i - 1;
      // Split at sentence only when current chunk is substantial OR remainder is large
      if (cur.length >= maxWords) push();
      else if (endSent && cur.length >= 10 && remaining >= 4) push();
      else if (soft && remaining >= 6) push();
    }
    push();
    return out;
  }

  global.FocusPiperTiming = {
    allocateByPhonemes: allocateByPhonemes,
    allocateWordTimes: allocateWordTimes,
    phonemesPerWord: phonemesPerWord,
    computeRms: computeRms,
    energyMinima: energyMinima,
    snapToEnergy: snapToEnergy,
    chunkWords: chunkWords,
    punctWeight: punctWeight
  };
})(typeof window !== 'undefined' ? window : globalThis);

export const FocusPiperTiming = (typeof globalThis !== 'undefined' && globalThis.FocusPiperTiming) || null;
