/**
 * Adaptive listening WPM limit (VoiceLimit).
 * Two inputs: technical voice max + learned comfortable limit.
 * Persist localStorage + optional Drive settings.json via FocusSync hook.
 */
(function (global) {
  'use strict';

  var LS_KEY = 'focusReader.voiceLimit';
  var DEFAULT_LIMIT = 300;
  var MIN = 100;
  var MAX = 600;
  var SETTLE_MS = 3 * 60 * 1000; // 3 cumulative minutes at S to raise
  var IGNORE_MS = 10000; // ignore first 10s after Listen on
  var SLOW_WINDOW_MS = 2 * 60 * 1000;

  var state = {
    limit: DEFAULT_LIMIT,
    voiceMax: null,
    perLang: {},
    listenEnabledAt: 0,
    dwellStart: null,
    dwellSpeed: null,
    dwellAccumMs: 0,
    lastDwellTick: null,
    recentSlowdowns: [],
    lastRaiseAt: 0
  };

  function clamp(n) {
    return Math.min(MAX, Math.max(MIN, Math.round(n)));
  }

  function load() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (typeof data.limit === 'number') state.limit = clamp(data.limit);
      if (data.perLang) state.perLang = data.perLang;
      if (typeof data.voiceMax === 'number') state.voiceMax = data.voiceMax;
    } catch (e) {}
  }

  function save() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        limit: state.limit,
        perLang: state.perLang,
        voiceMax: state.voiceMax,
        updatedAt: Date.now()
      }));
    } catch (e) {}
    if (global.FocusSync && FocusSync.notifySettings) {
      FocusSync.notifySettings({ voiceLimit: state.limit, perLang: state.perLang, updatedAt: Date.now() });
    }
  }

  function effectiveLimit(lang) {
    var base = state.limit;
    if (lang && state.perLang[lang] != null) base = state.perLang[lang];
    if (state.voiceMax != null) base = Math.min(base, state.voiceMax);
    return clamp(base);
  }

  function setVoiceMax(wpm) {
    if (!wpm || !isFinite(wpm)) return;
    state.voiceMax = clamp(wpm);
    save();
  }

  function onListenEnabled() {
    state.listenEnabledAt = Date.now();
    state.dwellStart = null;
    state.dwellSpeed = null;
    state.dwellAccumMs = 0;
    state.lastDwellTick = null;
  }

  function onListenDisabled() {
    flushDwell(Date.now());
    state.dwellStart = null;
  }

  function flushDwell(now) {
    if (state.lastDwellTick && state.dwellSpeed != null) {
      state.dwellAccumMs += now - state.lastDwellTick;
      state.lastDwellTick = now;
    }
  }

  /**
   * Call while Listen is playing, ~every second or on WPM change.
   */
  function tick(currentWpm, lang, playing) {
    if (!playing) {
      flushDwell(Date.now());
      state.lastDwellTick = null;
      return effectiveLimit(lang);
    }
    var now = Date.now();
    if (now - state.listenEnabledAt < IGNORE_MS) return effectiveLimit(lang);

    if (state.dwellSpeed !== currentWpm) {
      flushDwell(now);
      // speed change
      if (state.dwellSpeed != null && currentWpm < state.dwellSpeed) {
        // slowdown event
        state.recentSlowdowns.push(now);
        state.recentSlowdowns = state.recentSlowdowns.filter(function (t) {
          return now - t < SLOW_WINDOW_MS;
        });
        var lim = effectiveLimit(lang);
        if (currentWpm < lim) {
          // limit = limit - 0.5*(limit - newS)
          var lowered = lim - 0.5 * (lim - currentWpm);
          state.limit = clamp(lowered);
          if (lang) state.perLang[lang] = state.limit;
          save();
        }
      }
      state.dwellSpeed = currentWpm;
      state.dwellAccumMs = 0;
      state.lastDwellTick = now;
    } else {
      if (!state.lastDwellTick) state.lastDwellTick = now;
      else {
        state.dwellAccumMs += now - state.lastDwellTick;
        state.lastDwellTick = now;
      }
      var lim2 = effectiveLimit(lang);
      if (currentWpm > lim2 && state.dwellAccumMs >= SETTLE_MS) {
        // raise: limit = limit + 0.5*(S - limit), at least S-5
        var raised = lim2 + 0.5 * (currentWpm - lim2);
        raised = Math.max(raised, currentWpm - 5);
        state.limit = clamp(raised);
        if (lang) state.perLang[lang] = state.limit;
        state.dwellAccumMs = 0;
        state.lastRaiseAt = now;
        save();
      }
    }
    return effectiveLimit(lang);
  }

  function applyRemoteSettings(data) {
    if (!data) return;
    if (typeof data.voiceLimit === 'number') {
      // LWW: caller should check updatedAt
      state.limit = clamp(data.voiceLimit);
    }
    if (data.perLang) state.perLang = data.perLang;
    save();
  }

  // Pure helpers for unit tests
  function _learnRaise(limit, S) {
    var raised = limit + 0.5 * (S - limit);
    raised = Math.max(raised, S - 5);
    return clamp(raised);
  }
  function _learnLower(limit, newS) {
    return clamp(limit - 0.5 * (limit - newS));
  }

  load();

  global.VoiceLimit = {
    DEFAULT_LIMIT: DEFAULT_LIMIT,
    MIN: MIN,
    MAX: MAX,
    getLimit: effectiveLimit,
    setVoiceMax: setVoiceMax,
    onListenEnabled: onListenEnabled,
    onListenDisabled: onListenDisabled,
    tick: tick,
    applyRemoteSettings: applyRemoteSettings,
    getState: function () {
      return {
        limit: state.limit,
        voiceMax: state.voiceMax,
        effective: effectiveLimit()
      };
    },
    _learnRaise: _learnRaise,
    _learnLower: _learnLower,
    _clamp: clamp
  };
})(typeof window !== 'undefined' ? window : globalThis);
