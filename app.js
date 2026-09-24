/**
 * Focus Reader — Spritz-style ORP RSVP (classic script, offline)
 * Timer panel + Recent Files (IndexedDB)
 */
(function () {
'use strict';

var alphaLength = ORP.alphaLength;
var splitAtOrp = ORP.splitAtOrp;
var tokenize = ORP.tokenize;
var tokenizeAsync = ORP.tokenizeAsync || function (t) { return Promise.resolve(tokenize(t)); };
var displayDurationMs = ORP.displayDurationMs;
var estimateRemainingMs = ORP.estimateRemainingMs;
var ORP_TABLE = ORP.ORP_TABLE;

var LS_SESSION_MIN = 'focusReader.sessionMinutes';
var LS_BEEP = 'focusReader.beepEnabled';
var LS_SENTENCE_STRIP = 'focusReader.sentenceStrip';
var LS_NATURAL_PAUSES = 'focusReader.naturalPauses';
var LS_THEME = 'focusReader.theme';
var SAVE_THROTTLE_MS = 2000;

var SAMPLE_TEXT = 'Speed reading with RSVP presents one word at a time, aligned to an Optimal Recognition Point. Your eyes stay fixed while meaning flows forward. Short words flash briefly; longer words linger a little longer. After commas you pause; after full stops you rest longer still.\n\nPractice at a comfortable pace first. Three hundred words per minute is a solid default. Raise the speed when the text feels easy. Focus on comprehension, not only raw throughput.';

var els = {
  source: document.getElementById('source'),
  wordBefore: document.getElementById('wordBefore'),
  wordOrp: document.getElementById('wordOrp'),
  wordAfter: document.getElementById('wordAfter'),
  placeholder: document.getElementById('placeholder'),
  progressLabel: document.getElementById('progressLabel'),
  statusLabel: document.getElementById('statusLabel'),
  progressFill: document.getElementById('progressFill'),
  progressBar: document.getElementById('progressBar'),
  wpmRange: document.getElementById('wpmRange'),
  wpmInput: document.getElementById('wpmInput'),
  wpmDisplay: document.getElementById('wpmDisplay'),
  btnPlay: document.getElementById('btnPlay'),
  playLabel: document.getElementById('playLabel'),
  iconPlay: document.getElementById('iconPlay'),
  iconPause: document.getElementById('iconPause'),
  btnRestart: document.getElementById('btnRestart'),
  btnWpmDown: document.getElementById('btnWpmDown'),
  btnWpmUp: document.getElementById('btnWpmUp'),
  btnListen: document.getElementById('btnListen'),
  btnFocusControl: document.getElementById('btnFocusControl'),
  btnSentenceStrip: document.getElementById('btnSentenceStrip'),
  btnJumpMore: document.getElementById('btnJumpMore'),
  btnControlsMore: document.getElementById('btnControlsMore'),
  sentenceStripWrap: document.getElementById('sentenceStripWrap'),
  sentenceStrip: document.getElementById('sentenceStrip'),
  sentenceStripTrack: document.getElementById('sentenceStripTrack'),
  playerColNav: document.getElementById('playerColNav'),
  playerColControls: document.getElementById('playerColControls'),
  jumpCompactLabel: document.getElementById('jumpCompactLabel'),
  jumpPanel: document.getElementById('jumpPanel'),
  jumpSlider: document.getElementById('jumpSlider'),
  jumpReadout: document.getElementById('jumpReadout'),
  jumpTimeLabel: document.getElementById('jumpTimeLabel'),
  jumpWordsLabel: document.getElementById('jumpWordsLabel'),
  jumpTargetLabel: document.getElementById('jumpTargetLabel'),
  jumpClampLabel: document.getElementById('jumpClampLabel'),
  jumpPreview: document.getElementById('jumpPreview'),
  btnJumpApply: document.getElementById('btnJumpApply'),
  btnJumpCancel: document.getElementById('btnJumpCancel'),
  btnJumpUndo: document.getElementById('btnJumpUndo'),
  voiceLimitTrack: document.getElementById('voiceLimitTrack'),
  voiceLimitZone: document.getElementById('voiceLimitZone'),
  voiceLimitTick: document.getElementById('voiceLimitTick'),
  voiceLimitLabel: document.getElementById('voiceLimitLabel'),
  voiceLimitHint: document.getElementById('voiceLimitHint'),
  listenVoiceRow: document.getElementById('listenVoiceRow'),
  voiceSelect: document.getElementById('voiceSelect'),
  langOverride: document.getElementById('langOverride'),
  btnLoadSample: document.getElementById('btnLoadSample'),
  btnApply: document.getElementById('btnApply'),
  btnClear: document.getElementById('btnClear'),
  dropzone: document.getElementById('dropzone'),
  fileInput: document.getElementById('fileInput'),
  toast: document.getElementById('toast'),
  elapsedDisplay: document.getElementById('elapsedDisplay'),
  remainingDisplay: document.getElementById('remainingDisplay'),
  totalEstDisplay: document.getElementById('totalEstDisplay'),
  wordsReadDisplay: document.getElementById('wordsReadDisplay'),
  avgWpmDisplay: document.getElementById('avgWpmDisplay'),
  sessionCountdown: document.getElementById('sessionCountdown'),
  sessionPresets: document.getElementById('sessionPresets'),
  sessionCustomMin: document.getElementById('sessionCustomMin'),
  btnSessionStart: document.getElementById('btnSessionStart'),
  btnSessionReset: document.getElementById('btnSessionReset'),
  btnSessionOff: document.getElementById('btnSessionOff'),
  beepToggle: document.getElementById('beepToggle'),
  sessionBanner: document.getElementById('sessionBanner'),
  recentList: document.getElementById('recentList'),
  recentEmpty: document.getElementById('recentEmpty'),
  btnClearRecent: document.getElementById('btnClearRecent'),
  recentToggle: document.getElementById('recentToggle'),
  recentBody: document.getElementById('recentBody'),
  stage: document.getElementById('stage'),
  stageWrap: document.getElementById('stageWrap'),
  wordRow: document.getElementById('wordRow'),
  wordAnchor: document.getElementById('wordAnchor'),
  btnFocus: document.getElementById('btnFocus'),
  belowReader: document.getElementById('belowReader'),
  touchHint: document.getElementById('touchHint'),
  sourceLabel: document.getElementById('sourceLabel'),
  btnNaturalPauses: document.getElementById('btnNaturalPauses'),
  btnTheme: document.getElementById('btnTheme'),
  themeSelect: document.getElementById('themeSelect'),
  voiceHelpNote: document.getElementById('voiceHelpNote')
};

var state = {
  tokens: [],
  wordIndices: [],
  index: 0,
  playing: false,
  wpm: 300,
  positionRestored: false,
  listenMode: false,
  bookLang: null,
  langOverride: '',
  jumpUndoStack: [],
  jumpPendingSec: 0,
  sentenceStripOn: true,
  naturalPauses: false,
  theme: 'dark',
  listenWps: null,
  schedT0: null,
  schedN: 0,
  schedRaf: null,
  schedCumMs: 0,

  timer: null,
  sentenceWordCount: 0,
  // reading timer
  elapsedMs: 0,
  playStartedAt: null,
  wordsReadSession: 0,
  uiTick: null,
  // session countdown
  sessionActive: false,
  sessionDurationMs: 15 * 60 * 1000,
  sessionRemainingMs: 0,
  sessionTickAt: null,
  beepEnabled: true,
  // recent
  currentDocId: null,
  currentDocName: null,
  currentDocType: null,
  saveTimer: null,
  skipRecentSave: false,
  focusMode: false,
  wakeLock: null,
  baseWordFontPx: null
};


function timingOpts() {
  return { naturalPauses: !!state.naturalPauses };
}

function currentWordText() {
  var t = currentToken();
  return t ? t.text : null;
}

function clampWpm(v) {
  var n = Math.round(Number(v) || 300);
  return Math.min(1000, Math.max(100, n));
}

function showToast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(function () { els.toast.classList.remove('show'); }, 2600);
}

function formatDuration(ms) {
  if (ms == null || !isFinite(ms) || ms < 0) return '—';
  var totalSec = Math.round(ms / 1000);
  var h = Math.floor(totalSec / 3600);
  var m = Math.floor((totalSec % 3600) / 60);
  var s = totalSec % 60;
  if (h > 0) {
    return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }
  return m + ':' + String(s).padStart(2, '0');
}

function formatDateTime(ts) {
  try {
    var d = new Date(ts);
    return d.toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    return '';
  }
}

function liveElapsedMs() {
  var ms = state.elapsedMs;
  if (state.playing && state.playStartedAt != null) {
    ms += Date.now() - state.playStartedAt;
  }
  return ms;
}

function liveSessionRemainingMs() {
  if (!state.sessionActive) return null;
  var rem = state.sessionRemainingMs;
  if (state.playing && state.sessionTickAt != null) {
    rem -= Date.now() - state.sessionTickAt;
  }
  return Math.max(0, rem);
}

function setWpm(v, syncInputs, skipSave) {
  if (syncInputs === undefined) syncInputs = true;
  var prev = state.wpm;
  state.wpm = clampWpm(v);
  els.wpmDisplay.textContent = String(state.wpm);
  if (syncInputs) {
    els.wpmRange.value = String(state.wpm);
    els.wpmInput.value = String(state.wpm);
  }
  updateTimerDisplays();
  updateVoiceLimitUI();
  refreshJumpButtonTitles();
  if (typeof FocusJump !== 'undefined' && state.jumpPendingSec) updateJumpScrubUI();
  if (typeof VoiceLimit !== 'undefined' && state.listenMode && state.playing) {
    VoiceLimit.tick(state.wpm, state.langOverride || state.bookLang, true);
  }
  // Restart listen utterance from current word when speed changes while listening
  if (state.listenMode && state.playing && typeof FocusListen !== 'undefined' && prev !== state.wpm) {
    FocusListen.speakFromWordIndex(
      state.wordIndices.map(function (ti) { return state.tokens[ti].text; }),
      state.index,
      state.wpm
    );
  }
  if (!skipSave) scheduleSaveProgress(true);
}

function rebuildWordIndex() {
  state.wordIndices = [];
  state.tokens.forEach(function (t, i) {
    if (t.type === 'word') state.wordIndices.push(i);
  });
}

function totalWords() {
  return state.wordIndices.length;
}

function currentToken() {
  if (!state.wordIndices.length) return null;
  var ti = state.wordIndices[state.index];
  return state.tokens[ti] || null;
}

function measureTextWidth(text, font) {
  if (!measureTextWidth.canvas) measureTextWidth.canvas = document.createElement('canvas');
  var ctx = measureTextWidth.canvas.getContext('2d');
  ctx.font = font;
  return ctx.measureText(text || '').width;
}

function fitWordToStage(before, orp, after) {
  var row = els.wordRow || document.getElementById('wordRow');
  var stage = els.stage || document.getElementById('stage');
  if (!row || !stage) return;
  row.style.fontSize = '';
  var cs = getComputedStyle(row);
  var base = parseFloat(cs.fontSize) || 24;
  state.baseWordFontPx = base;
  var fontWeight = cs.fontWeight || '500';
  var fontFamily = cs.fontFamily || 'sans-serif';
  var pad = 16;
  var stageW = stage.clientWidth || 300;
  var leftBudget = stageW * 0.42 - pad;
  var rightBudget = stageW * 0.58 - pad;
  var fs = base;
  var minFs = 11;
  while (fs >= minFs) {
    var font = fontWeight + ' ' + fs + 'px ' + fontFamily;
    var bw = measureTextWidth(before, font);
    var ow = measureTextWidth(orp, font);
    var aw = measureTextWidth(after, font);
    if (bw <= leftBudget && (ow + aw) <= rightBudget) break;
    fs -= 0.5;
  }
  row.style.fontSize = fs + 'px';
}


function updateSourceLabel() {
  if (!els.sourceLabel) return;
  var name = state.currentDocName;
  if (!name) {
    if (state.currentDocType === 'paste') name = 'Pasted text';
    else if (totalWords()) name = 'Pasted text';
    else name = '';
  }
  els.sourceLabel.textContent = name || '';
  els.sourceLabel.hidden = !name;
  els.sourceLabel.title = name || '';
}

function renderWord(word, opts) {
  opts = opts || {};
  if (!word) {
    els.wordBefore.textContent = '';
    els.wordOrp.textContent = '';
    els.wordAfter.textContent = '';
    els.placeholder.classList.remove('hidden');
    if (els.wordRow) els.wordRow.style.fontSize = '';
    updateSentenceStrip({ forceInstant: true });
    return;
  }
  els.placeholder.classList.add('hidden');
  var parts = splitAtOrp(word);
  els.wordBefore.textContent = parts.before;
  els.wordOrp.textContent = parts.orp;
  els.wordAfter.textContent = parts.after;
  fitWordToStage(parts.before, parts.orp, parts.after);
  updateSourceLabel();
  updateSentenceStrip(opts);
}

function loadSentenceStripPref() {
  try {
    var v = localStorage.getItem(LS_SENTENCE_STRIP);
    if (v === '0') state.sentenceStripOn = false;
    else if (v === '1') state.sentenceStripOn = true;
  } catch (e) {}
  applySentenceStripVisibility();
}

function saveSentenceStripPref() {
  try {
    localStorage.setItem(LS_SENTENCE_STRIP, state.sentenceStripOn ? '1' : '0');
  } catch (e) {}
  if (typeof FocusSync !== 'undefined' && FocusSync.notifySettings) {
    FocusSync.notifySettings({ sentenceStrip: state.sentenceStripOn, updatedAt: Date.now() });
  }
}

function applySentenceStripVisibility() {
  document.body.classList.toggle('sentence-strip-off', !state.sentenceStripOn);
  if (els.sentenceStripWrap) {
    els.sentenceStripWrap.classList.toggle('is-hidden', !state.sentenceStripOn);
  }
  if (els.btnSentenceStrip) {
    els.btnSentenceStrip.classList.toggle('active', state.sentenceStripOn);
    els.btnSentenceStrip.setAttribute('aria-pressed', state.sentenceStripOn ? 'true' : 'false');
  }
}

function setSentenceStripOn(on) {
  state.sentenceStripOn = !!on;
  applySentenceStripVisibility();
  saveSentenceStripPref();
  if (state.sentenceStripOn) updateSentenceStrip({ forceInstant: true });
}

function updateSentenceStrip(opts) {
  opts = opts || {};
  if (!state.sentenceStripOn) return null;
  if (typeof SentenceStrip === 'undefined') return null;
  if (!els.sentenceStripTrack || !els.sentenceStrip) return null;
  var words = (typeof wordListTexts === 'function')
    ? wordListTexts()
    : state.wordIndices.map(function (ti) { return state.tokens[ti].text; });
  if (!words.length) {
    els.sentenceStripTrack.innerHTML = '';
    els.sentenceStripTrack.style.transform = 'translate3d(0,0,0)';
    if (typeof SentenceStrip.stopScroll === 'function') SentenceStrip.stopScroll(false);
    return null;
  }
  var forceInstant = !!opts.forceInstant;
  var reanchor = !!opts.reanchor || forceInstant || !!opts.jump;
  var run = function () {
    state._lastStripAlign = SentenceStrip.render({
      words: words,
      index: state.index,
      splitAtOrp: splitAtOrp,
      trackEl: els.sentenceStripTrack,
      stripEl: els.sentenceStrip,
      bigOrpEl: els.wordOrp,
      durationMs: forceInstant ? 0 : 150,
      forceInstant: forceInstant,
      reanchor: reanchor,
      easeMs: opts.easeMs != null ? opts.easeMs : (reanchor && !forceInstant ? 150 : 0),
      forceRebuild: !!opts.forceRebuild,
      wpm: state.wpm,
      listenWps: state.listenMode ? state.listenWps : null,
      radius: 50,
      font: '500 15px system-ui, -apple-system, Segoe UI, sans-serif'
    });
    if (state.playing && !SentenceStrip.prefersReducedMotion()) {
      var rt = SentenceStrip.getRuntime && SentenceStrip.getRuntime();
      if (!rt || !rt.playing) {
        SentenceStrip.startScroll({
          wpm: state.wpm,
          listenWps: state.listenMode ? state.listenWps : null,
          words: words,
          index: state.index
        });
      } else {
        // Update velocity target without resetting samples
        SentenceStrip.startScroll({
          wpm: state.wpm,
          listenWps: state.listenMode ? state.listenWps : null,
          words: words,
          index: state.index
        });
      }
    }
  };
  if (opts.sync) run();
  else {
    requestAnimationFrame(function () { requestAnimationFrame(run); });
  }
  return state._lastStripAlign;
}

function updateProgress() {
  var total = totalWords();
  var cur = total ? state.index + 1 : 0;
  els.progressLabel.textContent = cur + ' / ' + total;
  var fill = total ? ((state.index + 1) / total) * 100 : 0;
  els.progressFill.style.width = fill + '%';
  els.progressBar.setAttribute('aria-valuenow', String(Math.round(fill)));
  updateTimerDisplays();
}

function updateTimerDisplays() {
  if (!els.elapsedDisplay) return;
  els.elapsedDisplay.textContent = formatDuration(liveElapsedMs());

  var total = totalWords();
  if (!total) {
    els.remainingDisplay.textContent = '—';
    els.totalEstDisplay.textContent = '—';
  } else {
    var rem = estimateRemainingMs(state.tokens, state.wordIndices, state.index, state.wpm, timingOpts());
    var tot = estimateRemainingMs(state.tokens, state.wordIndices, 0, state.wpm, timingOpts());
    els.remainingDisplay.textContent = formatDuration(rem);
    els.totalEstDisplay.textContent = formatDuration(tot);
  }

  els.wordsReadDisplay.textContent = String(state.wordsReadSession);
  var elapsedMin = liveElapsedMs() / 60000;
  if (elapsedMin > 0.01 && state.wordsReadSession > 0) {
    els.avgWpmDisplay.textContent = String(Math.round(state.wordsReadSession / elapsedMin));
  } else {
    els.avgWpmDisplay.textContent = '—';
  }

  // session countdown UI
  if (!state.sessionActive) {
    els.sessionCountdown.textContent = 'Off';
    els.sessionCountdown.classList.remove('warn', 'done');
  } else {
    var srem = liveSessionRemainingMs();
    els.sessionCountdown.textContent = formatDuration(srem);
    els.sessionCountdown.classList.toggle('warn', srem > 0 && srem <= 60000);
    els.sessionCountdown.classList.toggle('done', srem <= 0);
  }
}

function setPlayingUI(playing) {
  state.playing = playing;
  els.playLabel.textContent = playing ? 'Pause' : 'Play';
  els.iconPlay.hidden = playing;
  els.iconPause.hidden = !playing;
  if (playing) {
    els.statusLabel.textContent = 'Reading';
  } else if (totalWords()) {
    els.statusLabel.textContent = 'Paused';
  } else {
    els.statusLabel.textContent = 'Ready';
  }
}

function stopWordTimer() {
  if (state.timer != null) {
    clearTimeout(state.timer);
    state.timer = null;
  }
  if (state.schedRaf != null) {
    cancelAnimationFrame(state.schedRaf);
    state.schedRaf = null;
  }
}

function endsSentence(word) {
  return /[.!?]$/.test(word);
}

function computeSentenceCountAt(wordIndex) {
  var count = 0;
  for (var i = wordIndex; i >= 0; i--) {
    var ti = state.wordIndices[i];
    var w = state.tokens[ti].text;
    count++;
    if (i < wordIndex && endsSentence(w)) {
      count--;
      break;
    }
    if (i > 0) {
      var prevTi = state.wordIndices[i - 1];
      for (var j = prevTi + 1; j < ti; j++) {
        if (state.tokens[j].type === 'para') return count;
      }
    }
  }
  return count;
}

function flushPlayClock() {
  if (state.playStartedAt != null) {
    state.elapsedMs += Date.now() - state.playStartedAt;
    state.playStartedAt = null;
  }
  if (state.sessionActive && state.sessionTickAt != null) {
    state.sessionRemainingMs = Math.max(0, state.sessionRemainingMs - (Date.now() - state.sessionTickAt));
    state.sessionTickAt = null;
  }
}

function startPlayClocks() {
  state.playStartedAt = Date.now();
  if (state.sessionActive) state.sessionTickAt = Date.now();
}

function playSoftBeep() {
  if (!state.beepEnabled) return;
  try {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    var ctx = new Ctx();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 660;
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    var now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.4);
    setTimeout(function () { ctx.close(); }, 500);
  } catch (e) { /* ignore */ }
}

function onSessionComplete() {
  flushPlayClock();
  state.sessionRemainingMs = 0;
  stopWordTimer();
  setPlayingUI(false);
  var token = currentToken();
  if (token) renderWord(token.text);
  updateProgress();
  if (els.sessionBanner) els.sessionBanner.hidden = false;
  playSoftBeep();
  showToast('Session complete');
  scheduleSaveProgress(true);
}

function checkSessionDuringTick() {
  if (!state.sessionActive || !state.playing) return;
  var rem = liveSessionRemainingMs();
  if (rem <= 0) onSessionComplete();
}

function wordDurationAt(index) {
  var total = totalWords();
  if (!total || index < 0 || index >= total) return ORP.baseMs(state.wpm);
  var ti = state.wordIndices[index];
  var token = state.tokens[ti];
  var sentenceCount = state.sentenceWordCount;
  if (state.naturalPauses && endsSentence(token.text)) {
    sentenceCount = computeSentenceCountAt(index);
  }
  var ms = displayDurationMs(token, state.wpm, sentenceCount, timingOpts());
  if (state.naturalPauses && index < total - 1) {
    var curTi = state.wordIndices[index];
    var nextTi = state.wordIndices[index + 1];
    var base = ORP.baseMs(state.wpm);
    for (var j = curTi + 1; j < nextTi; j++) {
      if (state.tokens[j].type === 'para') {
        ms += base * 2.5;
        break;
      }
    }
  }
  return Math.max(1, ms);
}

function advanceSentenceCountFor(token) {
  if (!state.naturalPauses) return;
  if (endsSentence(token.text)) state.sentenceWordCount = 0;
  else state.sentenceWordCount += 1;
}

function scheduleNext() {
  stopWordTimer();
  if (!state.playing) return;
  checkSessionDuringTick();
  if (!state.playing) return;

  var total = totalWords();
  if (!total || state.index >= total) {
    pause();
    els.statusLabel.textContent = 'Finished';
    showToast('Finished');
    return;
  }

  var token = currentToken();
  renderWord(token.text);
  updateProgress();
  advanceSentenceCountFor(token);

  // Drift-free: deadline = t0 + cumulative intervals
  if (state.schedT0 == null) {
    state.schedT0 = performance.now();
    state.schedN = 0;
    state.schedCumMs = 0;
  }
  var interval = wordDurationAt(state.index);
  state.schedCumMs += interval;
  state.schedN += 1;
  var deadline = state.schedT0 + state.schedCumMs;

  if (state.sessionActive) {
    var srem = liveSessionRemainingMs();
    if (srem != null && srem < interval) {
      state.timer = setTimeout(function () { onSessionComplete(); }, Math.max(0, srem));
      return;
    }
  }

  function armWait() {
    if (!state.playing) return;
    var wait = deadline - performance.now();
    if (wait <= 0) {
      onWordDeadline();
      return;
    }
    if (wait < 24) {
      state.schedRaf = requestAnimationFrame(function () {
        state.schedRaf = null;
        if (performance.now() >= deadline) onWordDeadline();
        else armWait();
      });
    } else {
      state.timer = setTimeout(function () {
        state.timer = null;
        onWordDeadline();
      }, wait);
    }
  }

  function onWordDeadline() {
    if (!state.playing) return;
    var total = totalWords();
    state.index += 1;
    state.wordsReadSession += 1;
    scheduleSaveProgress(false);
    if (state.index >= total) {
      renderWord(null);
      updateProgress();
      pause();
      els.placeholder.textContent = 'Done — press Restart or load more text';
      els.placeholder.classList.remove('hidden');
      els.statusLabel.textContent = 'Finished';
      showToast('Finished');
      scheduleSaveProgress(true);
      return;
    }
    // If behind schedule, scheduleNext will see wait<=0 and advance immediately (no drift)
    scheduleNext();
  }

  armWait();
}

function hideTouchHint() {
  if (els.touchHint) els.touchHint.hidden = true;
}
function play() {
  hideTouchHint();
  if (!totalWords()) {
    applyText(els.source.value, { toast: false, persist: true, nameHint: null });
    if (!totalWords()) {
      showToast('Add some text first');
      return;
    }
  }
  if (state.index >= totalWords()) {
    state.index = 0;
    state.sentenceWordCount = 0;
  }
  if (els.sessionBanner) els.sessionBanner.hidden = true;
  startPlayClocks();
  state.schedT0 = null;
  state.schedN = 0;
  state.schedCumMs = 0;
  setPlayingUI(true);
  requestWakeLock();
  ensureUiTick();
  if (typeof SentenceStrip !== 'undefined' && state.sentenceStripOn && !state.listenMode) {
    SentenceStrip.startScroll({ wpm: state.wpm, words: wordListTexts(), index: state.index });
  }
  if (state.listenMode && typeof FocusListen !== 'undefined' && FocusListen.supportsSpeech()) {
    stopWordTimer();
    FocusListen.speakFromWordIndex(
      state.wordIndices.map(function (ti) { return state.tokens[ti].text; }),
      state.index,
      state.wpm
    );
  } else {
    scheduleNext();
  }
}

function pause() {
  stopWordTimer();
  if (typeof FocusListen !== 'undefined') FocusListen.stop(true);
  if (typeof SentenceStrip !== 'undefined') SentenceStrip.stopScroll(true);
  flushPlayClock();
  state.schedT0 = null;
  setPlayingUI(false);
  releaseWakeLock();
  var token = currentToken();
  if (token) renderWord(token.text, { stripReanchor: false });
  updateProgress();
  scheduleSaveProgress(true);
}

function togglePlay() {
  if (state.playing) pause();
  else play();
}

function resetElapsedTimers() {
  flushPlayClock();
  state.elapsedMs = 0;
  state.playStartedAt = null;
  state.wordsReadSession = 0;
  updateTimerDisplays();
}

function restart() {
  stopWordTimer();
  if (typeof FocusListen !== 'undefined') FocusListen.stop(true);
  flushPlayClock();
  state.index = 0;
  state.sentenceWordCount = 0;
  resetElapsedTimers();
  if (els.sessionBanner) els.sessionBanner.hidden = true;
  if (totalWords()) {
    renderWord(state.tokens[state.wordIndices[0]].text);
    els.statusLabel.textContent = 'Ready';
  } else {
    renderWord(null);
    els.placeholder.textContent = 'Paste or import text, then press Play';
    els.statusLabel.textContent = 'Ready';
  }
  updateProgress();
  setPlayingUI(false);
  scheduleSaveProgress(true);
}

function skip(delta) {
  if (!totalWords()) return;
  var wasPlaying = state.playing;
  stopWordTimer();
  flushPlayClock();
  var prev = state.index;
  state.index = Math.min(totalWords() - 1, Math.max(0, state.index + delta));
  if (state.index > prev) state.wordsReadSession += (state.index - prev);
  state.sentenceWordCount = 0;
  var token = currentToken();
  if (token) renderWord(token.text);
  updateProgress();
  scheduleSaveProgress(true);
  if (wasPlaying) {
    startPlayClocks();
    setPlayingUI(true);
    if (state.listenMode && typeof FocusListen !== 'undefined') {
      FocusListen.speakFromWordIndex(
        state.wordIndices.map(function (ti) { return state.tokens[ti].text; }),
        state.index,
        state.wpm
      );
    } else {
      scheduleNext();
    }
  } else {
    setPlayingUI(false);
  }
}


/* ——— Time-based jumps (FocusJump) ——— */
function wordListTexts() {
  return state.wordIndices.map(function (ti) { return state.tokens[ti].text; });
}

function refreshJumpButtonTitles() {
  if (typeof FocusJump === 'undefined') return;
  document.querySelectorAll('[data-jump-sec]').forEach(function (btn) {
    var sec = Number(btn.getAttribute('data-jump-sec'));
    btn.title = FocusJump.tooltipFor(sec, state.wpm);
  });
}

function updateJumpScrubUI() {
  if (!els.jumpSlider || typeof FocusJump === 'undefined') return;
  var v = Number(els.jumpSlider.value) || 0;
  var sec = FocusJump.sliderToSeconds(v);
  state.jumpPendingSec = sec;
  var plan = FocusJump.planJump(state.index, totalWords(), sec, state.wpm);
  var active = sec !== 0 && totalWords() > 0;
  if (els.jumpReadout) els.jumpReadout.hidden = false;
  if (els.jumpTimeLabel) els.jumpTimeLabel.textContent = FocusJump.formatSignedTime(sec);
  if (els.jumpWordsLabel) {
    els.jumpWordsLabel.textContent = FocusJump.formatSignedWords(plan.requestedDelta != null ? plan.requestedDelta : plan.deltaWords);
  }
  if (els.jumpCompactLabel) {
    var wdelta = plan.requestedDelta != null ? plan.requestedDelta : plan.deltaWords;
    els.jumpCompactLabel.textContent = FocusJump.formatSignedTime(sec) + ' · ' +
      (wdelta === 0 ? '0w' : ((wdelta < 0 ? '−' : '+') + Math.abs(wdelta) + 'w'));
  }
  var total = totalWords();
  if (els.jumpTargetLabel) {
    if (total && sec !== 0) {
      var pct = Math.round(((plan.targetIndex + 1) / total) * 100);
      els.jumpTargetLabel.textContent = '→ word ' + (plan.targetIndex + 1) + '/' + total + ' (' + pct + '%)';
    } else {
      els.jumpTargetLabel.textContent = sec === 0 ? 'Drag to preview' : '';
    }
  }
  if (els.jumpClampLabel) {
    if (plan.clamped && plan.clampReason === 'start') {
      els.jumpClampLabel.hidden = false;
      els.jumpClampLabel.textContent = 'start of book';
    } else if (plan.clamped && plan.clampReason === 'end') {
      els.jumpClampLabel.hidden = false;
      els.jumpClampLabel.textContent = 'end of book';
    } else {
      els.jumpClampLabel.hidden = true;
      els.jumpClampLabel.textContent = '';
    }
  }
  if (els.jumpPreview && total && sec !== 0) {
    var snip = FocusJump.previewSnippet(wordListTexts(), plan.targetIndex, 5);
    els.jumpPreview.innerHTML = snip.html;
  } else if (els.jumpPreview) {
    els.jumpPreview.innerHTML = '';
  }
  if (els.jumpSlider) {
    els.jumpSlider.setAttribute('aria-valuetext', FocusJump.formatSignedTime(sec));
  }
  if (els.btnJumpApply) {
    els.btnJumpApply.disabled = !active;
    els.btnJumpApply.classList.toggle('btn-primary', !!active);
  }
  if (els.btnJumpCancel) els.btnJumpCancel.disabled = sec === 0;
  if (els.btnJumpUndo) els.btnJumpUndo.disabled = !state.jumpUndoStack.length;
}

function resetJumpSlider() {
  if (els.jumpSlider) els.jumpSlider.value = '0';
  state.jumpPendingSec = 0;
  updateJumpScrubUI();
}

/**
 * Jump by signed seconds at current WPM.
 * opts.pushUndo (default true), opts.fromUndo (default false)
 */
function jumpBySeconds(seconds, opts) {
  opts = opts || {};
  if (!totalWords() || typeof FocusJump === 'undefined') return null;
  var plan = FocusJump.planJump(state.index, totalWords(), seconds, state.wpm);
  if (plan.targetIndex === state.index && !plan.clamped && (plan.requestedDelta === 0)) {
    return plan;
  }
  var wasPlaying = state.playing;
  stopWordTimer();
  if (typeof FocusListen !== 'undefined') FocusListen.stop(true);
  flushPlayClock(); // pause play clock accrual but keep elapsedMs

  var fromIdx = state.index;
  if (opts.pushUndo !== false && !opts.fromUndo && plan.targetIndex !== fromIdx) {
    state.jumpUndoStack.push(fromIdx);
    if (state.jumpUndoStack.length > 10) state.jumpUndoStack.shift();
  }

  state.index = plan.targetIndex;
  state.sentenceWordCount = 0;
  state.schedT0 = null;
  state.schedCumMs = 0;
  state.schedN = 0;
  // Don't change elapsed time on jumps; wordsReadSession only grows forward
  if (state.index > fromIdx) state.wordsReadSession += (state.index - fromIdx);

  var token = currentToken();
  if (token) renderWord(token.text, { forceInstant: true, jump: true, reanchor: true });
  updateProgress();
  // Immediate persist (respects positionRestored gating)
  scheduleSaveProgress(true);
  if (typeof RecentStore !== 'undefined' && state.currentDocId && state.positionRestored) {
    RecentStore.updateProgress(state.currentDocId, {
      position: state.index,
      positionWord: currentWordText(),
      wpm: state.wpm,
      lastOpened: Date.now()
    }).then(function () { refreshRecentList(); }).catch(function () {});
  }

  if (wasPlaying) {
    startPlayClocks();
    setPlayingUI(true);
    if (state.listenMode && typeof FocusListen !== 'undefined' && FocusListen.supportsSpeech()) {
      FocusListen.speakFromWordIndex(wordListTexts(), state.index, state.wpm);
    } else {
      if (typeof SentenceStrip !== 'undefined' && state.sentenceStripOn) {
        SentenceStrip.startScroll({ wpm: state.wpm, words: wordListTexts(), index: state.index });
      }
      scheduleNext();
    }
  } else {
    setPlayingUI(false);
  }

  if (plan.clamped && plan.clampReason === 'start') showToast('Start of book');
  else if (plan.clamped && plan.clampReason === 'end') showToast('End of book');

  updateJumpScrubUI();
  updateSentenceStrip({ forceInstant: true });
  return plan;
}

function applyJumpScrub() {
  if (!state.jumpPendingSec) return;
  jumpBySeconds(state.jumpPendingSec);
  resetJumpSlider();
}

function undoJump() {
  if (!state.jumpUndoStack.length) return;
  var prev = state.jumpUndoStack.pop();
  var deltaSec = 0;
  if (typeof FocusJump !== 'undefined') {
    // Jump to absolute index via seconds≈0 path: set directly
    var wasPlaying = state.playing;
    stopWordTimer();
    if (typeof FocusListen !== 'undefined') FocusListen.stop(true);
    flushPlayClock();
    state.index = Math.min(totalWords() - 1, Math.max(0, prev));
    state.sentenceWordCount = 0;
    var token = currentToken();
    if (token) renderWord(token.text);
    updateProgress();
    scheduleSaveProgress(true);
    if (typeof RecentStore !== 'undefined' && state.currentDocId && state.positionRestored) {
      RecentStore.updateProgress(state.currentDocId, {
        position: state.index,
        wpm: state.wpm,
        lastOpened: Date.now()
      }).then(function () { refreshRecentList(); }).catch(function () {});
    }
    if (wasPlaying) {
      startPlayClocks();
      setPlayingUI(true);
      if (state.listenMode && typeof FocusListen !== 'undefined') {
        FocusListen.speakFromWordIndex(wordListTexts(), state.index, state.wpm);
      } else scheduleNext();
    } else setPlayingUI(false);
  }
  updateJumpScrubUI();
  showToast('Jump undone');
}

function pastedNameFromText(text) {
  var words = (text || '').trim().split(/\s+/).filter(Boolean).slice(0, 5);
  var head = words.join(' ') || 'Untitled';
  if (head.length > 48) head = head.slice(0, 45) + '…';
  var d = new Date();
  var stamp = d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  return 'Pasted text — ' + head + ' (' + stamp + ')';
}

/**
 * Load text into reader.
 * opts: { toast, persist, name, type, position, docId, resumeNotice, resetElapsed }
 */

/** Flush current book progress synchronously (promise) before switching away. */
function flushCurrentBook() {
  stopWordTimer();
  flushPlayClock();
  if (state.playing) {
    setPlayingUI(false);
    releaseWakeLock();
  }
  if (!state.currentDocId || typeof RecentStore === 'undefined') {
    return Promise.resolve();
  }
  return RecentStore.updateProgress(state.currentDocId, {
    position: state.index,
    positionWord: currentWordText(),
    wpm: state.wpm,
    lastOpened: Date.now()
  }).then(function () {
    return refreshRecentList();
  }).catch(function () {});
}

/**
 * Load text into reader, restoring saved position by content-hash id.
 * Always flushes the previous book first.
 */
function showLoading(msg, frac) {
  var ov = document.getElementById('loadingOverlay');
  var lt = document.getElementById('loadingText');
  var fill = document.getElementById('loadingBarFill');
  if (ov) ov.hidden = false;
  if (lt && msg) lt.textContent = msg;
  if (fill) fill.style.width = Math.round((frac || 0) * 100) + '%';
}

function hideLoading() {
  var ov = document.getElementById('loadingOverlay');
  if (ov) ov.hidden = true;
}

function applyText(text, opts) {
  opts = opts || {};
  var doToast = opts.toast !== false;
  var raw = text || '';

  var run = function () {
    state.positionRestored = false;
    stopWordTimer();
    flushPlayClock();
    setPlayingUI(false);
    if (typeof stopListening === 'function') stopListening(true);
    if (typeof FocusListen !== 'undefined') FocusListen.stop(true);

    var finish = function (tokens, restorePos) {
      state.tokens = tokens || [];
      rebuildWordIndex();
      var total = totalWords();
      var pos = restorePos != null ? restorePos : (opts.position != null ? opts.position : 0);
      if (pos < 0) pos = 0;
      if (total && pos >= total) pos = total - 1;
      var wantWord = opts.positionWord || null;
      if (!wantWord && opts.docId && typeof RecentStore !== 'undefined') {
        /* filled below when doc loaded */
      }
      if (wantWord && total && typeof ORP.findNearestWordIndex === 'function') {
        var texts = [];
        for (var wi = 0; wi < state.wordIndices.length; wi++) texts.push(state.tokens[state.wordIndices[wi]].text);
        pos = ORP.findNearestWordIndex(texts, pos, wantWord, 50);
      }
      state.index = total ? pos : 0;
      state.sentenceWordCount = 0;
      state.positionRestored = true;
      if (typeof FocusListen !== 'undefined') {
        state.bookLang = FocusListen.setDetectedFromText(raw);
        var savedLang = null;
        try {
          var map = JSON.parse(localStorage.getItem('focusReader.bookLang') || '{}');
          if (opts.docId && map[opts.docId]) savedLang = map[opts.docId];
        } catch (e) {}
        if (savedLang) {
          state.langOverride = savedLang;
          FocusListen.setLangOverride(savedLang);
          if (els.langOverride) els.langOverride.value = savedLang;
        } else if (els.langOverride) {
          els.langOverride.value = state.langOverride || '';
          FocusListen.setLangOverride(state.langOverride || '');
        }
      }
      if (opts.resetElapsed !== false) resetElapsedTimers();
      updateVoiceLimitUI();
      if (typeof updateJumpScrubUI === 'function') updateJumpScrubUI();
      refreshJumpButtonTitles();

      if (opts.driveFileId) state.currentDriveFileId = opts.driveFileId;

      if (total) {
        renderWord(state.tokens[state.wordIndices[state.index]].text);
        els.statusLabel.textContent = 'Ready';
        if (doToast && !opts.resumeNotice) {
          var msg = total.toLocaleString() + ' words loaded';
          if (state.index > 0) msg += ' · resumed at ' + (state.index + 1);
          showToast(msg);
        }
      } else {
        renderWord(null);
        els.placeholder.textContent = 'Paste or import text, then press Play';
        els.statusLabel.textContent = 'Ready';
      }
      updateProgress();
      hideLoading();

      var afterUi = Promise.resolve();
      if (opts.persist !== false && raw && String(raw).trim() && typeof RecentStore !== 'undefined') {
        var name = opts.name || pastedNameFromText(raw);
        var type = opts.type || 'paste';
        afterUi = RecentStore.upsertDocument({
          name: name,
          type: type,
          text: raw,
          wordCount: total,
          position: state.index,
          wpm: state.wpm,
          keepPosition: state.index === 0 && !opts.resetPosition,
          resetPosition: !!opts.resetPosition
        }).then(function (doc) {
          if (opts.driveFileId) {
            doc.driveFileId = opts.driveFileId;
            doc.driveFileName = name;
            doc.source = 'drive-library';
            return RecentStore.put(doc).then(function (saved) {
              if (typeof FocusSync !== 'undefined') {
                FocusSync.notifyLocalChange('book', saved);
                FocusSync.notifyLocalChange('progress', saved);
              }
              return saved;
            });
          }
          return doc;
        }).then(function (doc) {
          state.currentDocId = doc.id;
          state.currentDocName = doc.name;
          state.currentDocType = doc.type;
          updateSourceLabel();
          // Ensure stored position matches restored index (don't write 0 over real progress)
          if ((doc.position || 0) !== state.index && state.index > 0) {
            return RecentStore.updateProgress(doc.id, {
              position: state.index,
              wpm: state.wpm,
              lastOpened: Date.now()
            }).then(function () { return refreshRecentList(); });
          }
          return refreshRecentList();
        }).catch(function (err) { console.error(err); });
      } else if (opts.docId) {
        state.currentDocId = opts.docId;
        state.currentDocName = opts.name || null;
        state.currentDocType = opts.type || null;
      }

      // Set display name immediately (upsert is async)
      if (opts.name) {
        state.currentDocName = opts.name;
        state.currentDocType = opts.type || state.currentDocType || 'library';
      } else if (!state.currentDocName && raw && String(raw).trim()) {
        state.currentDocName = 'Pasted text';
        state.currentDocType = state.currentDocType || 'paste';
      }
      updateSourceLabel();
      if (opts.resumeNotice && opts.name) {
        showToast('Resumed: ' + opts.name + ' at word ' + (state.index + 1));
      }
      return afterUi;
    };

    var resolvePosition = function () {
      if (opts.position != null && opts.position > 0) return Promise.resolve(opts.position);
      if (opts.docId && opts.position != null) return Promise.resolve(opts.position);
      if (!raw || !String(raw).trim() || typeof RecentStore === 'undefined') {
        return Promise.resolve(opts.position != null ? opts.position : 0);
      }
      return RecentStore.hashText(raw).then(function (id) {
        return RecentStore.get(id).then(function (existing) {
          if (existing && (existing.position || 0) > 0 && !opts.resetPosition) {
            if (existing.positionWord) opts.positionWord = existing.positionWord;
            return existing.position;
          }
          return opts.position != null ? opts.position : 0;
        });
      });
    };

    return resolvePosition().then(function (restorePos) {
      var approxWords = raw.length / 5;
      if (approxWords > 20000 && tokenizeAsync) {
        showLoading('Preparing book…', 0.02);
        return tokenizeAsync(raw, function (frac) {
          showLoading('Tokenizing… ' + Math.round(frac * 100) + '%', frac);
        }).then(function (tokens) {
          return finish(tokens, restorePos);
        }).catch(function (err) {
          console.error(err);
          hideLoading();
          showToast('Could not load book');
        });
      }
      return finish(tokenize(raw), restorePos);
    });
  };

  // Flush previous book before loading a new one (unless skipFlush)
  if (opts.skipFlush) return Promise.resolve().then(run);
  return flushCurrentBook().then(run);
}


async function extractPdfText(arrayBuffer) {
  if (typeof pdfjsLib === 'undefined') throw new Error('pdf.js not loaded');
  var isHttp = location.protocol === 'http:' || location.protocol === 'https:';
  if (isHttp) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.min.js';
  } else if (typeof __PDFJS_WORKER_BLOB_URL__ !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = __PDFJS_WORKER_BLOB_URL__;
  } else if (!pdfjsLib.GlobalWorkerOptions.workerSrc && typeof __PDFJS_WORKER_BLOB_URL__ !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = __PDFJS_WORKER_BLOB_URL__;
  }
  var doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  var parts = [];
  for (var i = 1; i <= doc.numPages; i++) {
    var page = await doc.getPage(i);
    var content = await page.getTextContent();
    parts.push(content.items.map(function (it) { return it.str; }).join(' '));
  }
  return parts.join('\n\n');
}

async function loadFile(file) {
  if (!file) return;
  var name = file.name;
  var lower = name.toLowerCase();
  var type = 'txt';
  if (lower.endsWith('.pdf')) type = 'pdf';
  else if (lower.endsWith('.md')) type = 'md';
  try {
    var text;
    if (type === 'pdf' || file.type === 'application/pdf') {
      showToast('Extracting PDF…');
      var buf = await file.arrayBuffer();
      text = await extractPdfText(buf);
      type = 'pdf';
    } else {
      text = await file.text();
    }
    text = (text || '').trim();
    els.source.value = text;
    applyText(text, { toast: true, persist: true, name: name, type: type });
  } catch (err) {
    console.error(err);
    showToast('Could not read that file');
  }
}

function scheduleSaveProgress(force) {
  // Never persist a fresh 0 before restore has completed (avoids wiping real progress)
  if (!state.positionRestored) return;
  if (!state.currentDocId || typeof RecentStore === 'undefined') return;
  clearTimeout(state.saveTimer);
  var run = function () {
    RecentStore.updateProgress(state.currentDocId, {
      position: state.index,
      positionWord: currentWordText(),
      wpm: state.wpm,
      lastOpened: Date.now()
    }).then(function () {
      refreshRecentList();
    }).catch(function () {});
  };
  if (force) run();
  else state.saveTimer = setTimeout(run, SAVE_THROTTLE_MS);
}

function estimateLeftLabel(doc) {
  if (!doc || !doc.text || !doc.wordCount) return '';
  try {
    var tokens = tokenize(doc.text);
    var indices = [];
    tokens.forEach(function (t, i) { if (t.type === 'word') indices.push(i); });
    var pos = Math.min(doc.position || 0, Math.max(0, indices.length - 1));
    var ms = estimateRemainingMs(tokens, indices, pos, state.wpm, timingOpts());
    return formatDuration(ms) + ' left';
  } catch (e) {
    return '';
  }
}

function refreshRecentList() {
  if (!els.recentList || typeof RecentStore === 'undefined') return Promise.resolve();
  return RecentStore.list().then(function (rows) {
    els.recentList.innerHTML = '';
    if (!rows.length) {
      if (els.recentEmpty) els.recentEmpty.hidden = false;
      return;
    }
    if (els.recentEmpty) els.recentEmpty.hidden = true;
    rows.forEach(function (doc) {
      var li = document.createElement('li');
      li.className = 'recent-item' + (doc.id === state.currentDocId ? ' active' : '');
      li.setAttribute('data-id', doc.id);
      var pct = doc.wordCount ? Math.round(((doc.position || 0) + 1) / doc.wordCount * 100) : 0;
      if (pct > 100) pct = 100;
      var left = estimateLeftLabel(doc);
      li.innerHTML =
        '<button type="button" class="recent-main">' +
          '<span class="recent-name"></span>' +
          '<span class="recent-meta"></span>' +
        '</button>' +
        '<button type="button" class="recent-remove" title="Remove" aria-label="Remove">×</button>';
      var nameEl = li.querySelector('.recent-name');
      nameEl.textContent = doc.name;
      if (doc.cloudOnly) {
        var badge = document.createElement('span');
        badge.className = 'cloud-badge';
        badge.textContent = '☁';
        badge.title = 'On Google Drive — tap to download';
        nameEl.appendChild(badge);
      }
      li.querySelector('.recent-meta').textContent =
        pct + '% · word ' + ((doc.position || 0) + 1) + '/' + (doc.wordCount || 0) +
        ' · ' + formatDateTime(doc.lastOpened) +
        (left ? ' · ' + left : '');
      li.querySelector('.recent-main').addEventListener('click', function () {
        openRecentDoc(doc.id);
      });
      li.querySelector('.recent-remove').addEventListener('click', function (e) {
        e.stopPropagation();
        RecentStore.remove(doc.id).then(function () {
          if (state.currentDocId === doc.id) {
            state.currentDocId = null;
          }
          refreshRecentList();
          showToast('Removed from recent');
        });
      });
      els.recentList.appendChild(li);
    });
  });
}

function openRecentDoc(id) {
  RecentStore.get(id).then(function (doc) {
    if (!doc) return;
    var ready = Promise.resolve(doc);
    if (doc.cloudOnly || !doc.text) {
      showToast('Downloading from Drive…');
      if (typeof FocusSync !== 'undefined' && FocusSync.syncNow) {
        ready = FocusSync.syncNow().then(function () {
          return RecentStore.get(id);
        });
      }
    }
    ready.then(function (doc2) {
      if (!doc2 || !doc2.text) {
        showToast('Could not load book text');
        return;
      }
      els.source.value = doc2.text || '';
      if (doc2.wpm) setWpm(doc2.wpm, true, true);
      applyText(doc2.text, {
        toast: false,
        persist: true,
        docId: doc2.id,
        name: doc2.name,
        type: doc2.type,
        position: doc2.position || 0,
        resumeNotice: true,
        resetElapsed: true
      });
    });
  });
}

function resumeMostRecentOnStartup() {
  if (typeof RecentStore === 'undefined') return Promise.resolve();
  return RecentStore.list().then(function (rows) {
    refreshRecentList();
    if (!rows.length) return;
    var doc = rows[0];
    els.source.value = doc.text || '';
    if (doc.wpm) setWpm(doc.wpm, true, true);
    applyText(doc.text, {
      toast: false,
      persist: false,
      docId: doc.id,
      name: doc.name,
      type: doc.type,
      position: doc.position || 0,
      resumeNotice: true,
      resetElapsed: true
    });
  });
}

/* ——— Session timer controls ——— */
function loadSessionPrefs() {
  try {
    var mins = parseFloat(localStorage.getItem(LS_SESSION_MIN));
    if (isFinite(mins) && mins > 0) {
      state.sessionDurationMs = mins * 60 * 1000;
      els.sessionCustomMin.value = String(mins);
    }
    var beep = localStorage.getItem(LS_BEEP);
    if (beep != null) {
      state.beepEnabled = beep !== '0';
      els.beepToggle.checked = state.beepEnabled;
    }
  } catch (e) { /* file:// private mode etc. */ }
  highlightPreset();
}

function saveSessionPrefs() {
  try {
    localStorage.setItem(LS_SESSION_MIN, String(state.sessionDurationMs / 60000));
    localStorage.setItem(LS_BEEP, state.beepEnabled ? '1' : '0');
  } catch (e) {}
}

function highlightPreset() {
  var mins = state.sessionDurationMs / 60000;
  var chips = els.sessionPresets.querySelectorAll('.btn-chip');
  chips.forEach(function (btn) {
    var v = parseFloat(btn.getAttribute('data-min'));
    btn.classList.toggle('active', Math.abs(v - mins) < 0.001);
  });
}

function startSessionCountdown() {
  var mins = parseFloat(els.sessionCustomMin.value);
  if (!isFinite(mins) || mins <= 0) mins = 15;
  state.sessionDurationMs = mins * 60 * 1000;
  state.sessionRemainingMs = state.sessionDurationMs;
  state.sessionActive = true;
  state.sessionTickAt = state.playing ? Date.now() : null;
  if (els.sessionBanner) els.sessionBanner.hidden = true;
  saveSessionPrefs();
  highlightPreset();
  updateTimerDisplays();
  showToast('Session ' + mins + ' min started');
}

function resetSessionCountdown() {
  if (!state.sessionActive) {
    startSessionCountdown();
    return;
  }
  state.sessionRemainingMs = state.sessionDurationMs;
  state.sessionTickAt = state.playing ? Date.now() : null;
  if (els.sessionBanner) els.sessionBanner.hidden = true;
  updateTimerDisplays();
}

function offSessionCountdown() {
  state.sessionActive = false;
  state.sessionRemainingMs = 0;
  state.sessionTickAt = null;
  if (els.sessionBanner) els.sessionBanner.hidden = true;
  updateTimerDisplays();
}

function ensureUiTick() {
  if (state.uiTick) return;
  state.uiTick = setInterval(function () {
    updateTimerDisplays();
    checkSessionDuringTick();
    if (!state.playing && !state.sessionActive) {
      /* keep ticking lightly for display consistency */
    }
  }, 250);
}


/* ——— Wake Lock / Focus / Touch ——— */
function requestWakeLock() {
  if (!navigator.wakeLock || !navigator.wakeLock.request) return;
  navigator.wakeLock.request('screen').then(function (lock) {
    state.wakeLock = lock;
    lock.addEventListener('release', function () { state.wakeLock = null; });
  }).catch(function () { state.wakeLock = null; });
}

function releaseWakeLock() {
  if (state.wakeLock) {
    try { state.wakeLock.release(); } catch (e) {}
    state.wakeLock = null;
  }
}

function setFocusMode(on) {
  state.focusMode = !!on;
  document.body.classList.toggle('focus-mode', state.focusMode);
  if (els.btnFocus) {
    els.btnFocus.setAttribute('aria-pressed', state.focusMode ? 'true' : 'false');
    els.btnFocus.textContent = state.focusMode ? 'Exit focus' : 'Focus';
  }
  if (state.focusMode) {
    var root = document.documentElement;
    if (root.requestFullscreen) {
      root.requestFullscreen().catch(function () {});
    } else if (root.webkitRequestFullscreen) {
      try { root.webkitRequestFullscreen(); } catch (e) {}
    }
  } else if (document.fullscreenElement || document.webkitFullscreenElement) {
    if (document.exitFullscreen) document.exitFullscreen().catch(function () {});
    else if (document.webkitExitFullscreen) {
      try { document.webkitExitFullscreen(); } catch (e) {}
    }
  }
  // re-fit current word after layout change
  var token = currentToken();
  if (token) renderWord(token.text);
}

function toggleFocusMode() {
  setFocusMode(!state.focusMode);
}

function setupAccordionsForViewport() {
  var narrow = window.matchMedia('(max-width: 720px)').matches;
  var landscapeShort = window.matchMedia('(max-height: 480px) and (orientation: landscape)').matches;
  ['panelLibrary', 'panelTimer', 'panelRecent', 'panelSync', 'panelOrp'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (narrow || landscapeShort) el.open = false;
    else el.open = true;
  });
  var text = document.getElementById('panelText');
  if (text) text.open = true;
  var lib = document.getElementById('panelLibrary');
  if (lib) lib.open = true;
}

function setupTouchGestures() {
  var stage = els.stage;
  if (!stage) return;
  var startX = 0, startY = 0, startT = 0, moved = false, longTimer = null;
  var suppressClickUntil = 0;
  var activePointer = null;

  function clearLong() {
    if (longTimer) { clearTimeout(longTimer); longTimer = null; }
  }

  function onGestureEnd(x, y, fromTouch) {
    clearLong();
    if (fromTouch) suppressClickUntil = Date.now() + 1200;
    var dx = x - startX;
    var dy = y - startY;
    var adx = Math.abs(dx), ady = Math.abs(dy);
    var dt = Date.now() - startT;
    if (!moved && adx < 24 && ady < 24 && dt < 700) {
      togglePlay();
      return;
    }
    if (adx < 40 && ady < 40) return;
    if (adx > ady) {
      if (dx < 0) skip(5);
      else skip(-5);
    } else {
      if (dy < 0) setWpm(state.wpm + 25);
      else setWpm(state.wpm - 25);
    }
  }

  stage.addEventListener('pointerdown', function (e) {
    if (e.button != null && e.button !== 0) return;
    if (activePointer != null) return;
    activePointer = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    startT = Date.now();
    moved = false;
    clearLong();
    try { stage.setPointerCapture(e.pointerId); } catch (err) {}
    longTimer = setTimeout(function () {
      setFocusMode(!state.focusMode);
      moved = true;
      showToast(state.focusMode ? 'Focus mode' : 'Focus off');
    }, 550);
  });

  stage.addEventListener('pointermove', function (e) {
    if (activePointer == null || e.pointerId !== activePointer) return;
    if (Math.abs(e.clientX - startX) > 12 || Math.abs(e.clientY - startY) > 12) {
      moved = true;
      clearLong();
    }
  });

  stage.addEventListener('pointerup', function (e) {
    if (activePointer == null || e.pointerId !== activePointer) return;
    activePointer = null;
    onGestureEnd(e.clientX, e.clientY, e.pointerType === 'touch');
  });

  stage.addEventListener('pointercancel', function (e) {
    if (activePointer == null || e.pointerId !== activePointer) return;
    activePointer = null;
    clearLong();
    if (e.pointerType === 'touch') suppressClickUntil = Date.now() + 1200;
  });

  stage.addEventListener('touchstart', function (e) {
    if (window.PointerEvent) return; // modern path
    if (!e.touches || e.touches.length !== 1) return;
    var t = e.touches[0];
    startX = t.clientX; startY = t.clientY; startT = Date.now(); moved = false;
    clearLong();
    longTimer = setTimeout(function () {
      setFocusMode(!state.focusMode); moved = true;
      showToast(state.focusMode ? 'Focus mode' : 'Focus off');
    }, 550);
  }, { passive: true });

  stage.addEventListener('touchmove', function (e) {
    if (window.PointerEvent) return;
    if (!e.touches || e.touches.length !== 1) return;
    var t = e.touches[0];
    if (Math.abs(t.clientX - startX) > 12 || Math.abs(t.clientY - startY) > 12) {
      moved = true; clearLong();
    }
  }, { passive: true });

  stage.addEventListener('touchend', function (e) {
    if (window.PointerEvent) return;
    suppressClickUntil = Date.now() + 1200;
    var touch = e.changedTouches && e.changedTouches[0];
    if (!touch) return;
    try { e.preventDefault(); } catch (err) {}
    onGestureEnd(touch.clientX, touch.clientY, true);
  }, { passive: false });

  stage.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('button')) return;
    if (Date.now() < suppressClickUntil) return;
    if (Date.now() - startT < 800) return;
    togglePlay();
  });
}

/* ——— Events ——— */
els.btnPlay.addEventListener('click', togglePlay);
els.btnRestart.addEventListener('click', restart);

function bindHoldRepeat(btn, fn) {
  if (!btn) return;
  var timer = null;
  var delayTimer = null;
  var start = function (e) {
    e.preventDefault();
    fn();
    clearTimeout(delayTimer);
    clearInterval(timer);
    delayTimer = setTimeout(function () {
      timer = setInterval(fn, 120);
    }, 380);
  };
  var stop = function () {
    clearTimeout(delayTimer);
    clearInterval(timer);
  };
  btn.addEventListener('pointerdown', start);
  btn.addEventListener('pointerup', stop);
  btn.addEventListener('pointerleave', stop);
  btn.addEventListener('pointercancel', stop);
}
bindHoldRepeat(els.btnWpmDown, function () { setWpm(state.wpm - 5); });

bindHoldRepeat(els.btnWpmUp, function () { setWpm(state.wpm + 5); });

/* Jump panel wiring */
(function wireJumpPanel() {
  refreshJumpButtonTitles();
  document.querySelectorAll('[data-jump-sec]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sec = Number(btn.getAttribute('data-jump-sec'));
      jumpBySeconds(sec);
      resetJumpSlider();
    });
  });
  if (els.jumpSlider) {
    els.jumpSlider.addEventListener('input', updateJumpScrubUI);
    els.jumpSlider.addEventListener('change', updateJumpScrubUI);
    els.jumpSlider.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyJumpScrub();
      }
    });
  }
  if (els.btnJumpApply) els.btnJumpApply.addEventListener('click', applyJumpScrub);
  if (els.btnJumpCancel) els.btnJumpCancel.addEventListener('click', resetJumpSlider);
  if (els.btnJumpUndo) els.btnJumpUndo.addEventListener('click', undoJump);
  updateJumpScrubUI();
})();



function loadNaturalPausesPref() {
  try {
    var v = localStorage.getItem(LS_NATURAL_PAUSES);
    state.naturalPauses = v === '1';
  } catch (e) { state.naturalPauses = false; }
  applyNaturalPausesUI();
}

function saveNaturalPausesPref() {
  try { localStorage.setItem(LS_NATURAL_PAUSES, state.naturalPauses ? '1' : '0'); } catch (e) {}
  if (typeof FocusSync !== 'undefined' && FocusSync.notifySettings) {
    FocusSync.notifySettings({ naturalPauses: state.naturalPauses, theme: state.theme, sentenceStrip: state.sentenceStripOn, updatedAt: Date.now() });
  }
}

function applyNaturalPausesUI() {
  if (els.btnNaturalPauses) {
    els.btnNaturalPauses.classList.toggle('active', state.naturalPauses);
    els.btnNaturalPauses.setAttribute('aria-pressed', state.naturalPauses ? 'true' : 'false');
  }
}

function setNaturalPauses(on) {
  state.naturalPauses = !!on;
  applyNaturalPausesUI();
  saveNaturalPausesPref();
  // Reset scheduler epoch so pace changes cleanly
  if (state.playing && !state.listenMode) {
    state.schedT0 = null;
    state.schedCumMs = 0;
    state.schedN = 0;
  }
  updateTimerDisplays();
}

function loadThemePref() {
  try {
    var t = localStorage.getItem(LS_THEME) || 'dark';
    if (t !== 'dark' && t !== 'black' && t !== 'white') t = 'dark';
    state.theme = t;
  } catch (e) { state.theme = 'dark'; }
  applyTheme(state.theme, true);
}

function applyTheme(theme, skipSave) {
  theme = theme || 'dark';
  if (theme !== 'dark' && theme !== 'black' && theme !== 'white') theme = 'dark';
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  var meta = document.querySelector('meta[name="theme-color"]');
  var colors = { dark: '#0b0d12', black: '#000000', white: '#f4f5f7' };
  if (meta) meta.setAttribute('content', colors[theme] || colors.dark);
  if (els.themeSelect) els.themeSelect.value = theme;
  if (els.btnTheme) {
    els.btnTheme.textContent = theme === 'white' ? 'White' : (theme === 'black' ? 'Black' : 'Dark');
    els.btnTheme.title = 'Theme: ' + theme;
  }
  if (!skipSave) {
    try { localStorage.setItem(LS_THEME, theme); } catch (e) {}
    if (typeof FocusSync !== 'undefined' && FocusSync.notifySettings) {
      FocusSync.notifySettings({ theme: theme, naturalPauses: state.naturalPauses, sentenceStrip: state.sentenceStripOn, updatedAt: Date.now() });
    }
  }
}

function cycleTheme() {
  var order = ['dark', 'black', 'white'];
  var i = order.indexOf(state.theme);
  applyTheme(order[(i + 1) % order.length]);
}

function setListenMode(on) {
  state.listenMode = !!on;
  if (els.btnListen) {
    els.btnListen.classList.toggle('active', state.listenMode);
    els.btnListen.setAttribute('aria-pressed', state.listenMode ? 'true' : 'false');
  }
  if (els.listenVoiceRow) {
    // Keep selectors visible for picking a voice before enabling Listen
    els.listenVoiceRow.hidden = false;
  }
  if (typeof FocusListen !== 'undefined') FocusListen.setListen(state.listenMode);
  updateVoiceLimitUI();
  if (state.playing) {
    // switch modes mid-play
    stopWordTimer();
    if (typeof FocusListen !== 'undefined') FocusListen.stop(true);
    if (state.listenMode && typeof FocusListen !== 'undefined' && FocusListen.supportsSpeech()) {
      FocusListen.speakFromWordIndex(
        state.wordIndices.map(function (ti) { return state.tokens[ti].text; }),
        state.index,
        state.wpm
      );
    } else if (state.listenMode) {
      showToast('Speech synthesis not available in this browser');
      setListenMode(false);
      scheduleNext();
    } else {
      scheduleNext();
    }
  }
}
if (els.btnListen) {
  els.btnListen.addEventListener('click', function () {
    setListenMode(!state.listenMode);
  });
}
if (els.btnNaturalPauses) {
  els.btnNaturalPauses.addEventListener('click', function () {
    setNaturalPauses(!state.naturalPauses);
  });
}
if (els.btnTheme) {
  els.btnTheme.addEventListener('click', function () { cycleTheme(); });
}
if (els.themeSelect) {
  els.themeSelect.addEventListener('change', function () {
    applyTheme(els.themeSelect.value);
  });
}


function populateVoiceSelect() {
  if (!els.voiceSelect || typeof FocusListen === 'undefined') return;
  var voices = FocusListen.loadVoices(true);
  if (!voices.length) voices = FocusListen.getVoices();
  var prev = els.voiceSelect.value || (FocusListen.getVoiceURI && FocusListen.getVoiceURI()) || '';
  els.voiceSelect.innerHTML = '';
  var ph = document.createElement('option');
  ph.value = '';
  ph.textContent = voices.length ? 'Auto (best available)' : 'System voice (loading…)';
  els.voiceSelect.appendChild(ph);
  var groups = {};
  voices.forEach(function (v) {
    var lang = (v.lang || 'und').slice(0, 2);
    if (!groups[lang]) groups[lang] = [];
    groups[lang].push(v);
  });
  Object.keys(groups).sort().forEach(function (lang) {
    var og = document.createElement('optgroup');
    og.label = lang;
    groups[lang]
      .slice()
      .sort(function (a, b) {
        var ta = FocusListen.voiceQualityTag ? FocusListen.voiceQualityTag(a) : '';
        var tb = FocusListen.voiceQualityTag ? FocusListen.voiceQualityTag(b) : '';
        var rank = { Natural: 0, Enhanced: 1, Standard: 2 };
        return (rank[ta] || 9) - (rank[tb] || 9);
      })
      .forEach(function (v) {
        var opt = document.createElement('option');
        opt.value = v.voiceURI;
        var tag = FocusListen.voiceQualityTag ? FocusListen.voiceQualityTag(v) : 'Standard';
        opt.textContent = v.name + ' · ' + tag + (v.localService ? '' : ' · online');
        og.appendChild(opt);
      });
    els.voiceSelect.appendChild(og);
  });
  if (prev) els.voiceSelect.value = prev;
}
if (typeof FocusListen !== 'undefined') {
  FocusListen.on('voices', populateVoiceSelect);
  FocusListen.on('word', function (wi) {
    if (!state.listenMode || !state.playing) return;
    if (wi < 0) return;
    if (wi > state.index) state.wordsReadSession += (wi - state.index);
    state.index = Math.min(totalWords() - 1, Math.max(0, wi));
    var token = currentToken();
    if (token) renderWord(token.text, { reanchor: false });
    updateProgress();
    scheduleSaveProgress(false);
  });
  FocusListen.on('pace', function (info) {
    if (info && info.wps > 0) {
      state.listenWps = info.wps;
      if (typeof SentenceStrip !== 'undefined' && state.playing) {
        SentenceStrip.startScroll({ listenWps: state.listenWps, wpm: state.wpm, words: wordListTexts(), index: state.index });
      }
    }
  });
  FocusListen.on('end', function () {
    if (!state.listenMode) return;
    if (typeof SentenceStrip !== 'undefined') SentenceStrip.stopScroll(true);
    setPlayingUI(false);
    releaseWakeLock();
    flushPlayClock();
    scheduleSaveProgress(true);
    showToast('Finished');
  });
  populateVoiceSelect();
}
if (els.voiceSelect) {
  els.voiceSelect.addEventListener('change', function () {
    if (typeof FocusListen !== 'undefined') FocusListen.setVoiceURI(els.voiceSelect.value);
    if (state.listenMode && state.playing) {
      FocusListen.speakFromWordIndex(
        state.wordIndices.map(function (ti) { return state.tokens[ti].text; }),
        state.index,
        state.wpm
      );
    }
  });
}
if (els.langOverride) {
  els.langOverride.addEventListener('change', function () {
    state.langOverride = els.langOverride.value || '';
    if (typeof FocusListen !== 'undefined') FocusListen.setLangOverride(state.langOverride);
    if (state.currentDocId) {
      try {
        var map = JSON.parse(localStorage.getItem('focusReader.bookLang') || '{}');
        if (state.langOverride) map[state.currentDocId] = state.langOverride;
        else delete map[state.currentDocId];
        localStorage.setItem('focusReader.bookLang', JSON.stringify(map));
      } catch (e) {}
    }
    updateVoiceLimitUI();
    if (state.listenMode && state.playing) {
      FocusListen.speakFromWordIndex(
        state.wordIndices.map(function (ti) { return state.tokens[ti].text; }),
        state.index,
        state.wpm
      );
    }
  });
}

function updateVoiceLimitUI() {
  var lim = 300;
  if (typeof VoiceLimit !== 'undefined') {
    lim = VoiceLimit.getLimit(state.langOverride || state.bookLang);
  }
  var min = Number(els.wpmRange.min) || 100;
  var max = Number(els.wpmRange.max) || 1000;
  var pct = ((lim - min) / (max - min)) * 100;
  if (pct < 0) pct = 0;
  if (pct > 100) pct = 100;
  if (els.voiceLimitTrack) {
    els.voiceLimitTrack.hidden = !state.listenMode;
  }
  if (els.voiceLimitZone) {
    els.voiceLimitZone.style.left = pct + '%';
    els.voiceLimitZone.style.width = (100 - pct) + '%';
  }
  if (els.voiceLimitTick) {
    els.voiceLimitTick.style.left = pct + '%';
  }
  if (els.voiceLimitLabel) {
    els.voiceLimitLabel.textContent = 'voice limit ~' + lim + ' WPM';
  }
  if (els.voiceLimitHint) {
    els.voiceLimitHint.hidden = !state.listenMode;
    els.voiceLimitHint.textContent = state.listenMode ? ('limit ~' + lim) : '';
  }
  var over = state.listenMode && state.wpm > lim;
  if (els.wpmDisplay) els.wpmDisplay.classList.toggle('wpm-over-limit', over);
  if (els.wpmInput) els.wpmInput.classList.toggle('wpm-over-limit', over);
}

// Periodic voice-limit learning tick
setInterval(function () {
  if (!state.listenMode || !state.playing || typeof VoiceLimit === 'undefined') return;
  VoiceLimit.tick(state.wpm, state.langOverride || state.bookLang, true);
  updateVoiceLimitUI();
}, 1000);

els.btnLoadSample.addEventListener('click', function () {
  els.source.value = SAMPLE_TEXT;
  applyText(SAMPLE_TEXT, {
    toast: true,
    persist: true,
    name: 'Sample text',
    type: 'sample'
  });
});

els.btnApply.addEventListener('click', function () {
  applyText(els.source.value, { toast: true, persist: true, type: 'paste' });
});

els.btnClear.addEventListener('click', function () {
  els.source.value = '';
  stopWordTimer();
  flushPlayClock();
  state.tokens = [];
  state.wordIndices = [];
  state.index = 0;
  state.currentDocId = null;
  state.currentDocName = null;
  resetElapsedTimers();
  setPlayingUI(false);
  renderWord(null);
  els.placeholder.textContent = 'Paste or import text, then press Play';
  updateProgress();
  refreshRecentList();
});

els.wpmRange.addEventListener('input', function () {
  setWpm(els.wpmRange.value, false);
  els.wpmInput.value = String(state.wpm);
});
els.wpmInput.addEventListener('change', function () { setWpm(els.wpmInput.value); });
els.wpmInput.addEventListener('input', function () {
  var v = Number(els.wpmInput.value);
  if (!Number.isNaN(v)) {
    els.wpmDisplay.textContent = String(clampWpm(v));
    els.wpmRange.value = String(clampWpm(v));
    state.wpm = clampWpm(v);
    updateTimerDisplays();
  }
});

els.dropzone.addEventListener('click', function () { els.fileInput.click(); });
els.dropzone.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    els.fileInput.click();
  }
});
els.fileInput.addEventListener('change', function () {
  var f = els.fileInput.files && els.fileInput.files[0];
  loadFile(f);
  els.fileInput.value = '';
});

['dragenter', 'dragover'].forEach(function (ev) {
  els.dropzone.addEventListener(ev, function (e) {
    e.preventDefault();
    e.stopPropagation();
    els.dropzone.classList.add('dragover');
  });
});
['dragleave', 'drop'].forEach(function (ev) {
  els.dropzone.addEventListener(ev, function (e) {
    e.preventDefault();
    e.stopPropagation();
    els.dropzone.classList.remove('dragover');
  });
});
els.dropzone.addEventListener('drop', function (e) {
  var f = e.dataTransfer.files && e.dataTransfer.files[0];
  loadFile(f);
});

document.addEventListener('keydown', function (e) {
  var tag = (e.target && e.target.tagName) || '';
  if (tag === 'TEXTAREA' || tag === 'INPUT') {
    if (tag === 'TEXTAREA') return;
    if (e.code !== 'ArrowUp' && e.code !== 'ArrowDown') return;
  }
  if (e.code === 'Space') {
    e.preventDefault();
    togglePlay();
  } else if (e.key === 'f' || e.key === 'F') {
    e.preventDefault();
    toggleFocusMode();
  } else if (e.code === 'ArrowLeft') {
    e.preventDefault();
    skip(-5);
  } else if (e.code === 'ArrowRight') {
    e.preventDefault();
    skip(5);
  } else if (e.code === 'ArrowUp') {
    e.preventDefault();
    setWpm(state.wpm + (e.shiftKey ? 25 : 5));
  } else if (e.code === 'ArrowDown') {
    e.preventDefault();
    setWpm(state.wpm - (e.shiftKey ? 25 : 5));
  } else if (e.key === '[' || e.code === 'BracketLeft') {
    e.preventDefault();
    jumpBySeconds(e.shiftKey ? -60 : -10);
    resetJumpSlider();
  } else if (e.key === ']' || e.code === 'BracketRight') {
    e.preventDefault();
    jumpBySeconds(e.shiftKey ? 60 : 10);
    resetJumpSlider();
  }
});

els.sessionPresets.addEventListener('click', function (e) {
  var btn = e.target.closest('[data-min]');
  if (!btn) return;
  var mins = parseFloat(btn.getAttribute('data-min'));
  els.sessionCustomMin.value = String(mins);
  state.sessionDurationMs = mins * 60 * 1000;
  highlightPreset();
  saveSessionPrefs();
});

els.btnSessionStart.addEventListener('click', startSessionCountdown);
els.btnSessionReset.addEventListener('click', resetSessionCountdown);
els.btnSessionOff.addEventListener('click', offSessionCountdown);
els.beepToggle.addEventListener('change', function () {
  state.beepEnabled = !!els.beepToggle.checked;
  saveSessionPrefs();
});
els.sessionCustomMin.addEventListener('change', function () {
  var mins = parseFloat(els.sessionCustomMin.value);
  if (isFinite(mins) && mins > 0) {
    state.sessionDurationMs = mins * 60 * 1000;
    saveSessionPrefs();
    highlightPreset();
  }
});

if (els.btnClearRecent) {
  els.btnClearRecent.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    RecentStore.clearAll().then(function () {
      state.currentDocId = null;
      refreshRecentList();
      showToast('Recent list cleared');
    });
  });
}


window.addEventListener('beforeunload', function () {
  scheduleSaveProgress(true);
  flushCurrentBook();
});
window.addEventListener('pagehide', function () {
  scheduleSaveProgress(true);
  flushCurrentBook();
});
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') {
    scheduleSaveProgress(true);
    flushCurrentBook();
  }
});

void ORP_TABLE;
void alphaLength;

// Test / automation hook
window.__FOCUS_READER__ = {
  timingOpts: timingOpts,
  getNaturalPauses: function () { return state.naturalPauses; },
  setNaturalPauses: setNaturalPauses,
  getTheme: function () { return state.theme; },
  setTheme: applyTheme,

  getState: function () {
    return {
      playing: state.playing,
      index: state.index,
      total: totalWords(),
      wpm: state.wpm,
      elapsedMs: liveElapsedMs(),
      remainingMs: totalWords()
        ? estimateRemainingMs(state.tokens, state.wordIndices, state.index, state.wpm, timingOpts())
        : 0,
      totalEstMs: totalWords()
        ? estimateRemainingMs(state.tokens, state.wordIndices, 0, state.wpm, timingOpts())
        : 0,
      naturalPauses: state.naturalPauses,
      theme: state.theme,
      currentDocName: state.currentDocName,
      sessionActive: state.sessionActive,
      sessionRemainingMs: liveSessionRemainingMs(),
      wordsReadSession: state.wordsReadSession,
      currentDocId: state.currentDocId,
      currentDocName: state.currentDocName,
      bannerVisible: els.sessionBanner && !els.sessionBanner.hidden,
      listenMode: state.listenMode,
      positionRestored: state.positionRestored
    };
  },
  setListenMode: function (on) { setListenMode(!!on); },
  setSentenceStripOn: setSentenceStripOn,
  updateSentenceStrip: updateSentenceStrip,
  getStripAlign: function () {
    if (typeof SentenceStrip === 'undefined' || !els.wordOrp) return null;
    var stripOrp = els.sentenceStripTrack && els.sentenceStripTrack.querySelector('.strip-word.is-current .strip-orp');
    return SentenceStrip.measureAlignment(els.wordOrp, stripOrp);
  },
  jumpBySeconds: jumpBySeconds,
  applyJumpScrub: applyJumpScrub,
  undoJump: undoJump,
  resetJumpSlider: resetJumpSlider,
  getJumpPending: function () {
    return {
      seconds: state.jumpPendingSec,
      plan: typeof FocusJump !== 'undefined'
        ? FocusJump.planJump(state.index, totalWords(), state.jumpPendingSec, state.wpm)
        : null
    };
  },
  setJumpSlider: function (v) {
    if (els.jumpSlider) {
      els.jumpSlider.value = String(v);
      updateJumpScrubUI();
    }
  },
  setIndex: function (i) {
    if (!totalWords()) return;
    state.index = Math.min(totalWords() - 1, Math.max(0, i));
    state.schedT0 = null;
    state.schedCumMs = 0;
    state.schedN = 0;
    var token = currentToken();
    if (token) renderWord(token.text, { forceInstant: true, jump: true, reanchor: true });
    updateProgress();
    scheduleSaveProgress(true);
    updateJumpScrubUI();
  },
  flush: flushCurrentBook,
  applyText: applyText,
  setSessionMinutes: function (m) {
    els.sessionCustomMin.value = String(m);
    state.sessionDurationMs = m * 60 * 1000;
  },
  startSession: startSessionCountdown,
  offSession: offSessionCountdown,
  play: play,
  pause: pause,
  setWpm: setWpm,
  skip: skip,
  refreshRecent: refreshRecentList,
  openRecentByName: function (name) {
    return RecentStore.list().then(function (rows) {
      var doc = rows.find(function (r) {
        return r.name === name || (name && r.name && r.name.indexOf(name) !== -1);
      });
      if (!doc) throw new Error('recent not found: ' + name);
      return new Promise(function (resolve) {
        els.source.value = doc.text || '';
        if (doc.wpm) setWpm(doc.wpm);
        applyText(doc.text, {
          toast: false,
          persist: false,
          docId: doc.id,
          name: doc.name,
          type: doc.type,
          position: doc.position || 0,
          resumeNotice: false,
          resetElapsed: true
        });
        RecentStore.updateProgress(doc.id, {
          position: state.index,
          wpm: state.wpm,
          lastOpened: Date.now()
        }).then(function () { return refreshRecentList(); }).then(function () { resolve(doc); });
      });
    });
  },
  setPositionAndSave: function (index) {
    stopWordTimer();
    flushPlayClock();
    setPlayingUI(false);
    state.index = Math.max(0, Math.min(totalWords() - 1, index));
    state.sentenceWordCount = 0;
    var token = currentToken();
    if (token) renderWord(token.text);
    updateProgress();
    return RecentStore.updateProgress(state.currentDocId, {
      position: state.index,
      wpm: state.wpm,
      lastOpened: Date.now()
    }).then(function () { return refreshRecentList(); });
  },
  flushCurrentBook: flushCurrentBook,
  saveNow: function () {
    if (!state.currentDocId) return Promise.resolve();
    return RecentStore.updateProgress(state.currentDocId, {
      position: state.index,
      wpm: state.wpm,
      lastOpened: Date.now()
    });
  },
  toggleFocusMode: toggleFocusMode,
  setFocusMode: setFocusMode,
  renderWord: renderWord,
  fitCheck: function (word) {
    renderWord(word);
    var row = els.wordRow;
    var stage = els.stage;
    var before = els.wordBefore.getBoundingClientRect();
    var after = els.wordAfter.getBoundingClientRect();
    var orp = els.wordOrp.getBoundingClientRect();
    var stageBox = stage.getBoundingClientRect();
    return {
      fontSize: row.style.fontSize || getComputedStyle(row).fontSize,
      overflowLeft: before.left < stageBox.left - 1,
      overflowRight: Math.max(after.right, orp.right) > stageBox.right + 1,
      stageWidth: stageBox.width,
      wordLeft: before.left,
      wordRight: Math.max(after.right, orp.right)
    };
  }
};

loadSessionPrefs();
setWpm(300);
ensureUiTick();
setupAccordionsForViewport();
setupTouchGestures();

if (els.btnFocus) els.btnFocus.addEventListener('click', toggleFocusMode);
if (els.btnFocusControl) {
  els.btnFocusControl.addEventListener('click', toggleFocusMode);
}
function syncFocusButtons() {
  var on = !!state.focusMode;
  [els.btnFocus, els.btnFocusControl].forEach(function (b) {
    if (!b) return;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}
var _origToggleFocus = toggleFocusMode;
toggleFocusMode = function () {
  _origToggleFocus();
  syncFocusButtons();
};

if (els.btnSentenceStrip) {
  els.btnSentenceStrip.addEventListener('click', function () {
    setSentenceStripOn(!state.sentenceStripOn);
  });
}
if (els.btnJumpMore && els.playerColNav) {
  els.btnJumpMore.addEventListener('click', function () {
    var open = !els.playerColNav.classList.contains('is-jump-expanded');
    els.playerColNav.classList.toggle('is-jump-expanded', open);
    els.btnJumpMore.setAttribute('aria-expanded', open ? 'true' : 'false');
    els.btnJumpMore.textContent = open ? 'Less' : 'More';
  });
}
if (els.btnControlsMore && els.playerColControls) {
  els.btnControlsMore.addEventListener('click', function () {
    var open = !els.playerColControls.classList.contains('is-controls-expanded');
    els.playerColControls.classList.toggle('is-controls-expanded', open);
    els.btnControlsMore.setAttribute('aria-expanded', open ? 'true' : 'false');
    els.btnControlsMore.textContent = open ? 'Less' : 'More';
  });
}
loadSentenceStripPref();
loadNaturalPausesPref();
loadThemePref();
window.addEventListener('resize', function () {
  updateSentenceStrip({ forceInstant: true });
});

window.addEventListener('resize', function () {
  var token = currentToken();
  if (token) renderWord(token.text);
});
window.matchMedia('(max-width: 720px)').addEventListener('change', setupAccordionsForViewport);
document.addEventListener('fullscreenchange', function () {
  if (!document.fullscreenElement && state.focusMode) {
    // user exited OS fullscreen — keep CSS focus or drop? Drop to stay consistent
    state.focusMode = false;
    document.body.classList.remove('focus-mode');
    if (els.btnFocus) {
      els.btnFocus.setAttribute('aria-pressed', 'false');
      els.btnFocus.textContent = 'Focus';
    }
  }
});
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible' && state.playing) requestWakeLock();
});

applyText('', { toast: false, persist: false, resetElapsed: true });
els.source.value = '';


/* ——— PWA service worker + sync UI ——— */
function registerServiceWorker() {
  var isHttp = location.protocol === 'http:' || location.protocol === 'https:';
  if (!isHttp || !('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('./service-worker.js').then(function (reg) {
    function showUpdate() {
      var toast = document.getElementById('updateToast');
      if (toast) toast.hidden = false;
    }
    if (reg.waiting) showUpdate();
    reg.addEventListener('updatefound', function () {
      var nw = reg.installing;
      if (!nw) return;
      nw.addEventListener('statechange', function () {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdate();
      });
    });
    var btn = document.getElementById('btnUpdateReload');
    if (btn) {
      btn.addEventListener('click', function () {
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        location.reload();
      });
    }
    var refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (refreshing) return;
      refreshing = true;
      location.reload();
    });
  }).catch(function (err) {
    console.warn('SW register failed', err);
  });
}

function formatSyncTime(ts) {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch (e) { return ''; }
}

function updateSyncPanel() {
  if (typeof FocusSync === 'undefined') return;
  var st = FocusSync.getStatus();
  var line = document.getElementById('syncStatusLine');
  var meta = document.getElementById('syncMetaLine');
  var btnC = document.getElementById('btnSyncConnect');
  var btnN = document.getElementById('btnSyncNow');
  var btnD = document.getElementById('btnSyncDisconnect');
  var help = document.getElementById('syncHelp');
  var deviceInput = document.getElementById('deviceNameInput');
  if (deviceInput && document.activeElement !== deviceInput) {
    deviceInput.value = st.deviceName || '';
  }
  if (!st.configured) {
    if (line) line.textContent = 'Sync setup in progress';
    if (meta) meta.textContent = 'Google Drive connection is being prepared. Reading still works fully offline.';
    if (btnC) btnC.hidden = true;
    if (btnN) btnN.hidden = true;
    if (btnD) btnD.hidden = true;
    return;
  }
  if (btnC) btnC.hidden = st.connected;
  if (btnN) btnN.hidden = !st.connected;
  if (btnD) btnD.hidden = !st.connected;
  if (st.pausedNeedReconnect) {
    if (line) line.textContent = 'Sync paused — tap Connect to reconnect';
    if (btnC) { btnC.hidden = false; btnC.textContent = 'Reconnect Google Drive'; }
  } else if (st.connected) {
    var who = st.email || 'Google Drive';
    if (line) line.textContent = 'Connected as ' + who + (st.syncing ? ' · syncing…' : '');
  } else {
    if (line) line.textContent = 'Not connected';
    if (btnC) btnC.textContent = 'Connect Google Drive';
  }
  var bits = [];
  if (st.lastSyncedAt) bits.push('Last sync ' + formatSyncTime(st.lastSyncedAt));
  if (st.pendingCount) bits.push(st.pendingCount + ' pending');
  if (meta) meta.textContent = bits.join(' · ');
}

function showResumePrompt(device, wordN, onJump, onStay) {
  var toast = els.toast;
  toast.innerHTML = '';
  var span = document.createElement('span');
  span.textContent = 'Continue from ' + device + ' at word ' + wordN + '?';
  var actions = document.createElement('span');
  actions.className = 'resume-toast-actions';
  var jump = document.createElement('button');
  jump.type = 'button';
  jump.className = 'btn btn-tiny';
  jump.textContent = 'Jump';
  var stay = document.createElement('button');
  stay.type = 'button';
  stay.className = 'btn btn-tiny btn-ghost';
  stay.textContent = 'Stay';
  actions.appendChild(jump);
  actions.appendChild(stay);
  toast.appendChild(span);
  toast.appendChild(actions);
  toast.classList.add('show');
  clearTimeout(showToast._t);
  jump.onclick = function () {
    toast.classList.remove('show');
    toast.textContent = '';
    onJump();
  };
  stay.onclick = function () {
    toast.classList.remove('show');
    toast.textContent = '';
    onStay();
  };
}

var lastKnownLocalPos = null;

function maybeOfferRemoteResume(syncResult) {
  if (!syncResult || !state.currentDocId) return;
  return RecentStore.get(state.currentDocId).then(function (doc) {
    if (!doc) return;
    // If cloud progressed further on another device
    var remote = doc._remoteDevice;
    // After merge, remote device hint may be gone — compare via FocusSync pull hints
    var hints = (syncResult.remoteHints || []).filter(function (h) {
      return h.id === state.currentDocId;
    });
    if (!hints.length) return;
    var h = hints[0];
    if (h.position == null || h.position === state.index) return;
    if (h.position < state.index) return;
    var device = h._remoteDevice || 'another device';
    if (!state.playing && (lastKnownLocalPos == null || lastKnownLocalPos === state.index)) {
      // auto-jump when paused and local unchanged
      state.index = h.position;
      var token = currentToken();
      if (token) renderWord(token.text);
      updateProgress();
      showToast('Jumped to word ' + (state.index + 1) + ' from ' + device);
      return;
    }
    showResumePrompt(device, h.position + 1, function () {
      state.index = h.position;
      if (state.playing) pause();
      var token = currentToken();
      if (token) renderWord(token.text);
      updateProgress();
      scheduleSaveProgress(true);
    }, function () {});
  });
}

function wireSyncUi() {
  if (typeof FocusSync === 'undefined') return;
  FocusSync.onStatus(updateSyncPanel);
  updateSyncPanel();
  var btnC = document.getElementById('btnSyncConnect');
  var btnN = document.getElementById('btnSyncNow');
  var btnD = document.getElementById('btnSyncDisconnect');
  var deviceInput = document.getElementById('deviceNameInput');
  if (btnC) btnC.addEventListener('click', function () {
    FocusSync.connect().then(function (res) {
      refreshRecentList();
      maybeOfferRemoteResume(res);
      showToast('Synced');
    }).catch(function (err) {
      showToast(err.message || 'Connect failed');
    });
  });
  if (btnN) btnN.addEventListener('click', function () {
    FocusSync.syncNow().then(function (res) {
      refreshRecentList();
      maybeOfferRemoteResume(res);
      showToast('Synced');
    }).catch(function (err) {
      showToast(err.message || 'Sync failed');
    });
  });
  if (btnD) btnD.addEventListener('click', function () {
    FocusSync.disconnect().then(function () {
      showToast('Disconnected');
    });
  });
  if (deviceInput) {
    deviceInput.addEventListener('change', function () {
      FocusSync.setDeviceName(deviceInput.value.trim());
    });
  }
  FocusSync.trySilentReconnect().then(function (ok) {
    if (ok) refreshRecentList();
  });
  FocusSync.startLoop(function () {
    return {
      playing: state.playing,
      docId: state.currentDocId,
      position: state.index,
      wpm: state.wpm
    };
  });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && FocusSync.getStatus().connected) {
      lastKnownLocalPos = state.index;
      FocusSync.syncNow().then(function (res) {
        refreshRecentList();
        maybeOfferRemoteResume(res);
      }).catch(function () {});
    }
  });
  window.addEventListener('online', function () {
    if (FocusSync.getStatus().connected) {
      FocusSync.syncNow().then(function () { refreshRecentList(); }).catch(function () {});
    }
  });
}

// Track local position for auto-jump heuristic
var _origPause = pause;
pause = function () {
  lastKnownLocalPos = state.index;
  _origPause();
  if (typeof FocusSync !== 'undefined' && FocusSync.getStatus().connected) {
    FocusSync.syncNow().catch(function () {});
  }
};

registerServiceWorker();
wireSyncUi();

/* ——— Library panel ——— */
function renderLibraryLists(publicBooks, driveFiles, driveMsg) {
  var pub = document.getElementById('libraryPublicList');
  var drv = document.getElementById('libraryDriveList');
  var status = document.getElementById('libraryStatus');
  if (status) status.textContent = driveMsg || '';
  if (pub) {
    pub.innerHTML = '';
    (publicBooks || []).forEach(function (b) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'library-item';
      btn.innerHTML = '<span class="library-item-title"></span><span class="library-item-meta"></span>';
      btn.querySelector('.library-item-title').textContent = b.title;
      btn.querySelector('.library-item-meta').textContent =
        (b.words ? b.words.toLocaleString() + ' words' : '') +
        (b.bytes ? ' · ' + FocusLibrary.formatSize(b.bytes) : '') +
        ' · public domain';
      btn.addEventListener('click', function () { openPublicBook(b); });
      li.appendChild(btn);
      pub.appendChild(li);
    });
    if (!publicBooks || !publicBooks.length) {
      pub.innerHTML = '<p class="library-empty">Public domain pack unavailable offline until cached.</p>';
    }
  }
  if (drv) {
    drv.innerHTML = '';
    if (!driveFiles || !driveFiles.length) {
      var p = document.createElement('p');
      p.className = 'library-empty';
      p.textContent = driveMsg || 'Connect Google Drive to see your books. Put .txt or .pdf files in the Focus Reader Books folder in your Drive.';
      drv.appendChild(p);
    } else {
      driveFiles.forEach(function (f) {
        var li = document.createElement('li');
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'library-item';
        btn.innerHTML = '<span class="library-item-title"></span><span class="library-item-meta"></span>';
        btn.querySelector('.library-item-title').textContent = f.name;
        btn.querySelector('.library-item-meta').textContent =
          FocusLibrary.formatSize(f.size) + ' · ' + (f.mimeType || 'file');
        btn.addEventListener('click', function () { openDriveBook(f); });
        li.appendChild(btn);
        drv.appendChild(li);
      });
    }
  }
}

function openPublicBook(b) {
  showLoading('Downloading ' + b.title + '…', 0.05);
  flushCurrentBook().then(function () {
    return FocusLibrary.loadPublicBook(b.file);
  }).then(function (text) {
    els.source.value = text;
    // position omitted on purpose — applyText restores from RecentStore by content hash
    applyText(text, {
      toast: true,
      persist: true,
      name: b.title,
      type: 'library',
      skipFlush: true
    });
  }).catch(function (err) {
    hideLoading();
    showToast(err.message || 'Could not load book');
  });
}

function openDriveBook(f) {
  showLoading('Downloading from Drive…', 0.05);
  flushCurrentBook().then(function () {
    return FocusLibrary.downloadDriveFile(f);
  }).then(function (text) {
    if (typeof text !== 'string') text = String(text || '');
    els.source.value = text;
    applyText(text, {
      toast: true,
      persist: true,
      name: f.name,
      type: 'drive',
      driveFileId: f.id,
      skipFlush: true
    });
  }).catch(function (err) {
    hideLoading();
    if (err && err.code === 401) showToast('Reconnect Google Drive');
    else showToast(err.message || 'Download failed');
  });
}

function refreshLibraryPanel() {
  if (typeof FocusLibrary === 'undefined') return;
  var folderInput = document.getElementById('libraryFolderInput');
  if (folderInput && !folderInput.value) folderInput.value = FocusLibrary.folderName();

  var pubPromise = FocusLibrary.loadPublicManifest().then(function (m) {
    return m.books || [];
  }).catch(function () { return []; });

  var drivePromise = Promise.resolve({ files: null, msg: '' });
  if (typeof FocusSync !== 'undefined' && FocusSync.getStatus().connected) {
    drivePromise = FocusLibrary.findLibraryFolder().then(function (folder) {
      if (!folder) {
        return { files: [], msg: 'No folder named “' + FocusLibrary.folderName() + '” found in Drive. Create it and add .txt/.pdf files.' };
      }
      return FocusLibrary.listFolderFiles(folder.id).then(function (files) {
        return {
          files: files,
          msg: files.length ? ('Folder “' + folder.name + '” · ' + files.length + ' books') : ('Folder “' + folder.name + '” is empty — add .txt or .pdf files.')
        };
      });
    }).catch(function (err) {
      return { files: [], msg: err.message || 'Could not list Drive folder' };
    });
  } else if (typeof FocusSync !== 'undefined' && !FocusSync.isConfigured()) {
    drivePromise = Promise.resolve({
      files: [],
      msg: 'Connect Google Drive (when sync is ready) to browse your Focus Reader Books folder. Public domain titles below work now.'
    });
  } else {
    drivePromise = Promise.resolve({
      files: [],
      msg: 'Connect Google Drive to see your books'
    });
  }

  Promise.all([pubPromise, drivePromise]).then(function (pair) {
    renderLibraryLists(pair[0], pair[1].files, pair[1].msg);
  });
}

function wireLibraryUi() {
  if (typeof FocusLibrary === 'undefined') return;
  var btn = document.getElementById('btnLibraryRefresh');
  var folderInput = document.getElementById('libraryFolderInput');
  if (btn) btn.addEventListener('click', refreshLibraryPanel);
  if (folderInput) {
    folderInput.value = FocusLibrary.folderName();
    folderInput.addEventListener('change', function () {
      FocusLibrary.setFolderName(folderInput.value);
      refreshLibraryPanel();
    });
  }
  refreshLibraryPanel();
  if (typeof FocusSync !== 'undefined') {
    FocusSync.onStatus(function () { refreshLibraryPanel(); });
  }
}

wireLibraryUi();


resumeMostRecentOnStartup().catch(function (err) {
  console.error(err);
});

})();
