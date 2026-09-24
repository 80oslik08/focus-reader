/**
 * SentenceStrip — continuous constant-velocity scroll under the ORP word,
 * with gentle proportional correction so the current word stays near the anchor.
 * prefers-reduced-motion: per-word snap (legacy behaviour).
 */
(function (global) {
  'use strict';

  var DEFAULT_RADIUS = 50;
  var MAX_RADIUS = 80;
  var AVG_WINDOW = 30;
  var CORRECTION_K = 0.35;
  var CORRECTION_CLAMP = 0.15; // ±15% of v
  var TARGET_BAND_FRAC = 0.6; // of current word width

  var runtime = {
    playing: false,
    tx: 0,
    v: 0, // px/s (negative = content moves left / forward in reading)
    baseV: 0,
    raf: null,
    lastTs: 0,
    words: [],
    index: 0,
    trackEl: null,
    stripEl: null,
    bigOrpEl: null,
    splitAtOrp: null,
    font: '500 15px system-ui, sans-serif',
    gap: 10,
    winStart: 0,
    winEnd: -1,
    wordCenters: [], // ORP centers in track-local coords (translate=0)
    wordWidths: [],
    listenWps: null,
    wpm: 300,
    velocitySamples: [],
    lastError: 0
  };

  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  function prefersReducedMotion() {
    try {
      return !!(global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      return false;
    }
  }

  function computeWindow(index, total, radius) {
    radius = radius == null ? DEFAULT_RADIUS : radius;
    radius = clamp(radius, 8, MAX_RADIUS);
    total = Math.max(0, total | 0);
    index = clamp(index | 0, 0, Math.max(0, total - 1));
    if (total === 0) return { start: 0, end: -1, index: 0, radius: radius };
    var start = Math.max(0, index - radius);
    var end = Math.min(total - 1, index + radius);
    var span = end - start + 1;
    var want = radius * 2 + 1;
    if (span < want && total >= want) {
      if (start === 0) end = Math.min(total - 1, want - 1);
      else if (end === total - 1) start = Math.max(0, total - want);
    }
    return { start: start, end: end, index: index, radius: radius };
  }

  function computeAlignTranslate(wordsLayout, currentLocal, gap, anchorX, trackPaddingLeft) {
    gap = gap == null ? 8 : gap;
    trackPaddingLeft = trackPaddingLeft || 0;
    var x = trackPaddingLeft;
    var orpCenter = 0;
    for (var i = 0; i < wordsLayout.length; i++) {
      var w = wordsLayout[i];
      var wordW = (w.beforeW || 0) + (w.orpW || 0) + (w.afterW || 0);
      if (i === currentLocal) {
        orpCenter = x + (w.beforeW || 0) + (w.orpW || 0) / 2;
      }
      x += wordW;
      if (i < wordsLayout.length - 1) x += gap;
    }
    return { orpCenter: orpCenter, translateX: anchorX - orpCenter, trackWidth: x };
  }

  function makeMeasurer(font) {
    if (typeof document !== 'undefined') {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      ctx.font = font;
      return function (text) {
        return ctx.measureText(text || '').width;
      };
    }
    var size = parseFloat(font) || 14;
    return function (text) {
      return (text || '').length * size * 0.55;
    };
  }

  function splitParts(word, splitAtOrp) {
    if (splitAtOrp) return splitAtOrp(word);
    return { before: '', orp: word || '', after: '' };
  }

  function layoutWindow(words, splitAtOrp, font) {
    var measure = makeMeasurer(font);
    return words.map(function (word) {
      var p = splitParts(word, splitAtOrp);
      return {
        beforeW: measure(p.before),
        orpW: measure(p.orp),
        afterW: measure(p.after),
        before: p.before,
        orp: p.orp,
        after: p.after,
        text: word
      };
    });
  }

  function avgAdvancePx(words, index, gap, font, splitAtOrp) {
    var measure = makeMeasurer(font);
    var n = words.length;
    if (!n) return 40;
    var lo = Math.max(0, index - Math.floor(AVG_WINDOW / 2));
    var hi = Math.min(n - 1, lo + AVG_WINDOW - 1);
    lo = Math.max(0, hi - AVG_WINDOW + 1);
    var sum = 0;
    var count = 0;
    for (var i = lo; i <= hi; i++) {
      var p = splitParts(words[i], splitAtOrp);
      var w = measure(p.before) + measure(p.orp) + measure(p.after);
      sum += w + (i < hi ? gap : 0);
      count++;
    }
    return count ? sum / count : 40;
  }

  function computeBaseVelocity(opts) {
    opts = opts || {};
    var words = opts.words || runtime.words;
    var index = opts.index != null ? opts.index : runtime.index;
    var gap = opts.gap != null ? opts.gap : runtime.gap;
    var font = opts.font || runtime.font;
    var split = opts.splitAtOrp || runtime.splitAtOrp;
    var advance = avgAdvancePx(words, index, gap, font, split);
    var wps;
    if (opts.listenWps != null && opts.listenWps > 0) {
      wps = opts.listenWps;
    } else if (runtime.listenWps != null && runtime.listenWps > 0) {
      wps = runtime.listenWps;
    } else {
      var wpm = opts.wpm != null ? opts.wpm : runtime.wpm;
      wps = Math.max(0.5, (Number(wpm) || 300) / 60);
    }
    // Content scrolls left (negative tx velocity in px/s)
    return -advance * wps;
  }

  function getAnchorX(strip, bigOrp) {
    var stripRect = strip.getBoundingClientRect();
    if (bigOrp) {
      var br = bigOrp.getBoundingClientRect();
      return (br.left + br.right) / 2 - stripRect.left;
    }
    return stripRect.width * 0.42;
  }

  function applyTransform(track, tx) {
    track.style.transition = 'none';
    track.style.transform = 'translate3d(' + tx + 'px,0,0)';
  }

  function rebuildDom(opts) {
    var track = opts.trackEl || runtime.trackEl;
    var strip = opts.stripEl || runtime.stripEl;
    var bigOrp = opts.bigOrpEl || runtime.bigOrpEl;
    if (!track || !strip) return null;

    var words = opts.words || [];
    var total = words.length;
    var index = clamp(opts.index | 0, 0, Math.max(0, total - 1));
    var win = computeWindow(index, total, opts.radius);
    var slice = [];
    for (var i = win.start; i <= win.end; i++) slice.push(words[i]);
    var local = index - win.start;
    var font = opts.font || runtime.font;
    var gap = opts.gap != null ? opts.gap : runtime.gap;
    var layout = layoutWindow(slice, opts.splitAtOrp, font);

    track.innerHTML = '';
    var frag = document.createDocumentFragment();
    layout.forEach(function (w, li) {
      var span = document.createElement('span');
      span.className = 'strip-word' +
        (li < local ? ' is-past' : '') +
        (li === local ? ' is-current' : '') +
        (li > local ? ' is-future' : '');
      span.setAttribute('data-wi', String(win.start + li));
      var b = document.createElement('span');
      b.className = 'strip-before';
      b.textContent = w.before;
      var o = document.createElement('span');
      o.className = 'strip-orp';
      o.textContent = w.orp;
      var a = document.createElement('span');
      a.className = 'strip-after';
      a.textContent = w.after;
      span.appendChild(b);
      span.appendChild(o);
      span.appendChild(a);
      frag.appendChild(span);
      if (li < layout.length - 1) {
        frag.appendChild(document.createTextNode('\u00a0'));
      }
    });
    track.appendChild(frag);

    // Measure ORP centers in untransformed space
    applyTransform(track, 0);
    var stripRect = strip.getBoundingClientRect();
    var centers = [];
    var widths = [];
    var nodes = track.querySelectorAll('.strip-word');
    for (var n = 0; n < nodes.length; n++) {
      var orpEl = nodes[n].querySelector('.strip-orp');
      var wr = nodes[n].getBoundingClientRect();
      widths.push(wr.width);
      if (orpEl) {
        var cr = orpEl.getBoundingClientRect();
        centers.push((cr.left + cr.right) / 2 - stripRect.left);
      } else {
        centers.push((wr.left + wr.right) / 2 - stripRect.left);
      }
    }

    runtime.words = words;
    runtime.index = index;
    runtime.trackEl = track;
    runtime.stripEl = strip;
    runtime.bigOrpEl = bigOrp;
    runtime.splitAtOrp = opts.splitAtOrp;
    runtime.font = font;
    runtime.gap = gap;
    runtime.winStart = win.start;
    runtime.winEnd = win.end;
    runtime.wordCenters = centers;
    runtime.wordWidths = widths;
    if (opts.wpm != null) runtime.wpm = opts.wpm;
    if (opts.listenWps != null) runtime.listenWps = opts.listenWps;

    var anchorX = getAnchorX(strip, bigOrp);
    var curCenter = centers[local] != null ? centers[local] : 0;
    runtime.tx = anchorX - curCenter;
    applyTransform(track, runtime.tx);

    return {
      window: win,
      translateX: runtime.tx,
      anchorX: anchorX,
      orpCenter: curCenter,
      duration: 0,
      alignedOrpX: curCenter + runtime.tx
    };
  }

  function updateHighlightOnly() {
    var track = runtime.trackEl;
    if (!track) return;
    var nodes = track.querySelectorAll('.strip-word');
    for (var i = 0; i < nodes.length; i++) {
      var wi = parseInt(nodes[i].getAttribute('data-wi'), 10);
      nodes[i].classList.toggle('is-past', wi < runtime.index);
      nodes[i].classList.toggle('is-current', wi === runtime.index);
      nodes[i].classList.toggle('is-future', wi > runtime.index);
    }
  }

  function currentLocal() {
    return runtime.index - runtime.winStart;
  }

  function alignmentError() {
    var strip = runtime.stripEl;
    var bigOrp = runtime.bigOrpEl;
    if (!strip) return 0;
    var anchorX = getAnchorX(strip, bigOrp);
    var local = currentLocal();
    var center = runtime.wordCenters[local];
    if (center == null) return 0;
    // Where the ORP is now on screen
    var screenX = center + runtime.tx;
    // error > 0 means current word is to the right of anchor → need more leftward velocity
    return screenX - anchorX;
  }

  function tick(ts) {
    if (!runtime.playing || !runtime.trackEl) {
      runtime.raf = null;
      return;
    }
    if (!runtime.lastTs) runtime.lastTs = ts;
    var dt = Math.min(0.05, (ts - runtime.lastTs) / 1000);
    runtime.lastTs = ts;

    var err = alignmentError();
    runtime.lastError = err;
    var band = (runtime.wordWidths[currentLocal()] || 40) * TARGET_BAND_FRAC;
    var corr = 0;
    if (Math.abs(err) > band * 0.25) {
      // adjust velocity: positive err → more negative v
      corr = -CORRECTION_K * err;
      var maxAdj = Math.abs(runtime.baseV) * CORRECTION_CLAMP;
      corr = clamp(corr, -maxAdj, maxAdj);
    }
    runtime.v = runtime.baseV + corr;
    runtime.tx += runtime.v * dt;
    applyTransform(runtime.trackEl, runtime.tx);

    if (runtime.velocitySamples) {
      runtime.velocitySamples.push(runtime.v);
      if (runtime.velocitySamples.length > 600) runtime.velocitySamples.shift();
    }

    // Rebuild window when current word nears edge
    var local = currentLocal();
    var span = runtime.winEnd - runtime.winStart;
    if (local < 8 || local > span - 8) {
      var snap = rebuildDom({
        words: runtime.words,
        index: runtime.index,
        splitAtOrp: runtime.splitAtOrp,
        trackEl: runtime.trackEl,
        stripEl: runtime.stripEl,
        bigOrpEl: runtime.bigOrpEl,
        font: runtime.font,
        gap: runtime.gap,
        wpm: runtime.wpm,
        radius: DEFAULT_RADIUS
      });
      void snap;
    }

    runtime.raf = requestAnimationFrame(tick);
  }

  function startScroll(opts) {
    opts = opts || {};
    if (prefersReducedMotion()) return;
    var wasPlaying = runtime.playing;
    runtime.playing = true;
    runtime.wpm = opts.wpm != null ? opts.wpm : runtime.wpm;
    if (opts.listenWps != null) runtime.listenWps = opts.listenWps;
    runtime.baseV = computeBaseVelocity(opts);
    if (!wasPlaying) {
      runtime.v = runtime.baseV;
      runtime.lastTs = 0;
      runtime.velocitySamples = [];
    }
    if (!runtime.raf) runtime.raf = requestAnimationFrame(tick);
  }

  function stopScroll(smooth) {
    runtime.playing = false;
    runtime.v = 0;
    runtime.lastTs = 0;
    if (runtime.raf) {
      cancelAnimationFrame(runtime.raf);
      runtime.raf = null;
    }
    // smooth stop = just halt (no jump); position stays
    void smooth;
  }

  function setIndex(index, opts) {
    opts = opts || {};
    runtime.index = index | 0;
    var needRebuild = opts.forceRebuild ||
      runtime.index < runtime.winStart ||
      runtime.index > runtime.winEnd ||
      !runtime.trackEl ||
      !runtime.trackEl.childNodes.length;

    if (needRebuild) {
      rebuildDom({
        words: opts.words || runtime.words,
        index: runtime.index,
        splitAtOrp: opts.splitAtOrp || runtime.splitAtOrp,
        trackEl: opts.trackEl || runtime.trackEl,
        stripEl: opts.stripEl || runtime.stripEl,
        bigOrpEl: opts.bigOrpEl || runtime.bigOrpEl,
        font: opts.font || runtime.font,
        gap: opts.gap != null ? opts.gap : runtime.gap,
        wpm: opts.wpm != null ? opts.wpm : runtime.wpm,
        listenWps: opts.listenWps,
        radius: opts.radius || DEFAULT_RADIUS
      });
    } else {
      updateHighlightOnly();
      if (opts.reanchor) {
        var local = currentLocal();
        var anchorX = getAnchorX(runtime.stripEl, runtime.bigOrpEl);
        var curCenter = runtime.wordCenters[local] || 0;
        var targetTx = anchorX - curCenter;
        if (opts.easeMs && opts.easeMs > 0 && !prefersReducedMotion()) {
          var from = runtime.tx;
          var t0 = performance.now();
          var dur = opts.easeMs;
          function ease(ts) {
            var t = Math.min(1, (ts - t0) / dur);
            var e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            runtime.tx = from + (targetTx - from) * e;
            applyTransform(runtime.trackEl, runtime.tx);
            if (t < 1) requestAnimationFrame(ease);
          }
          requestAnimationFrame(ease);
        } else {
          runtime.tx = targetTx;
          applyTransform(runtime.trackEl, runtime.tx);
        }
      }
    }
    if (opts.wpm != null || opts.listenWps != null) {
      runtime.baseV = computeBaseVelocity(opts);
    }
  }

  /**
   * DOM updater — call whenever the current word changes.
   * Continuous mode: updates highlight + optional reanchor; scroll is separate.
   */
  function render(opts) {
    opts = opts || {};
    var track = opts.trackEl;
    var strip = opts.stripEl;
    if (!track || !strip) return null;

    runtime.trackEl = track;
    runtime.stripEl = strip;
    runtime.bigOrpEl = opts.bigOrpEl;
    runtime.splitAtOrp = opts.splitAtOrp;
    if (opts.wpm != null) runtime.wpm = opts.wpm;
    if (opts.listenWps != null) runtime.listenWps = opts.listenWps;
    if (opts.font) runtime.font = opts.font;

    var reduced = prefersReducedMotion() || opts.forceSnap;
    var words = opts.words || [];
    var index = opts.index | 0;

    if (reduced || opts.forceInstant) {
      stopScroll(false);
      var result = rebuildDom(opts);
      // Legacy transition snap for reduced motion between words (non-instant)
      if (reduced && !opts.forceInstant && opts.durationMs > 0) {
        // already anchored; nothing else
      }
      return result;
    }

    // Continuous path
    var sameWindow = runtime.words === words &&
      runtime.winStart <= index && index <= runtime.winEnd &&
      track.childNodes.length;

    // Always refresh words reference
    runtime.words = words;

    if (!sameWindow || opts.forceRebuild || !track.childNodes.length) {
      return rebuildDom(opts);
    }

    setIndex(index, {
      reanchor: !!opts.reanchor,
      easeMs: opts.easeMs != null ? opts.easeMs : 0,
      wpm: opts.wpm,
      listenWps: opts.listenWps
    });

    return {
      window: { start: runtime.winStart, end: runtime.winEnd, index: runtime.index },
      translateX: runtime.tx,
      anchorX: getAnchorX(strip, opts.bigOrpEl),
      orpCenter: runtime.wordCenters[currentLocal()],
      duration: 0,
      alignedOrpX: (runtime.wordCenters[currentLocal()] || 0) + runtime.tx,
      error: runtime.lastError
    };
  }

  function measureAlignment(bigOrpEl, stripOrpEl) {
    if (!bigOrpEl || !stripOrpEl) return null;
    var a = bigOrpEl.getBoundingClientRect();
    var b = stripOrpEl.getBoundingClientRect();
    var ax = (a.left + a.right) / 2;
    var bx = (b.left + b.right) / 2;
    return { bigX: ax, stripX: bx, delta: Math.abs(ax - bx) };
  }

  function getVelocityStats() {
    var s = runtime.velocitySamples || [];
    if (s.length < 2) return { n: s.length, mean: 0, stdev: 0, cv: 0 };
    var mean = s.reduce(function (a, b) { return a + b; }, 0) / s.length;
    var varSum = 0;
    for (var i = 0; i < s.length; i++) varSum += (s[i] - mean) * (s[i] - mean);
    var stdev = Math.sqrt(varSum / s.length);
    var cv = Math.abs(mean) > 1e-6 ? stdev / Math.abs(mean) : 0;
    return { n: s.length, mean: mean, stdev: stdev, cv: cv, lastError: runtime.lastError };
  }

  global.SentenceStrip = {
    DEFAULT_RADIUS: DEFAULT_RADIUS,
    computeWindow: computeWindow,
    computeAlignTranslate: computeAlignTranslate,
    layoutWindow: layoutWindow,
    avgAdvancePx: avgAdvancePx,
    computeBaseVelocity: computeBaseVelocity,
    render: render,
    startScroll: startScroll,
    stopScroll: stopScroll,
    setIndex: setIndex,
    measureAlignment: measureAlignment,
    prefersReducedMotion: prefersReducedMotion,
    getVelocityStats: getVelocityStats,
    getRuntime: function () {
      return {
        tx: runtime.tx,
        v: runtime.v,
        baseV: runtime.baseV,
        playing: runtime.playing,
        index: runtime.index,
        lastError: runtime.lastError
      };
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
