/**
 * SentenceStrip — windowed flowing sentence under the ORP word,
 * with current-word ORP letter aligned to the big ORP anchor.
 */
(function (global) {
  'use strict';

  var DEFAULT_RADIUS = 50; // ~100-word window
  var MAX_RADIUS = 60;

  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  /**
   * Window of word indices around current.
   * Returns { start, end } inclusive end (exclusive endIdx = end+1).
   */
  function computeWindow(index, total, radius) {
    radius = radius == null ? DEFAULT_RADIUS : radius;
    radius = clamp(radius, 8, MAX_RADIUS);
    total = Math.max(0, total | 0);
    index = clamp(index | 0, 0, Math.max(0, total - 1));
    if (total === 0) return { start: 0, end: -1, index: 0, radius: radius };
    var start = Math.max(0, index - radius);
    var end = Math.min(total - 1, index + radius);
    // Prefer filling the window when near edges
    var span = end - start + 1;
    var want = radius * 2 + 1;
    if (span < want && total >= want) {
      if (start === 0) end = Math.min(total - 1, want - 1);
      else if (end === total - 1) start = Math.max(0, total - want);
    }
    return { start: start, end: end, index: index, radius: radius };
  }

  /**
   * Pure layout math: given widths of [before, orp, after] for each word
   * and gap, compute x of ORP letter center for word at localIdx, and
   * the translateX needed so that center aligns to anchorX (in strip coords).
   *
   * wordsLayout: [{ beforeW, orpW, afterW }, ...] for the window
   * currentLocal: index within wordsLayout
   * gap: space between words
   * anchorX: target x (center) in strip viewport coordinates
   * trackPaddingLeft: left padding of track before first word
   */
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
    // translateX moves track; positive moves right
    var translateX = anchorX - orpCenter;
    return {
      orpCenter: orpCenter,
      translateX: translateX,
      trackWidth: x
    };
  }

  /** Measure text width with canvas (Node-safe if measureFn provided). */
  function makeMeasurer(font) {
    if (typeof document !== 'undefined') {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      ctx.font = font;
      return function (text) {
        return ctx.measureText(text || '').width;
      };
    }
    // crude fallback: ~0.55em per char
    var size = parseFloat(font) || 14;
    return function (text) {
      return (text || '').length * size * 0.55;
    };
  }

  function splitParts(word, splitAtOrp) {
    if (splitAtOrp) return splitAtOrp(word);
    return { before: '', orp: word || '', after: '' };
  }

  /**
   * Build layout metrics for a window of word strings.
   */
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

  function prefersReducedMotion() {
    try {
      return !!(global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      return false;
    }
  }

  /**
   * DOM updater — call whenever the current word changes.
   * opts: {
   *   words, index, splitAtOrp,
   *   trackEl, stripEl, bigOrpEl,
   *   durationMs, forceInstant
   * }
   */
  function render(opts) {
    opts = opts || {};
    var track = opts.trackEl;
    var strip = opts.stripEl;
    var bigOrp = opts.bigOrpEl;
    if (!track || !strip) return null;

    var words = opts.words || [];
    var total = words.length;
    var index = clamp(opts.index | 0, 0, Math.max(0, total - 1));
    var win = computeWindow(index, total, opts.radius);
    var slice = [];
    for (var i = win.start; i <= win.end; i++) slice.push(words[i]);
    var local = index - win.start;

    var font = opts.font || '500 15px system-ui, sans-serif';
    var layout = layoutWindow(slice, opts.splitAtOrp, font);
    var gap = opts.gap != null ? opts.gap : 10;

    // Build DOM
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
        frag.appendChild(document.createTextNode(' '));
      }
    });
    track.appendChild(frag);

    // Measure real DOM for precise alignment
    var curEl = track.querySelector('.strip-word.is-current .strip-orp');
    var stripRect = strip.getBoundingClientRect();
    var anchorX;
    if (bigOrp) {
      var br = bigOrp.getBoundingClientRect();
      anchorX = (br.left + br.right) / 2 - stripRect.left;
    } else {
      anchorX = stripRect.width * 0.42;
    }

    var orpCenter;
    if (curEl) {
      var cr = curEl.getBoundingClientRect();
      // current translate may already be applied — measure as if translate 0
      var currentTx = 0;
      var m = /translate3d\(([-\d.]+)px/.exec(track.style.transform || '');
      if (m) currentTx = parseFloat(m[1]) || 0;
      else {
        m = /translateX\(([-\d.]+)px/.exec(track.style.transform || '');
        if (m) currentTx = parseFloat(m[1]) || 0;
      }
      orpCenter = (cr.left + cr.right) / 2 - stripRect.left - currentTx;
    } else {
      var math = computeAlignTranslate(layout, local, gap, anchorX, 0);
      orpCenter = math.orpCenter;
    }

    var translateX = anchorX - orpCenter;
    var duration = opts.forceInstant || prefersReducedMotion()
      ? 0
      : Math.max(0, Math.min(800, opts.durationMs || 120));

    if (duration <= 0) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform ' + duration + 'ms linear';
    }
    track.style.transform = 'translate3d(' + translateX + 'px,0,0)';

    return {
      window: win,
      translateX: translateX,
      anchorX: anchorX,
      orpCenter: orpCenter,
      duration: duration,
      // predicted aligned center after transform
      alignedOrpX: orpCenter + translateX
    };
  }

  /** After paint, measure actual centers (for tests). */
  function measureAlignment(bigOrpEl, stripOrpEl) {
    if (!bigOrpEl || !stripOrpEl) return null;
    var a = bigOrpEl.getBoundingClientRect();
    var b = stripOrpEl.getBoundingClientRect();
    var ax = (a.left + a.right) / 2;
    var bx = (b.left + b.right) / 2;
    return { bigX: ax, stripX: bx, delta: Math.abs(ax - bx) };
  }

  global.SentenceStrip = {
    DEFAULT_RADIUS: DEFAULT_RADIUS,
    computeWindow: computeWindow,
    computeAlignTranslate: computeAlignTranslate,
    layoutWindow: layoutWindow,
    render: render,
    measureAlignment: measureAlignment,
    prefersReducedMotion: prefersReducedMotion
  };
})(typeof window !== 'undefined' ? window : globalThis);
