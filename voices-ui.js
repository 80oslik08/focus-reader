/**
 * Natural voices manager UI — Piper catalog from HF (cached), download/delete/preview.
 */
(function (global) {
  'use strict';

  var HF_VOICES = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/voices.json';
  var CACHE_KEY = 'focusReader.piperVoicesIndex';
  var CACHE_AT = 'focusReader.piperVoicesIndexAt';

  function $(id) { return document.getElementById(id); }

  async function fetchIndex() {
    var cached = null;
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      var at = Number(localStorage.getItem(CACHE_AT) || 0);
      if (raw && Date.now() - at < 7 * 864e5) cached = JSON.parse(raw);
    } catch (e) {}
    try {
      var res = await fetch(HF_VOICES);
      if (res.ok) {
        var data = await res.json();
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_AT, String(Date.now()));
        return data;
      }
    } catch (e) {}
    if (cached) return cached;
    // Fallback: mintplex static via FocusPiper.voices()
    if (global.FocusPiper && FocusPiper.voices) {
      try { return await FocusPiper.voices(); } catch (e2) {}
    }
    return {};
  }

  function voiceSizeMb(v) {
    var n = (v && (v.size || v.filesize || v.bytes)) || 0;
    if (!n && v && v.files) {
      Object.keys(v.files).forEach(function (k) {
        if (/\.onnx$/.test(k)) n += Number(v.files[k].size_bytes || v.files[k].size || 0);
      });
    }
    return n ? (n / (1024 * 1024)) : null;
  }

  function normalize(index) {
    var list = [];
    if (!index) return list;
    // rhasspy format: { key: { name, language, quality, ... } } or array
    if (Array.isArray(index)) {
      index.forEach(function (v) {
        list.push({
          id: v.key || v.voiceId || v.id,
          name: v.name || v.key,
          lang: (v.language && (v.language.code || v.language.family)) || v.lang || '',
          quality: v.quality || '',
          sizeMb: voiceSizeMb(v),
          license: (v.license || (v.language && v.language.name) || '')
        });
      });
      return list;
    }
    Object.keys(index).forEach(function (key) {
      var v = index[key] || {};
      // mintplex PATH_MAP style returns different shape from voices()
      if (typeof v === 'string') {
        list.push({ id: key, name: key, lang: key.split('-')[0], quality: '', sizeMb: null, license: 'MIT' });
        return;
      }
      var lang = '';
      if (v.language) {
        lang = v.language.code || v.language.family || v.language.name || '';
      } else if (key.indexOf('_') > 0) {
        lang = key.split('-')[0].replace('_', '-');
      }
      list.push({
        id: key,
        name: v.name || key,
        lang: lang || key.slice(0, 5),
        quality: v.quality || '',
        sizeMb: voiceSizeMb(v),
        license: v.license || 'See model card'
      });
    });
    return list;
  }

  async function storedSet() {
    if (!global.FocusPiper || !FocusPiper.stored) return {};
    var arr = await FocusPiper.stored();
    var set = {};
    (arr || []).forEach(function (id) { set[id] = true; });
    return set;
  }

  async function render() {
    var listEl = $('voicesList');
    var filter = $('voicesLangFilter');
    if (!listEl) return;
    listEl.innerHTML = '<p class="sync-meta">Loading catalog…</p>';
    var index = await fetchIndex();
    var voices = normalize(index);
    var stored = await storedSet();
    var langs = {};
    voices.forEach(function (v) {
      var code = (v.lang || '').slice(0, 2).toLowerCase() || '??';
      langs[code] = true;
    });
    if (filter && filter.options.length <= 1) {
      var pref = ['sk', 'cs', 'en', 'de'];
      Object.keys(langs).sort(function (a, b) {
        var ia = pref.indexOf(a); var ib = pref.indexOf(b);
        if (ia < 0) ia = 50; if (ib < 0) ib = 50;
        if (ia !== ib) return ia - ib;
        return a.localeCompare(b);
      }).forEach(function (code) {
        var o = document.createElement('option');
        o.value = code;
        o.textContent = code;
        filter.appendChild(o);
      });
    }
    var want = filter ? filter.value : '';
    var preferred = ['sk', 'cs', 'en', 'de', 'pl', 'hu', 'fr', 'es', 'it', 'ru', 'uk'];
    var qualityRank = function (q) {
      q = String(q || '').toLowerCase();
      if (q === 'medium') return 0;
      if (q === 'low') return 1;
      if (q === 'x_low' || q === 'x-low') return 2;
      if (q === 'high') return 3;
      return 4;
    };
    voices.sort(function (a, b) {
      var pa = preferred.indexOf((a.lang || '').slice(0, 2));
      var pb = preferred.indexOf((b.lang || '').slice(0, 2));
      if (pa < 0) pa = 99;
      if (pb < 0) pb = 99;
      if (pa !== pb) return pa - pb;
      var qa = qualityRank(a.quality);
      var qb = qualityRank(b.quality);
      if (qa !== qb) return qa - qb;
      return String(a.id).localeCompare(String(b.id));
    });
    listEl.innerHTML = '';
    var shown = 0;
    voices.forEach(function (v) {
      if (want && (v.lang || '').slice(0, 2).toLowerCase() !== want) return;
      shown++;
      var row = document.createElement('div');
      row.className = 'voice-row';
      var left = document.createElement('div');
      left.innerHTML = '<strong></strong><div class="voice-row-meta"></div>';
      left.querySelector('strong').textContent = v.name || v.id;
      var mb = v.sizeMb != null ? (v.sizeMb.toFixed(1) + ' MB') : 'size n/a';
      var q = (v.quality || '').toLowerCase();
      var rec = (q === 'medium') ? ' · Recommended' : '';
      left.querySelector('.voice-row-meta').textContent =
        (v.lang || '') + ' · ' + (v.quality || '—') + ' · ' + mb + rec +
        (stored[v.id] ? ' · Downloaded' : '') +
        (v.license ? ' · ' + v.license : '');
      if (q === 'medium') row.classList.add('voice-recommended');
      if (stored[v.id]) row.classList.add('voice-downloaded');
      var actions = document.createElement('div');
      actions.className = 'voice-row-actions';
      var btnPrev = document.createElement('button');
      btnPrev.type = 'button';
      btnPrev.className = 'btn btn-ghost btn-touch';
      btnPrev.textContent = 'Preview';
      btnPrev.disabled = !stored[v.id];
      btnPrev.addEventListener('click', function () { preview(v.id); });
      var btnDl = document.createElement('button');
      btnDl.type = 'button';
      btnDl.className = 'btn btn-touch';
      btnDl.textContent = stored[v.id] ? 'Re-download' : 'Download';
      btnDl.addEventListener('click', function () { downloadVoice(v.id, btnDl, row); });
      var btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.className = 'btn btn-ghost btn-touch';
      btnDel.textContent = 'Delete';
      btnDel.disabled = !stored[v.id];
      btnDel.addEventListener('click', async function () {
        if (FocusPiper && FocusPiper.remove) await FocusPiper.remove(v.id);
        render();
        if (global.populateVoiceSelect) populateVoiceSelect();
      });
      var btnUse = document.createElement('button');
      btnUse.type = 'button';
      btnUse.className = 'btn btn-primary btn-touch';
      btnUse.textContent = 'Use';
      btnUse.disabled = !stored[v.id];
      btnUse.addEventListener('click', function () { useVoice(v); });
      actions.appendChild(btnPrev);
      actions.appendChild(btnDl);
      actions.appendChild(btnDel);
      actions.appendChild(btnUse);
      row.appendChild(left);
      row.appendChild(actions);
      listEl.appendChild(row);
    });
    if (!shown) listEl.innerHTML = '<p class="sync-meta">No voices for this filter.</p>';
    updateStorage();
  }

  async function updateStorage() {
    var el = $('voicesStorage');
    if (!el) return;
    try {
      if (navigator.storage && navigator.storage.estimate) {
        var est = await navigator.storage.estimate();
        var used = ((est.usage || 0) / (1024 * 1024)).toFixed(1);
        var quota = est.quota ? ((est.quota / (1024 * 1024 * 1024)).toFixed(2) + ' GB') : '?';
        var stored = await storedSet();
        var n = Object.keys(stored).length;
        el.textContent = 'Downloaded voices: ' + n + ' · Storage used: ' + used + ' MB / ' + quota;
      }
    } catch (e) { el.textContent = 'Storage: —'; }
  }

  async function downloadVoice(id, btn, row) {
    if (!global.FocusPiper || !FocusPiper.download) {
      alert('Piper runtime not ready');
      return;
    }
    btn.disabled = true;
    btn.textContent = '0%';
    try {
      await FocusPiper.download(id, function (p) {
        if (!p || !p.total) return;
        btn.textContent = Math.round(p.loaded * 100 / p.total) + '%';
      });
      btn.textContent = 'Done';
      render();
      if (global.populateVoiceSelect) populateVoiceSelect();
    } catch (e) {
      btn.textContent = 'Retry';
      btn.disabled = false;
      console.warn(e);
      alert('Download failed: ' + (e && e.message || e));
    }
  }

  async function preview(id) {
    if (!global.FocusPiperEngine) return;
    FocusPiperEngine.setVoiceId(id);
    FocusPiperEngine.setRate(160);
    await FocusPiperEngine.speak(
      ['Hello', 'this', 'is', 'a', 'preview', 'of', 'the', id.replace(/_/g, ' '), 'voice.'],
      0,
      { wpm: 160, voiceId: id }
    );
  }

  function useVoice(v) {
    if (!global.FocusPiperEngine) return;
    FocusPiperEngine.setVoiceId(v.id);
    if (global.FocusListen && FocusListen.setEngine) FocusListen.setEngine('piper', FocusPiperEngine);
    var lang = (v.lang || '').slice(0, 2).toLowerCase();
    if (lang && global.FocusPiperUtil) {
      var map = FocusPiperUtil.loadVoiceMap();
      map[lang] = v.id;
      FocusPiperUtil.saveVoiceMap(map);
      try { localStorage.setItem(FocusPiperUtil.LS_PREF_ENGINE, 'piper'); } catch (e) {}
    }
    if (global.populateVoiceSelect) populateVoiceSelect();
    if (global.showToast) showToast('Using natural voice: ' + v.id);
    close();
  }

  function open() {
    var m = $('voicesManager');
    if (!m) return;
    m.hidden = false;
    render();
  }
  function close() {
    var m = $('voicesManager');
    if (m) m.hidden = true;
  }

  function bind() {
    var openBtn = $('btnVoicesManager');
    var closeBtn = $('btnVoicesClose');
    var filter = $('voicesLangFilter');
    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (filter) filter.addEventListener('change', render);
    var modal = $('voicesManager');
    if (modal) modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();

  global.FocusVoicesUI = { open: open, close: close, render: render, fetchIndex: fetchIndex };
})(typeof window !== 'undefined' ? window : globalThis);
