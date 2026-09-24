/**
 * Roman numeral conversion for speech (and optional display).
 */
(function (global) {
  'use strict';

  var ROMAN_RE = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;

  var CONTEXT_WORDS = [
    'chapter', 'chap', 'chap.', 'book', 'part', 'volume', 'vol', 'vol.',
    'canto', 'act', 'scene', 'section', 'letter', 'psalm', 'stave',
    'kapitola', 'časť', 'cast', 'kniha', 'diel', 'kapitel', 'teil'
  ];

  function isValidRoman(s) {
    if (!s) return false;
    var t = String(s).replace(/\.$/, '').trim();
    if (!t || t.length < 1) return false;
    // Reject single 'I' as potential pronoun unless forced by context
    return ROMAN_RE.test(t);
  }

  function romanToInt(str) {
    var s = String(str).replace(/\.$/, '').toUpperCase();
    if (!ROMAN_RE.test(s)) return null;
    var map = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
    var n = 0;
    for (var i = 0; i < s.length; i++) {
      var v = map[s[i]] || 0;
      var next = map[s[i + 1]] || 0;
      if (v < next) n -= v;
      else n += v;
    }
    return n > 0 ? n : null;
  }

  function normalizeContext(w) {
    return String(w || '').toLowerCase().replace(/[^a-záäčďéíľĺňóôŕšťúýž.]/gi, '');
  }

  function isContextWord(w) {
    var n = normalizeContext(w);
    if (!n) return false;
    if (CONTEXT_WORDS.indexOf(n) >= 0) return true;
    // chap. already covered; also "chapters"
    if (n === 'chapters' || n === 'volumes' || n === 'parts') return true;
    return false;
  }

  /**
   * Decide if word at index should be spoken/shown as arabic.
   * words: string[], index: number
   * opts: { headingLine?: boolean, lineStart?: boolean }
   */
  function shouldConvert(words, index, opts) {
    opts = opts || {};
    var w = words[index];
    if (!w) return false;
    var core = String(w).replace(/^[("'[]+/, '').replace(/[)"'\],:;!?]+$/, '');
    var trailingDot = /\.$/.test(core);
    var bare = core.replace(/\.$/, '');
    if (!isValidRoman(bare)) return false;
    // Never convert lone "I" as pronoun
    if (opts.headingLine) return true;
    if (opts.lineStart && (trailingDot || opts.force)) return true;
    if (index > 0 && isContextWord(words[index - 1])) return true;
    // Never convert bare romans in prose (protects I, MIX, DI, etc.)
    return false;
  }

  function convertWord(word) {
    var prefix = (String(word).match(/^[("'[]+/) || [''])[0];
    var suffix = (String(word).match(/[)"'\],:;!?]+$/) || [''])[0];
    var core = String(word).slice(prefix.length, suffix ? -suffix.length : undefined);
    var hadDot = /\.$/.test(core);
    var bare = core.replace(/\.$/, '');
    var n = romanToInt(bare);
    if (n == null) return word;
    return prefix + String(n) + (hadDot ? '.' : '') + suffix;
  }

  /**
   * Build speech words array from display words, converting chapter romans.
   * Also detects heading lines: if previous token was para or index 0 and word is pure roman.
   */
  function speechWordsFrom(words, tokens, wordIndices) {
    var out = [];
    for (var i = 0; i < words.length; i++) {
      var heading = false;
      var lineStart = false;
      if (wordIndices && tokens) {
        var ti = wordIndices[i];
        if (i === 0 || (ti > 0 && tokens[ti - 1] && tokens[ti - 1].type === 'para')) {
          heading = isValidRoman(String(words[i]).replace(/\.$/, ''));
          lineStart = true;
        }
      }
      if (shouldConvert(words, i, { headingLine: heading, lineStart: lineStart })) {
        out.push(convertWord(words[i]));
      } else {
        out.push(words[i]);
      }
    }
    return out;
  }

  /**
   * Format context + number for speech: keep "Chapter" and append arabic.
   * speechWordsFrom already replaces the roman token itself.
   */
  function transformForSpeech(words, tokens, wordIndices) {
    return speechWordsFrom(words, tokens, wordIndices);
  }

  global.FocusRoman = {
    isValidRoman: isValidRoman,
    romanToInt: romanToInt,
    shouldConvert: shouldConvert,
    convertWord: convertWord,
    transformForSpeech: transformForSpeech,
    CONTEXT_WORDS: CONTEXT_WORDS
  };
})(typeof window !== 'undefined' ? window : globalThis);
