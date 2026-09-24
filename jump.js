/**
 * FocusJump — time-based navigation from current WPM.
 * words = round(seconds * WPM / 60)
 * Log scrub: v in [-1,1] -> seconds, then snap to nice steps (max 10h).
 */
(function (global) {
  'use strict';

  var MAX_SEC = 10 * 3600; // 10 hours
  var NICE_STEPS = [
    5, 10, 15, 20, 30, 45,
    60, 90, 120, 180, 300, 420, 600, 900, 1200, 1800, 2700,
    3600, 5400, 7200, 10800, 14400, 18000, 21600, 28800, 36000
  ];

  function secondsToWords(seconds, wpm) {
    var s = Number(seconds) || 0;
    var w = Number(wpm) || 0;
    if (!isFinite(s) || !isFinite(w)) return 0;
    return Math.round(s * w / 60);
  }

  function wordsToSeconds(words, wpm) {
    var n = Number(words) || 0;
    var w = Number(wpm) || 1;
    if (w <= 0) return 0;
    return (n * 60) / w;
  }

  /** Continuous (pre-snap) seconds from slider value v ∈ [-1, 1]. */
  function sliderToSecondsRaw(v, maxSec) {
    maxSec = maxSec == null ? MAX_SEC : maxSec;
    v = Math.max(-1, Math.min(1, Number(v) || 0));
    if (v === 0) return 0;
    var sign = v < 0 ? -1 : 1;
    var mag = Math.abs(v);
    var sec = Math.exp(mag * Math.log(maxSec + 1)) - 1;
    return sign * sec;
  }

  /** Inverse of sliderToSecondsRaw (pre-snap). */
  function secondsToSliderRaw(sec, maxSec) {
    maxSec = maxSec == null ? MAX_SEC : maxSec;
    sec = Number(sec) || 0;
    if (sec === 0) return 0;
    var sign = sec < 0 ? -1 : 1;
    var mag = Math.abs(sec);
    var v = Math.log(mag + 1) / Math.log(maxSec + 1);
    return sign * Math.max(0, Math.min(1, v));
  }

  function snapSeconds(sec) {
    sec = Number(sec) || 0;
    if (sec === 0) return 0;
    var sign = sec < 0 ? -1 : 1;
    var mag = Math.abs(sec);
    var best = NICE_STEPS[0];
    var bestDist = Math.abs(mag - best);
    for (var i = 1; i < NICE_STEPS.length; i++) {
      var d = Math.abs(mag - NICE_STEPS[i]);
      if (d < bestDist) {
        bestDist = d;
        best = NICE_STEPS[i];
      }
    }
    // Prefer exact match when very close to a step
    return sign * best;
  }

  /** Full pipeline: slider v -> snapped signed seconds. */
  function sliderToSeconds(v, maxSec) {
    return snapSeconds(sliderToSecondsRaw(v, maxSec));
  }

  /** Nearest slider value that snaps to the given seconds (approx). */
  function secondsToSlider(sec, maxSec) {
    var snapped = snapSeconds(sec);
    return secondsToSliderRaw(snapped, maxSec);
  }

  function formatSignedTime(sec) {
    sec = Math.round(Number(sec) || 0);
    if (sec === 0) return '0s';
    var sign = sec < 0 ? '−' : '+';
    var t = Math.abs(sec);
    var h = Math.floor(t / 3600);
    var m = Math.floor((t % 3600) / 60);
    var s = t % 60;
    var parts = [];
    if (h) parts.push(h + 'h');
    if (m) parts.push(m + 'm');
    if (s || !parts.length) parts.push(s + 's');
    // Compact: "2m 30s" not "2m 0s" when we have minutes and leftover seconds
    if (h && !m && !s) return sign + h + 'h';
    if (!h && m && !s) return sign + m + 'm';
    if (!h && !m) return sign + s + 's';
    return sign + parts.join(' ');
  }

  function formatSignedWords(n) {
    n = Math.round(Number(n) || 0);
    if (n === 0) return '0 words';
    var sign = n < 0 ? '−' : '+';
    return sign + Math.abs(n).toLocaleString() + ' words';
  }

  /**
   * Compute jump from current index.
   * Returns { deltaWords, targetIndex, seconds, clamped, clampReason }
   */
  function planJump(currentIndex, totalWords, seconds, wpm) {
    var total = Math.max(0, Number(totalWords) || 0);
    var cur = Math.max(0, Number(currentIndex) || 0);
    if (total <= 0) {
      return { deltaWords: 0, targetIndex: 0, seconds: 0, clamped: true, clampReason: 'empty' };
    }
    var maxIdx = total - 1;
    var delta = secondsToWords(seconds, wpm);
    var target = cur + delta;
    var clamped = false;
    var reason = null;
    if (target < 0) {
      target = 0;
      clamped = true;
      reason = 'start';
    } else if (target > maxIdx) {
      target = maxIdx;
      clamped = true;
      reason = 'end';
    }
    return {
      deltaWords: target - cur,
      targetIndex: target,
      seconds: seconds,
      requestedDelta: delta,
      clamped: clamped,
      clampReason: reason
    };
  }

  /** Preview ~8–12 words around target; highlight center. */
  function previewSnippet(wordList, targetIndex, radius) {
    radius = radius == null ? 5 : radius;
    var words = wordList || [];
    if (!words.length) return { html: '', text: '', start: 0, end: 0 };
    var t = Math.max(0, Math.min(words.length - 1, targetIndex));
    var start = Math.max(0, t - radius);
    var end = Math.min(words.length - 1, t + radius);
    var parts = [];
    var plain = [];
    for (var i = start; i <= end; i++) {
      var w = words[i];
      plain.push(w);
      if (i === t) parts.push('<mark class="jump-preview-hl">' + escapeHtml(w) + '</mark>');
      else parts.push(escapeHtml(w));
    }
    return {
      html: parts.join(' '),
      text: plain.join(' '),
      start: start,
      end: end,
      target: t
    };
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buttonLabel(seconds) {
    var abs = Math.abs(seconds);
    var sign = seconds < 0 ? '−' : '+';
    if (abs < 60) return sign + abs + 's';
    if (abs % 60 === 0) return sign + (abs / 60) + 'm';
    return sign + formatSignedTime(seconds).replace(/^[+−]/, '');
  }

  function tooltipFor(seconds, wpm) {
    var words = secondsToWords(Math.abs(seconds), wpm);
    var lbl = buttonLabel(seconds);
    return lbl + ' = ' + words + ' words at ' + wpm + ' WPM';
  }

  global.FocusJump = {
    MAX_SEC: MAX_SEC,
    NICE_STEPS: NICE_STEPS.slice(),
    secondsToWords: secondsToWords,
    wordsToSeconds: wordsToSeconds,
    sliderToSecondsRaw: sliderToSecondsRaw,
    secondsToSliderRaw: secondsToSliderRaw,
    snapSeconds: snapSeconds,
    sliderToSeconds: sliderToSeconds,
    secondsToSlider: secondsToSlider,
    formatSignedTime: formatSignedTime,
    formatSignedWords: formatSignedWords,
    planJump: planJump,
    previewSnippet: previewSnippet,
    buttonLabel: buttonLabel,
    tooltipFor: tooltipFor
  };
})(typeof window !== 'undefined' ? window : globalThis);
