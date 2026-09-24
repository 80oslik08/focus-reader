/**
 * External load receiver — postMessage handshake for extension iframe / opener / bookmarklet.
 * Protocol: app posts FR_READY (repeat) → parent/opener sends FR_LOAD or FR_ACK → app replies FR_LOADED.
 */
(function (global) {
  'use strict';

  var MAX_BYTES = 20 * 1024 * 1024;
  var handlers = { onLoad: null };
  var handshakeDone = false;
  var readyTimer = null;
  var readyTicks = 0;
  var MAX_READY_TICKS = 20; // 20 * 500ms = 10s

  function sanitizeText(t) {
    return String(t || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\u0000/g, '')
      .slice(0, MAX_BYTES);
  }

  function isTrustedSource(src) {
    if (!src) return false;
    try {
      if (global.parent && global.parent !== global && src === global.parent) return true;
      if (global.opener && src === global.opener) return true;
    } catch (e) {}
    return false;
  }

  function reply(source, msg) {
    if (!source) return;
    try { source.postMessage(msg, '*'); } catch (e) {}
  }

  function stopReadyLoop() {
    handshakeDone = true;
    if (readyTimer) {
      clearInterval(readyTimer);
      readyTimer = null;
    }
  }

  function acceptLoad(payload, origin, source) {
    var title = sanitizeText(payload.title || 'Shared text').slice(0, 200);
    var text = sanitizeText(payload.text || '');
    if (!text.trim()) {
      reply(source, { type: 'FR_LOADED', ok: false, error: 'empty' });
      return false;
    }
    var bytes = 0;
    try { bytes = new Blob([text]).size; } catch (e) { bytes = text.length; }
    if (bytes > MAX_BYTES) {
      reply(source, { type: 'FR_LOADED', ok: false, error: 'too_large' });
      return false;
    }
    var host = '';
    try {
      host = origin && origin !== 'null' ? new URL(origin).host
        : (payload.sourceUrl ? new URL(payload.sourceUrl).host : 'external');
    } catch (e) { host = 'external'; }

    var meta = {
      title: title,
      text: text,
      sourceUrl: payload.sourceUrl || '',
      genre: payload.genre || null,
      wpmHint: typeof payload.wpmHint === 'number' ? payload.wpmHint : null,
      host: host,
      _source: source || null
    };

    if (handlers.onLoad) {
      try {
        var maybe = handlers.onLoad(meta);
        if (maybe && typeof maybe.then === 'function') {
          maybe.then(function () {
            reply(source, { type: 'FR_LOADED', ok: true, title: title });
          }).catch(function (err) {
            reply(source, { type: 'FR_LOADED', ok: false, error: String(err && err.message || err) });
          });
        } else {
          reply(source, { type: 'FR_LOADED', ok: true, title: title });
        }
      } catch (err) {
        reply(source, { type: 'FR_LOADED', ok: false, error: String(err && err.message || err) });
        return false;
      }
    } else {
      reply(source, { type: 'FR_LOADED', ok: true, title: title });
    }
    return true;
  }

  function onMessage(ev) {
    var data = ev.data;
    if (!data || typeof data !== 'object') return;

    if (data.type === 'FR_ACK') {
      if (isTrustedSource(ev.source) || ev.source === global.parent || ev.source === global.opener) {
        stopReadyLoop();
      }
      return;
    }

    if (data.type === 'FR_PING') {
      reply(ev.source, { type: 'FR_READY' });
      return;
    }

    if (data.type === 'FR_LOAD') {
      // Prefer event.source identity (chrome-extension:// origins vary); also allow same-origin tests
      var okSrc = isTrustedSource(ev.source);
      try {
        if (!okSrc && ev.origin === global.location.origin) okSrc = true;
      } catch (e) {}
      if (!okSrc) return;
      stopReadyLoop();
      acceptLoad(data, ev.origin, ev.source);
    }
  }

  function announceReadyOnce() {
    try {
      if (global.opener) global.opener.postMessage({ type: 'FR_READY' }, '*');
    } catch (e) {}
    try {
      if (global.parent && global.parent !== global) {
        global.parent.postMessage({ type: 'FR_READY' }, '*');
      }
    } catch (e) {}
  }

  function startReadyLoop() {
    announceReadyOnce();
    if (readyTimer) return;
    readyTimer = setInterval(function () {
      if (handshakeDone) {
        stopReadyLoop();
        return;
      }
      readyTicks += 1;
      announceReadyOnce();
      if (readyTicks >= MAX_READY_TICKS) stopReadyLoop();
    }, 500);
  }

  var pendingLoads = [];

  // Wrap accept to queue if handler not ready yet
  var _acceptLoad = acceptLoad;
  acceptLoad = function (payload, origin, source) {
    if (!handlers.onLoad) {
      pendingLoads.push({ payload: payload, origin: origin, source: source });
      return true;
    }
    return _acceptLoad(payload, origin, source);
  };

  global.addEventListener('message', onMessage);

  global.FocusReceiver = {
    onLoad: function (fn) {
      handlers.onLoad = fn;
      // Flush any loads that arrived before the app wired the handler
      var q = pendingLoads.splice(0, pendingLoads.length);
      q.forEach(function (item) {
        _acceptLoad(item.payload, item.origin, item.source);
      });
      // Only announce FR_READY once the app can accept FR_LOAD
      startReadyLoop();
    },
    acceptLoad: function (payload, origin) {
      return acceptLoad(payload, origin || (global.location && global.location.origin), null);
    },
    sanitizeText: sanitizeText,
    announceReady: announceReadyOnce,
    startReadyLoop: startReadyLoop,
    stopReadyLoop: stopReadyLoop,
    MAX_BYTES: MAX_BYTES
  };

  // Soft early ping response still works via onMessage FR_PING;
  // do not spam FR_READY until onLoad is registered.
})(typeof window !== 'undefined' ? window : globalThis);
