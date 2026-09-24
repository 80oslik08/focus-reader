/**
 * Natural voices manager UI — Piper catalog, download/delete/preview/use.
 */
(function (global) {
  'use strict';

  var HF_VOICES = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/voices.json';
  var CACHE_KEY = 'focusReader.piperVoicesIndex';
  var CACHE_AT = 'focusReader.piperVoicesIndexAt';

  var LANG_NAMES = {
    sk: 'Slovak', cs: 'Czech', en: 'English', de: 'German', pl: 'Polish',
    hu: 'Hungarian', fr: 'French', es: 'Spanish', it: 'Italian', ru: 'Russian',
    uk: 'Ukrainian', pt: 'Portuguese', nl: 'Dutch', sv: 'Swedish', fi: 'Finnish',
    no: 'Norwegian', da: 'Danish', ro: 'Romanian', bg: 'Bulgarian', hr: 'Croatian',
    sr: 'Serbian', sl: 'Slovenian', el: 'Greek', tr: 'Turkish', ar: 'Arabic',
    zh: 'Chinese', ja: 'Japanese', ko: 'Korean', hi: 'Hindi', ca: 'Catalan',
    cy: 'Welsh', ga: 'Irish', is: 'Icelandic', lt: 'Lithuanian', lv: 'Latvian',
    et: 'Estonian', fa: 'Persian', he: 'Hebrew', id: 'Indonesian', ka: 'Georgian',
    kk: 'Kazakh', kn: 'Kannada', ml: 'Malayalam', mr: 'Marathi', ne: 'Nepali',
    sw: 'Swahili', ta: 'Tamil', te: 'Telugu', th: 'Thai', ur: 'Urdu', vi: 'Vietnamese'
  };

  function $(id) { return document.getElementById(id); }

  function langLabel(v) {
    var id = v.id || '';
    var code2 = (v.lang || id).slice(0, 2).toLowerCase();
    var locale = '';
    var m = id.match(/^([a-z]{2}_[A-Z]{2})/);
    if (m) locale = m[1];
    else if (v.lang && v.lang.length >= 5) locale = v.lang.replace('-', '_');
    else locale = code2;
    var name = LANG_NAMES[code2] || code2.toUpperCase();
    return name + ' (' + locale + ')';
  }

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
    if (Array.isArray(index)) {
      index.forEach(function (v) {
        list.push({
          id: v.key || v.voiceId || v.id,
          name: v.name || v.key,
          lang: (v.language && (v.language.code || v.language.family)) || v.lang || '',
          quality: v.quality || '',
          sizeMb: voiceSizeMb(v),
          license: (v.license || '')
        });
      });
      return list;
    }
    Object.keys(index).forEach(function (key) {
      var v = index[key] || {};
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
        license: v.license || ''
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

  function currentVoiceId() {
    if (global.FocusPiperEngine && FocusPiperEngine.getVoiceId) {
      return FocusPiperEngine.getVoiceId() || '';
    }
    return '';
  }

  function closeMenus(except) {
    document.querySelectorAll('.voice-overflow.open').forEach(function (el) {
      if (el !== except) el.classList.remove('open');
    });
  }

  function buildOverflow(items) {
    var wrap = document.createElement('div');
    wrap.className = 'voice-overflow';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost btn-touch voice-overflow-btn';
    btn.setAttribute('aria-label', 'More actions');
    btn.textContent = '…';
    var menu = document.createElement('div');
    menu.className = 'voice-overflow-menu';
    menu.hidden = true;
    items.forEach(function (it) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'voice-overflow-item';
      b.textContent = it.label;
      if (it.danger) b.classList.add('is-danger');
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        wrap.classList.remove('open');
        menu.hidden = true;
        it.onClick();
      });
      menu.appendChild(b);
    });
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !wrap.classList.contains('open');
      closeMenus(wrap);
      wrap.classList.toggle('open', open);
      menu.hidden = !open;
    });
    wrap.appendChild(btn);
    wrap.appendChild(menu);
    return wrap;
  }

  function matchesSearch(v, q) {
    if (!q) return true;
    q = q.toLowerCase();
    var hay = [
      v.id, v.name, v.lang, v.quality, langLabel(v), LANG_NAMES[(v.lang || '').slice(0, 2).toLowerCase()] || ''
    ].join(' ').toLowerCase();
    return hay.indexOf(q) >= 0;
  }

  async function render() {
    var listEl = $('voicesList');
    var filter = $('voicesLangFilter');
    var search = $('voicesSearch');
    if (!listEl) return;
    listEl.innerHTML = '<p class="sync-meta">Loading catalog…</p>';
    var index = await fetchIndex();
    var voices = normalize(index);
    var stored = await storedSet();
    var inUse = currentVoiceId();
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
        o.textContent = (LANG_NAMES[code] || code) + ' (' + code + ')';
        filter.appendChild(o);
      });
    }
    var want = filter ? filter.value : '';
    var q = search ? String(search.value || '').trim() : '';
    var preferred = ['sk', 'cs', 'en', 'de', 'pl', 'hu', 'fr', 'es', 'it', 'ru', 'uk'];
    var qualityRank = function (qq) {
      qq = String(qq || '').toLowerCase();
      if (qq === 'medium') return 0;
      if (qq === 'low') return 1;
      if (qq === 'x_low' || qq === 'x-low') return 2;
      if (qq === 'high') return 3;
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
      if (!matchesSearch(v, q)) return;
      shown++;
      var isDown = !!stored[v.id];
      var isInUse = isDown && inUse === v.id;
      var row = document.createElement('div');
      row.className = 'voice-row';
      row.setAttribute('data-voice-id', v.id);
      row.setAttribute('data-downloaded', isDown ? '1' : '0');
      row.setAttribute('data-in-use', isInUse ? '1' : '0');
      if ((v.quality || '').toLowerCase() === 'medium') row.classList.add('voice-recommended');
      if (isDown) row.classList.add('voice-downloaded');
      if (isInUse) row.classList.add('voice-in-use');

      var left = document.createElement('div');
      left.className = 'voice-row-main';
      left.innerHTML = '<strong class="voice-row-name"></strong><div class="voice-row-lang"></div><div class="voice-row-meta"></div>';
      var nameEl = left.querySelector('.voice-row-name');
      if (isDown) {
        var check = document.createElement('span');
        check.className = 'voice-row-check';
        check.setAttribute('aria-label', 'Downloaded');
        check.textContent = '✓ ';
        nameEl.appendChild(check);
      }
      nameEl.appendChild(document.createTextNode(v.name || v.id));
      left.querySelector('.voice-row-lang').textContent = langLabel(v);
      var mb = v.sizeMb != null ? (v.sizeMb.toFixed(1) + ' MB') : 'size n/a';
      var rec = ((v.quality || '').toLowerCase() === 'medium') ? ' · Recommended' : '';
      left.querySelector('.voice-row-meta').textContent =
        (v.quality || '—') + ' · ' + mb + rec +
        (isDown ? ' · Downloaded' : '') +
        (v.license ? ' · ' + v.license : '');

      var actions = document.createElement('div');
      actions.className = 'voice-row-actions';

      if (!isDown) {
        // Not downloaded: primary Download only (no Preview without model; no Delete/Use)
        var btnDl = document.createElement('button');
        btnDl.type = 'button';
        btnDl.className = 'btn btn-primary btn-touch voice-btn-download';
        btnDl.textContent = 'Download';
        btnDl.addEventListener('click', function () { downloadVoice(v.id, btnDl, row); });
        actions.appendChild(btnDl);
      } else {
        // Downloaded: Preview + Use/In use + overflow (Re-download, Delete)
        var btnPrev = document.createElement('button');
        btnPrev.type = 'button';
        btnPrev.className = 'btn btn-ghost btn-touch voice-btn-preview';
        btnPrev.textContent = 'Preview';
        btnPrev.addEventListener('click', function () { preview(v.id); });
        actions.appendChild(btnPrev);

        var btnUse = document.createElement('button');
        btnUse.type = 'button';
        btnUse.className = 'btn btn-primary btn-touch voice-btn-use';
        if (isInUse) {
          btnUse.textContent = 'In use';
          btnUse.disabled = true;
          btnUse.classList.add('is-in-use');
        } else {
          btnUse.textContent = 'Use';
          btnUse.addEventListener('click', function () { useVoice(v); });
        }
        actions.appendChild(btnUse);

        var btnProg = document.createElement('button');
        btnProg.type = 'button';
        btnProg.className = 'btn btn-ghost btn-touch voice-btn-progress';
        btnProg.hidden = true;
        actions.appendChild(btnProg);

        actions.appendChild(buildOverflow([
          {
            label: 'Re-download',
            onClick: function () {
              btnProg.hidden = false;
              downloadVoice(v.id, btnProg, row).then(function () { btnProg.hidden = true; });
            }
          },
          {
            label: 'Delete',
            danger: true,
            onClick: async function () {
              if (FocusPiper && FocusPiper.remove) await FocusPiper.remove(v.id);
              if (isInUse && FocusPiperEngine && FocusPiperEngine.setVoiceId) {
                FocusPiperEngine.setVoiceId(null);
              }
              render();
              if (global.populateVoiceSelect) populateVoiceSelect();
            }
          }
        ]));
      }

      row.appendChild(left);
      row.appendChild(actions);
      listEl.appendChild(row);
    });
    if (!shown) listEl.innerHTML = '<p class="sync-meta">No voices match this filter.</p>';
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
    if (row) {
      row.setAttribute('data-downloading', '1');
      row.classList.add('voice-downloading');
    }
    btn.disabled = true;
    btn.textContent = '0%';
    try {
      await FocusPiper.download(id, function (p) {
        if (!p || !p.total) return;
        btn.textContent = Math.round(p.loaded * 100 / p.total) + '%';
      });
      btn.textContent = 'Done';
      if (row) row.setAttribute('data-downloading', '0');
      render();
      if (global.populateVoiceSelect) populateVoiceSelect();
    } catch (e) {
      btn.textContent = 'Retry';
      btn.disabled = false;
      if (row) {
        row.setAttribute('data-downloading', '0');
        row.classList.remove('voice-downloading');
      }
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
    render();
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
    closeMenus();
  }

  function bind() {
    var openBtn = $('btnVoicesManager');
    var closeBtn = $('btnVoicesClose');
    var filter = $('voicesLangFilter');
    var search = $('voicesSearch');
    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (filter) filter.addEventListener('change', render);
    if (search) {
      var t = null;
      search.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(render, 120);
      });
    }
    var modal = $('voicesManager');
    if (modal) modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
      else closeMenus();
    });
    document.addEventListener('click', function () { closeMenus(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();

  global.FocusVoicesUI = {
    open: open,
    close: close,
    render: render,
    fetchIndex: fetchIndex,
    langLabel: langLabel,
    LANG_NAMES: LANG_NAMES
  };
})(typeof window !== 'undefined' ? window : globalThis);
